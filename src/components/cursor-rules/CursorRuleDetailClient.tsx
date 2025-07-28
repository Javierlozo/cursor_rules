"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { CursorRule } from "@/lib/types/cursor-rule";
import { FiArrowLeft, FiCopy, FiCheck, FiClock, FiCode, FiFile, FiTag } from "react-icons/fi";
import Link from "next/link";
import { ArticleStructuredData } from "@/components/StructuredData";

interface CursorRuleDetailClientProps {
  ruleId: string;
}

export default function CursorRuleDetailClient({ ruleId }: CursorRuleDetailClientProps) {
  const router = useRouter();
  const [rule, setRule] = useState<CursorRule | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchRule = async () => {
      try {
        setLoading(true);
        
        // Fetch the rule without join
        const { data: ruleData, error: ruleError } = await supabase
          .from("cursor_rules")
          .select("*")
          .eq("id", ruleId)
          .single();

        if (ruleError) {
          console.error("Error fetching rule:", ruleError);
          setError("Rule not found");
          return;
        }

        setRule(ruleData);
      } catch (error) {
        console.error("Error fetching rule:", error);
        setError("Failed to load rule");
      } finally {
        setLoading(false);
      }
    };

    if (ruleId) {
      fetchRule();
    }
  }, [ruleId]);

  const copyRuleContent = async () => {
    if (!rule) return;
    
    try {
      await navigator.clipboard.writeText(rule.rule_content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy rule:", err);
    }
  };

  if (loading) {
    return (
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-400">Loading rule...</p>
      </div>
    );
  }

  if (error || !rule) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-4">Rule Not Found</h1>
        <p className="text-gray-400 mb-6">
          {error || "The rule you're looking for doesn't exist."}
        </p>
        <Link
          href="/cursor-rules"
          className="inline-flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
        >
          <FiArrowLeft className="w-4 h-4" />
          Back to Rules
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/cursor-rules"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition mb-4"
        >
          <FiArrowLeft className="w-4 h-4" />
          Back to Rules
        </Link>
        
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white mb-2">{rule.name}</h1>
            {rule.description && (
              <p className="text-gray-300 text-lg">{rule.description}</p>
            )}
          </div>
          
          <button
            onClick={copyRuleContent}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            title={copied ? "Copied!" : "Copy rule content"}
          >
            {copied ? <FiCheck className="w-4 h-4" /> : <FiCopy className="w-4 h-4" />}
            {copied ? "Copied!" : "Copy Rule"}
          </button>
        </div>
      </div>

      {/* Rule Metadata */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {rule.pattern && (
          <div className="flex items-center gap-2 text-gray-300">
            <FiFile className="w-4 h-4" />
            <span className="text-sm">Pattern: {rule.pattern}</span>
          </div>
        )}
        {rule.framework && (
          <div className="flex items-center gap-2 text-gray-300">
            <FiCode className="w-4 h-4" />
            <span className="text-sm">Framework: {rule.framework}</span>
          </div>
        )}
        {rule.category && (
          <div className="flex items-center gap-2 text-gray-300">
            <FiTag className="w-4 h-4" />
            <span className="text-sm">Category: {rule.category}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-gray-300">
          <FiClock className="w-4 h-4" />
          <span className="text-sm">
            Created: {new Date(rule.created_at).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Rule Content */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Rule Content</h2>
        <pre className="bg-gray-900 p-4 rounded overflow-x-auto text-sm text-gray-200 whitespace-pre-wrap">
          {rule.rule_content}
        </pre>
      </div>

      {/* Description */}
      {rule.description && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-white mb-4">Description</h2>
          <p className="text-gray-300 leading-relaxed">{rule.description}</p>
        </div>
      )}
      
      <ArticleStructuredData rule={rule} />
    </div>
  );
} 