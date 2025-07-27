"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import OnboardingModal from "@/components/OnboardingModal";

export default function HomePage() {
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Show onboarding for new users (check if it's their first visit)
  useEffect(() => {
    const hasVisited = localStorage.getItem('cursor-rules-hub-visited');
    if (!hasVisited) {
      setShowOnboarding(true);
      localStorage.setItem('cursor-rules-hub-visited', 'true');
    }
  }, []);

  return (
    <>
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white mb-8">Cursor Rules Hub</h1>
          <p className="text-xl text-gray-400 mb-10 max-w-3xl mx-auto">
            An independent community platform for sharing and discovering Cursor rules. 
            Built by developers, for developers.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/cursor-rules"
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition font-medium"
            >
              Browse Rules
            </Link>
            <Link
              href="/cursor-rules/create"
              className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition font-medium"
            >
              Create Rule
            </Link>
            <button
              onClick={() => setShowOnboarding(true)}
              className="bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition font-medium"
            >
              Quick Tour
            </button>
          </div>
        </section>

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

      <OnboardingModal 
        isOpen={showOnboarding} 
        onClose={() => setShowOnboarding(false)} 
      />
    </>
  );
}
