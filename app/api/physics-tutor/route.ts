import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { question, stream } = await request.json();

    if (!question || typeof question !== "string") {
      return NextResponse.json(
        { error: "Question is required and must be a string" },
        { status: 400 }
      );
    }

    // Enable streaming for faster responses
    const useStreaming = stream !== false; // Default to streaming

    const ollamaResponse = await fetch("http://localhost:11434/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "qwen-bangla-physics",
        stream: useStreaming,
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
        options: {
          temperature: 0.7,
          num_predict: 512, // Limit response length for faster generation
        },
      }),
    });

    if (!ollamaResponse.ok) {
      return NextResponse.json(
        { error: "Ollama API error: " + ollamaResponse.statusText },
        { status: ollamaResponse.status }
      );
    }

    // If streaming is enabled, return the stream
    if (useStreaming) {
      const readable = new ReadableStream({
        async start(controller) {
          const reader = ollamaResponse.body?.getReader();
          const decoder = new TextDecoder();

          if (!reader) {
            controller.close();
            return;
          }

          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;

              // Decode and forward the chunk
              const chunk = decoder.decode(value, { stream: true });
              const encoded = new TextEncoder().encode(chunk);
              controller.enqueue(encoded);
            }
          } catch (error) {
            console.error("Streaming error:", error);
            controller.error(error);
          } finally {
            controller.close();
          }
        },
      });

      return new NextResponse(readable, {
        headers: {
          "Content-Type": "application/x-ndjson",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    }

    // Non-streaming response (original behavior)
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
