"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { FiUser, FiMail, FiLock, FiShield, FiCalendar, FiSave, FiEdit3, FiMapPin, FiGlobe, FiGithub, FiTwitter, FiCheck, FiX, FiEye, FiEyeOff } from "react-icons/fi";
import Link from "next/link";
import { UserProfile, UpdateProfileData } from "@/lib/types/user-profile";

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // Password update state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updatingPassword, setUpdatingPassword] = useState(false);
  
  // Profile update state
  const [editingProfile, setEditingProfile] = useState(false);
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);

  const [profileData, setProfileData] = useState<UpdateProfileData>({
    id: "",
    username: "",
    display_name: "",
    bio: "",
    website: "",
    github_username: "",
    twitter_username: "",
    location: "",
    is_public: true,
  });

  // Check authentication and redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin?redirect=/profile');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      setLoadingProfile(true);
      setError("");

      // Fetch user profile from user_profiles table
      const { data: profileData, error: profileError } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError && profileError.code !== "PGRST116") {
        console.error("Error fetching profile:", profileError);
        setError("Failed to load profile data");
        return;
      }

      if (profileData) {
        setProfileData({
          id: profileData.id,
          username: profileData.username || "",
          display_name: profileData.display_name || "",
          bio: profileData.bio || "",
          website: profileData.website || "",
          github_username: profileData.github_username || "",
          twitter_username: profileData.twitter_username || "",
          location: profileData.location || "",
          is_public: profileData.is_public ?? true,
        });
      }

      // Set basic profile info from auth user
      setProfile({
        id: user.id,
        user_id: user.id,
        username: profileData?.username || "",
        display_name: profileData?.display_name,
        bio: profileData?.bio,
        website: profileData?.website,
        github_username: profileData?.github_username,
        twitter_username: profileData?.twitter_username,
        location: profileData?.location,
        is_public: profileData?.is_public ?? true,
        created_at: user.created_at,
        updated_at: user.updated_at || user.created_at,
      });

      setUserProfile(profileData);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setError("Failed to load profile data");
    } finally {
      setLoadingProfile(false);
    }
  };

  const checkUsernameAvailability = async (username: string, currentUsername?: string) => {
    if (!username || username.length < 3) {
      setUsernameAvailable(null);
      return;
    }

    if (username === currentUsername) {
      setUsernameAvailable(true);
      return;
    }

    setCheckingUsername(true);
    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("username")
        .eq("username", username)
        .single();

      setUsernameAvailable(!data);
    } catch (error) {
      setUsernameAvailable(true);
    } finally {
      setCheckingUsername(false);
    }
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUsername = e.target.value;
    setProfileData({ ...profileData, username: newUsername });
    checkUsernameAvailability(newUsername, profileData.username);
  };

  const updatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("New passwords don't match");
      return;
    }

    setUpdatingPassword(true);
    setError("");
    setSuccess("");

    try {
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
      const { error } = await supabase
        .from("user_profiles")
        .upsert({
          user_id: user?.id,
          username: profileData.username,
          display_name: profileData.display_name,
          bio: profileData.bio,
          website: profileData.website,
          github_username: profileData.github_username,
          twitter_username: profileData.twitter_username,
          location: profileData.location,
          is_public: profileData.is_public,
        });

      if (error) {
        setError(error.message);
      } else {
        setSuccess("Profile updated successfully!");
        setEditingProfile(false);
        fetchProfile(); // Refresh the profile data
      }
    } catch (error) {
      setError("Failed to update profile");
    } finally {
      setUpdatingProfile(false);
    }
  };

  if (loading || loadingProfile) {
    return (
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading profile...</p>
          </div>
        </div>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 text-center">Profile Settings</h1>
          <p className="text-gray-400 text-center">Manage your account and profile information</p>
        </div>

        {/* Error and Success Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-700/30 rounded-lg">
            <p className="text-red-400">{error}</p>
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-900/20 border border-green-700/30 rounded-lg">
            <p className="text-green-400">{success}</p>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Profile Information */}
          <div className="space-y-6">
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-white">Profile Information</h2>
                {!editingProfile && (
                  <button
                    onClick={() => setEditingProfile(true)}
                    className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                  >
                    <FiEdit3 className="w-4 h-4" />
                    Edit Profile
                  </button>
                )}
              </div>

              {!editingProfile ? (
                /* View Mode */
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Username
                      </label>
                      <div className="flex items-center p-3 bg-gray-700 rounded-lg">
                        <FiUser className="text-gray-400 mr-2" />
                        <span className="text-white">
                          {profileData.username || "No username set"}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Display Name
                      </label>
                      <div className="flex items-center p-3 bg-gray-700 rounded-lg">
                        <FiUser className="text-gray-400 mr-2" />
                        <span className="text-white">
                          {profileData.display_name || "No display name set"}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Email
                      </label>
                      <div className="flex items-center p-3 bg-gray-700 rounded-lg">
                        <FiMail className="text-gray-400 mr-2" />
                        <span className="text-white">{user.email}</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Public Profile
                      </label>
                      <div className="flex items-center p-3 bg-gray-700 rounded-lg">
                        {profileData.is_public ? (
                          <FiEye className="text-gray-400 mr-2" />
                        ) : (
                          <FiEyeOff className="text-gray-400 mr-2" />
                        )}
                        <span className="text-white">
                          {profileData.is_public ? "Public" : "Private"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Bio
                    </label>
                    <div className="p-3 bg-gray-700 rounded-lg">
                      <span className="text-white">
                        {profileData.bio || "No bio set"}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Website
                      </label>
                      <div className="flex items-center p-3 bg-gray-700 rounded-lg">
                        <FiGlobe className="text-gray-400 mr-2" />
                        <span className="text-white">
                          {profileData.website ? (
                            <a href={profileData.website} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                              {profileData.website}
                            </a>
                          ) : (
                            "No website set"
                          )}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Location
                      </label>
                      <div className="flex items-center p-3 bg-gray-700 rounded-lg">
                        <FiMapPin className="text-gray-400 mr-2" />
                        <span className="text-white">
                          {profileData.location || "No location set"}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        GitHub
                      </label>
                      <div className="flex items-center p-3 bg-gray-700 rounded-lg">
                        <FiGithub className="text-gray-400 mr-2" />
                        <span className="text-white">
                          {profileData.github_username ? (
                            <a href={`https://github.com/${profileData.github_username}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                              {profileData.github_username}
                            </a>
                          ) : (
                            "No GitHub username set"
                          )}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Twitter
                      </label>
                      <div className="flex items-center p-3 bg-gray-700 rounded-lg">
                        <FiTwitter className="text-gray-400 mr-2" />
                        <span className="text-white">
                          {profileData.twitter_username ? (
                            <a href={`https://twitter.com/${profileData.twitter_username}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                              {profileData.twitter_username}
                            </a>
                          ) : (
                            "No Twitter username set"
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Edit Mode */
                <form onSubmit={updateProfile} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Username *
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={profileData.username}
                          onChange={handleUsernameChange}
                          className="w-full p-3 border border-gray-600 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter username"
                          required
                          minLength={3}
                          maxLength={20}
                        />
                        {checkingUsername && (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                        )}
                        {usernameAvailable === false && (
                          <FiX className="w-4 h-4 text-red-400" title="Username not available" />
                        )}
                        {usernameAvailable === true && (
                          <FiCheck className="w-4 h-4 text-green-400" title="Username available" />
                        )}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="display_name" className="block text-sm font-medium text-gray-400 mb-1">
                        Display Name
                      </label>
                      <input
                        type="text"
                        id="display_name"
                        value={profileData.display_name}
                        onChange={(e) => setProfileData({ ...profileData, display_name: e.target.value })}
                        className="w-full p-3 border border-gray-600 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter display name"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-400 mb-1">
                      Bio
                    </label>
                    <textarea
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                      className="w-full p-3 border border-gray-600 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                      placeholder="Write a brief bio"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="website" className="block text-sm font-medium text-gray-400 mb-1">
                        Website
                      </label>
                      <input
                        type="url"
                        id="website"
                        value={profileData.website}
                        onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                        className="w-full p-3 border border-gray-600 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://example.com"
                      />
                    </div>

                    <div>
                      <label htmlFor="location" className="block text-sm font-medium text-gray-400 mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        id="location"
                        value={profileData.location}
                        onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                        className="w-full p-3 border border-gray-600 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter your location"
                      />
                    </div>

                    <div>
                      <label htmlFor="github_username" className="block text-sm font-medium text-gray-400 mb-1">
                        GitHub Username
                      </label>
                      <input
                        type="text"
                        id="github_username"
                        value={profileData.github_username}
                        onChange={(e) => setProfileData({ ...profileData, github_username: e.target.value })}
                        className="w-full p-3 border border-gray-600 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="your-github-username"
                      />
                    </div>

                    <div>
                      <label htmlFor="twitter_username" className="block text-sm font-medium text-gray-400 mb-1">
                        Twitter Username
                      </label>
                      <input
                        type="text"
                        id="twitter_username"
                        value={profileData.twitter_username}
                        onChange={(e) => setProfileData({ ...profileData, twitter_username: e.target.value })}
                        className="w-full p-3 border border-gray-600 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="your-twitter-username"
                      />
                    </div>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_public"
                      checked={profileData.is_public}
                      onChange={(e) => setProfileData({ ...profileData, is_public: e.target.checked })}
                      className="mr-2 text-blue-400 focus:ring-blue-500 border-gray-600 rounded"
                    />
                    <label htmlFor="is_public" className="text-sm text-gray-400">
                      Make my profile public
                    </label>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      type="submit"
                      disabled={updatingProfile}
                      className="flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
                    >
                      <FiSave className="w-4 h-4" />
                      {updatingProfile ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingProfile(false)}
                      className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Password Change */}
          <div className="space-y-6">
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <h2 className="text-2xl font-semibold text-white mb-6">Security Settings</h2>
              
              <form onSubmit={updatePassword} className="space-y-4">
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-400 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full p-3 border border-gray-600 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter current password"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-400 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full p-3 border border-gray-600 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter new password"
                    required
                    minLength={6}
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-400 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full p-3 border border-gray-600 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Confirm new password"
                    required
                    minLength={6}
                  />
                </div>

                <button
                  type="submit"
                  disabled={updatingPassword}
                  className="flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition disabled:opacity-50"
                >
                  <FiLock className="w-4 h-4" />
                  {updatingPassword ? "Updating..." : "Update Password"}
                </button>
              </form>
            </div>

            {/* Account Information */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <h2 className="text-2xl font-semibold text-white mb-6">Account Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Account Created
                  </label>
                  <div className="flex items-center p-3 bg-gray-700 rounded-lg">
                    <FiCalendar className="text-gray-400 mr-2" />
                    <span className="text-white">
                      {new Date(user.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    User ID
                  </label>
                  <div className="flex items-center p-3 bg-gray-700 rounded-lg">
                    <FiShield className="text-gray-400 mr-2" />
                    <span className="text-white font-mono text-sm">
                      {user.id}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 