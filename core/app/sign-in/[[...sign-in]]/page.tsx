import { SignIn } from "@clerk/nextjs";
import images from "next/image";

export default function Page() {
  return (
    <div className="overflow-hidden grid lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="/">
            <img
              src="https://i.pinimg.com/originals/28/28/38/28283832b82999acea2c337704c5d9ed.gif"
              alt="Image"
            />
          </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            {/* You can add additional content here if needed */}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center p-1 overflow-y-auto">
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