"use client";

import Link from "next/link";
import { FiFile, FiCode, FiCopy, FiCheck, FiClock, FiDownload } from "react-icons/fi";
import { CursorRule } from "@/lib/types/cursor-rule";
import { useState } from "react";

export default function CursorRulesList({
  rules = [],
}: {
  rules: CursorRule[];
}) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!rules.length) {
    return (
      <div className="text-center py-12 bg-gray-800/50 rounded-xl border border-gray-700">
        <p className="text-gray-400 text-lg">
          No rules found matching your search. Try different keywords or{" "}
          <Link
            href="/cursor-rules/create"
            className="text-blue-400 hover:text-blue-300"
          >
            create a new rule
          </Link>
          .
        </p>
      </div>
    );
  }

  const copyRuleContent = async (id: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy rule:", err);
    }
  };

  const trackDownload = async (ruleId: string) => {
    try {
      await fetch('/api/cursor-rules/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ruleId }),
      });
    } catch (error) {
      console.error('Failed to track download:', error);
    }
  };

  const handleDownload = async (ruleId: string, content: string) => {
    // Track the download
    await trackDownload(ruleId);
    
    // Copy to clipboard
    await copyRuleContent(ruleId, content);
  };

  return (
    <div className="grid gap-8 grid-cols-1 lg:grid-cols-2">
      {rules.map((rule) => (
        <div
          key={rule.id}
          className="group bg-gray-800/50 border border-gray-700 rounded-xl p-6 hover:shadow-xl hover:border-blue-500/50 transition-all duration-300 relative"
        >
          {/* Card Header */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-bold text-gray-200 group-hover:text-blue-400 transition-colors">
                {rule.name}
              </h3>
              <div className="flex items-center gap-2 mt-1 text-sm text-gray-400">
                <FiClock className="w-4 h-4" />
                <span>
                  Added {new Date(rule.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleDownload(rule.id, rule.rule_content)}
                className="text-gray-400 hover:text-green-500 transition-colors p-2 rounded-full hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-200"
                title="Download and copy rule"
              >
                <FiDownload className="w-5 h-5" />
              </button>
              <button
                onClick={() => copyRuleContent(rule.id, rule.rule_content)}
                className="text-gray-400 hover:text-blue-500 transition-colors p-2 rounded-full hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
                title={copiedId === rule.id ? "Copied!" : "Copy rule content"}
              >
                {copiedId === rule.id ? (
                  <FiCheck className="w-5 h-5 text-green-500" />
                ) : (
                  <FiCopy className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Description */}
          {rule.description && (
            <p className="text-gray-400 mb-6 line-clamp-2 leading-relaxed">
              {rule.description}
            </p>
          )}

          {/* Rule Details */}
          <div className="space-y-4">
            {/* Pattern */}
            {rule.pattern && (
              <div className="flex items-center gap-2 text-sm text-gray-400 bg-gray-900/50 p-2 rounded-lg group-hover:bg-blue-900/20 transition-colors">
                <FiFile className="w-4 h-4 flex-shrink-0 text-gray-500" />
                <span className="truncate" title={rule.pattern}>
                  {rule.pattern}
                </span>
              </div>
            )}

            {/* Rule Content */}
            <div className="relative">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                <FiCode className="w-4 h-4 flex-shrink-0" />
                <span>Rule Content</span>
              </div>
              <pre className="bg-gray-900/50 p-4 rounded-lg text-sm overflow-x-auto max-h-40 group-hover:max-h-60 transition-all duration-300 border border-gray-700 group-hover:border-blue-500/50">
                <code className="text-gray-200 font-mono">
                  {rule.rule_content}
                </code>
              </pre>
            </div>

            {/* References */}
            {rule.references && rule.references.length > 0 && (
              <div className="bg-gray-900/50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-300 mb-2">
                  Referenced Files
                </h4>
                <ul className="space-y-1">
                  {rule.references.map((ref, index) => (
                    <li
                      key={index}
                      className="text-sm text-gray-400 truncate flex items-center gap-2"
                      title={ref}
                    >
                      <FiFile className="w-4 h-4 text-gray-500" />
                      {ref}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Card Footer */}
          <div className="mt-6 pt-4 border-t border-gray-700 flex justify-end">
            <Link
              href={`/cursor-rules/${rule.id}`}
              className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded px-2 py-1"
            >
              View Details
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
