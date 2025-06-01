import ChatInterface from "@/components/ChatInterface";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function ChatPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-4">
      <ChatInterface />
    </div>
  );
}