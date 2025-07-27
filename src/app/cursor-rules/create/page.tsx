"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { CreateRuleData } from "@/lib/types/cursor-rule";
import { FiSave, FiX, FiPlus, FiAlertCircle, FiCheck, FiUser, FiStar } from "react-icons/fi";
import Link from "next/link";

function CreateRuleForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
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

  const [newTag, setNewTag] = useState("");
  const [newReference, setNewReference] = useState("");

  // Check authentication and redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin?redirect=/cursor-rules/create');
    }
  }, [user, loading, router]);

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
        tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
        category: category || "",
        framework: framework || "",
        file_references: [],
      });
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    if (!user) {
      setError("You must be logged in to create a rule");
      setIsSubmitting(false);
      return;
    }

    try {
      const ruleData = {
        ...formData,
        created_by: user.id, // Explicitly set the created_by field
      };

      const { data, error } = await supabase
        .from("cursor_rules")
        .insert([ruleData])
        .select()
        .single();

      if (error) {
        console.error("Error creating rule:", error);
        setError(error.message || "Failed to create rule");
        return;
      }

      setSuccess(true);
      
      // Redirect after a short delay to show success message
      setTimeout(() => {
        router.push("/cursor-rules");
      }, 1500);
    } catch (error) {
      console.error("Error creating rule:", error);
      setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags?.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), newTag.trim()],
      });
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags?.filter((tag) => tag !== tagToRemove) || [],
    });
  };

  const addReference = () => {
    if (newReference.trim() && !formData.file_references?.includes(newReference.trim())) {
      setFormData({
        ...formData,
        file_references: [...(formData.file_references || []), newReference.trim()],
      });
      setNewReference("");
    }
  };

  const removeReference = (refToRemove: string) => {
    setFormData({
      ...formData,
      file_references: formData.file_references?.filter((ref) => ref !== refToRemove) || [],
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Create New Cursor Rule</h1>
        
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-700/30 rounded-lg flex items-center gap-2">
            <FiAlertCircle className="text-red-400" />
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-900/20 border border-green-700/30 rounded-lg flex items-center gap-2">
            <FiCheck className="text-green-400" />
            <p className="text-green-300">Rule created successfully! Redirecting...</p>
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
                className="w-full p-3 border border-gray-600 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter rule name"
                required
                disabled={isSubmitting}
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
                className="w-full p-3 border border-gray-600 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., *.tsx, src/**/*.js"
                disabled={isSubmitting}
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
                disabled={isSubmitting}
              >
                <option value="">Select a category</option>
                <option value="React">React</option>
                <option value="Node.js">Node.js</option>
                <option value="TypeScript">TypeScript</option>
                <option value="Testing">Testing</option>
                <option value="UI/UX">UI/UX</option>
                <option value="Performance">Performance</option>
                <option value="Security">Security</option>
                <option value="Database">Database</option>
                <option value="API">API</option>
                <option value="General">General</option>
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
                disabled={isSubmitting}
              >
                <option value="">Select a framework</option>
                <option value="React">React</option>
                <option value="Vue">Vue</option>
                <option value="Angular">Angular</option>
                <option value="Next.js">Next.js</option>
                <option value="Nuxt">Nuxt</option>
                <option value="Svelte">Svelte</option>
                <option value="Express">Express</option>
                <option value="Fastify">Fastify</option>
                <option value="Koa">Koa</option>
                <option value="NestJS">NestJS</option>
                <option value="Django">Django</option>
                <option value="Flask">Flask</option>
                <option value="Laravel">Laravel</option>
                <option value="Ruby on Rails">Ruby on Rails</option>
                <option value="Spring">Spring</option>
                <option value="ASP.NET">ASP.NET</option>
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
              className="w-full p-3 border border-gray-600 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              placeholder="Describe when and how this rule should be applied..."
              disabled={isSubmitting}
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags?.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                    disabled={isSubmitting}
                  >
                    <FiX size={14} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag();
                  }
                }}
                className="flex-1 p-3 border border-gray-600 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Add a tag and press Enter"
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
                disabled={isSubmitting}
              >
                <FiPlus size={16} />
              </button>
            </div>
          </div>

          {/* File References */}
          <div>
            <label className="block text-sm font-medium mb-2">
              File References
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.file_references?.map((ref, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                >
                  {ref}
                  <button
                    type="button"
                    onClick={() => removeReference(ref)}
                    className="ml-1 text-green-600 hover:text-green-800"
                    disabled={isSubmitting}
                  >
                    <FiX size={14} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newReference}
                onChange={(e) => setNewReference(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addReference();
                  }
                }}
                className="flex-1 p-3 border border-gray-600 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Add a file reference and press Enter"
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={addReference}
                className="px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition disabled:opacity-50"
                disabled={isSubmitting}
              >
                <FiPlus size={16} />
              </button>
            </div>
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
              className="w-full p-3 border border-gray-600 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
              rows={15}
              placeholder="Enter your rule content here..."
              required
              disabled={isSubmitting}
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
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <FiSave size={16} />
              {isSubmitting ? "Creating..." : "Create Rule"}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="bg-gray-100 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-200 transition flex items-center gap-2"
              disabled={isSubmitting}
            >
              <FiX size={16} />
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CreateRulePage() {
  const { user, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show authentication required message if user is not authenticated
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-8">
              <div className="mb-6">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiUser className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl font-bold mb-2">Authentication Required</h1>
                <p className="text-gray-400 mb-6">
                  You need to be logged in to create Cursor Rules. Sign in to start creating your own rules and contributing to the community.
                </p>
              </div>
              
              <div className="space-y-4">
                <Link
                  href="/auth/signin?redirect=/cursor-rules/create"
                  className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition flex items-center justify-center gap-2"
                >
                  <FiUser className="w-4 h-4" />
                  Sign In to Create Rules
                </Link>
                
                <div className="text-sm text-gray-400">
                  Don't have an account?{" "}
                  <Link href="/auth/signup?redirect=/cursor-rules/create" className="text-blue-400 hover:text-blue-300">
                    Sign up here
                  </Link>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-700">
                <h3 className="text-lg font-semibold mb-3">Why Create Rules?</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-400">
                  <div className="text-center">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                      <FiPlus className="w-4 h-4 text-white" />
                    </div>
                    <p>Share your expertise</p>
                  </div>
                  <div className="text-center">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
                                              <FiStar className="w-4 h-4 text-white" />
                    </div>
                    <p>Help other developers</p>
                  </div>
                  <div className="text-center">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-2">
                      <FiStar className="w-4 h-4 text-white" />
                    </div>
                    <p>Build your reputation</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded mb-8"></div>
            <div className="space-y-6">
              <div className="h-12 bg-gray-700 rounded"></div>
              <div className="h-12 bg-gray-700 rounded"></div>
              <div className="h-32 bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    }>
      <CreateRuleForm />
    </Suspense>
  );
}
