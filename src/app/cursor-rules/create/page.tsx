"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { CreateRuleData } from "@/lib/types/cursor-rule";
import { FiSave, FiX, FiPlus, FiTrash2 } from "react-icons/fi";

export default function CreateRulePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
        .from("cursor_rules")
        .insert([formData])
        .select()
        .single();

      if (error) {
        console.error("Error creating rule:", error);
        alert("Failed to create rule");
        return;
      }

      console.log("Rule created successfully:", data.name);
      router.push("/cursor-rules");
    } catch (error) {
      console.error("Error creating rule:", error);
      alert("Failed to create rule");
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
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Create New Cursor Rule</h1>
        
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
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
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
              />
              <button
                type="button"
                onClick={addReference}
                className="px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
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
