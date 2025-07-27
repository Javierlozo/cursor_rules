"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

interface UserStats {
  rulesCount: number;
  likesCount: number;
}

export default function UserStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats>({
    rulesCount: 0,
    likesCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserStats();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchUserStats = async () => {
    try {
      // Fetch user's rules count
      const { count: rulesCount, error: rulesError } = await supabase
        .from("cursor_rules")
        .select("*", { count: "exact", head: true })
        .eq("created_by", user?.id);

      if (rulesError) {
        console.error("Error fetching rules count:", rulesError);
      }

      // For now, just show rules count since downloads/likes tables might not exist
      setStats({
        rulesCount: rulesCount || 0,
        likesCount: 0, // Will be implemented when likes table is ready
      });
    } catch (error) {
      console.error("Error fetching user stats:", error);
      // Set default values on error
      setStats({
        rulesCount: 0,
        likesCount: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded mb-1"></div>
            <div className="h-3 bg-gray-700 rounded"></div>
          </div>
        </div>
        <div>
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded mb-1"></div>
            <div className="h-3 bg-gray-700 rounded"></div>
          </div>
        </div>
        <div>
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded mb-1"></div>
            <div className="h-3 bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 text-center">
      <div>
        <p className="text-2xl font-bold text-blue-400">{stats.rulesCount}</p>
        <p className="text-xs text-gray-400">Rules</p>
      </div>
      <div>
        <p className="text-2xl font-bold text-purple-400">{stats.likesCount}</p>
        <p className="text-xs text-gray-400">Likes</p>
      </div>
    </div>
  );
} 