"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { FiUser, FiMail, FiLock, FiShield, FiCalendar, FiSave, FiEdit3, FiMapPin, FiGlobe, FiGithub, FiTwitter, FiCheck, FiX } from "react-icons/fi";
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

  // Show loading state while checking authentication
  if (loading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading...</p>
          </div>
        </div>
      </main>
    );
  }

  // Show authentication required message if user is not authenticated
  if (!user) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-8">
              <div className="mb-6">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiUser className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl font-bold mb-2">Authentication Required</h1>
                <p className="text-gray-400 mb-6">
                  You need to be logged in to view your profile. Sign in to manage your account settings and preferences.
                </p>
              </div>
              
              <div className="space-y-4">
                <Link
                  href="/auth/signin?redirect=/profile"
                  className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition flex items-center justify-center gap-2"
                >
                  <FiUser className="w-4 h-4" />
                  Sign In to View Profile
                </Link>
                
                <div className="text-sm text-gray-400">
                  Don't have an account?{" "}
                  <Link href="/auth/signup?redirect=/profile" className="text-blue-400 hover:text-blue-300">
                    Sign up here
                  </Link>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-700">
                <h3 className="text-lg font-semibold mb-3">Profile Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-400">
                  <div className="text-center">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                      <FiUser className="w-4 h-4 text-white" />
                    </div>
                    <p>Manage account</p>
                  </div>
                  <div className="text-center">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
                      <FiLock className="w-4 h-4 text-white" />
                    </div>
                    <p>Update password</p>
                  </div>
                  <div className="text-center">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-2">
                      <FiShield className="w-4 h-4 text-white" />
                    </div>
                    <p>Security settings</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

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
        // Store auth user data separately, don't try to cast to UserProfile
        setProfile(profileData as any);
      }

      // Get user profile from user_profiles table
      const { data: publicProfile, error: publicProfileError } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (publicProfile) {
        setUserProfile(publicProfile);
        setProfileData({
          id: publicProfile.id,
          username: publicProfile.username,
          display_name: publicProfile.display_name || "",
          bio: publicProfile.bio || "",
          website: publicProfile.website || "",
          github_username: publicProfile.github_username || "",
          twitter_username: publicProfile.twitter_username || "",
          location: publicProfile.location || "",
          is_public: publicProfile.is_public,
        });
      }
    } catch (error) {
      setError("Failed to fetch profile");
    } finally {
      setLoadingProfile(false);
    }
  };

  const checkUsernameAvailability = async (username: string, currentUsername?: string) => {
    if (username.length < 3) {
      setUsernameAvailable(null);
      return;
    }

    // If username hasn't changed, it's available
    if (currentUsername && username === currentUsername) {
      setUsernameAvailable(true);
      return;
    }

    setCheckingUsername(true);
    try {
      const { data } = await supabase
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
    const username = e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '');
    setProfileData({ ...profileData, username });
    
    if (username.length >= 3) {
      checkUsernameAvailability(username, userProfile?.username);
    } else {
      setUsernameAvailable(null);
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

    // Validate password requirements
    const passwordRequirements = {
      length: newPassword.length >= 8,
      uppercase: /[A-Z]/.test(newPassword),
      lowercase: /[a-z]/.test(newPassword),
      number: /\d/.test(newPassword),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
    };

    if (!Object.values(passwordRequirements).every(Boolean)) {
      setError("Password must meet all security requirements");
      setUpdatingPassword(false);
      return;
    }

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

    if (!profileData.username) {
      setError("Username is required");
      setUpdatingProfile(false);
      return;
    }

    if (usernameAvailable !== true) {
      setError("Please choose an available username");
      setUpdatingProfile(false);
      return;
    }

    try {
      if (userProfile) {
        // Update existing profile
        const { error } = await supabase
          .from("user_profiles")
          .update({
            username: profileData.username,
            display_name: profileData.display_name,
            bio: profileData.bio,
            website: profileData.website,
            github_username: profileData.github_username,
            twitter_username: profileData.twitter_username,
            location: profileData.location,
            is_public: profileData.is_public,
          })
          .eq("id", profileData.id);

        if (error) {
          setError(error.message || "Failed to update profile");
        } else {
          setSuccess("Profile updated successfully!");
          setEditingProfile(false);
          fetchProfile();
        }
      } else {
        // Create new profile
        const { error } = await supabase
          .from("user_profiles")
          .insert([{
            user_id: user.id,
            username: profileData.username,
            display_name: profileData.display_name,
            bio: profileData.bio,
            website: profileData.website,
            github_username: profileData.github_username,
            twitter_username: profileData.twitter_username,
            location: profileData.location,
            is_public: profileData.is_public,
          }]);

        if (error) {
          setError(error.message || "Failed to create profile");
        } else {
          setSuccess("Profile created successfully!");
          setEditingProfile(false);
          fetchProfile();
        }
      }
    } catch (error) {
      setError("Failed to update profile");
    } finally {
      setUpdatingProfile(false);
    }
  };

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
                        {profileData.username || "No username set"}
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
                <p className="text-sm text-gray-400 mt-1">Password must be at least 8 characters with uppercase, lowercase, number, and special character</p>
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