import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { question } = await request.json();

    if (!question || typeof question !== "string") {
      return NextResponse.json(
        { error: "Question is required and must be a string" },
        { status: 400 }
      );
    }

    const ollamaResponse = await fetch("http://localhost:11434/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "qwen-bangla-physics",
        stream: false,
        messages: [
          {
            role: "system",
            content:
              "You are an expert NCTB Physics tutor. Answer questions accurately and concisely in Bengali only. Use formulas and step-by-step explanations where necessary.",
          },
          {
            role: "user",
            content: question,
          },
        ],
      }),
    });

    if (!ollamaResponse.ok) {
      return NextResponse.json(
        { error: "Ollama API error: " + ollamaResponse.statusText },
        { status: ollamaResponse.status }
      );
    }

    const data = await ollamaResponse.json();

    return NextResponse.json({
      answer: data.message.content,
      model: data.model,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Physics Tutor API Error:", error);
    return NextResponse.json(
      { error: "Failed to process physics question" },
      { status: 500 }
    );
  }
}
