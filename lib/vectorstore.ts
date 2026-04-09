import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { Document } from "@langchain/core/documents";
import scrapedData from "../data/scraped-content.json";
import faqData from "../data/custom_faq.json";

interface StoredDoc {
  doc: Document;
  tokens: Set<string>;
  tokenCount: Map<string, number>;
}

class SimpleVectorStore {
  private docs: StoredDoc[] = [];
  private idf: Map<string, number> = new Map();

  async addDocuments(documents: Document[]) {
    // Build document index
    this.docs = documents.map((doc) => {
      const tokens = this.tokenize(doc.pageContent);
      const tokenCount = new Map<string, number>();
      for (const token of tokens) {
        tokenCount.set(token, (tokenCount.get(token) || 0) + 1);
      }
      return { doc, tokens: new Set(tokens), tokenCount };
    });

    // Calculate IDF scores
    const totalDocs = this.docs.length;
    const documentFrequency = new Map<string, number>();

    for (const { tokens } of this.docs) {
      for (const token of tokens) {
        documentFrequency.set(token, (documentFrequency.get(token) || 0) + 1);
      }
    }

    for (const [token, frequency] of documentFrequency) {
      this.idf.set(token, Math.log(totalDocs / frequency));
    }
  }

  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, " ")
      .split(/\s+/)
      .filter((t) => t.length > 2 && !this.isStopword(t));
  }

  private isStopword(word: string): boolean {
    const stopwords = new Set([
      "the",
      "a",
      "an",
      "and",
      "or",
      "but",
      "in",
      "on",
      "at",
      "to",
      "for",
      "of",
      "with",
      "is",
      "are",
      "was",
      "were",
      "be",
      "have",
      "has",
      "do",
      "does",
      "did",
      "will",
      "would",
      "could",
      "should",
      "may",
      "might",
      "must",
      "can",
      "this",
      "that",
      "these",
      "those",
      "from",
      "by",
      "as",
      "about",
      "than",
      "into",
      "through",
      "during",
      "each",
      "if",
      "which",
      "who",
      "why",
      "how",
      "what",
      "when",
      "where",
      "ie",
      "ie300",
      "ie400",
      "you",
      "your",
      "we",
      "our",
      "it",
      "its",
    ]);
    return stopwords.has(word);
  }

  async similaritySearch(query: string, k: number = 5): Promise<Document[]> {
    const queryTokens = this.tokenize(query);
    const queryTokenSet = new Set(queryTokens);

    const scored = this.docs
      .map(({ doc, tokenCount }) => {
        let score = 0;
        for (const token of queryTokens) {
          const tf = tokenCount.get(token) || 0;
          const idf = this.idf.get(token) || 0;
          score += tf * idf;
        }

        // Boost exact phrase matches
        const docText = doc.pageContent.toLowerCase();
        const query_lower = query.toLowerCase();
        if (docText.includes(query_lower)) {
          score += 10;
        }

        return { doc, score };
      })
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score);

    return scored.slice(0, k).map((s) => s.doc);
  }
}

let vectorStorePromise: Promise<SimpleVectorStore> | null = null;

function buildDocuments(): Document[] {
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

async function createVectorStore(): Promise<SimpleVectorStore> {
  const rawDocs = buildDocuments();

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 50,
  });

  const splitDocs = await splitter.splitDocuments(rawDocs);

  const store = new SimpleVectorStore();
  await store.addDocuments(splitDocs);
  return store;
}

export function getVectorStore(): Promise<SimpleVectorStore> {
  if (!vectorStorePromise) {
    vectorStorePromise = createVectorStore();
  }
  return vectorStorePromise;
}
