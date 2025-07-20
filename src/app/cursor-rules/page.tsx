"use client";

import { useState, useEffect } from "react";
import CursorRulesList from "@/components/cursor-rules/CursorRulesList";
import SearchBar from "@/components/cursor-rules/SearchBar";
import { supabase } from "@/lib/supabase";
import { CursorRule } from "@/lib/types/cursor-rule";

export default function CursorRulesPage() {
  const [rules, setRules] = useState<CursorRule[]>([]);
  const [filteredRules, setFilteredRules] = useState<CursorRule[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Change useState to useEffect for data fetching
  useEffect(() => {
    const fetchRules = async () => {
      try {
        console.log("Fetching rules...");
        const { data, error } = await supabase
          .from("cursor_rules")
          .select("*");

        console.log("Supabase response:", { data, error });

        if (error) {
          console.error("Error fetching rules:", error);
          return;
        }

        const safeRules = data ?? [];
        console.log("Setting rules:", safeRules);
        setRules(safeRules);
        setFilteredRules(safeRules);
      } catch (error) {
        console.error("Error fetching rules:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRules();
  }, []); // Empty dependency array means this runs once on mount

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredRules(rules);
      return;
    }

    const searchTerms = query.toLowerCase().split(" ");
    const filtered = rules.filter((rule) => {
      const searchableText = `
        ${rule.name.toLowerCase()}
        ${rule.description?.toLowerCase() ?? ""}
        ${rule.pattern?.toLowerCase() ?? ""}
        ${rule.rule_content.toLowerCase()}
      `;

      return searchTerms.every((term) => searchableText.includes(term));
    });

    setFilteredRules(filtered);
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Cursor Rules</h1>
        <a
          href="/cursor-rules/create"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Create New Rule
        </a>
      </div>

      <div className="mb-6 max-w-2xl">
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search by name, description, or pattern..."
        />
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading rules...</p>
        </div>
      ) : (
        <CursorRulesList rules={filteredRules} />
      )}
    </main>
  );
}
