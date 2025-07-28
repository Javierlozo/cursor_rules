import Link from "next/link";
import { FiBook, FiUsers, FiCheckCircle, FiXCircle, FiCode, FiShield, FiHelpCircle } from "react-icons/fi";

export default function GuidelinesPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section - Matching other pages */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-8">Community Guidelines</h1>
          <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
            We're building a collaborative space where developers can share and discover AI behavior rules 
            for Cursor Editor. To ensure everyone has a great experience, please follow these guidelines.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/cursor-rules/create"
              className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition font-medium flex items-center gap-2"
            >
              <FiCode className="w-5 h-5" />
              Create Your First Rule
            </Link>
            <Link
              href="/cursor-rules/templates"
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition font-medium flex items-center gap-2"
            >
              <FiBook className="w-5 h-5" />
              Browse Templates
            </Link>
          </div>
        </div>

        {/* Creating Quality Rules */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6 text-white text-center">Creating Quality Rules</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="p-6 border border-green-700 bg-green-900/20 rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <FiCheckCircle className="text-green-400 w-5 h-5" />
                <h3 className="font-semibold text-green-400">✅ Do's</h3>
              </div>
              <ul className="space-y-2 text-gray-300">
                <li>• Write clear, specific instructions that Cursor can follow</li>
                <li>• Include examples and code snippets in your rules</li>
                <li>• Use descriptive names and detailed descriptions</li>
                <li>• Tag your rules appropriately for easy discovery</li>
                <li>• Test your rules before sharing them</li>
                <li>• Follow established patterns and best practices</li>
              </ul>
            </div>
            
            <div className="p-6 border border-red-700 bg-red-900/20 rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <FiXCircle className="text-red-400 w-5 h-5" />
                <h3 className="font-semibold text-red-400">❌ Don'ts</h3>
              </div>
              <ul className="space-y-2 text-gray-300">
                <li>• Don't share rules with vague or unclear instructions</li>
                <li>• Don't include sensitive information or API keys</li>
                <li>• Don't create rules that promote harmful practices</li>
                <li>• Don't spam with low-quality or duplicate rules</li>
                <li>• Don't violate copyright or intellectual property rights</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Rule Categories */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6 text-white text-center">Rule Categories</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="p-6 border border-gray-700 bg-gray-800 rounded-lg hover:bg-gray-750 transition">
              <h3 className="font-semibold mb-3 text-blue-400">React</h3>
              <p className="text-sm text-gray-400">
                Rules for React components, hooks, state management, and TypeScript integration.
              </p>
            </div>
            <div className="p-6 border border-gray-700 bg-gray-800 rounded-lg hover:bg-gray-750 transition">
              <h3 className="font-semibold mb-3 text-green-400">API</h3>
              <p className="text-sm text-gray-400">
                Backend API patterns, error handling, validation, and response formatting.
              </p>
            </div>
            <div className="p-6 border border-gray-700 bg-gray-800 rounded-lg hover:bg-gray-750 transition">
              <h3 className="font-semibold mb-3 text-purple-400">Testing</h3>
              <p className="text-sm text-gray-400">
                Testing strategies, Jest configurations, and testing best practices.
              </p>
            </div>
            <div className="p-6 border border-gray-700 bg-gray-800 rounded-lg hover:bg-gray-750 transition">
              <h3 className="font-semibold mb-3 text-yellow-400">Database</h3>
              <p className="text-sm text-gray-400">
                Database operations, security practices, and query optimization.
              </p>
            </div>
            <div className="p-6 border border-gray-700 bg-gray-800 rounded-lg hover:bg-gray-750 transition">
              <h3 className="font-semibold mb-3 text-red-400">Security</h3>
              <p className="text-sm text-gray-400">
                Security best practices, authentication, and data protection.
              </p>
            </div>
            <div className="p-6 border border-gray-700 bg-gray-800 rounded-lg hover:bg-gray-750 transition">
              <h3 className="font-semibold mb-3 text-indigo-400">Performance</h3>
              <p className="text-sm text-gray-400">
                Performance optimization, caching strategies, and efficiency patterns.
              </p>
            </div>
          </div>
        </section>

        {/* Writing Effective Rules */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6 text-white text-center">Writing Effective Rules</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="p-6 border border-gray-700 bg-gray-800 rounded-lg">
              <h3 className="font-semibold mb-4 text-white">Structure Your Rules</h3>
              <div className="space-y-3 text-sm text-gray-300">
                <div className="flex items-start gap-2">
                  <span className="text-blue-400 font-semibold">1.</span>
                  <div>
                    <strong className="text-blue-400">Clear Title:</strong> Use descriptive names that explain the rule's purpose
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-400 font-semibold">2.</span>
                  <div>
                    <strong className="text-blue-400">Detailed Description:</strong> Explain when and how the rule should be applied
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-400 font-semibold">3.</span>
                  <div>
                    <strong className="text-blue-400">File Pattern:</strong> Specify which files the rule applies to (e.g., *.tsx, src/**/*.js)
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-400 font-semibold">4.</span>
                  <div>
                    <strong className="text-blue-400">Code Examples:</strong> Include practical examples and templates
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-400 font-semibold">5.</span>
                  <div>
                    <strong className="text-blue-400">Best Practices:</strong> List specific guidelines and conventions
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 border border-green-700 bg-green-900/20 rounded-lg">
              <h3 className="font-semibold mb-4 text-green-400">Example: Good Rule</h3>
              <div className="text-sm space-y-3 text-gray-300">
                <div>
                  <strong className="text-green-400">Title:</strong> React TypeScript Component Pattern
                </div>
                <div>
                  <strong className="text-green-400">Description:</strong> Standard React component with TypeScript interfaces and proper typing
                </div>
                <div>
                  <strong className="text-green-400">Pattern:</strong> *.tsx
                </div>
                <div>
                  <strong className="text-green-400">Content:</strong> Clear instructions with code examples and best practices
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Community Etiquette */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6 text-white text-center">Community Etiquette</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-6 border border-gray-700 bg-gray-800 rounded-lg hover:bg-gray-750 transition">
              <div className="flex items-center gap-2 mb-3">
                <FiUsers className="text-blue-400 w-5 h-5" />
                <h3 className="font-semibold text-white">Be Respectful</h3>
              </div>
              <p className="text-gray-300">
                Treat other community members with respect. We're all here to learn and share knowledge.
              </p>
            </div>
            <div className="p-6 border border-gray-700 bg-gray-800 rounded-lg hover:bg-gray-750 transition">
              <div className="flex items-center gap-2 mb-3">
                <FiCode className="text-green-400 w-5 h-5" />
                <h3 className="font-semibold text-white">Share Knowledge</h3>
              </div>
              <p className="text-gray-300">
                Don't just take - contribute back! Share your expertise and help others learn.
              </p>
            </div>
            <div className="p-6 border border-gray-700 bg-gray-800 rounded-lg hover:bg-gray-750 transition">
              <div className="flex items-center gap-2 mb-3">
                <FiCheckCircle className="text-purple-400 w-5 h-5" />
                <h3 className="font-semibold text-white">Give Credit</h3>
              </div>
              <p className="text-gray-300">
                If you're building on someone else's work, give them proper credit.
              </p>
            </div>
            <div className="p-6 border border-gray-700 bg-gray-800 rounded-lg hover:bg-gray-750 transition">
              <div className="flex items-center gap-2 mb-3">
                <FiShield className="text-yellow-400 w-5 h-5" />
                <h3 className="font-semibold text-white">Stay On Topic</h3>
              </div>
              <p className="text-gray-300">
                Keep discussions focused on Cursor rules and coding best practices.
              </p>
            </div>
          </div>
        </section>

        {/* Getting Help */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6 text-white text-center">Need Help?</h2>
          <div className="bg-blue-900/20 border border-blue-700/30 p-8 rounded-lg">
            <div className="flex items-center gap-2 mb-6">
              <FiHelpCircle className="text-blue-400 w-6 h-6" />
              <h3 className="font-semibold text-blue-300 text-xl">Resources for Contributors</h3>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <p className="text-blue-200 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                  <strong>Browse Templates:</strong> Start with our pre-built templates
                </p>
                <p className="text-blue-200 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                  <strong>Read Documentation:</strong> Check out Cursor's official docs
                </p>
              </div>
              <div className="space-y-3">
                <p className="text-blue-200 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                  <strong>Join Discussions:</strong> Connect with other developers
                </p>
                <p className="text-blue-200 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                  <strong>Report Issues:</strong> Help us improve the platform
                </p>
              </div>
            </div>
            <div className="mt-8 flex gap-4 flex-wrap justify-center">
              <Link
                href="/cursor-rules/templates"
                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition font-medium flex items-center gap-2"
              >
                <FiBook className="w-5 h-5" />
                Browse Templates
              </Link>
              <a
                href="https://docs.cursor.sh"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition font-medium flex items-center gap-2"
              >
                <FiCode className="w-5 h-5" />
                Cursor Docs
              </a>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <h2 className="text-2xl font-semibold mb-4 text-white">Ready to Contribute?</h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Start sharing your knowledge and help build the best Cursor rules community!
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/cursor-rules/create"
              className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition font-medium flex items-center gap-2"
            >
              <FiCode className="w-5 h-5" />
              Create Your First Rule
            </Link>
            <Link
              href="/cursor-rules"
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition font-medium flex items-center gap-2"
            >
              <FiUsers className="w-5 h-5" />
              Browse Community Rules
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
} 