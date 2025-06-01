import { auth } from '@clerk/nextjs/server'; // ✅ use this import!
import { redirect } from 'next/navigation';

export default async function ChatPage() {
  const { userId } = await auth(); // ✅ make it async

  if (!userId) {
    redirect('/sign-in');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-4">
      <h1 className="text-3xl font-bold text-center">Velvet - History Assistant</h1>
      <div className="mt-8 max-w-3xl mx-auto">
        <p className="text-center">Chat UI coming soon!</p>
      </div>
    </div>
  );
}