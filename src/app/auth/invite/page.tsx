"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { FiMail, FiLock, FiUser, FiCheck } from "react-icons/fi";

export default function InvitePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [inviteValid, setInviteValid] = useState(false);
  const [inviteLoading, setInviteLoading] = useState(true);

  useEffect(() => {
    // Check if we have an invitation token
    const token = searchParams.get('token');
    const emailParam = searchParams.get('email');
    
    if (emailParam) {
      setEmail(emailParam);
    }

    if (token) {
      validateInvite(token);
    } else {
      setInviteLoading(false);
    }
  }, [searchParams]);

  const validateInvite = async (token: string) => {
    try {
      // Verify the invitation token
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'invite'
      });

      if (error) {
        setError("Invalid or expired invitation link");
        setInviteValid(false);
      } else {
        setInviteValid(true);
        if (data.user?.email) {
          setEmail(data.user.email);
        }
      }
    } catch (error) {
      setError("Invalid invitation link");
      setInviteValid(false);
    } finally {
      setInviteLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      // Get the invitation token
      const token = searchParams.get('token');
      
      if (!token) {
        setError("No invitation token found");
        setLoading(false);
        return;
      }

      // Accept the invitation
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'invite'
      });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      // Now set the password for the user
      const { error: passwordError } = await supabase.auth.updateUser({
        password: password
      });

      if (passwordError) {
        setError(passwordError.message);
        setLoading(false);
        return;
      }

      // Update user metadata with username if provided
      if (username.trim()) {
        const { error: updateError } = await supabase.auth.updateUser({
          data: { username: username.trim() }
        });
        
        if (updateError) {
          console.error("Error updating username:", updateError);
        }
      }

      // Sign in the user
      const { error: signInError } = await signIn(email, password);
      
      if (signInError) {
        setError(signInError.message);
      } else {
        // Success! Redirect to home page
        alert("Welcome! Your account has been created successfully.");
        router.push("/");
      }
    } catch (error) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (inviteLoading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Validating invitation...</p>
        </div>
      </main>
    );
  }

  if (!inviteValid) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Invalid Invitation</h1>
            <p className="text-gray-400">This invitation link is invalid or has expired</p>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-xl p-8">
            <div className="text-center">
              <p className="text-red-300 mb-6">{error}</p>
              <Link 
                href="/auth/signin"
                className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
              >
                Go to Sign In
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-4">
            <FiMail className="text-green-500 text-2xl" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Welcome!</h1>
          <p className="text-gray-400">You've been invited to join Cursor Rules Hub</p>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-xl p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-700/30 rounded-lg">
              <p className="text-red-300">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 border border-gray-600 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="your@email.com"
                  required
                  disabled
                />
              </div>
              <p className="text-sm text-gray-400 mt-1">This email was used for your invitation</p>
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium mb-2">
                Username (optional)
              </label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 border border-gray-600 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
                  placeholder="your-username"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Create Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 border border-gray-600 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
              <p className="text-sm text-gray-400 mt-1">Password must be at least 6 characters</p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 border border-gray-600 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating Account...
                </>
              ) : (
                <>
                  <FiCheck className="mr-2" />
                  Accept Invitation
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Already have an account?{" "}
              <Link href="/auth/signin" className="text-blue-400 hover:text-blue-300">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
} 