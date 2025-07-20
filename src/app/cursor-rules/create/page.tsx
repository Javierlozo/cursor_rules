"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CreateRuleData } from "@/lib/types/cursor-rule";

const CATEGORIES = [
  "React", "Node.js", "TypeScript", "Testing", "UI/UX", 
  "Performance", "Security", "Database", "API", "General"
];

const FRAMEWORKS = [
  "React", "Vue", "Angular", "Next.js", "Nuxt", "Svelte",
  "Express", "Fastify", "Koa", "NestJS", "Django", "Flask",
  "Laravel", "Ruby on Rails", "Spring", "ASP.NET"
];

export default function CreateRulePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [formData, setFormData] = useState<CreateRuleData>({
    name: "",
    description: "",
    pattern: "",
    rule_content: "",
    references: [],
    tags: [],
    category: "",
    framework: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Load template data from URL parameters
  useEffect(() => {
    const name = searchParams.get('name');
    const description = searchParams.get('description');
    const pattern = searchParams.get('pattern');
    const category = searchParams.get('category');
    const framework = searchParams.get('framework');
    const tags = searchParams.get('tags');
    const content = searchParams.get('content');

    if (name || description || pattern || category || framework || tags || content) {
      setFormData({
        name: name || "",
        description: description || "",
        pattern: pattern || "",
        rule_content: content || "",
        references: [],
        tags: tags ? tags.split(',') : [],
        category: category || "",
        framework: framework || "",
      });
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/cursor-rules", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/cursor-rules");
      } else {
        const errorData = await res.json();
        setError(errorData.error || "Failed to create rule");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const addTag = (tag: string) => {
    if (tag.trim() && !formData.tags?.includes(tag.trim())) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), tag.trim()],
      });
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: (formData.tags || []).filter(tag => tag !== tagToRemove),
    });
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Create Cursor Rule</h1>
          <a
            href="/cursor-rules/templates"
            className="text-blue-500 hover:text-blue-600 transition"
          >
            Browse Templates →
          </a>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Rule Name *
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-3 border border-gray-600 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
                placeholder="e.g., React Component Best Practices"
                required
              />
            </div>

            <div>
              <label htmlFor="pattern" className="block text-sm font-medium mb-2">
                File Pattern
              </label>
              <input
                type="text"
                id="pattern"
                value={formData.pattern}
                onChange={(e) => setFormData({ ...formData, pattern: e.target.value })}
                className="w-full p-3 border border-gray-600 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
                placeholder="e.g., *.tsx, src/**/*.js"
              />
            </div>
          </div>

          {/* Category and Framework */}
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="category" className="block text-sm font-medium mb-2">
                Category
              </label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full p-3 border border-gray-600 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a category</option>
                {CATEGORIES.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="framework" className="block text-sm font-medium mb-2">
                Framework
              </label>
              <select
                id="framework"
                value={formData.framework}
                onChange={(e) => setFormData({ ...formData, framework: e.target.value })}
                className="w-full p-3 border border-gray-600 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a framework</option>
                {FRAMEWORKS.map(framework => (
                  <option key={framework} value={framework}>{framework}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-3 border border-gray-600 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
              rows={3}
              placeholder="Describe when and how this rule should be applied..."
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {(formData.tags || []).map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              placeholder="Add a tag and press Enter"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addTag(e.currentTarget.value);
                  e.currentTarget.value = '';
                }
              }}
              className="w-full p-3 border border-gray-600 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
            />
          </div>

          {/* Rule Content */}
          <div>
            <label htmlFor="rule_content" className="block text-sm font-medium mb-2">
              Rule Content *
            </label>
            <textarea
              id="rule_content"
              value={formData.rule_content}
              onChange={(e) => setFormData({ ...formData, rule_content: e.target.value })}
              className="w-full p-3 border border-gray-600 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm placeholder-gray-400"
              rows={15}
              placeholder="Enter your rule content here..."
              required
            />
            <p className="mt-2 text-sm text-gray-600">
              This is the actual rule that will be applied to Cursor AI. Use clear, specific instructions.
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Creating..." : "Create Rule"}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="bg-gray-100 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-200 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
