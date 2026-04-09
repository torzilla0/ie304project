import { NextRequest, NextResponse } from "next/server";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { getVectorStore } from "@/lib/vectorstore";

const SYSTEM_PROMPT = `You are the METU-IE Summer Practice Consultant, an official virtual assistant for the Middle East Technical University (METU) Industrial Engineering Department's Summer Practice program.

You MUST follow these rules strictly:

1. ONLY use the provided Context below to answer the user's question. Do not use any prior knowledge or make up information.
2. If the user asks about anything that is NOT related to METU-IE Summer Practice (IE 300 or IE 400), politely decline by saying: "I can only assist with METU-IE Summer Practice queries. This topic falls outside my scope. Please consult the relevant department or resource for assistance."
3. If the question IS about METU-IE Summer Practice but the answer is NOT found in the provided Context, say: "I can only assist with METU-IE Summer Practice queries, and unfortunately, I do not have this specific information in my official guidelines. Please contact the SP Committee at ie-staj@metu.edu.tr or visit https://sp-ie.metu.edu.tr/en for the most up-to-date information."
4. Be professional, accurate, concise, and helpful.
5. When listing steps or requirements, use numbered lists or bullet points for clarity.
6. Always reference the official SP website (https://sp-ie.metu.edu.tr/en) when appropriate.
7. Respond in the same language the user writes in (Turkish or English).`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }

    const userMessage = messages[messages.length - 1]?.content;
    if (!userMessage) {
      return NextResponse.json(
        { error: "No user message found" },
        { status: 400 }
      );
    }

    // Retrieve relevant context
    const vectorStore = await getVectorStore();
    const results = await vectorStore.similaritySearch(userMessage, 5);
    const context = results.map((doc) => doc.pageContent).join("\n\n---\n\n");

    // Build prompt
    const systemContent = `${SYSTEM_PROMPT}\n\nContext:\n${context}`;

    const llm = new ChatGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_API_KEY!,
      model: "gemini-2.5-flash",
      temperature: 0.3,
      maxOutputTokens: 1024,
    });

    const response = await llm.invoke([
      new SystemMessage(systemContent),
      new HumanMessage(userMessage),
    ]);

    const reply =
      typeof response.content === "string"
        ? response.content
        : JSON.stringify(response.content);

    return NextResponse.json({ reply });
  } catch (error: unknown) {
    console.error("Chat API error:", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
