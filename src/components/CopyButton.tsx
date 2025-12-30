"use client";
import { useState } from "react";
import { Copy, Check } from "lucide-react";

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className={`p-3 rounded-xl transition-all duration-200 flex items-center gap-2 ${
        copied 
        ? "bg-green-100 text-green-600" 
        : "bg-slate-100 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600"
      }`}
    >
      {copied ? <Check size={18} /> : <Copy size={18} />}
      <span className="text-sm font-medium">{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}