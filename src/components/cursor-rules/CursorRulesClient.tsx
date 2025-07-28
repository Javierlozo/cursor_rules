"use client";

import { useState, useEffect } from "react";
import CursorRulesList from "@/components/cursor-rules/CursorRulesList";
import SearchBar from "@/components/cursor-rules/SearchBar";
import { supabase } from "@/lib/supabase";
import { CursorRule } from "@/lib/types/cursor-rule";

export default function CursorRulesClient() {
  const [rules, setRules] = useState<CursorRule[]>([]);
  const [filteredRules, setFilteredRules] = useState<CursorRule[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Change useState to useEffect for data fetching
  useEffect(() => {
    const fetchRules = async () => {
      try {
        // Try to use the enhanced view first, fall back to regular table
        let { data, error } = await supabase
          .from("cursor_rules_with_creator")
          .select("*");

        // If view doesn't exist, use regular table
        if (error && error.code === '42P01') {
          const result = await supabase
            .from("cursor_rules")
            .select("*");
          data = result.data;
          error = result.error;
        }

        if (error) {
          console.error("Error fetching rules:", error);
          return;
        }

        const safeRules = data ?? [];
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
    <>
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
    </>
  );
} 