import { createGroq } from "@ai-sdk/groq";
import { streamText } from "ai";

export const runtime = "edge";

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

function isRelevantTopic(message: string): boolean {
  const keywords = [
    "history",
    "archaeology",
    "ancient",
    "empire",
    "civilization",
    "artifact",
    "ruins",
    "prehistoric",
    "dynasty",
    "monument",
    "relic",
    "excavation",
    "historical",
    "archaeological",
    "Indonesia",
    "Regime",
    "Reformation",
    "Dutch East Indies",
    "Staged",
    "Coup",
    "Genocide",
  ];
  return keywords.some((keyword) =>
    message.toLowerCase().includes(keyword.toLowerCase())
  );
}

export async function POST(req: Request): Promise<Response> {
  try {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1]?.content || "";

    if (!isRelevantTopic(lastMessage)) {
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(
            encoder.encode(
              "This chatbot only answers history and archaeology-related questions."
            )
          );
          controller.close();
        },
      });

      return new Response(stream, {
        headers: {
          "Content-Type": "text/plain",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    }

    const result = await streamText({
      model: groq("deepseek-r1-distill-llama-70b"),
      messages,
    });

    return new Response(result.textStream, {
      headers: {
        "Content-Type": "text/plain",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Error handling POST request:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}