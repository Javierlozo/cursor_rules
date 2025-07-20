"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
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

export default function EditRulePage() {
  const router = useRouter();
  const params = useParams();
  const ruleId = params.id as string;
  const { user, loading } = useAuth();
  
  const [formData, setFormData] = useState<CreateRuleData>({
    name: "",
    description: "",
    pattern: "",
    rule_content: "",
    tags: [],
    category: "",
    framework: "",
    file_references: [],
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchRule = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("cursor_rules")
        .select("*")
        .eq("id", ruleId)
        .eq("created_by", user?.id) // Security: only fetch user's own rules
        .single();

      if (error) {
        console.error("Error fetching rule:", error);
        setError("Rule not found or you don't have permission to edit it");
        return;
      }

      if (data) {
        setFormData({
          name: data.name,
          description: data.description || "",
          pattern: data.pattern || "",
          rule_content: data.rule_content,
          tags: data.tags || [],
          category: data.category || "",
          framework: data.framework || "",
          file_references: data.file_references || [],
        });
      }
    } catch {
      console.error("Error loading rule");
      setError("Failed to load rule");
    } finally {
      setIsLoading(false);
    }
  }, [ruleId, user?.id]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin');
      return;
    }

    if (user && ruleId) {
      fetchRule();
    }
  }, [user, loading, ruleId, fetchRule, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // Get the current session token
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        setError("You must be logged in to edit rules");
        setIsSubmitting(false);
        return;
      }

      const res = await fetch(`/api/cursor-rules/${ruleId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/cursor-rules/my-rules");
      } else {
        const errorData = await res.json();
        setError(errorData.error || "Failed to update rule");
      }
    } catch {
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

  // Show loading state
  if (loading || isLoading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading...</p>
        </div>
      </main>
    );
  }

  // Show sign-in required
  if (!user) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Authentication Required</h1>
          <p className="text-gray-400 mb-6">
            You need to be logged in to edit rules.
          </p>
          <button
            onClick={() => router.push('/auth/signin')}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
          >
            Sign In
          </button>
        </div>
      </main>
    );
  }

  // Show error state
  if (error && !isLoading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Error</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => router.push('/cursor-rules/my-rules')}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
          >
            Back to My Rules
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Edit Rule</h1>
          <a
            href="/cursor-rules/my-rules"
            className="text-blue-500 hover:text-blue-600 transition"
          >
            ← Back to My Rules
          </a>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-700/30 rounded-lg">
            <p className="text-red-300">{error}</p>
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
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-900/50 text-blue-300 rounded-full text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 text-blue-400 hover:text-blue-200"
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
            <p className="mt-2 text-sm text-gray-400">
              This is the actual rule that will be applied to Cursor AI. Use clear, specific instructions.
            </p>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Updating..." : "Update Rule"}
            </button>
            <button
              type="button"
              onClick={() => router.push('/cursor-rules/my-rules')}
              className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
} 