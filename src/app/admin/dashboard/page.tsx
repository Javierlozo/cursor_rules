"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { FiUsers, FiTrash2, FiShield, FiActivity, FiUser, FiMapPin, FiGlobe, FiGithub, FiTwitter, FiEye, FiEdit, FiX } from "react-icons/fi";
import Link from "next/link";

interface User {
  id: string;
  email: string;
  username?: string;
  created_at: string;
  last_sign_in_at?: string;
  role?: string;
  profile?: {
    username: string;
    display_name?: string;
    bio?: string;
    location?: string;
    website?: string;
    github_username?: string;
    twitter_username?: string;
    is_public: boolean;
  };
  stats?: {
    total_rules: number;
  
    followers_count: number;
    following_count: number;
  };
}

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalRules: number;
  usersWithProfiles: number;
  publicProfiles: number;
}

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalRules: 0,
    usersWithProfiles: 0,
    publicProfiles: 0,
  });
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("user");
  const [inviting, setInviting] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserDetails, setShowUserDetails] = useState(false);

  useEffect(() => {
    if (user) {
      
      fetchUsers();
      fetchStats();
    }
  }, [user]);

  const fetchUsers = async () => {
    try {
      // Get current session token
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        console.error("No session token available");
        return;
      }

      // Fetch users through API route
      const res = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (!res.ok) {
        console.error("Error fetching users:", res.statusText);
        return;
      }

      const data = await res.json();
      
      // Enhance users with profile and stats data
      const enhancedUsers = await Promise.all(
        (data.users || []).map(async (user: User) => {
          try {
            // Get user profile
            let profile = null;
            try {
              const { data: profileData } = await supabase
                .from("user_profiles")
                .select("*")
                .eq("user_id", user.id)
                .single();
              profile = profileData;
            } catch (error) {
              profile = null;
            }

            // Get user stats
            let statsData = null;
            try {
              const { data: statsResult } = await supabase
                .rpc("get_user_stats", { user_uuid: user.id });
              statsData = statsResult;
            } catch (error) {
              statsData = null;
            }

            return {
              ...user,
              profile: profile || null,
              stats: statsData?.[0] || {
                total_rules: 0,
                total_likes: 0,
                followers_count: 0,
                following_count: 0,
              },
            };
          } catch (error) {
            return {
              ...user,
              profile: null,
              stats: {
                total_rules: 0,
                total_likes: 0,
                followers_count: 0,
                following_count: 0,
              },
            };
          }
        })
      );

      setUsers(enhancedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchStats = async () => {
    try {
      // Get current session token
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        console.error("No session token available");
        return;
      }

      // Fetch stats through API route
      const res = await fetch('/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (!res.ok) {
        console.error("Error fetching stats:", res.statusText);
        return;
      }

      const data = await res.json();
      
      // Get additional profile stats
      const { count: usersWithProfiles } = await supabase
        .from("user_profiles")
        .select("*", { count: "exact", head: true });

      const { count: publicProfiles } = await supabase
        .from("user_profiles")
        .select("*", { count: "exact", head: true })
        .eq("is_public", true);

      setStats({
        ...data,
        usersWithProfiles: usersWithProfiles || 0,
        publicProfiles: publicProfiles || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        alert("No session token available");
        return;
      }

      const res = await fetch(`/api/admin/users?userId=${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (!res.ok) {
        const error = await res.json();
        alert(`Error deleting user: ${error.error}`);
      } else {
        alert("User deleted successfully");
        fetchUsers();
        fetchStats();
      }
    } catch (error) {
      alert("Error deleting user");
    }
  };

  const inviteUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviting(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        alert("No session token available");
        return;
      }

      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: inviteEmail,
          role: inviteRole
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        alert(`Error inviting user: ${error.error}`);
      } else {
        alert("Invitation sent successfully");
        setInviteEmail("");
        setInviteRole("user");
        fetchUsers();
        fetchStats();
      }
    } catch (error) {
      alert("Error inviting user");
    } finally {
      setInviting(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        alert("No session token available");
        return;
      }

      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          role: newRole
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        alert(`Error updating user role: ${error.error}`);
      } else {
        alert("User role updated successfully");
        fetchUsers();
      }
    } catch (error) {
      alert("Error updating user role");
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

  // Check if user is admin (you can customize this logic)
  const isAdmin = user.email === "admin@example.com" || user.user_metadata?.role === "admin";

  if (!isAdmin) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-400 mb-6">
                            You don&apos;t have permission to access admin functions.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center">
              <FiUsers className="text-blue-500 text-2xl mr-3" />
              <div>
                <p className="text-gray-400 text-sm">Total Users</p>
                <p className="text-2xl font-bold">{stats.totalUsers}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center">
              <FiActivity className="text-green-500 text-2xl mr-3" />
              <div>
                <p className="text-gray-400 text-sm">Active Users</p>
                <p className="text-2xl font-bold">{stats.activeUsers}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center">
              <FiUser className="text-purple-500 text-2xl mr-3" />
              <div>
                <p className="text-gray-400 text-sm">With Profiles</p>
                <p className="text-2xl font-bold">{stats.usersWithProfiles}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center">
              <FiShield className="text-orange-500 text-2xl mr-3" />
              <div>
                <p className="text-gray-400 text-sm">Public Profiles</p>
                <p className="text-2xl font-bold">{stats.publicProfiles}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center">
              <FiEdit className="text-green-500 text-2xl mr-3" />
              <div>
                <p className="text-gray-400 text-sm">Total Rules</p>
                <p className="text-2xl font-bold">{stats.totalRules}</p>
              </div>
            </div>
          </div>
          

        </div>

        {/* Invite User Section */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Invite New User</h2>
          <form onSubmit={inviteUser} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="user@example.com"
                className="flex-1 p-3 border border-gray-600 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
                className="p-3 border border-gray-600 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="moderator">Moderator</option>
              </select>
              <button
                type="submit"
                disabled={inviting}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {inviting ? "Inviting..." : "Send Invitation"}
              </button>
            </div>
          </form>
        </div>

        {/* Users Table */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">User Management</h2>
          
          {loadingUsers ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2 text-gray-400">Loading users...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="p-3 text-gray-400 font-medium">User</th>
                    <th className="p-3 text-gray-400 font-medium">Profile</th>
                    <th className="p-3 text-gray-400 font-medium">Stats</th>
                    <th className="p-3 text-gray-400 font-medium">Role</th>
                    <th className="p-3 text-gray-400 font-medium">Created</th>
                    <th className="p-3 text-gray-400 font-medium">Last Sign In</th>
                    <th className="p-3 text-gray-400 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-gray-700 hover:bg-gray-700/50 transition">
                      <td className="p-3">
                        <div>
                          <p className="font-medium">{user.email}</p>
                          {user.profile?.username && (
                            <p className="text-sm text-blue-400">@{user.profile.username}</p>
                          )}
                          {user.profile?.display_name && (
                            <p className="text-sm text-gray-400">{user.profile.display_name}</p>
                          )}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="space-y-1">
                          {user.profile ? (
                            <>
                              <div className="flex items-center gap-1">
                                <span className={`px-2 py-1 rounded text-xs ${
                                  user.profile.is_public 
                                    ? 'bg-green-900/30 text-green-400' 
                                    : 'bg-gray-700 text-gray-400'
                                }`}>
                                  {user.profile.is_public ? 'Public' : 'Private'}
                                </span>
                              </div>
                              {user.profile.location && (
                                <div className="flex items-center gap-1 text-xs text-gray-400">
                                  <FiMapPin className="w-3 h-3" />
                                  <span>{user.profile.location}</span>
                                </div>
                              )}
                              {user.profile.website && (
                                <div className="flex items-center gap-1 text-xs text-gray-400">
                                  <FiGlobe className="w-3 h-3" />
                                  <span>Website</span>
                                </div>
                              )}
                            </>
                          ) : (
                            <span className="text-xs text-gray-500">No profile</span>
                          )}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="space-y-1">

                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <span>Rules: {user.stats?.total_rules || 0}</span>
                            <span>•</span>
                            <span>Followers: {user.stats?.followers_count || 0}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <select
                          value={user.role || "user"}
                          onChange={(e) => updateUserRole(user.id, e.target.value)}
                          className="bg-gray-700 border border-gray-600 text-white rounded px-2 py-1 text-sm"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                          <option value="moderator">Moderator</option>
                        </select>
                      </td>
                      <td className="p-3 text-gray-400 text-sm">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-3 text-gray-400 text-sm">
                        {user.last_sign_in_at 
                          ? new Date(user.last_sign_in_at).toLocaleDateString()
                          : "Never"
                        }
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          {user.profile?.username && (
                            <Link
                              href={`/profile/${user.profile.username}`}
                              className="text-blue-400 hover:text-blue-300 transition"
                              title="View profile"
                            >
                              <FiEye className="w-4 h-4" />
                            </Link>
                          )}
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setShowUserDetails(true);
                            }}
                            className="text-gray-400 hover:text-gray-300 transition"
                            title="View details"
                          >
                            <FiEdit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteUser(user.id)}
                            className="text-red-400 hover:text-red-300 transition"
                            title="Delete user"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* User Details Modal */}
        {showUserDetails && selectedUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">User Details</h3>
                <button
                  onClick={() => setShowUserDetails(false)}
                  className="text-gray-400 hover:text-gray-300 transition"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Basic Info */}
                <div>
                  <h4 className="text-lg font-medium mb-3">Basic Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Email</label>
                      <p className="text-white">{selectedUser.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">User ID</label>
                      <p className="text-white font-mono text-sm">{selectedUser.id}</p>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Created</label>
                      <p className="text-white">{new Date(selectedUser.created_at).toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Last Sign In</label>
                      <p className="text-white">
                        {selectedUser.last_sign_in_at 
                          ? new Date(selectedUser.last_sign_in_at).toLocaleString()
                          : "Never"
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* Profile Info */}
                {selectedUser.profile && (
                  <div>
                    <h4 className="text-lg font-medium mb-3">Profile Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Username</label>
                        <p className="text-white">@{selectedUser.profile.username}</p>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Display Name</label>
                        <p className="text-white">{selectedUser.profile.display_name || "Not set"}</p>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Location</label>
                        <p className="text-white">{selectedUser.profile.location || "Not set"}</p>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Profile Status</label>
                        <span className={`px-2 py-1 rounded text-xs ${
                          selectedUser.profile.is_public 
                            ? 'bg-green-900/30 text-green-400' 
                            : 'bg-gray-700 text-gray-400'
                        }`}>
                          {selectedUser.profile.is_public ? 'Public' : 'Private'}
                        </span>
                      </div>
                      {selectedUser.profile.bio && (
                        <div className="md:col-span-2">
                          <label className="block text-sm text-gray-400 mb-1">Bio</label>
                          <p className="text-white">{selectedUser.profile.bio}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Stats */}
                {selectedUser.stats && (
                  <div>
                    <h4 className="text-lg font-medium mb-3">User Statistics</h4>
                    <div className="grid grid-cols-3 md:grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-gray-700 rounded">
                        <p className="text-2xl font-bold text-blue-400">{selectedUser.stats.total_rules}</p>
                        <p className="text-xs text-gray-400">Rules</p>
                      </div>
                      <div className="text-center p-3 bg-gray-700 rounded">
                        <p className="text-2xl font-bold text-purple-400">{selectedUser.stats.followers_count}</p>
                        <p className="text-xs text-gray-400">Followers</p>
                      </div>
                      <div className="text-center p-3 bg-gray-700 rounded">
                        <p className="text-2xl font-bold text-orange-400">{selectedUser.stats.following_count}</p>
                        <p className="text-xs text-gray-400">Following</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Social Links */}
                {selectedUser.profile && (selectedUser.profile.website || selectedUser.profile.github_username || selectedUser.profile.twitter_username) && (
                  <div>
                    <h4 className="text-lg font-medium mb-3">Social Links</h4>
                    <div className="flex gap-4">
                      {selectedUser.profile.website && (
                        <a
                          href={selectedUser.profile.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition"
                        >
                          <FiGlobe className="w-4 h-4" />
                          <span>Website</span>
                        </a>
                      )}
                      {selectedUser.profile.github_username && (
                        <a
                          href={`https://github.com/${selectedUser.profile.github_username}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition"
                        >
                          <FiGithub className="w-4 h-4" />
                          <span>GitHub</span>
                        </a>
                      )}
                      {selectedUser.profile.twitter_username && (
                        <a
                          href={`https://twitter.com/${selectedUser.profile.twitter_username}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition"
                        >
                          <FiTwitter className="w-4 h-4" />
                          <span>Twitter</span>
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
} 