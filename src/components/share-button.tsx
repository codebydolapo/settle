"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Share2, Check, Copy } from "lucide-react";
import { toast } from "sonner";

export function ShareButton({ username }: { username: string }) {
  const [copied, setCopied] = useState(false);

  const shareUrl = `${window.location.origin}/${username}`;

  const handleShare = async () => {
    // 1. Try Native Share (Mobile/Safari)
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Settle ${username}`,
          text: `Pay me or settle up via my Settle link!`,
          url: shareUrl,
        });
        return;
      } catch (err) {
        console.log("Error sharing", err);
      }
    }

    // 2. Fallback: Copy to Clipboard
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  return (
    <Button
      onClick={handleShare}
      variant="outline"
      className="rounded-full border-zinc-200 hover:bg-zinc-50 transition-all gap-2"
    >
      {copied ? (
        <Check className="h-4 w-4 text-emerald-500" />
      ) : (
        <Share2 className="h-4 w-4 text-zinc-600" />
      )}
      <span className="hidden sm:inline">Share Profile</span>
    </Button>
  );
}