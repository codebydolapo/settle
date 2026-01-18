
import type { Metadata } from "next";
import "./globals.css";
import { ApolloWrapper } from "../lib/apollo-wrapper";
import { ClerkProvider } from '@clerk/nextjs'

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