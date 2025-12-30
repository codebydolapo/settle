// components/auth-modal.tsx
"use client";

import { SignIn, SignUp } from "@clerk/nextjs";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export function AuthModal({ 
  children, 
  type, 
  prefillUsername 
}: { 
  children: React.ReactNode; 
  type: "login" | "signup";
  prefillUsername?: string; 
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[450px] p-0 border-none bg-transparent shadow-none">
        {type === "login" ? (
          <SignIn routing="hash" />
        ) : (
          <SignUp 
            routing="hash" 
            initialValues={{
              username: prefillUsername // Prefills the Clerk username field!
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}