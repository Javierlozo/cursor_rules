export default function AboutPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white mb-8">About Cursor Rules Hub</h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            An independent community platform for sharing and discovering Cursor rules. 
            Built by developers, for developers - not affiliated with Cursor but passionate about helping the community.
          </p>
        </section>
        
        {/* What are Cursor Rules */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6 text-white text-center">What are Cursor Rules?</h2>
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
          <h2 className="text-2xl font-semibold mb-6 text-white text-center">Why Use Cursor Rules?</h2>
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
          <h2 className="text-2xl font-semibold mb-6 text-white text-center">Types of Cursor Rules</h2>
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
          <h2 className="text-2xl font-semibold mb-6 text-white text-center">How Do Cursor Rules Work?</h2>
          <div className="max-w-6xl mx-auto">
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
          <h2 className="text-2xl font-semibold mb-6 text-white text-center">Example Rules</h2>
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
          <h2 className="text-2xl font-semibold mb-6 text-white text-center">Getting Started</h2>
          <div className="bg-gradient-to-r from-blue-900/20 to-indigo-900/20 p-8 rounded-xl border border-blue-700/30">
            <div className="text-center max-w-3xl mx-auto">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold mb-4 text-blue-300">Ready to Create Your First Rule?</h3>
              <p className="text-gray-300 mb-8 text-lg">
                Start by creating a rule for your most common coding patterns. Think about the conventions 
                your team follows and the patterns you want to enforce.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <a
                  href="/cursor-rules/create"
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition font-medium"
                >
                  Create Your First Rule
                </a>
                <a
                  href="/cursor-rules"
                  className="bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition font-medium border border-gray-600"
                >
                  Browse Community Rules
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Community Benefits */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6 text-white text-center">Why Share Rules with the Community?</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center p-8 border border-gray-700 rounded-xl bg-gray-800/50">
              <div className="text-5xl mb-6">🤝</div>
              <h3 className="text-xl font-semibold mb-4 text-white">Help Others</h3>
              <p className="text-gray-300">
                Share your expertise and help other developers learn from your experience and best practices.
              </p>
            </div>
            <div className="text-center p-8 border border-gray-700 rounded-xl bg-gray-800/50">
              <div className="text-5xl mb-6">💡</div>
              <h3 className="text-xl font-semibold mb-4 text-white">Discover New Patterns</h3>
              <p className="text-gray-300">
                Learn from the community and discover new coding patterns and best practices you might not have considered.
              </p>
            </div>
            <div className="text-center p-8 border border-gray-700 rounded-xl bg-gray-800/50">
              <div className="text-5xl mb-6">🚀</div>
              <h3 className="text-xl font-semibold mb-4 text-white">Build Together</h3>
              <p className="text-gray-300">
                Contribute to a growing library of proven patterns and coding standards that benefit everyone.
              </p>
            </div>
          </div>
        </section>

        {/* Developer Showcase */}
        <section id="developer" className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-white">Built with expertise by Luis Lozoya</h2>
                          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Senior Full Stack Engineer with extensive experience in building secure, high-performance web applications for businesses of all sizes
              </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 items-center">
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-2xl">👨‍💻</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-blue-300">Senior Full Stack Engineer</h3>
                  <p className="text-gray-400">Building secure, high-performance web applications for businesses</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🚀</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-green-300">Modern Technologies</h3>
                  <p className="text-gray-400">React, Angular, Next.js, AWS, and cloud-native solutions</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🎨</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-purple-300">Security & DevOps</h3>
                  <p className="text-gray-400">Cybersecurity, cloud security, and infrastructure expertise</p>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex items-center space-x-4 pt-4">
                <a href="https://github.com/Javierlozo" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
                <a href="https://www.linkedin.com/in/luisjlozoya/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a href="https://www.luislozoya.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </a>
                <a href="mailto:luis.lozoya.tech@gmail.com" className="text-gray-400 hover:text-white transition">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.272H1.636A1.636 1.636 0 0 1 0 18.366V5.457c0-.904.732-1.636 1.636-1.636h20.728c.904 0 1.636.732 1.636 1.636zM12 13.273L1.636 5.457h20.728L12 13.273z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-xl border border-gray-700">
              <h3 className="text-xl font-semibold mb-4 text-blue-300">About Me</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                I'm a Senior Full Stack Engineer with extensive experience in building secure, high-performance web applications for businesses of all sizes. 
                Leveraging modern frameworks like React, Next.js, and AWS, I focus on creating user-friendly solutions that help companies thrive in today's digital landscape.
              </p>
              <p className="text-gray-300 mb-6 leading-relaxed">
                With a passion for full-stack development, I strive to implement impactful, transformative technologies and best practices that drive real-world results.
              </p>
              
              <h4 className="text-lg font-semibold mb-3 text-green-300">Tech Stack</h4>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-300">React</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-300">Angular</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-gray-300">Next.js</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-gray-300">AWS</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-gray-300">TypeScript</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                  <span className="text-sm text-gray-300">Supabase</span>
                </div>
              </div>
              
                            <div className="border-t border-gray-700 pt-6">
                <h4 className="text-sm font-semibold mb-3 text-gray-400">This Project</h4>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Community-driven platform</li>
                  <li>• Real-time notifications</li>
                  <li>• User authentication & profiles</li>
                  <li>• Social features (follows, likes)</li>
                  <li>• Admin dashboard</li>
                  <li>• Modern UI/UX design</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <h2 className="text-2xl font-semibold mb-6 text-white">Ready to Join the Community?</h2>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Start sharing your knowledge and help build the best Cursor rules community!
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href="/cursor-rules/create"
              className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition font-medium"
            >
              Create Your First Rule
            </a>
            <a
              href="/cursor-rules"
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition font-medium"
            >
              Browse Community Rules
            </a>
          </div>
        </section>
      </div>
    </main>
  );
} 