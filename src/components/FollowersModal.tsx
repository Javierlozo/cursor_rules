"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { FiUser, FiX, FiUsers, FiUserPlus } from "react-icons/fi";
import Link from "next/link";

interface User {
  id: string;
  username: string;
  display_name: string;
}

interface FollowersModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  type: "followers" | "following";
  count: number;
}

export default function FollowersModal({ isOpen, onClose, userId, type, count }: FollowersModalProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen && userId) {
      fetchUsers();
    }
  }, [isOpen, userId, type]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      let userIds: string[] = [];
      
      if (type === "followers") {
        // Get users who follow this user
        const { data: followersData, error: followersError } = await supabase
          .from("user_follows")
          .select("follower_id")
          .eq("following_id", userId);

        if (followersError) {
          console.error(`Error fetching ${type}:`, followersError);
          setError(`Failed to load ${type}`);
          return;
        }

        userIds = followersData?.map(f => f.follower_id) || [];
      } else {
        // Get users this user is following
        const { data: followingData, error: followingError } = await supabase
          .from("user_follows")
          .select("following_id")
          .eq("follower_id", userId);

        if (followingError) {
          console.error(`Error fetching ${type}:`, followingError);
          setError(`Failed to load ${type}`);
          return;
        }

        userIds = followingData?.map(f => f.following_id) || [];
      }

      // Get user profiles for the user IDs
      if (userIds.length > 0) {
        const { data: profilesData, error: profilesError } = await supabase
          .from("user_profiles")
          .select("user_id, username, display_name")
          .in("user_id", userIds);

        if (profilesError) {
          console.error("Error fetching user profiles:", profilesError);
          setError("Failed to load user profiles");
          return;
        }

        // Transform the data
        const usersList = userIds.map(userId => {
          const profile = profilesData?.find(p => p.user_id === userId);
          return {
            id: userId,
            username: profile?.username || "Unknown",
            display_name: profile?.display_name || profile?.username || "Unknown"
          };
        });

        setUsers(usersList);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
      setError(`Failed to load ${type}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-xl max-w-md w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            {type === "followers" ? (
              <FiUsers className="w-5 h-5 text-purple-400" />
            ) : (
              <FiUserPlus className="w-5 h-5 text-orange-400" />
            )}
            <div>
              <h2 className="text-lg font-semibold text-white capitalize">
                {type}
              </h2>
              <p className="text-sm text-gray-400">{count} {type.slice(0, -1)}{count !== 1 ? 's' : ''}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition p-1"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-400">{error}</p>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8">
              <FiUsers className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No {type} yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {users.map((user) => (
                <Link
                  key={user.id}
                  href={`/profile/${user.username}`}
                  onClick={onClose}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition group"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <FiUser className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate group-hover:text-blue-400 transition">
                      {user.display_name}
                    </p>
                    <p className="text-sm text-gray-400 truncate">
                      @{user.username}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 