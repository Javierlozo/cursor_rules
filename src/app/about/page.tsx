export default function AboutPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6">About Cursor Rules</h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Discover how AI behavior instructions can transform your coding workflow and help build better software together.
          </p>
        </section>
        
        {/* What are Cursor Rules */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">What are Cursor Rules?</h2>
          <div className="grid gap-8 md:grid-cols-2 items-center">
            <div>
              <p className="text-lg text-gray-300 mb-6">
                Cursor rules are system-level instructions that control how the Agent model behaves. They provide 
                persistent, reusable context at the prompt level, giving the AI consistent guidance for generating code, 
                interpreting edits, or helping with workflows.
              </p>
              <p className="text-lg text-gray-300">
                Think of them as <strong className="text-blue-400">persistent context, preferences, or workflows</strong> for your projects - 
                they're included at the start of the model context to provide consistent guidance.
              </p>
            </div>
            <div className="bg-blue-900/20 p-8 rounded-xl border border-blue-700/30">
              <div className="text-4xl mb-4">🤖</div>
                                <h3 className="text-xl font-semibold mb-3 text-blue-300">System-Level Instructions</h3>
                  <p className="text-blue-200">
                    Control how the Agent model behaves with reusable, scoped instructions that apply to Chat and Inline Edit.
                  </p>
            </div>
          </div>
        </section>

        {/* Why Use Cursor Rules */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Why Use Cursor Rules?</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="p-8 border border-gray-700 rounded-xl bg-gradient-to-br from-blue-900/20 to-indigo-900/20">
              <div className="text-3xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold mb-3 text-blue-300">Boost Productivity</h3>
              <p className="text-gray-300">
                Generate code that matches your team's patterns instantly. No more rewriting AI suggestions 
                to match your coding standards.
              </p>
            </div>
            <div className="p-8 border border-gray-700 rounded-xl bg-gradient-to-br from-green-900/20 to-emerald-900/20">
              <div className="text-3xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-3 text-green-300">Maintain Consistency</h3>
              <p className="text-gray-300">
                Keep your codebase consistent across all developers and projects. Rules ensure everyone on your 
                team follows the same patterns.
              </p>
            </div>
            <div className="p-8 border border-gray-700 rounded-xl bg-gradient-to-br from-purple-900/20 to-pink-900/20">
              <div className="text-3xl mb-4">🧠</div>
              <h3 className="text-xl font-semibold mb-3 text-purple-300">Learn Best Practices</h3>
              <p className="text-gray-300">
                Share and discover proven patterns from experienced developers. Learn from the community's 
                collective knowledge.
              </p>
            </div>
            <div className="p-8 border border-gray-700 rounded-xl bg-gradient-to-br from-orange-900/20 to-red-900/20">
              <div className="text-3xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold mb-3 text-orange-300">Faster Onboarding</h3>
              <p className="text-gray-300">
                New team members can instantly adopt your project's conventions by using the same rules. 
                Reduce ramp-up time significantly.
              </p>
            </div>
          </div>
        </section>

        {/* Types of Rules */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Types of Cursor Rules</h2>
          <div className="grid gap-6 md:grid-cols-3 mb-12">
            <div className="p-6 border border-gray-700 rounded-xl bg-gray-800">
              <h3 className="text-lg font-semibold mb-3 text-blue-300">Project Rules</h3>
              <p className="text-gray-300 text-sm mb-3">
                Stored in <code className="bg-gray-900 px-1 rounded">.cursor/rules</code>, version-controlled and scoped to your codebase.
              </p>
              <ul className="text-gray-400 text-sm space-y-1">
                <li>• Encode domain-specific knowledge</li>
                <li>• Automate project-specific workflows</li>
                <li>• Standardize style decisions</li>
              </ul>
            </div>
            <div className="p-6 border border-gray-700 rounded-xl bg-gray-800">
              <h3 className="text-lg font-semibold mb-3 text-green-300">User Rules</h3>
              <p className="text-gray-300 text-sm mb-3">
                Global preferences defined in Cursor Settings → Rules that apply across all projects.
              </p>
              <ul className="text-gray-400 text-sm space-y-1">
                <li>• Plain text format</li>
                <li>• Communication style preferences</li>
                <li>• Coding conventions</li>
              </ul>
            </div>
            <div className="p-6 border border-gray-700 rounded-xl bg-gray-800">
              <h3 className="text-lg font-semibold mb-3 text-orange-300">.cursorrules (Legacy)</h3>
              <p className="text-gray-300 text-sm mb-3">
                Still supported but deprecated. Use Project Rules instead for more control and flexibility.
              </p>
              <ul className="text-gray-400 text-sm space-y-1">
                <li>• File in project root</li>
                <li>• Limited functionality</li>
                <li>• Migration recommended</li>
              </ul>
            </div>
          </div>
        </section>

        {/* How Rules Work */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">How Do Cursor Rules Work?</h2>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              <div className="flex gap-6 items-start">
                <div className="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">Rule Types & Application</h3>
                  <p className="text-gray-300 text-lg">
                    Rules can be <strong>Always</strong> (always included), <strong>Auto Attached</strong> (applied to matching glob patterns), 
                    <strong>Agent Requested</strong> (AI decides when to include), or <strong>Manual</strong> (explicitly mentioned with @ruleName).
                  </p>
                </div>
              </div>
              <div className="flex gap-6 items-start">
                <div className="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">Project Rules Location</h3>
                  <p className="text-gray-300 text-lg">
                    Project rules live in <code className="bg-gray-800 px-2 py-1 rounded text-blue-300">.cursor/rules</code> directory, are version-controlled, 
                    and can be scoped using path patterns, invoked manually, or included based on relevance.
                  </p>
                </div>
              </div>
              <div className="flex gap-6 items-start">
                <div className="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">Rule Anatomy</h3>
                  <p className="text-gray-300 text-lg">
                    Rules are written in MDC format with metadata (description, globs, alwaysApply) and content. 
                    They can reference other files using @file syntax for additional context.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Example Rules */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Example Rules</h2>
          <div className="space-y-6">
            <div className="p-8 border border-gray-700 rounded-xl bg-gray-800">
              <h3 className="text-xl font-semibold mb-4 text-white">RPC Service Boilerplate</h3>
              <p className="text-gray-300 mb-4 text-lg">
                Use our internal RPC pattern when defining services. Always use snake_case for service names.
              </p>
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-600">
                <code className="text-sm text-gray-200">
                  <div className="mb-2"><span className="text-blue-300">description:</span> RPC Service boilerplate</div>
                  <div className="mb-2"><span className="text-blue-300">globs:</span> <span className="font-mono">["**/*.ts"]</span></div>
                  <div className="mb-2"><span className="text-blue-300">alwaysApply:</span> false</div>
                  <div className="text-gray-400 mt-3">Referenced: @service-template.ts</div>
                </code>
              </div>
            </div>
            <div className="p-8 border border-gray-700 rounded-xl bg-gray-800">
              <h3 className="text-xl font-semibold mb-4 text-white">User Rule Example</h3>
              <p className="text-gray-300 mb-4 text-lg">
                Global preferences defined in Cursor Settings → Rules that apply across all projects.
              </p>
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-600">
                <code className="text-sm text-gray-200">
                  <div className="text-gray-300">Please reply in a concise style. Avoid unnecessary repetition or filler language.</div>
                </code>
              </div>
            </div>
          </div>
        </section>

        {/* Getting Started */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Getting Started</h2>
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-xl border border-blue-100">
            <div className="text-center max-w-3xl mx-auto">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold mb-4 text-blue-800">Ready to Create Your First Rule?</h3>
              <p className="text-blue-700 mb-8 text-lg">
                Start by creating a rule for your most common coding patterns. Think about the conventions 
                your team follows and the patterns you want to enforce.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <a
                  href="/cursor-rules/create"
                  className="bg-blue-500 text-white px-8 py-4 rounded-lg hover:bg-blue-600 transition font-medium"
                >
                  Create Your First Rule
                </a>
                <a
                  href="/cursor-rules"
                  className="bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-gray-50 transition font-medium border border-blue-200"
                >
                  Browse Community Rules
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Community Benefits */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Why Share Rules with the Community?</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center p-8 border rounded-xl">
              <div className="text-5xl mb-6">🤝</div>
              <h3 className="text-xl font-semibold mb-4">Help Others</h3>
              <p className="text-gray-700">
                Share your expertise and help other developers learn from your experience and best practices.
              </p>
            </div>
            <div className="text-center p-8 border rounded-xl">
              <div className="text-5xl mb-6">💡</div>
              <h3 className="text-xl font-semibold mb-4">Discover New Patterns</h3>
              <p className="text-gray-700">
                Learn from the community and discover new coding patterns and best practices you might not have considered.
              </p>
            </div>
            <div className="text-center p-8 border rounded-xl">
              <div className="text-5xl mb-6">🚀</div>
              <h3 className="text-xl font-semibold mb-4">Build Together</h3>
              <p className="text-gray-700">
                Contribute to a growing library of proven patterns and coding standards that benefit everyone.
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Join the Community?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Start sharing your knowledge and help build the best Cursor rules community!
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href="/cursor-rules/create"
              className="bg-green-500 text-white px-8 py-4 rounded-lg hover:bg-green-600 transition font-medium"
            >
              Create Your First Rule
            </a>
            <a
              href="/cursor-rules"
              className="bg-blue-500 text-white px-8 py-4 rounded-lg hover:bg-blue-600 transition font-medium"
            >
              Browse Community Rules
            </a>
          </div>
        </section>
      </div>
    </main>
  );
} 