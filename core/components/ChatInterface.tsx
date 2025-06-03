"use client";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardContent,
//   CardFooter,
// } from "@/components/ui/card";
// import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";

const STARTER_QUESTIONS = [
  "Explain the causes of World War I",
  "Who was Cleopatra and why was she important?",
  "Describe the cultural significance of the Silk Road",
  "How did the Industrial Revolution change society?",
  "What were the key events of the American Civil War?",
  "Explain the fall of the Roman Empire",
];

export default function ChatInterface() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    [
      {
        role: "assistant",
        content:
          "Hello! I'm Velvet, your history expert. Ask me anything about historical events, figures, or civilizations!",
      },
    ]
  );
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo(0, scrollRef.current.scrollHeight);
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.ok || !response.body) {
        throw new Error("Failed to get streaming response");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let partialMessage = "";

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        partialMessage += chunk;

        setMessages((prevMessages) => {
          const updated = [...prevMessages];
          updated[updated.length - 1] = {
            role: "assistant",
            content: partialMessage,
          };
          return updated;
        });
      }
    } catch (error) {
      console.error("Streaming error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again...",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStarterQuestion = (question: string) => {
    setInput(question);
    setTimeout(() => {
      const submitEvent = new Event("submit", {
        bubbles: true,
        cancelable: true,
      });
      const form = document.querySelector("form");
      form?.dispatchEvent(submitEvent);
    }, 10);
  };

  return (
    <div className="w-full max-w-4xl mx-auto h-screen flex flex-col p-4 bg-white">
      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        <Avatar>
          <AvatarFallback className="bg-black text-white">V</AvatarFallback>
        </Avatar>
        <h1 className="text-xl font-bold text-bg">
          Velvet - History Assistant
        </h1>
      </div>

      {/* Chat Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 pr-1">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex mb-4 ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-xl px-4 py-3 border text-sm ${
                msg.role === "user"
                  ? "bg-indigo-100 text-indigo-900 border-indigo-200"
                  : "bg-white text-gray-800 border-gray-200"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-purple-100 text-purple-900 rounded-xl px-4 py-2 flex items-center max-w-[80%] shadow-sm text-sm">
              <Loader2 className="animate-spin mr-2 w-4 h-4" />
              Thinking...
            </div>
          </div>
        )}

        {messages.length === 1 && (
          <div className="mt-6">
            <h3 className="text-center text-muted-foreground text-sm mb-4">
              Try one of these to get started:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {STARTER_QUESTIONS.map((q, i) => (
                <Button
                  key={i}
                  variant="outline"
                  className="justify-start text-left whitespace-normal h-auto py-3"
                  onClick={() => handleStarterQuestion(q)}
                >
                  {q}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 pt-4 border-t mt-4"
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Velvet a historical question..."
          className="flex-1"
          disabled={isLoading}
        />
        <Button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700"
          disabled={isLoading || !input.trim()}
        >
          {isLoading ? <Loader2 className="animate-spin" /> : "Send"}
        </Button>
      </form>
    </div>
  );
}