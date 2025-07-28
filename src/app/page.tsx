import Link from "next/link";
import type { Metadata } from "next";
import { WebsiteStructuredData } from "@/components/StructuredData";
import HomeHero from "@/components/HomeHero";

export const metadata: Metadata = {
  title: "Home",
  description: "Discover and share Cursor AI coding rules. Boost your productivity with custom AI behavior patterns. Join the community of developers building better coding experiences.",
  keywords: ["cursor rules", "ai coding", "developer productivity", "coding patterns", "software development", "programming", "ai assistant"],
  openGraph: {
    title: "Cursor Rules Hub - Share & Discover AI Coding Rules",
    description: "Discover and share Cursor AI coding rules. Boost your productivity with custom AI behavior patterns. Join the community of developers building better coding experiences.",
    url: "https://cursor-rules-hub.vercel.app",
    siteName: "Cursor Rules Hub",
    images: [
      {
        url: "/og-home.png",
        width: 1200,
        height: 630,
        alt: "Cursor Rules Hub - AI Coding Rules Community",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cursor Rules Hub - Share & Discover AI Coding Rules",
    description: "Discover and share Cursor AI coding rules. Boost your productivity with custom AI behavior patterns.",
    images: ["/og-home.png"],
  },
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  return (
    <>
      <main className="container mx-auto px-4 py-8">
        <HomeHero />

        {/* Key Benefits */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6 text-white text-center">Why Cursor Rules Matter</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center p-6 border border-gray-700 bg-gray-800 rounded-lg">
              <div className="text-3xl mb-4">⚡</div>
              <h3 className="font-semibold mb-2">Boost Productivity</h3>
              <p className="text-gray-400 text-sm">
                Generate code that matches your team's patterns instantly.
              </p>
            </div>
            <div className="text-center p-6 border border-gray-700 bg-gray-800 rounded-lg">
              <div className="text-3xl mb-4">🎯</div>
              <h3 className="font-semibold mb-2">Maintain Consistency</h3>
              <p className="text-gray-400 text-sm">
                Keep your codebase consistent across all developers.
              </p>
            </div>
            <div className="text-center p-6 border border-gray-700 bg-gray-800 rounded-lg">
              <div className="text-3xl mb-4">🧠</div>
              <h3 className="font-semibold mb-2">Learn Best Practices</h3>
              <p className="text-gray-400 text-sm">
                Discover proven patterns from experienced developers.
              </p>
            </div>
            <div className="text-center p-6 border border-gray-700 bg-gray-800 rounded-lg">
              <div className="text-3xl mb-4">🚀</div>
              <h3 className="font-semibold mb-2">Faster Onboarding</h3>
              <p className="text-gray-400 text-sm">
                New team members can instantly adopt your conventions.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-16 max-w-6xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6 text-white text-center">How It Works</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="p-6 border border-gray-700 bg-gray-800 rounded-lg">
              <h3 className="font-semibold mb-3">1. Create Rules</h3>
              <p className="text-gray-400 mb-4">
                Write clear, specific instructions for your coding patterns and best practices.
              </p>
              <Link
                href="/cursor-rules/create"
                className="text-blue-400 hover:text-blue-300 transition"
              >
                Start Creating →
              </Link>
            </div>
            <div className="p-6 border border-gray-700 bg-gray-800 rounded-lg">
              <h3 className="font-semibold mb-3">2. Share & Discover</h3>
              <p className="text-gray-400 mb-4">
                Browse community rules and find patterns that match your needs.
              </p>
              <Link
                href="/cursor-rules"
                className="text-blue-400 hover:text-blue-300 transition"
              >
                Browse Rules →
              </Link>
            </div>
            <div className="p-6 border border-gray-700 bg-gray-800 rounded-lg">
              <h3 className="font-semibold mb-3">3. Use in Projects</h3>
              <p className="text-gray-400 mb-4">
                Store rules in your <code className="bg-gray-900 px-1 rounded">.cursor/rules</code> directory.
              </p>
              <Link
                href="/guidelines"
                className="text-blue-400 hover:text-blue-300 transition"
              >
                Learn More →
              </Link>
            </div>
            <div className="p-6 border border-gray-700 bg-gray-800 rounded-lg">
              <h3 className="font-semibold mb-3">4. Improve AI</h3>
              <p className="text-gray-400 mb-4">
                Watch as Cursor generates code that matches your team's patterns.
              </p>
              <Link
                href="/about"
                className="text-blue-400 hover:text-blue-300 transition"
              >
                About Cursor →
              </Link>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <h2 className="text-2xl font-semibold mb-6 text-white">Ready to Get Started?</h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Join the community and start sharing your coding expertise with other developers.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/cursor-rules"
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
            >
              Browse Rules
            </Link>
            <Link
              href="/cursor-rules/create"
              className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition"
            >
              Create Your First Rule
            </Link>
          </div>
        </section>
      </main>

      <WebsiteStructuredData />
    </>
  );
}
