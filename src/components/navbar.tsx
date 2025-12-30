"use client"

import React from "react";
import { AuthModal } from "@/components/auth-modal";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Image from "next/image";
import { isUsernameAvailable } from "@/lib/check-username";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'

function Navbar() {
  return (
    <motion.nav
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex items-center justify-between p-6 max-w-7xl mx-auto backdrop-blur-md sticky top-0 z-50 border-b border-transparent hover:border-zinc-200/50 transition-colors"
          >
            <div className="text-2xl font-black tracking-tighter text-indigo-600 flex justify-center items-center gap-2 group cursor-pointer">
              <motion.div
                whileHover={{ rotate: -10, scale: 1.1 }}
                className=""
              >
                <Image width={0} height={0} alt="" src="/settle.jpg" unoptimized className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-sm italic shadow-lg shadow-indigo-200" />
              </motion.div>
              <span>SETTLE.</span>
            </div>
            <div className="flex gap-4 items-center">
              {/* <AuthModal type="login">
                <Button variant="ghost" className="font-medium cursor-pointer hover:bg-zinc-100 transition-all">Log in</Button>
              </AuthModal> */}
              <SignedOut>
                {/* <SignInButton /> */}
                <SignUpButton>
                  <button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                    Sign Up
                  </button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
              {/* <AuthModal type="signup">
                <Button className="bg-indigo-600 text-white hover:bg-indigo-700 rounded-full px-6 shadow-md transition-all active:scale-95">
                  Claim your link
                </Button>
              </AuthModal> */}
            </div>
          </motion.nav>
  )
}

export default Navbar