import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { Document } from "@langchain/core/documents";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { DocxLoader } from "@langchain/community/document_loaders/fs/docx";
import fs from "fs/promises";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

// Basic scraped data
import scrapedData from "../data/scraped-content.json" assert { type: "json" };
import faqData from "../data/custom_faq.json" assert { type: "json" };
console.log("seed.ts is running...")

function buildBaseDocuments(): Document[] {
  const docs: Document[] = [];

  for (const page of scrapedData as any[]) {
    docs.push(
      new Document({
        pageContent: page.content,
        metadata: { source: page.url, title: page.title },
      })
    );
  }

  for (const faq of faqData as any[]) {
    docs.push(
      new Document({
        pageContent: `Question: ${faq.question}\nAnswer: ${faq.answer}`,
        metadata: { source: "custom_faq", title: faq.question },
      })
    );
  }

  return docs;
}

async function loadDirectory(dir: string): Promise<Document[]> {
  const docs: Document[] = [];
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const res = path.resolve(dir, entry.name);
      if (entry.isDirectory()) {
        docs.push(...(await loadDirectory(res)));
      } else {
        const ext = path.extname(res).toLowerCase();
        try {
          if (ext === ".txt") {
            const content = await fs.readFile(res, "utf-8");
            docs.push(new Document({ pageContent: content, metadata: { source: res, title: entry.name } }));
          } else if (ext === ".pdf") {
            const loader = new PDFLoader(res);
            const loaded = await loader.load();
            loaded.forEach(d => d.metadata.title = entry.name);
            docs.push(...loaded);
          } else if (ext === ".docx") {
            const loader = new DocxLoader(res);
            const loaded = await loader.load();
            loaded.forEach(d => d.metadata.title = entry.name);
            docs.push(...loaded);
          } else if (ext === ".doc") {
            const loader = new DocxLoader(res, {type: "doc"});
            const loaded = await loader.load();
            loaded.forEach(d => d.metadata.title = entry.name);
            docs.push(...loaded);
          }
        } catch (e) {
          console.warn(`[Seed] Could not read file ${res}:`, e);
        }
      }
    }
  } catch (e) {
    // Ignore if directory doesn't exist
  }
  return docs;
}

async function run() {
  console.log("Loading environment variables...");
  
  if (!process.env.PINECONE_API_KEY || !process.env.PINECONE_INDEX || !process.env.GOOGLE_API_KEY) {
    console.error("Missing PINECONE_API_KEY, PINECONE_INDEX, or GOOGLE_API_KEY in .env.local");
    process.exit(1);
  }

  const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
  });

  const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX);

  const rawDocs = buildBaseDocuments();

  try {
    const addedFilesPath = path.join(process.cwd(), "added_files");
    const loadedDocs = await loadDirectory(addedFilesPath);
    rawDocs.push(...loadedDocs);
    console.log(`[Seed] Loaded ${loadedDocs.length} additional documents from added_files/`);
  } catch (err) {
    console.warn("[Seed] Warning: Could not load added_files directory completely.", err);
  }

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 50,
  });

  const splitDocs = await splitter.splitDocuments(rawDocs);
  
  // Filter out any empty chunks which can cause Pinecone to throw "Must pass in at least 1 record to upsert"
  const validDocs = splitDocs.filter((doc) => doc.pageContent.trim().length > 0);
  
  console.log(`[Seed] Created ${splitDocs.length} document chunks. After filtering empty ones, ${validDocs.length} remain. Preparing for embedding...`);

  const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GOOGLE_API_KEY,
    model: "gemini-embedding-001",
  });

  console.log(`[Seed] Pushing chunks to Pinecone index: ${process.env.PINECONE_INDEX}...`);
  console.log("[Seed] This may take a moment. Do not interrupt.");

  const pineconeStore = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex,
  });

  // Manual batching to avoid PineconeArgumentError and rate limits
  const batchSize = 10; // Smaller batches for debugging and rate limits
  for (let i = 0; i < validDocs.length; i += batchSize) {
    const batch = validDocs.slice(i, i + batchSize);
    console.log(`[Seed] Generating embeddings for batch ${i / batchSize + 1} / ${Math.ceil(validDocs.length / batchSize)} (${batch.length} docs)...`);
    
    // Explicitly generate embeddings first
    const texts = batch.map((doc) => doc.pageContent);
    const vectors = await embeddings.embedDocuments(texts);
    
    if (!vectors || vectors.length === 0) {
      console.warn(`[Seed] Warning: Embeddings API returned 0 vectors for this batch! Skipping...`);
      continue;
    }

    console.log(`[Seed] Uploading ${vectors.length} vectors to Pinecone for batch ${i / batchSize + 1}...`);
    
    // Push directly to Pinecone using the official client
    const pineconeRecords = batch.map((doc, index) => {
      // Sanitize metadata: Pinecone only accepts strings, numbers, booleans, and arrays of strings
      const cleanMetadata: Record<string, any> = { text: doc.pageContent };
      for (const [key, value] of Object.entries(doc.metadata || {})) {
        if (value == null) continue;
        if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
          cleanMetadata[key] = value;
        } else if (Array.isArray(value) && value.every(v => typeof v === "string")) {
          cleanMetadata[key] = value;
        } else {
          cleanMetadata[key] = JSON.stringify(value);
        }
      }

      return {
        id: `chunk_${i + index}`,
        values: vectors[index],
        metadata: cleanMetadata
      };
    });
    
    try {
      // SDK v5 expects { records: [...] } instead of directly passing an array
      await pineconeIndex.upsert({ records: pineconeRecords });
    } catch (upsertError: any) {
      console.error(`[Seed] Upsert failed! Error message: ${upsertError.message || upsertError}`);
      process.exit(1);
    }
  }

  console.log("[Seed] Successfully uploaded all vectors to Pinecone!");
}
export { run };