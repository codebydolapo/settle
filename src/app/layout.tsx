// "use client"

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// import { ApolloProvider } from "@apollo/client";
import _ApolloClient from "../lib/apollo-client";
import { ApolloProvider } from "@apollo/client/react";
import { ApolloWrapper } from "../lib/apollo-wrapper";
import { ClerkProvider } from '@clerk/nextjs'
import Navbar from "@/components/navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Settle",
  description: "One link for all your payment channels.",
  openGraph: {
    title: 'Settle',
    description: 'One link for all your payment channels.',
    url: '/settle.jpg',
    siteName: 'Settle',
    images: [{ url: '/settle.jpg' }]
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-w-screen min-h-screen">
        <ClerkProvider>
          <ApolloWrapper>
            {children}
          </ApolloWrapper>
        </ClerkProvider>
      </body>
    </html>
  );
}