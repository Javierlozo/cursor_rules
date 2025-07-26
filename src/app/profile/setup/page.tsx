"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { CreateProfileData } from "@/lib/types/user-profile";
import { FiUser, FiMapPin, FiGlobe, FiGithub, FiTwitter, FiSave, FiCheck, FiX } from "react-icons/fi";
import Link from "next/link";

export default function ProfileSetupPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);

  const [formData, setFormData] = useState<CreateProfileData>({
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
      router.push('/auth/signin?redirect=/profile/setup');
    }
  }, [user, loading, router]);

  // Check if user already has a profile
  useEffect(() => {
    if (user) {
      checkExistingProfile();
    }
  }, [user]);

  const checkExistingProfile = async () => {
    try {
      const { data: existingProfile } = await supabase
        .from("user_profiles")
        .select("username")
        .eq("user_id", user?.id)
        .single();

      if (existingProfile) {
        router.push('/profile');
      }
    } catch (error) {
      // No existing profile, continue with setup
    }
  };

  const checkUsernameAvailability = async (username: string) => {
    if (username.length < 3) {
      setUsernameAvailable(null);
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
    setFormData({ ...formData, username });
    
    if (username.length >= 3) {
      checkUsernameAvailability(username);
    } else {
      setUsernameAvailable(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    if (!user) {
      setError("You must be logged in to create a profile");
      setIsSubmitting(false);
      return;
    }

    if (!formData.username) {
      setError("Username is required");
      setIsSubmitting(false);
      return;
    }

    if (usernameAvailable !== true) {
      setError("Please choose an available username");
      setIsSubmitting(false);
      return;
    }

    try {
      const { error } = await supabase
        .from("user_profiles")
        .insert([{
          user_id: user.id,
          ...formData,
        }]);

      if (error) {
        console.error("Error creating profile:", error);
        setError(error.message || "Failed to create profile");
        return;
      }

      // Redirect to profile page
      router.push('/profile');
    } catch (error) {
      console.error("Error creating profile:", error);
      setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // Don't render the form if user is not authenticated
  if (!user) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Set Up Your Profile</h1>
          <p className="text-gray-400">Create your public profile to share your Cursor Rules with the community</p>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-xl p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-700/30 rounded-lg flex items-center gap-2">
              <FiX className="text-red-400" />
              <p className="text-red-300">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium mb-2">
                Username *
              </label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  id="username"
                  value={formData.username}
                  onChange={handleUsernameChange}
                  className="w-full pl-10 pr-3 py-3 border border-gray-600 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="your-username"
                  required
                  minLength={3}
                  maxLength={50}
                  pattern="[a-z0-9_-]+"
                />
              </div>
              <div className="mt-2 flex items-center gap-2">
                {checkingUsername ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                ) : usernameAvailable === true ? (
                  <FiCheck className="w-4 h-4 text-green-400" />
                ) : usernameAvailable === false ? (
                  <FiX className="w-4 h-4 text-red-400" />
                ) : null}
                <span className={`text-sm ${
                  usernameAvailable === true ? 'text-green-400' :
                  usernameAvailable === false ? 'text-red-400' :
                  'text-gray-400'
                }`}>
                  {checkingUsername ? 'Checking...' :
                   usernameAvailable === true ? 'Username available' :
                   usernameAvailable === false ? 'Username taken' :
                   'Username must be 3-50 characters, letters, numbers, hyphens, and underscores only'}
                </span>
              </div>
            </div>

            {/* Display Name */}
            <div>
              <label htmlFor="display_name" className="block text-sm font-medium mb-2">
                Display Name
              </label>
              <input
                type="text"
                id="display_name"
                value={formData.display_name}
                onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                className="w-full p-3 border border-gray-600 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Your full name"
                maxLength={100}
              />
            </div>

            {/* Bio */}
            <div>
              <label htmlFor="bio" className="block text-sm font-medium mb-2">
                Bio
              </label>
              <textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full p-3 border border-gray-600 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Tell the community about yourself..."
                rows={3}
                maxLength={500}
              />
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium mb-2">
                Location
              </label>
              <div className="relative">
                <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full pl-10 pr-3 py-3 border border-gray-600 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="City, Country"
                  maxLength={100}
                />
              </div>
            </div>

            {/* Social Links */}
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label htmlFor="website" className="block text-sm font-medium mb-2">
                  Website
                </label>
                <div className="relative">
                  <FiGlobe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="url"
                    id="website"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full pl-10 pr-3 py-3 border border-gray-600 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://your-website.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="github_username" className="block text-sm font-medium mb-2">
                  GitHub Username
                </label>
                <div className="relative">
                  <FiGithub className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    id="github_username"
                    value={formData.github_username}
                    onChange={(e) => setFormData({ ...formData, github_username: e.target.value })}
                    className="w-full pl-10 pr-3 py-3 border border-gray-600 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="username"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="twitter_username" className="block text-sm font-medium mb-2">
                  Twitter Username
                </label>
                <div className="relative">
                  <FiTwitter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    id="twitter_username"
                    value={formData.twitter_username}
                    onChange={(e) => setFormData({ ...formData, twitter_username: e.target.value })}
                    className="w-full pl-10 pr-3 py-3 border border-gray-600 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="username"
                  />
                </div>
              </div>
            </div>

            {/* Privacy Setting */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="is_public"
                checked={formData.is_public}
                onChange={(e) => setFormData({ ...formData, is_public: e.target.checked })}
                className="h-4 w-4 text-blue-500 border-gray-600 rounded focus:ring-blue-500 focus:ring-2 bg-gray-700"
              />
              <label htmlFor="is_public" className="text-sm text-gray-300">
                Make my profile public (recommended)
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isSubmitting || usernameAvailable !== true}
                className="flex-1 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <FiSave className="w-4 h-4" />
                {isSubmitting ? "Creating Profile..." : "Create Profile"}
              </button>
              <Link
                href="/profile"
                className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition"
              >
                Skip for Now
              </Link>
            </div>
          </form>

          <div className="mt-6 p-4 bg-blue-900/20 border border-blue-700/30 rounded-lg">
            <h3 className="text-sm font-medium text-blue-300 mb-2">Why Create a Profile?</h3>
            <ul className="text-sm text-blue-200 space-y-1">
              <li>• Share your Cursor Rules with the community</li>
              <li>• Build your reputation as a developer</li>
              <li>• Connect with other developers</li>
              <li>• Get recognized for your contributions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 