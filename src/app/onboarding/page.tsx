"use client";
import React, { useState, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, MoveRight, Loader2, Sparkles } from "lucide-react";
import { isUsernameAvailable } from "@/lib/check-username";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import Image from "next/image";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as any },
    },
};

export default function OnboardingPage() {
    const { user, isLoaded } = useUser();
    const [username, setUsername] = useState("");
    const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
    const [checking, setChecking] = useState(false);
    const [loading, setLoading] = useState(false);

    // Real-time username check (same logic as your homepage)
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
        }, 400);

        return () => clearTimeout(timeoutId);
    }, [username]);

    const handleFinish = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isAvailable) return;

        setLoading(true);
        try {
            const res = await fetch("/api/onboarding", {
                method: "POST",
                body: JSON.stringify({ username }),
            });

            if (res.ok) {
                toast.success("Identity claimed!");
                // Force refresh to update Clerk session metadata
                window.location.href = "/dashboard";
            } else {
                const err = await res.json();
                toast.error(err.error || "Something went wrong");
            }
        } catch (e) {
            toast.error("Failed to save username");
        } finally {
            setLoading(false);
        }
    };

    console.log(user, isLoaded)


    // 1. Check if Clerk is still "thinking"
    if (!isLoaded) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] border-2 border-black">
                <Loader2 className="animate-spin h-8 w-8 text-indigo-600" />
            </div>
        );
    }
    console.log(user, isLoading)

    // 2. Now that we know Clerk IS loaded, check if a user actually exists
    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-zinc-500 font-medium">Please sign in to continue.</p>
            </div>
        );
    }


    return (
        <div className="min-h-screen min-w-screen bg-[#FAFAFA] flex items-center justify-center p-6 relative overflow-hidden border-2 border-black">
            {/* Background Blobs - matching your homepage */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-100/40 blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-50/50 blur-[120px]" />

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="max-w-md w-full relative z-10"
            >
                {/* User Identity Preview */}
                <motion.div variants={itemVariants} className="flex flex-col items-center mb-10">
                    <div className="relative mb-4">
                        <div className="absolute inset-0 bg-indigo-200 rounded-full blur-xl opacity-50 animate-pulse" />
                        <img
                            src={user?.imageUrl}
                            alt="Profile"
                            className="w-20 h-20 rounded-full border-4 border-white shadow-sm relative"
                        />
                        <div className="absolute -bottom-1 -right-1 bg-white p-1.5 rounded-full shadow-sm">
                            <Sparkles className="w-4 h-4 text-indigo-600" />
                        </div>
                    </div>
                    <h2 className="text-zinc-400 font-medium">Welcome, {user?.firstName}</h2>
                </motion.div>

                {/* Content */}
                <motion.div variants={itemVariants} className="text-center mb-10">
                    <h1 className="text-4xl font-black text-zinc-900 tracking-tight mb-3">
                        Claim your handle
                    </h1>
                    <p className="text-zinc-500 font-medium">
                        This will be your permanent link for receiving payments worldwide.
                    </p>
                </motion.div>

                {/* Claim Input */}
                <motion.form variants={itemVariants} onSubmit={handleFinish} className="space-y-6">
                    <div className="bg-white border border-zinc-200 p-2 rounded-[24px] shadow-[0_20px_50px_rgba(79,70,229,0.08)] group focus-within:ring-4 ring-indigo-50 transition-all">
                        <div className="flex items-center px-4">
                            <span className="text-indigo-400 font-black text-lg mr-1">settle.to/</span>
                            <input
                                autoFocus
                                value={username}
                                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                                placeholder="username"
                                className="flex-1 border-none focus:ring-0 text-xl font-bold outline-none py-4 bg-transparent placeholder:text-zinc-200 text-zinc-900"
                            />

                            <div className="flex items-center justify-center w-8">
                                {checking ? (
                                    <Loader2 className="animate-spin h-5 w-5 text-indigo-500" />
                                ) : isAvailable === true ? (
                                    <div className="bg-emerald-100 p-1 rounded-full">
                                        <Check className="text-emerald-600 h-4 w-4" />
                                    </div>
                                ) : isAvailable === false ? (
                                    <span className="text-[10px] font-black uppercase text-red-500 bg-red-50 px-2 py-1 rounded-md">Taken</span>
                                ) : null}
                            </div>
                        </div>
                    </div>

                    <Button
                        disabled={!isAvailable || loading}
                        className="w-full h-16 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[24px] text-lg font-black shadow-xl shadow-indigo-100 transition-all active:scale-[0.98] disabled:opacity-50 group"
                    >
                        {loading ? (
                            <Loader2 className="animate-spin h-6 w-6" />
                        ) : (
                            <span className="flex items-center gap-2">
                                Create My Profile <MoveRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </span>
                        )}
                    </Button>

                    <p className="text-center text-xs text-zinc-400 font-medium">
                        You can use lowercase letters, numbers, and underscores.
                    </p>
                </motion.form>
            </motion.div>
        </div>
    );
}