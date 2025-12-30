// created this because I need to have client side code in the profile page, and the container is a server component.



"use client";
import { Wallet, Banknote, Globe, ShieldCheck, Copy, ExternalLink, QrCode, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditProfileModal } from "@/components/edit-profile-modal";
import { ShareButton } from "@/components/share-button";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";
import Navbar from "./navbar";

interface User {
    id: string;
    name: string;
    username: string;
    image?: string;
    bio?: string;
}



export default function ProfileClient({ user, isOwner }: { user: User; isOwner: boolean }) {
    // Animation Variants
    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
    };

    const staggerContainer = {
        animate: {
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const FloatingShape = ({ delay = 0, initialX = 0, initialY = 0 }) => (
        <motion.div
            initial={{ x: initialX, y: initialY, opacity: 0 }}
            animate={{
                y: [initialY, initialY - 40, initialY],
                x: [initialX, initialX + 20, initialX],
                rotate: [0, 10, 0],
                opacity: [0.03, 0.06, 0.03], // Keep it very subtle
            }}
            transition={{
                duration: 8,
                repeat: Infinity,
                delay: delay,
                ease: "easeInOut",
            }}
            className="absolute pointer-events-none text-indigo-600 hidden lg:block" // Hidden on mobile to keep it clean
        >
            <div className="blur-[1px]">
                {/* Use simple geometric shapes or tiny icons */}
                <div className="w-12 h-12 rounded-xl border-2 border-current opacity-20" />
            </div>
        </motion.div>
    );

    return (
        <main className="min-h-screen bg-gradient-to-b from-[#FAFAFA] to-white text-zinc-950 pb-20 relative overflow-hidden">
            {/* Navigation */}
            <Navbar />
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <FloatingShape initialX={100} initialY={200} delay={0} />
                <FloatingShape initialX={800} initialY={150} delay={2} />
                <FloatingShape initialX={200} initialY={600} delay={4} />
                <FloatingShape initialX={900} initialY={700} delay={1} />

                {/* Subtle SVG Grid for a professional "Fintech" feel */}
                <div className="absolute inset-0 bg-[url('https://shared-assets.adobe.com/link/f3a9e378-569d-478a-530d-2a3b04313f8c')] opacity-[0.03]" />
            </div>

            {/* --- Your existing Background Orbs (Enhanced) --- */}
            <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-100/40 rounded-full blur-[120px] -z-10 animate-pulse" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-100/30 rounded-full blur-[120px] -z-10" />

            {/* Admin/Owner Top Bar */}
            {isOwner && (
                <motion.div
                    initial={{ y: -100 }}
                    animate={{ y: 0 }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-indigo-100 px-6 py-3 flex justify-between items-center shadow-sm"
                >
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                        <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                            Admin Mode
                        </p>
                    </div>
                    <EditProfileModal user={user} />
                </motion.div>
            )}

            {/* Profile Header */}
            <div className="max-w-2xl mx-auto pt-16 px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", duration: 0.6 }}
                    className="relative inline-block mb-6"
                >
                    <div className="w-32 h-32 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-gradient-to-br from-indigo-100 to-purple-100 mx-auto relative group">
                        {user.image ? (
                            <Image
                                src={user.image}
                                alt={user.name}
                                fill
                                className="object-cover transition-transform group-hover:scale-110"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-indigo-500 text-5xl font-bold">
                                {user.name[0]}
                            </div>
                        )}
                    </div>
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.4, type: "spring" }}
                        className="absolute bottom-1 right-1 bg-indigo-600 text-white p-2 rounded-full border-4 border-white shadow-lg"
                    >
                        <ShieldCheck className="w-5 h-5" />
                    </motion.div>
                </motion.div>

                <motion.h1
                    {...fadeIn}
                    className="text-4xl font-black tracking-tight text-zinc-900 mb-2"
                >
                    {user.name}
                </motion.h1>

                <motion.p
                    {...fadeIn}
                    transition={{ delay: 0.1 }}
                    className="text-indigo-600 font-bold mb-6 text-lg"
                >
                    settle.to/{user.username}
                </motion.p>

                {user.bio && (
                    <motion.p
                        {...fadeIn}
                        transition={{ delay: 0.2 }}
                        className="text-zinc-500 max-w-md mx-auto leading-relaxed mb-8 text-lg"
                    >
                        {user.bio}
                    </motion.p>
                )}

                <motion.div
                    {...fadeIn}
                    transition={{ delay: 0.3 }}
                    className="flex items-center justify-center gap-3"
                >
                    <ShareButton username={user.username} />
                    <Button
                        variant="outline"
                        className="rounded-full border-zinc-200 hover:border-indigo-600 hover:text-indigo-600 transition-all bg-white"
                    >
                        <QrCode className="w-4 h-4 mr-2" />
                        Show QR
                    </Button>
                </motion.div>
            </div>

            {/* Payment Channels Grid */}
            <motion.div
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="max-w-xl mx-auto mt-16 px-6 space-y-4"
            >
                <motion.h3
                    variants={fadeIn}
                    className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1 mb-6"
                >
                    Payment Methods
                </motion.h3>

                {user.paymentMethods?.map((method: any) => (
                    <motion.div key={method.id} variants={fadeIn}>
                        <PaymentCard
                            icon={
                                method.category === 'BANK' ? <Banknote className="text-emerald-500" /> :
                                    method.category === 'CRYPTO' ? <Wallet className="text-orange-500" /> :
                                        <Globe className="text-blue-500" />
                            }
                            title={method.providerName}
                            details={method.accountName ? `${method.accountName} • ${method.accountDetails}` : method.accountDetails}
                            value={method.accountDetails}
                            actionLabel={method.category === 'EWALLET' ? "Open Link" : "Copy Details"}
                            isExternal={method.category === 'EWALLET' || method.accountDetails.startsWith('http')}
                        />
                    </motion.div>
                ))}
            </motion.div>

            {/* Trust Badge */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="max-w-xl mx-auto mt-12 text-center"
            >
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-100 rounded-full text-zinc-500 text-xs font-medium">
                    <ShieldCheck className="w-4 h-4" />
                    End-to-end encrypted payment details
                </div>
            </motion.div>

            <footer className="mt-20 text-center opacity-40">
                <p className="text-sm text-zinc-500 font-medium">
                    Powered by <span className="font-bold text-indigo-600">SETTLE.</span>
                </p>
            </footer>
        </main>
    );
}

// Completed Payment Card with Clipboard Logic
function PaymentCard({
    icon,
    title,
    details,
    value,
    actionLabel,
    isExternal = false
}: {
    icon: React.ReactNode;
    title: string;
    details: string;
    value: string;
    actionLabel: string;
    isExternal?: boolean;
}) {
    const [copied, setCopied] = useState(false);

    const handleAction = () => {
        if (isExternal) {
            window.open(value, "_blank");
            return;
        }

        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div
            onClick={handleAction}
            className="group bg-white border border-zinc-200 p-5 rounded-2xl flex items-center justify-between hover:border-indigo-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all cursor-pointer active:scale-[0.98] md:min-w-160"
        >
            <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-zinc-50 rounded-2xl flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                    {icon}
                </div>
                <div>
                    <h4 className="font-bold text-zinc-900 text-lg">{title}</h4>
                    <p className="text-sm text-zinc-500 font-mono tracking-tight">{details}</p>
                </div>
            </div>
            <Button
                variant="ghost"
                size="sm"
                className={`text-xs font-bold rounded-xl transition-all ${copied ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-50" : "text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white"
                    }`}
            >
                {copied ? (
                    <>
                        <Check className="w-3 h-3 mr-1.5" />
                        Copied!
                    </>
                ) : (
                    <>
                        {isExternal ? <ExternalLink className="w-3 h-3 mr-1.5" /> : <Copy className="w-3 h-3 mr-1.5" />}
                        {actionLabel}
                    </>
                )}
            </Button>
        </div>
    );
}