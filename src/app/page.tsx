export default function HomePage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Cursor Rules Hub</h1>
        <p className="text-xl text-gray-600 mb-8">
          Discover, create, and share AI behavior rules for your Cursor editor
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="/cursor-rules/create"
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
          >
            Create Rule
          </a>
          <a
            href="/cursor-rules"
            className="bg-gray-100 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-200 transition"
          >
            Browse Rules
          </a>
        </div>
      </section>

      <section className="mb-12 max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6">How It Works</h2>
        <div className="grid gap-6">
          <div className="p-6 border rounded-lg">
            <h3 className="font-semibold mb-2">Project Rules</h3>
            <p className="text-gray-600">
              Store in .cursor/rules directory. Perfect for framework-specific
              configurations, custom UI patterns, and project-specific
              preferences.
            </p>
          </div>
          <div className="p-6 border rounded-lg">
            <h3 className="font-semibold mb-2">Rule Features</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Semantic descriptions for rule application</li>
              <li>File pattern matching with glob patterns</li>
              <li>Automatic attachment to relevant files</li>
              <li>Reference other files using @file syntax</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
