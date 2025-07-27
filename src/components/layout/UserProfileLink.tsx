"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

interface UserProfileLinkProps {
  onClose?: () => void;
}

export default function UserProfileLink({ onClose }: UserProfileLinkProps) {
  const { user } = useAuth();
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUsername();
    }
  }, [user]);

  const fetchUsername = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      const { data: profileData, error } = await supabase
        .from("user_profiles")
        .select("username")
        .eq("user_id", user.id)
        .single();

      if (error) {
        console.error("Error fetching username:", error);
        return;
      }

      setUsername(profileData?.username || null);
    } catch (error) {
      console.error("Error fetching username:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-xs text-gray-500">
        Loading...
      </div>
    );
  }

  if (!username) {
    return (
      <Link
        href="/profile"
        className="text-xs text-blue-400 hover:text-blue-300 transition"
        onClick={onClose}
      >
        View All
      </Link>
    );
  }

  return (
    <Link
      href={`/profile/${username}`}
      className="text-xs text-blue-400 hover:text-blue-300 transition"
      onClick={onClose}
    >
      View All
    </Link>
  );
} 