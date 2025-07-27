import Link from "next/link";

export default function GuidelinesPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Community Guidelines</h1>
        
        {/* Introduction */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6 text-white">Welcome to the Cursor Rules Community!</h2>
          <p className="text-gray-300 mb-4">
            We're building a collaborative space where developers can share and discover AI behavior rules 
            for Cursor Editor. To ensure everyone has a great experience, please follow these guidelines.
          </p>
        </section>

        {/* Creating Quality Rules */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6 text-white">Creating Quality Rules</h2>
          <div className="space-y-6">
            <div className="p-6 border border-gray-700 bg-gray-800 rounded-lg">
              <h3 className="font-semibold mb-3 text-green-400">✅ Do's</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Write clear, specific instructions that Cursor can follow</li>
                <li>• Include examples and code snippets in your rules</li>
                <li>• Use descriptive names and detailed descriptions</li>
                <li>• Tag your rules appropriately for easy discovery</li>
                <li>• Test your rules before sharing them</li>
                <li>• Follow established patterns and best practices</li>
              </ul>
            </div>
            
            <div className="p-6 border border-gray-700 bg-gray-800 rounded-lg">
              <h3 className="font-semibold mb-3 text-red-400">❌ Don'ts</h3>
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
          <h2 className="text-2xl font-semibold mb-6 text-white">Rule Categories</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 border border-gray-700 bg-gray-800 rounded-lg">
              <h3 className="font-semibold mb-2 text-white">React</h3>
              <p className="text-sm text-gray-400">
                Rules for React components, hooks, state management, and TypeScript integration.
              </p>
            </div>
            <div className="p-4 border border-gray-700 bg-gray-800 rounded-lg">
              <h3 className="font-semibold mb-2 text-white">API</h3>
              <p className="text-sm text-gray-400">
                Backend API patterns, error handling, validation, and response formatting.
              </p>
            </div>
            <div className="p-4 border border-gray-700 bg-gray-800 rounded-lg">
              <h3 className="font-semibold mb-2 text-white">Testing</h3>
              <p className="text-sm text-gray-400">
                Testing strategies, Jest configurations, and testing best practices.
              </p>
            </div>
            <div className="p-4 border border-gray-700 bg-gray-800 rounded-lg">
              <h3 className="font-semibold mb-2 text-white">Database</h3>
              <p className="text-sm text-gray-400">
                Database operations, security practices, and query optimization.
              </p>
            </div>
            <div className="p-4 border border-gray-700 bg-gray-800 rounded-lg">
              <h3 className="font-semibold mb-2 text-white">Security</h3>
              <p className="text-sm text-gray-400">
                Security best practices, authentication, and data protection.
              </p>
            </div>
            <div className="p-4 border border-gray-700 bg-gray-800 rounded-lg">
              <h3 className="font-semibold mb-2 text-white">Performance</h3>
              <p className="text-sm text-gray-400">
                Performance optimization, caching strategies, and efficiency patterns.
              </p>
            </div>
          </div>
        </section>

        {/* Writing Effective Rules */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6 text-white">Writing Effective Rules</h2>
          <div className="space-y-6">
            <div className="p-6 border border-gray-700 bg-gray-800 rounded-lg">
              <h3 className="font-semibold mb-3 text-white">Structure Your Rules</h3>
              <div className="space-y-3 text-sm text-gray-300">
                <p><strong className="text-blue-400">1. Clear Title:</strong> Use descriptive names that explain the rule's purpose</p>
                <p><strong className="text-blue-400">2. Detailed Description:</strong> Explain when and how the rule should be applied</p>
                <p><strong className="text-blue-400">3. File Pattern:</strong> Specify which files the rule applies to (e.g., *.tsx, src/**/*.js)</p>
                <p><strong className="text-blue-400">4. Code Examples:</strong> Include practical examples and templates</p>
                <p><strong className="text-blue-400">5. Best Practices:</strong> List specific guidelines and conventions</p>
              </div>
            </div>
            
            <div className="p-6 border border-green-700 bg-green-900/20 rounded-lg">
              <h3 className="font-semibold mb-3 text-green-400">Example: Good Rule</h3>
              <div className="text-sm space-y-2 text-gray-300">
                <p><strong>Title:</strong> React TypeScript Component Pattern</p>
                <p><strong>Description:</strong> Standard React component with TypeScript interfaces and proper typing</p>
                <p><strong>Pattern:</strong> *.tsx</p>
                <p><strong>Content:</strong> Clear instructions with code examples and best practices</p>
              </div>
            </div>
          </div>
        </section>

        {/* Community Etiquette */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6 text-white">Community Etiquette</h2>
          <div className="space-y-4">
            <div className="p-4 border border-gray-700 bg-gray-800 rounded-lg">
              <h3 className="font-semibold mb-2 text-white">Be Respectful</h3>
              <p className="text-gray-300">
                Treat other community members with respect. We're all here to learn and share knowledge.
              </p>
            </div>
            <div className="p-4 border border-gray-700 bg-gray-800 rounded-lg">
              <h3 className="font-semibold mb-2 text-white">Share Knowledge</h3>
              <p className="text-gray-300">
                Don't just take - contribute back! Share your expertise and help others learn.
              </p>
            </div>
            <div className="p-4 border border-gray-700 bg-gray-800 rounded-lg">
              <h3 className="font-semibold mb-2 text-white">Give Credit</h3>
              <p className="text-gray-300">
                If you're building on someone else's work, give them proper credit.
              </p>
            </div>
            <div className="p-4 border border-gray-700 bg-gray-800 rounded-lg">
              <h3 className="font-semibold mb-2 text-white">Stay On Topic</h3>
              <p className="text-gray-300">
                Keep discussions focused on Cursor rules and coding best practices.
              </p>
            </div>
          </div>
        </section>

        {/* Getting Help */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6 text-white">Need Help?</h2>
          <div className="bg-blue-900/20 border border-blue-700/30 p-6 rounded-lg">
            <h3 className="font-semibold mb-4 text-blue-300">Resources for Contributors</h3>
            <div className="space-y-3">
              <p className="text-blue-200">
                • <strong>Browse Templates:</strong> Start with our pre-built templates
              </p>
              <p className="text-blue-200">
                • <strong>Read Documentation:</strong> Check out Cursor's official docs
              </p>
              <p className="text-blue-200">
                • <strong>Join Discussions:</strong> Connect with other developers
              </p>
              <p className="text-blue-200">
                • <strong>Report Issues:</strong> Help us improve the platform
              </p>
            </div>
            <div className="mt-6 flex gap-4 flex-wrap">
              <Link
                href="/cursor-rules/templates"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
              >
                Browse Templates
              </Link>
              <a
                href="https://docs.cursor.sh"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
              >
                Cursor Docs
              </a>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <h2 className="text-2xl font-semibold mb-4 text-white">Ready to Contribute?</h2>
          <p className="text-gray-400 mb-6">
            Start sharing your knowledge and help build the best Cursor rules community!
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/cursor-rules/create"
              className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition"
            >
              Create Your First Rule
            </Link>
            <Link
              href="/cursor-rules"
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
            >
              Browse Community Rules
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
} 