"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

export default function MigratePage() {
  const { user, loading } = useAuth();
  const [isMigrating, setIsMigrating] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleMigrate = async () => {
    setIsMigrating(true);
    setResult(null);

    try {
      // Get the current session token
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        setResult({ error: "You must be logged in" });
        return;
      }

      const res = await fetch('/api/admin/migrate-orphaned-rules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      const data = await res.json();
      setResult(data);
    } catch (error) {
      setResult({ error: "Failed to migrate orphaned rules" });
    } finally {
      setIsMigrating(false);
    }
  };

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

  if (!user) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Authentication Required</h1>
          <p className="text-gray-400 mb-6">
            You need to be logged in to access admin functions.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Admin: Migrate Orphaned Rules</h1>
        
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">What this does:</h2>
          <ul className="text-gray-400 space-y-2 mb-6">
            <li>• Finds rules created before authentication was implemented</li>
            <li>• These rules have <code className="bg-gray-700 px-1 rounded">created_by: null</code></li>
            <li>• Deletes them so users can create new rules with proper ownership</li>
            <li>• This is safe as these rules were created during development</li>
          </ul>
          
          <button
            onClick={handleMigrate}
            disabled={isMigrating}
            className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isMigrating ? "Migrating..." : "Delete Orphaned Rules"}
          </button>
        </div>

        {result && (
          <div className={`p-4 rounded-lg ${
            result.error 
              ? 'bg-red-900/20 border border-red-700/30' 
              : 'bg-green-900/20 border border-green-700/30'
          }`}>
            {result.error ? (
              <p className="text-red-300">{result.error}</p>
            ) : (
              <div>
                <p className="text-green-300 font-semibold">{result.message}</p>
                {result.deletedRules && result.deletedRules.length > 0 && (
                  <div className="mt-4">
                    <p className="text-green-300 text-sm">Deleted rules:</p>
                    <ul className="text-green-300 text-sm mt-2 space-y-1">
                      {result.deletedRules.map((rule: any) => (
                        <li key={rule.id}>• {rule.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
} 