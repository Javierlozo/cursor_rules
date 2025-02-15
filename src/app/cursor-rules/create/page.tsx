"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateRulePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    pattern: "",
    rule_content: "",
    references: [] as string[],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/cursor-rules", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        router.push("/cursor-rules");
      }
    } catch (error) {
      console.error("Error creating rule:", error);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Create Cursor Rule</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Rule Name
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="pattern" className="block text-sm font-medium mb-1">
            File Pattern
          </label>
          <input
            type="text"
            id="pattern"
            placeholder="e.g., *.tsx, src/**/*.js"
            value={formData.pattern}
            onChange={(e) =>
              setFormData({ ...formData, pattern: e.target.value })
            }
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-sm font-medium mb-1"
          >
            Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full p-2 border rounded"
            rows={3}
            placeholder="Describe when and how this rule should be applied"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="rule_content"
            className="block text-sm font-medium mb-1"
          >
            Rule Content
          </label>
          <textarea
            id="rule_content"
            value={formData.rule_content}
            onChange={(e) =>
              setFormData({ ...formData, rule_content: e.target.value })
            }
            className="w-full p-2 border rounded font-mono"
            rows={10}
            placeholder="Enter your rule content here..."
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Create Rule
        </button>
      </form>
    </main>
  );
}
