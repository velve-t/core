"use client";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
        body: JSON.stringify({
          message: input,
          history: newMessages,
        }),
      });

      if (!response.ok) throw new Error("API request failed");

      const data = await response.json();
      setMessages([...newMessages, { role: "assistant", content: data.reply }]);
    } catch (error) {
      console.error("Error:", error);
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
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
    <Card className="w-full max-w-4xl mx-auto shadow-lg">
      <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white rounded-t-lg">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarFallback className="bg-indigo-500 text-white">
              V
            </AvatarFallback>
          </Avatar>
          <CardTitle>Velvet - History Assistant</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <ScrollArea ref={scrollRef} className="h-[60vh] p-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex mb-4 ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-4 ${
                  msg.role === "user"
                    ? "bg-indigo-100 text-indigo-900"
                    : "bg-purple-100 text-purple-900"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start mb-4">
              <div className="bg-purple-100 text-purple-900 rounded-lg p-4 max-w-[80%] flex items-center">
                <Loader2 className="animate-spin mr-2" />
                Thinking...
              </div>
            </div>
          )}

          {messages.length === 1 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-center mb-4">
                How can I help you?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {STARTER_QUESTIONS.map((q, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    className="h-16 text-left justify-start whitespace-normal"
                    onClick={() => handleStarterQuestion(q)}
                  >
                    {q}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </ScrollArea>
      </CardContent>

      <CardFooter className="bg-gray-50 rounded-b-lg p-4">
        <form onSubmit={handleSubmit} className="flex w-full space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about any historical topic..."
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
      </CardFooter>
    </Card>
  );
}