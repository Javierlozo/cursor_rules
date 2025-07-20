"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { FiUser, FiMail, FiLock, FiShield, FiCalendar, FiSave, FiEdit3 } from "react-icons/fi";

interface UserProfile {
  id: string;
  email: string;
  username?: string;
  role?: string;
  created_at: string;
  last_sign_in_at?: string;
}

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // Password update state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updatingPassword, setUpdatingPassword] = useState(false);
  
  // Profile update state
  const [username, setUsername] = useState("");
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      setLoadingProfile(true);
      
      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        setError("No user session found");
        return;
      }

      // Get user profile data
      const { data: { user: profileData }, error } = await supabase.auth.getUser();
      
      if (error) {
        setError("Failed to fetch profile");
        return;
      }

      if (profileData) {
        const userProfile: UserProfile = {
          id: profileData.id,
          email: profileData.email || "",
          username: profileData.user_metadata?.username,
          role: profileData.user_metadata?.role || "user",
          created_at: profileData.created_at,
          last_sign_in_at: profileData.last_sign_in_at
        };
        
        setProfile(userProfile);
        setUsername(userProfile.username || "");
      }
    } catch (error) {
      setError("Failed to fetch profile");
    } finally {
      setLoadingProfile(false);
    }
  };

  const updatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdatingPassword(true);
    setError("");
    setSuccess("");

    // Validate passwords
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      setUpdatingPassword(false);
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      setUpdatingPassword(false);
      return;
    }

    try {
      // Update password
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccess("Password updated successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      setError("Failed to update password");
    } finally {
      setUpdatingPassword(false);
    }
  };

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdatingProfile(true);
    setError("");
    setSuccess("");

    try {
      // Update user metadata
      const { error } = await supabase.auth.updateUser({
        data: { username: username.trim() }
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccess("Profile updated successfully!");
        setEditingProfile(false);
        // Refresh profile data
        fetchProfile();
      }
    } catch (error) {
      setError("Failed to update profile");
    } finally {
      setUpdatingProfile(false);
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
            You need to be logged in to view your profile.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>
        
        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-700/30 rounded-lg">
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-900/20 border border-green-700/30 rounded-lg">
            <p className="text-green-300">{success}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Information */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold flex items-center">
                <FiUser className="mr-2" />
                Account Information
              </h2>
              <button
                onClick={() => setEditingProfile(!editingProfile)}
                className="text-blue-400 hover:text-blue-300 transition"
              >
                <FiEdit3 className="w-4 h-4" />
              </button>
            </div>

            {loadingProfile ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-2 text-gray-400">Loading profile...</p>
              </div>
            ) : profile ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Email
                  </label>
                  <div className="flex items-center p-3 bg-gray-700 rounded-lg">
                    <FiMail className="text-gray-400 mr-2" />
                    <span className="text-white">{profile.email}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Username
                  </label>
                  {editingProfile ? (
                    <form onSubmit={updateProfile} className="space-y-4">
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full p-3 border border-gray-600 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter username"
                      />
                      <div className="flex space-x-3">
                        <button
                          type="submit"
                          disabled={updatingProfile}
                          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
                        >
                          {updatingProfile ? "Saving..." : "Save"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingProfile(false)}
                          className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex items-center p-3 bg-gray-700 rounded-lg">
                      <FiUser className="text-gray-400 mr-2" />
                      <span className="text-white">
                        {profile.username || "No username set"}
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Role
                  </label>
                  <div className="flex items-center p-3 bg-gray-700 rounded-lg">
                    <FiShield className="text-gray-400 mr-2" />
                    <span className="text-white capitalize">{profile.role}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Member Since
                  </label>
                  <div className="flex items-center p-3 bg-gray-700 rounded-lg">
                    <FiCalendar className="text-gray-400 mr-2" />
                    <span className="text-white">
                      {new Date(profile.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {profile.last_sign_in_at && (
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Last Sign In
                    </label>
                    <div className="flex items-center p-3 bg-gray-700 rounded-lg">
                      <FiCalendar className="text-gray-400 mr-2" />
                      <span className="text-white">
                        {new Date(profile.last_sign_in_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-400">Failed to load profile</p>
            )}
          </div>

          {/* Password Update */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <FiLock className="mr-2" />
              Update Password
            </h2>

            <form onSubmit={updatePassword} className="space-y-4">
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-3 border border-gray-600 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
                <p className="text-sm text-gray-400 mt-1">Password must be at least 6 characters</p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-3 border border-gray-600 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>

              <button
                type="submit"
                disabled={updatingPassword || !newPassword || !confirmPassword}
                className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {updatingPassword ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Updating Password...
                  </>
                ) : (
                  <>
                    <FiSave className="mr-2" />
                    Update Password
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 p-4 bg-blue-900/20 border border-blue-700/30 rounded-lg">
              <h3 className="text-sm font-medium text-blue-300 mb-2">Password Security Tips</h3>
              <ul className="text-sm text-blue-200 space-y-1">
                <li>• Use at least 6 characters</li>
                <li>• Include uppercase and lowercase letters</li>
                <li>• Add numbers and special characters</li>
                <li>• Avoid common passwords</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 