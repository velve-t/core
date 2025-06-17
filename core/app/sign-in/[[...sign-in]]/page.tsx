import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="h-screen overflow-hidden grid lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            Velvet
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            {/* You can add additional content here if needed */}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center p-4 overflow-y-auto">
        <div className="w-full max-w-md">
          <SignIn
            afterSignInUrl="/chat"
            afterSignUpUrl="/chat"
            appearance={{
              elements: {
                rootBox: "mx-auto",
                card: "shadow-none border-0",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}