"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/auth-modal";
import { MoveRight, ShieldCheck, Zap, Globe, Smartphone, Check } from "lucide-react";
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
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar";

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1] as any // Casting as any or Easing solves the TS mismatch
    }
  },
};

export default function HomePage() {
  const [index, setIndex] = useState(0);
  const words = ["Payment Channels", "Crypto Wallets", "Bank Transfers", "Side Hustles"];
  const [username, setUsername] = useState("");
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(false);

  const [hasMounted, setHasMounted] = React.useState(false);
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  // 1. Handle Mounting
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // 2. Handle Redirects (Only after mounting and loading)
  useEffect(() => {
    if (hasMounted && isLoaded && isSignedIn && user?.username) {
      router.push(`/dashboard`);
    }
  }, [hasMounted, isLoaded, isSignedIn, user, router]);

  // Optional: Return a loading skeleton if isLoaded is false 
  // to prevent a "flash" of the landing page
  // if (!isLoaded) return null;

  useEffect(() => {
    if (username.length < 3) {
      setIsAvailable(null);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setChecking(true);
      const available = await isUsernameAvailable(username);
      setIsAvailable(available);
      setChecking(false);
    }, 500); // Check after 500ms of no typing

    return () => clearTimeout(timeoutId);
  }, [username]);

  // Cycle through words every 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // Parent container animation to stagger children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };
  
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-zinc-950 font-sans selection:bg-indigo-100 overflow-x-hidden relative">

      {/* Animated Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-100/40 blur-[120px] animate-pulse" />
      <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] rounded-full bg-blue-50/50 blur-[100px]" />

   {/* Navigation */}
            <Navbar />

      {/* Hero Section */}
      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto text-center pt-24 pb-32 px-6 relative z-10"
      >
        {/* Badge */}
        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 bg-white border border-zinc-200 px-4 py-1.5 rounded-full text-xs font-semibold mb-8 shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-zinc-600">Trusted by 10,000+ creators</span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          variants={itemVariants}
          className="text-5xl md:text-7xl font-bold tracking-tight mb-4 text-zinc-950"
        >
          One link for all your <br />
          <div className="h-[1.2em] relative overflow-hidden mt-2">
            <AnimatePresence mode="wait">
              <motion.span
                key={words[index]}
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -40, opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                className="absolute inset-0 text-indigo-600"
              >
                {words[index]}
              </motion.span>
            </AnimatePresence>
          </div>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-zinc-500 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          Stop sending long account numbers. Share your Settle link and let people pay you however they want—Bank, Crypto, or Wallet.
        </motion.p>

        {/* Claim Link Input Field */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col md:flex-row items-center justify-center gap-2 max-w-xl mx-auto bg-white border border-zinc-200 p-2 rounded-2xl shadow-[0_20px_50px_rgba(79,70,229,0.1)] mb-20 group transition-shadow focus-within:ring-2 ring-indigo-100"
        >
          <div className="flex items-center flex-1 w-full px-4">
            <span className="text-indigo-400 font-bold mr-1">settle.to/</span>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase())}
              placeholder="yourname"
              className="flex-1 border-none focus:ring-0 text-lg outline-none py-3 bg-transparent placeholder:text-zinc-300"
            />
            {checking ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-indigo-500 border-t-transparent" />
            ) : isAvailable === true ? (
              <Check className="text-emerald-500 h-5 w-5" />
            ) : isAvailable === false ? (
              <span className="text-xs text-red-500">Taken</span>
            ) : null}
          </div>

          <AuthModal type="signup" prefillUsername={username}>
            <Button
              disabled={!isAvailable}
              className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-8 py-7 text-lg font-semibold transition-all hover:gap-4 active:scale-95 disabled:opacity-50"
            >
              Get Started <MoveRight className="h-5 w-5" />
            </Button>
          </AuthModal>
        </motion.div>

        {/* Floating Social Proof/Features */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
        >
          {['Global Payments', 'Instant Settlement', 'Secure Escrow', 'Low Fees'].map((feature, i) => (
            <div key={i} className="flex items-center justify-center gap-2 text-zinc-400 text-sm font-medium">
              <Check className="w-4 h-4 text-emerald-500" />
              {feature}
            </div>
          ))}
        </motion.div>
      </motion.main>
    </div>
  );
}