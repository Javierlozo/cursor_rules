"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import OnboardingModal from "@/components/OnboardingModal";

interface Stats {
  totalRules: number;
  totalDownloads: number;
  uniqueContributors: number;
  topCategories: Array<{ name: string; count: number }>;
  recentRules: Array<{ id: string; name: string; description: string; category: string }>;
}

export default function HomePage() {
  const [stats, setStats] = useState<Stats>({
    totalRules: 0,
    totalDownloads: 0,
    uniqueContributors: 0,
    topCategories: [],
    recentRules: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();

    // Show onboarding for new users (check if it's their first visit)
    const hasVisited = localStorage.getItem('cursor-rules-hub-visited');
    if (!hasVisited) {
      setShowOnboarding(true);
      localStorage.setItem('cursor-rules-hub-visited', 'true');
    }
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K+`;
    }
    return `${num}+`;
  };

  return (
    <>
      <main className="container mx-auto px-4 py-8">
        <section className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6">Cursor Rules Hub</h1>
          <p className="text-xl text-gray-400 mb-10 max-w-3xl mx-auto">
            Discover, create, and share system-level instructions for controlling how the Cursor Agent model behaves
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/cursor-rules"
              className="bg-blue-500 text-white px-8 py-4 rounded-lg hover:bg-blue-600 transition font-medium"
            >
              Browse Rules
            </Link>
            <Link
              href="/about"
              className="bg-gray-700 text-white px-8 py-4 rounded-lg hover:bg-gray-600 transition font-medium"
            >
              Learn More
            </Link>
            <button
              onClick={() => setShowOnboarding(true)}
              className="bg-green-500 text-white px-8 py-4 rounded-lg hover:bg-green-600 transition font-medium"
            >
              Quick Tour
            </button>
          </div>
        </section>

        {/* Featured Rules Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Featured Rules</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="p-6 border border-gray-700 bg-gray-800 rounded-lg">
              <h3 className="font-semibold mb-2">React Best Practices</h3>
              <p className="text-gray-400 text-sm">
                Rules for writing clean, maintainable React components with proper TypeScript patterns.
              </p>
              <div className="mt-3">
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">React</span>
                <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded ml-2">TypeScript</span>
              </div>
            </div>
            <div className="p-6 border border-gray-700 bg-gray-800 rounded-lg">
              <h3 className="font-semibold mb-2">Node.js API Patterns</h3>
              <p className="text-gray-400 text-sm">
                Consistent API development patterns with proper error handling and validation.
              </p>
              <div className="mt-3">
                <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Node.js</span>
                <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded ml-2">Express</span>
              </div>
            </div>
            <div className="p-6 border border-gray-700 bg-gray-800 rounded-lg">
              <h3 className="font-semibold mb-2">Testing Strategies</h3>
              <p className="text-gray-400 text-sm">
                Comprehensive testing rules for unit, integration, and E2E tests with Jest and Playwright.
              </p>
              <div className="mt-3">
                <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">Testing</span>
                <span className="inline-block bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded ml-2">Jest</span>
              </div>
            </div>
          </div>
        </section>

        {/* Why Cursor Rules Matter */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-center">Why Cursor Rules Matter</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center p-6 border border-gray-700 bg-gray-800 rounded-lg">
              <div className="text-3xl mb-4">⚡</div>
              <h3 className="font-semibold mb-2">Boost Productivity</h3>
              <p className="text-gray-400 text-sm">
                Generate code that matches your team&apos;s patterns instantly. No more rewriting AI suggestions.
              </p>
            </div>
            <div className="text-center p-6 border border-gray-700 bg-gray-800 rounded-lg">
              <div className="text-3xl mb-4">🎯</div>
              <h3 className="font-semibold mb-2">Maintain Consistency</h3>
              <p className="text-gray-400 text-sm">
                Keep your codebase consistent across all developers and projects with shared rules.
              </p>
            </div>
            <div className="text-center p-6 border border-gray-700 bg-gray-800 rounded-lg">
              <div className="text-3xl mb-4">🧠</div>
              <h3 className="font-semibold mb-2">Learn Best Practices</h3>
              <p className="text-gray-400 text-sm">
                Discover proven patterns from experienced developers and improve your coding skills.
              </p>
            </div>
            <div className="text-center p-6 border border-gray-700 bg-gray-800 rounded-lg">
              <div className="text-3xl mb-4">🚀</div>
              <h3 className="font-semibold mb-2">Faster Onboarding</h3>
              <p className="text-gray-400 text-sm">
                New team members can instantly adopt your project&apos;s conventions and coding standards.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12 max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6">How It Works</h2>
          <div className="grid gap-6">
            <div className="p-6 border border-gray-700 bg-gray-800 rounded-lg">
              <h3 className="font-semibold mb-2">Project Rules</h3>
              <p className="text-gray-400">
                Store in <code className="bg-gray-900 px-1 rounded">.cursor/rules</code> directory. Version-controlled and scoped to your codebase for domain-specific knowledge and workflows.
              </p>
            </div>
            <div className="p-6 border border-gray-700 bg-gray-800 rounded-lg">
              <h3 className="font-semibold mb-2">Rule Types</h3>
              <ul className="list-disc list-inside text-gray-400 space-y-2">
                <li>Always - Always included in model context</li>
                <li>Auto Attached - Applied to matching glob patterns</li>
                <li>Agent Requested - AI decides when to include</li>
                <li>Manual - Explicitly mentioned with @ruleName</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Getting Started */}
        <section className="mb-12">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">Ready to Get Started?</h2>
            <p className="text-gray-400 mb-8">
              Join the community and start sharing your coding expertise with other developers.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                href="/cursor-rules/templates"
                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
              >
                Browse Templates
              </Link>
              <Link
                href="/cursor-rules/create"
                className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition"
              >
                Create Rule
              </Link>
            </div>
          </div>
        </section>

        {/* Community Stats */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-center">Join the Community</h2>
          {isLoading ? (
            <div className="grid gap-8 md:grid-cols-3">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            </div>
          ) : (
            <>
              <div className="grid gap-8 md:grid-cols-3 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {formatNumber(stats.totalRules)}
                  </div>
                  <div className="text-gray-600">Rules Shared</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {formatNumber(stats.totalDownloads)}
                  </div>
                  <div className="text-gray-600">Downloads</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {formatNumber(stats.uniqueContributors)}
                  </div>
                  <div className="text-gray-600">Contributors</div>
                </div>
              </div>
              
              {/* Show message when no rules exist */}
              {stats.totalRules === 0 && (
                <div className="text-center max-w-2xl mx-auto">
                  <div className="text-4xl mb-4">🎉</div>
                  <h3 className="text-lg font-semibold mb-2">
                    Be the First to Share!
                  </h3>
                  <p className="text-gray-600 mb-4">
                    No rules have been shared yet. Help build the community!
                  </p>
                </div>
              )}
              
              {/* Top Categories */}
              {stats.topCategories.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4 text-center">Popular Categories</h3>
                  <div className="flex flex-wrap justify-center gap-2">
                    {stats.topCategories.slice(0, 5).map((category) => (
                      <span
                        key={category.name}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {category.name}
                        <span className="text-xs bg-blue-200 px-1 rounded-full">
                          {category.count}
                        </span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      </main>

      <OnboardingModal 
        isOpen={showOnboarding} 
        onClose={() => setShowOnboarding(false)} 
      />
    </>
  );
}
