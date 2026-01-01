"use client";

import React, { useRef } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { QRCodeSVG } from "qrcode.react";
import { X, Download, QrCode, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

export function QRCodeModal({ username }: { username: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  
  const profileUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/settler/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    toast.success("Link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadQR = () => {
    const svg = svgRef.current;
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    img.onload = () => {
      canvas.width = 1000;
      canvas.height = 1000;
      ctx?.drawImage(img, 0, 0, 1000, 1000);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `${username}-settle-qr.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button
          variant="outline"
          className="rounded-full border-zinc-200 hover:border-indigo-600 hover:text-indigo-600 transition-all bg-white shadow-sm"
        >
          <QrCode className="w-4 h-4 mr-2" />
          Show QR
        </Button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-zinc-950/40 backdrop-blur-md z-[100] animate-in fade-in duration-300" />
        <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-sm bg-white rounded-[40px] p-8 shadow-2xl z-[101] animate-in zoom-in-95 duration-200 focus:outline-none">
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 mb-4">
              <QrCode className="w-6 h-6" />
            </div>
            <Dialog.Title className="text-2xl font-black text-zinc-900 tracking-tight">
              Your Settle QR
            </Dialog.Title>
            <p className="text-zinc-500 text-sm mt-1 font-medium">Scan to view payment channels</p>
          </div>

          {/* QR Code Container */}
          <div className="mt-8 mb-8 flex flex-col items-center justify-center p-6 bg-zinc-50 rounded-[32px] border border-zinc-100 relative group">
            <QRCodeSVG
              ref={svgRef}
              value={profileUrl}
              size={200}
              level="H"
              includeMargin={false}
              className="rounded-lg"
              imageSettings={{
                src: "/settle.jpg",
                x: undefined,
                y: undefined,
                height: 40,
                width: 40,
                excavate: true,
              }}
            />
          </div>

          <div className="space-y-3">
            <Button
              onClick={copyToClipboard}
              variant="outline"
              className="w-full py-6 rounded-2xl border-zinc-200 font-bold flex items-center justify-center gap-2 hover:bg-zinc-50 transition-all"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied Link" : "Copy Profile Link"}
            </Button>

            <Button
              onClick={downloadQR}
              className="w-full py-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 transition-all active:scale-95"
            >
              <Download className="w-4 h-4" />
              Download Image
            </Button>
          </div>

          <Dialog.Close asChild>
            <button className="absolute top-6 right-6 p-2 text-zinc-400 hover:text-zinc-900 transition-colors">
              <X className="w-6 h-6" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}