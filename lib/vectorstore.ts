import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { Document } from "@langchain/core/documents";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import scrapedData from "../data/scraped-content.json";
import faqData from "../data/custom_faq.json";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { DocxLoader } from "@langchain/community/document_loaders/fs/docx";
import fs from "fs/promises";
import path from "path";

interface StoredDoc {
  doc: Document;
  embedding: number[];
}

class EmbeddingVectorStore {
  private docs: StoredDoc[] = [];
  private embeddingModel: GoogleGenerativeAIEmbeddings;

  constructor() {
    this.embeddingModel = new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GOOGLE_API_KEY!,
      model: "gemini-embedding-001",
    });
  }

  async addDocuments(documents: Document[]) {
    // Generate embeddings in batches to avoid rate limits
    const batchSize = 50;
    for (let i = 0; i < documents.length; i += batchSize) {
      const batch = documents.slice(i, i + batchSize);
      const texts = batch.map((doc) => doc.pageContent);
      const embeddings = await this.embeddingModel.embedDocuments(texts);

      for (let j = 0; j < batch.length; j++) {
        this.docs.push({
          doc: batch[j],
          embedding: embeddings[j],
        });
      }
    }

    console.log(
      `[VectorStore] Indexed ${this.docs.length} document chunks with embeddings`
    );
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    const denominator = Math.sqrt(normA) * Math.sqrt(normB);
    if (denominator === 0) return 0;
    return dotProduct / denominator;
  }

  async similaritySearch(query: string, k: number = 5): Promise<Document[]> {
    // Generate embedding for the user query
    const queryEmbedding = await this.embeddingModel.embedQuery(query);

    // Compute cosine similarity against all stored document embeddings
    const scored = this.docs
      .map(({ doc, embedding }) => ({
        doc,
        score: this.cosineSimilarity(queryEmbedding, embedding),
      }))
      .sort((a, b) => b.score - a.score);

    return scored.slice(0, k).map((s) => s.doc);
  }
}

let vectorStorePromise: Promise<EmbeddingVectorStore> | null = null;

function buildBaseDocuments(): Document[] {
  const docs: Document[] = [];

  for (const page of scrapedData) {
    docs.push(
      new Document({
        pageContent: page.content,
        metadata: { source: page.url, title: page.title },
      })
    );
  }

  for (const faq of faqData) {
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
          }
        } catch (e) {
          console.warn(`[VectorStore] Could not read file ${res}:`, e);
        }
      }
    }
  } catch (e) {
    // Ignore if directory doesn't exist
  }
  return docs;
}

async function createVectorStore(): Promise<EmbeddingVectorStore> {
  const rawDocs = buildBaseDocuments();

  try {
    const addedFilesPath = path.join(process.cwd(), "added_files");
    const loadedDocs = await loadDirectory(addedFilesPath);
    rawDocs.push(...loadedDocs);
    console.log(`[VectorStore] Loaded ${loadedDocs.length} additional documents from added_files/`);
  } catch (err) {
    console.warn("[VectorStore] Warning: Could not load added_files directory completely.", err);
  }

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 50,
  });

  const splitDocs = await splitter.splitDocuments(rawDocs);

  const store = new EmbeddingVectorStore();
  await store.addDocuments(splitDocs);
  return store;
}

export function getVectorStore(): Promise<EmbeddingVectorStore> {
  if (!vectorStorePromise) {
    vectorStorePromise = createVectorStore();
  }
  return vectorStorePromise;
}
