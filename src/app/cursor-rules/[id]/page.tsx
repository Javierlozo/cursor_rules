"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { CursorRule } from "@/lib/types/cursor-rule";
import { FiArrowLeft, FiCopy, FiCheck, FiDownload, FiUser, FiClock, FiCode, FiFile, FiTag } from "react-icons/fi";
import Link from "next/link";

export default function CursorRuleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [rule, setRule] = useState<CursorRule | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchRule = async () => {
      try {
        setLoading(true);
        const ruleId = params.id as string;

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

    if (params.id) {
      fetchRule();
    }
  }, [params.id]);

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

  const trackDownload = async () => {
    if (!rule) return;
    
    try {
      await fetch('/api/cursor-rules/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ruleId: rule.id }),
      });
    } catch (error) {
      console.error('Failed to track download:', error);
    }
  };

  const handleDownload = async () => {
    if (!rule) return;
    
    // Track the download
    await trackDownload();
    
    // Copy to clipboard
    await copyRuleContent();
  };

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading rule...</p>
        </div>
      </main>
    );
  }

  if (error || !rule) {
    return (
      <main className="container mx-auto px-4 py-8">
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
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/cursor-rules"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-blue-400 transition mb-6"
          >
            <FiArrowLeft className="w-4 h-4" />
            Back to Rules
          </Link>
          
          <h1 className="text-4xl font-bold text-white mb-4">{rule.name}</h1>
          
          {/* Creator Information */}
          {rule.created_by && (
            <div className="flex items-center gap-3 mb-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <FiUser className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-medium">
                  Created by {rule.created_by}
                </p>
                <p className="text-sm text-gray-400">
                  {new Date(rule.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition"
          >
            <FiDownload className="w-4 h-4" />
            Download & Copy
          </button>
          
          <button
            onClick={copyRuleContent}
            className="flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
          >
            {copied ? (
              <>
                <FiCheck className="w-4 h-4" />
                Copied!
              </>
            ) : (
              <>
                <FiCopy className="w-4 h-4" />
                Copy Rule
              </>
            )}
          </button>
        </div>

        {/* Rule Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            {rule.description && (
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Description</h2>
                <p className="text-gray-300 leading-relaxed">{rule.description}</p>
              </div>
            )}

            {/* Pattern */}
            {rule.pattern && (
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <FiFile className="w-5 h-5" />
                  Pattern
                </h2>
                <div className="bg-gray-900/50 p-4 rounded-lg">
                  <code className="text-gray-200 font-mono text-sm">{rule.pattern}</code>
                </div>
              </div>
            )}

            {/* Rule Content */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <FiCode className="w-5 h-5" />
                Rule Content
              </h2>
              <pre className="bg-gray-900/50 p-4 rounded-lg text-sm overflow-x-auto">
                <code className="text-gray-200 font-mono">{rule.rule_content}</code>
              </pre>
            </div>

            {/* References */}
            {rule.file_references && rule.file_references.length > 0 && (
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Referenced Files</h2>
                <ul className="space-y-2">
                  {rule.file_references.map((ref: string, index: number) => (
                    <li
                      key={index}
                      className="flex items-center gap-2 text-gray-300"
                    >
                      <FiFile className="w-4 h-4 text-gray-500" />
                      <span className="font-mono text-sm">{ref}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Downloads</span>
                  <span className="text-white font-medium">{rule.downloads || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Likes</span>
                  <span className="text-white font-medium">{rule.likes || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Created</span>
                  <span className="text-white font-medium">
                    {new Date(rule.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Tags */}
            {rule.tags && rule.tags.length > 0 && (
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <FiTag className="w-4 h-4" />
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {rule.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Category */}
            {rule.category && (
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Category</h3>
                <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm">
                  {rule.category}
                </span>
              </div>
            )}

            {/* Framework */}
            {rule.framework && (
              <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Framework</h3>
                <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm">
                  {rule.framework}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
} 