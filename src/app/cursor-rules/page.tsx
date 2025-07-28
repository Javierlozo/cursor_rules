import type { Metadata } from "next";
import Link from "next/link";
import CursorRulesClient from "@/components/cursor-rules/CursorRulesClient";

export const metadata: Metadata = {
  title: "Browse Cursor Rules",
  description: "Discover and browse community-created Cursor AI coding rules. Find patterns for React, TypeScript, Python, and more. Boost your development productivity with custom AI behavior.",
  keywords: ["cursor rules", "ai coding rules", "developer patterns", "react rules", "typescript rules", "python rules", "coding productivity"],
  openGraph: {
    title: "Browse Cursor Rules - AI Coding Patterns",
    description: "Discover and browse community-created Cursor AI coding rules. Find patterns for React, TypeScript, Python, and more.",
    url: "https://cursor-rules-hub.vercel.app/cursor-rules",
    siteName: "Cursor Rules Hub",
    images: [
      {
        url: "/og-rules.png",
        width: 1200,
        height: 630,
        alt: "Browse Cursor Rules - AI Coding Patterns",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Browse Cursor Rules - AI Coding Patterns",
    description: "Discover and browse community-created Cursor AI coding rules. Find patterns for React, TypeScript, Python, and more.",
    images: ["/og-rules.png"],
  },
  alternates: {
    canonical: "/cursor-rules",
  },
};

export default function CursorRulesPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white text-center">Cursor Rules</h1>
          <Link
            href="/cursor-rules/create"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Create New Rule
          </Link>
        </div>

        <CursorRulesClient />
      </div>
    </main>
  );
}
