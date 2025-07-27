"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { FiUser, FiUsers } from "react-icons/fi";

interface Follower {
  id: string;
  username: string;
  display_name: string;
}

export default function FollowersPreview() {
  const { user } = useAuth();
  const [followers, setFollowers] = useState<Follower[]>([]);
  const [loading, setLoading] = useState(true);
  const [followerCount, setFollowerCount] = useState(0);

  useEffect(() => {
    if (user) {
      fetchFollowers();
    }
  }, [user]);

  const fetchFollowers = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Get followers first
      const { data: followersData, error } = await supabase
        .from("user_follows")
        .select("follower_id")
        .eq("following_id", user.id)
        .limit(3); // Show only first 3 followers

      if (error) {
        console.error("Error fetching followers:", error);
        return;
      }

      // Get total follower count
      const { count: totalFollowers } = await supabase
        .from("user_follows")
        .select("*", { count: "exact", head: true })
        .eq("following_id", user.id);

      setFollowerCount(totalFollowers || 0);

      // Get user profiles for the followers
      if (followersData && followersData.length > 0) {
        const followerIds = followersData.map(f => f.follower_id);
        const { data: profilesData, error: profilesError } = await supabase
          .from("user_profiles")
          .select("user_id, username, display_name")
          .in("user_id", followerIds);

        if (profilesError) {
          console.error("Error fetching user profiles:", profilesError);
          return;
        }

        // Transform the data
        const followersList = followersData.map(follower => {
          const profile = profilesData?.find(p => p.user_id === follower.follower_id);
          return {
            id: follower.follower_id,
            username: profile?.username || "Unknown",
            display_name: profile?.display_name || profile?.username || "Unknown"
          };
        });

        setFollowers(followersList);
      } else {
        setFollowers([]);
      }
    } catch (error) {
      console.error("Error fetching followers:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-2">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (followerCount === 0) {
    return (
      <div className="text-center py-3">
        <FiUsers className="w-8 h-8 text-gray-500 mx-auto mb-2" />
        <p className="text-sm text-gray-400">No followers yet</p>
        <p className="text-xs text-gray-500 mt-1">Share your profile to get followers!</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Follower count */}
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
        <FiUsers className="w-4 h-4" />
        <span>{followerCount} follower{followerCount !== 1 ? 's' : ''}</span>
      </div>

      {/* Follower previews */}
      <div className="space-y-2">
        {followers.map((follower) => (
          <div key={follower.id} className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <FiUser className="w-3 h-3 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white truncate">
                {follower.display_name}
              </p>
              <p className="text-xs text-gray-400 truncate">
                @{follower.username}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Show more indicator */}
      {followerCount > 3 && (
        <div className="text-center pt-2 border-t border-gray-700">
          <p className="text-xs text-gray-400">
            +{followerCount - 3} more
          </p>
        </div>
      )}
    </div>
  );
} 