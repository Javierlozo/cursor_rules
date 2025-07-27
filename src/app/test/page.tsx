"use client";

import { useState, useEffect } from "react";
import { CursorRule } from "@/lib/types/cursor-rule";
import CursorRulesList from "@/components/cursor-rules/CursorRulesList";

export default function TestPage() {
  const [rules, setRules] = useState<CursorRule[]>([]);

  // Test creating a rule
  const createRule = async () => {
    const testRule = {
      name: "Test Cursor",
      description: "A test cursor rule",
      cursor_properties: {
        color: "#FF0000",
        size: 20,
        shape: "circle" as const,
      },
    };

    try {
      const res = await fetch("/api/cursor-rules", {
        method: "POST",
        body: JSON.stringify(testRule),
      });
      const data = await res.json();

      fetchRules();
    } catch (error) {
      console.error("Error creating rule:", error);
    }
  };

  // Fetch all rules
  const fetchRules = async () => {
    try {
      const res = await fetch("/api/cursor-rules");
      const data = await res.json();

      // Check if data is an array before setting
      if (Array.isArray(data)) {
        setRules(data);
      } else {
        setRules([]); // Set empty array as fallback
      }
    } catch (error) {
      console.error("Error fetching rules:", error);
      setRules([]); // Set empty array on error
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Database Test Page</h1>
      <button
        onClick={createRule}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Create Test Rule
      </button>

      <div className="mb-4">
        <h2 className="text-xl mb-2">Current Rules:</h2>
        <CursorRulesList rules={rules} />
      </div>
    </div>
  );
}
