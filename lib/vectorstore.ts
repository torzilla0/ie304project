import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

let vectorStorePromise: Promise<PineconeStore> | null = null;

async function createVectorStore(): Promise<PineconeStore> {
  if (!process.env.PINECONE_API_KEY || !process.env.PINECONE_INDEX || !process.env.GOOGLE_API_KEY) {
    throw new Error("Missing PINECONE_API_KEY, PINECONE_INDEX, or GOOGLE_API_KEY in environment variables.");
  }

  // Initialize Pinecone
  const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
  });

  const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX);

  // Initialize Embeddings
  const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GOOGLE_API_KEY,
    model: "gemini-embedding-001",
  });

  // Connect to the existing Pinecone Store (does not upload anything)
  const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex,
  });

  console.log("[VectorStore] Successfully connected to Pinecone Cloud Index.");
  return vectorStore;
}

export function getVectorStore(): Promise<PineconeStore> {
  if (!vectorStorePromise) {
    vectorStorePromise = createVectorStore();
  }
  return vectorStorePromise;
}
