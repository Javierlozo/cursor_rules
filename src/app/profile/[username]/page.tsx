"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { CursorRule } from "@/lib/types/cursor-rule";
import { PublicUserProfile } from "@/lib/types/user-profile";
import { FiUser, FiMapPin, FiGlobe, FiGithub, FiTwitter, FiUsers, FiStar, FiEdit } from "react-icons/fi";
import Link from "next/link";
import FollowersModal from "@/components/FollowersModal";

export default function PublicProfilePage() {
  const params = useParams();
  const { user } = useAuth();
  const [profile, setProfile] = useState<PublicUserProfile | null>(null);
  const [rules, setRules] = useState<CursorRule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isUpdatingFollow, setIsUpdatingFollow] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"followers" | "following">("followers");

  const username = params.username as string;

  useEffect(() => {
    fetchProfile();
  }, [username]);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);

      // Fetch user profile
      const { data: profileData, error: profileError } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("username", username)
        .eq("is_public", true)
        .single();

      if (profileError || !profileData) {
        console.error("Profile not found:", profileError);
        return;
      }

      // Fetch user stats
      const { data: statsData, error: statsError } = await supabase
        .rpc("get_user_stats", { user_uuid: profileData.user_id });

      if (statsError) {
        console.error("Error fetching stats:", statsError);
      }

      // Check if current user is following this profile
      let isFollowingStatus = false;
      if (user) {
        try {
          const { data: followData, error: followError } = await supabase
            .from("user_follows")
            .select("id")
            .eq("follower_id", user.id)
            .eq("following_id", profileData.user_id)
            .single();

          // If no error and data exists, user is following
          isFollowingStatus = !followError && !!followData;
        } catch (error) {
          // If there's an error (like 406), assume not following
          console.warn("Could not check follow status:", error);
          isFollowingStatus = false;
        }
      }

      // Fetch user's rules
      const { data: rulesData, error: rulesError } = await supabase
        .from("cursor_rules")
        .select("*")
        .eq("created_by", profileData.user_id)
        .order("created_at", { ascending: false });

      if (rulesError) {
        console.error("Error fetching rules:", rulesError);
      }

      setProfile({
        ...profileData,
        stats: statsData?.[0] || {
          total_rules: 0,
          total_likes: 0,
          followers_count: 0,
          following_count: 0,
        },
        is_following: isFollowingStatus,
      });

      setRules(rulesData || []);
      setIsFollowing(isFollowingStatus);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollow = async () => {
    if (!user || !profile) return;

    setIsUpdatingFollow(true);
    try {
      if (isFollowing) {
        // Unfollow
        console.log("🔄 Unfollowing user:", profile.user_id);
        const { error } = await supabase
          .from("user_follows")
          .delete()
          .eq("follower_id", user.id)
          .eq("following_id", profile.user_id);

        if (!error) {
          console.log("✅ Unfollowed successfully");
          setIsFollowing(false);
          setProfile((prev: PublicUserProfile | null) => prev ? {
            ...prev,
            stats: {
              ...prev.stats,
              followers_count: prev.stats.followers_count - 1,
            },
            is_following: false,
          } : null);
        } else {
          console.error("❌ Error unfollowing:", error);
        }
      } else {
        // Follow
        console.log("🔄 Following user:", profile.user_id);
        const { error } = await supabase
          .from("user_follows")
          .insert({
            follower_id: user.id,
            following_id: profile.user_id,
          });

        if (!error) {
          console.log("✅ Followed successfully");
          setIsFollowing(true);
          setProfile((prev: PublicUserProfile | null) => prev ? {
            ...prev,
            stats: {
              ...prev.stats,
              followers_count: prev.stats.followers_count + 1,
            },
            is_following: true,
          } : null);
        } else {
          console.error("❌ Error following:", error);
        }
      }
    } catch (error) {
      console.error("Error updating follow status:", error);
    } finally {
      setIsUpdatingFollow(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Profile Not Found</h1>
          <p className="text-gray-400 mb-6">
            The profile you're looking for doesn't exist or is private.
          </p>
          <Link
            href="/cursor-rules"
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
          >
            Browse Rules
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-6 mb-6 md:mb-0">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <FiUser className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold mb-1">
                  {profile.display_name || profile.username}
                </h1>
                <p className="text-gray-400 mb-2">@{profile.username}</p>
                {profile.bio && (
                  <p className="text-gray-300 max-w-md">{profile.bio}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              {user && user.id !== profile.user_id && (
                <button
                  onClick={handleFollow}
                  disabled={isUpdatingFollow}
                  className={`px-6 py-2 rounded-lg transition flex items-center gap-2 ${
                    isFollowing
                      ? "bg-gray-600 text-white hover:bg-gray-700"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  {isUpdatingFollow ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <FiUsers className="w-4 h-4" />
                  )}
                  {isFollowing ? "Following" : "Follow"}
                </button>
              )}

              {user && user.id === profile.user_id && (
                <Link
                  href="/profile"
                  className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition flex items-center gap-2"
                >
                  <FiEdit className="w-4 h-4" />
                  Edit Profile
                </Link>
              )}
            </div>
          </div>

          {/* Social Links */}
          {(profile.website || profile.github_username || profile.twitter_username || profile.location) && (
            <div className="flex flex-wrap items-center gap-4 mt-6 pt-6 border-t border-gray-700">
              {profile.location && (
                <div className="flex items-center gap-2 text-gray-400">
                  <FiMapPin className="w-4 h-4" />
                  <span>{profile.location}</span>
                </div>
              )}
              {profile.website && (
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition"
                >
                  <FiGlobe className="w-4 h-4" />
                  <span>Website</span>
                </a>
              )}
              {profile.github_username && (
                <a
                  href={`https://github.com/${profile.github_username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition"
                >
                  <FiGithub className="w-4 h-4" />
                  <span>GitHub</span>
                </a>
              )}
              {profile.twitter_username && (
                <a
                  href={`https://twitter.com/${profile.twitter_username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition"
                >
                  <FiTwitter className="w-4 h-4" />
                  <span>Twitter</span>
                </a>
              )}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{profile.stats.total_rules}</div>
            <div className="text-sm text-gray-400">Rules</div>
          </div>

          <button
            onClick={() => {
              setModalType("followers");
              setModalOpen(true);
            }}
            className="bg-gray-800 border border-gray-700 rounded-xl p-4 text-center hover:bg-gray-700 transition cursor-pointer"
          >
            <div className="text-2xl font-bold text-purple-400">{profile.stats.followers_count}</div>
            <div className="text-sm text-gray-400">Followers</div>
          </button>

          <button
            onClick={() => {
              setModalType("following");
              setModalOpen(true);
            }}
            className="bg-gray-800 border border-gray-700 rounded-xl p-4 text-center hover:bg-gray-700 transition cursor-pointer"
          >
            <div className="text-2xl font-bold text-orange-400">{profile.stats.following_count}</div>
            <div className="text-sm text-gray-400">Following</div>
          </button>
        </div>

        {/* Rules Section */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Rules by {profile.display_name || profile.username}</h2>
            {rules.length > 0 && (
              <span className="text-gray-400">{rules.length} rule{rules.length !== 1 ? 's' : ''}</span>
            )}
          </div>

          {rules.length === 0 ? (
            <div className="text-center py-12 bg-gray-800/50 rounded-xl border border-gray-700">
              <FiStar className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">
                {profile.display_name || profile.username} hasn't created any rules yet.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
              {rules.map((rule) => (
                <div
                  key={rule.id}
                  className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 hover:shadow-xl hover:border-blue-500/50 transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-200 mb-1">
                        {rule.name}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {rule.description}
                      </p>
                    </div>

                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                    <span className="px-2 py-1 bg-gray-700 rounded text-xs">
                      {rule.category || 'General'}
                    </span>
                    {rule.framework && (
                      <span className="px-2 py-1 bg-gray-700 rounded text-xs">
                        {rule.framework}
                      </span>
                    )}
                  </div>

                  <Link
                    href={`/cursor-rules/${rule.id}`}
                    className="text-blue-400 hover:text-blue-300 text-sm transition"
                  >
                    View Details →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Followers/Following Modal */}
      {profile && (
        <FollowersModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          userId={profile.user_id}
          type={modalType}
          count={modalType === "followers" ? profile.stats.followers_count : profile.stats.following_count}
        />
      )}
    </div>
  );
} 