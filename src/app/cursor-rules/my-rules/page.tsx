"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { CursorRule } from "@/lib/types/cursor-rule";
import { FiEdit, FiTrash2, FiEye, FiDownload, FiCopy, FiCheck } from "react-icons/fi";

export default function MyRulesPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [rules, setRules] = useState<CursorRule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const fetchMyRules = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("cursor_rules")
        .select("*")
        .eq("created_by", user?.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching rules:", error);
      } else {
        setRules(data || []);
      }
    } catch {
      console.error("Error fetching rules");
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin');
      return;
    }

    if (user) {
      fetchMyRules();
    }
  }, [user, loading, fetchMyRules, router]);

  // Refresh data when the page becomes visible (e.g., after returning from edit)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && user) {
        fetchMyRules();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [user, fetchMyRules]);

  // Refresh data when navigating back to this page
  useEffect(() => {
    if (user) {
      fetchMyRules();
    }
  }, [user]);

  const copyRuleContent = async (id: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy rule:", err);
    }
  };

  const handleDelete = async (ruleId: string) => {
    try {
      const { error } = await supabase
        .from("cursor_rules")
        .delete()
        .eq("id", ruleId)
        .eq("created_by", user?.id); // Extra security check

      if (error) {
        console.error("Error deleting rule:", error);
        alert("Failed to delete rule");
      } else {
        setRules(rules.filter(rule => rule.id !== ruleId));
        setDeleteConfirm(null);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to delete rule");
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
    await trackDownload(ruleId);
    await copyRuleContent(ruleId, content);
  };

  // Show loading state
  if (loading) {
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
            You need to be logged in to view your rules.
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

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-center">My Rules</h1>
            <p className="text-gray-400 mt-2">Manage your cursor rules</p>
          </div>
          <button
            onClick={() => router.push('/cursor-rules/create')}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
          >
            Create New Rule
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading your rules...</p>
          </div>
        ) : rules.length === 0 ? (
          <div className="text-center py-12 bg-gray-800/50 rounded-xl border border-gray-700">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-xl font-semibold mb-2">No Rules Yet</h3>
            <p className="text-gray-400 mb-6">
              You haven&apos;t created any rules yet. Start contributing to the community!
            </p>
            <button
              onClick={() => router.push('/cursor-rules/create')}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
            >
              Create Your First Rule
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {rules.map((rule) => (
              <div
                key={rule.id}
                className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">{rule.name}</h3>
                    {rule.description && (
                      <p className="text-gray-400 mb-3">{rule.description}</p>
                    )}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {rule.category && (
                        <span className="inline-block bg-blue-900/50 text-blue-300 text-xs px-2 py-1 rounded">
                          {rule.category}
                        </span>
                      )}
                      {rule.framework && (
                        <span className="inline-block bg-green-900/50 text-green-300 text-xs px-2 py-1 rounded">
                          {rule.framework}
                        </span>
                      )}
                      <span className="inline-block bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded">
                        {new Date(rule.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDownload(rule.id, rule.rule_content)}
                      className="text-gray-400 hover:text-green-500 transition-colors p-2 rounded-full hover:bg-green-900/20"
                      title="Download and copy rule"
                    >
                      <FiDownload className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => copyRuleContent(rule.id, rule.rule_content)}
                      className="text-gray-400 hover:text-blue-500 transition-colors p-2 rounded-full hover:bg-blue-900/20"
                      title={copiedId === rule.id ? "Copied!" : "Copy rule content"}
                    >
                      {copiedId === rule.id ? (
                        <FiCheck className="w-4 h-4 text-green-500" />
                      ) : (
                        <FiCopy className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => router.push(`/cursor-rules/edit/${rule.id}`)}
                      className="text-gray-400 hover:text-yellow-500 transition-colors p-2 rounded-full hover:bg-yellow-900/20"
                      title="Edit rule"
                    >
                      <FiEdit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(rule.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-900/20"
                      title="Delete rule"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Rule Content Preview */}
                <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                    <FiEye className="w-4 h-4" />
                    <span>Rule Content</span>
                  </div>
                  <pre className="text-sm overflow-x-auto max-h-32">
                    <code className="text-gray-200 font-mono">
                      {rule.rule_content.substring(0, 200)}
                      {rule.rule_content.length > 200 && "..."}
                    </code>
                  </pre>
                </div>

                {/* Delete Confirmation Modal */}
                {deleteConfirm === rule.id && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 max-w-md mx-4">
                      <h3 className="text-xl font-semibold mb-4">Delete Rule</h3>
                      <p className="text-gray-400 mb-6">
                        Are you sure you want to delete &quot;{rule.name}&quot;? This action cannot be undone.
                      </p>
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleDelete(rule.id)}
                          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
} 