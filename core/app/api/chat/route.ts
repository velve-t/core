import { createGroq } from "@ai-sdk/groq";
import { streamText } from "ai";

export const runtime = "edge";

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request): Promise<Response> {
  try {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1]?.content || "";
    
    if (lastMessage.trim().length < 5 || !/[a-zA-Z]/.test(lastMessage)) {
      return new Response("Please ask a valid historical question.", {
        status: 200,
        headers: {
          "Content-Type": "text/plain",
        },
      });
    }

    const result = await streamText({
      model: groq("deepseek-r1-distill-llama-70b"),
      messages: [
        {
          role: "system",
          content:
            "You are a helpful and knowledgeable assistant who only answers questions related to history, archaeology, and human civilizations. If the question is not relevant to those topics, politely explain that you only handle historical topics.",
        },
        ...messages,
      ],
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