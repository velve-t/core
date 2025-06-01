"use client";

import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      <SignUp path="/sign-up" routing="path" signInUrl="/sign-in" />
    </div>
  );
}