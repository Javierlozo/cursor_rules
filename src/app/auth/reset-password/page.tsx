"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import ClientOnly from "@/components/ClientOnly";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Check if we have tokens in the URL hash fragment (Supabase email links use #)
    const hash = window.location.hash.substring(1); // Remove the # symbol
    const urlParams = new URLSearchParams(hash);
    
    const accessToken = urlParams.get('access_token');
    const refreshToken = urlParams.get('refresh_token');
    const token = urlParams.get('token');
    const type = urlParams.get('type');
    
    console.log('Reset password URL params:', { 
      accessToken: !!accessToken, 
      refreshToken: !!refreshToken,
      token: !!token,
      type,
      hash: window.location.hash,
      allParams: Object.fromEntries(urlParams.entries())
    });
    
    if (!accessToken && !token) {
      setError("This page is for password reset links only. Please check your email for the reset link or request a new password reset.");
    } else if (token) {
      // Handle the token parameter (older Supabase format)
      supabase.auth.verifyOtp({
        token_hash: token,
        type: 'recovery'
      }).then(({ data, error }) => {
        if (error) {
          console.error('Token verification error:', error);
          setError("Invalid or expired reset link. Please request a new password reset.");
        }
      });
    } else if (accessToken && refreshToken) {
      // Set the session with the tokens
      supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    // Validate passwords
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        console.error('Password update error:', error);
        setError(error.message);
      } else {
        setMessage("Password updated successfully! Redirecting to sign in...");
        setTimeout(() => {
          router.push('/auth/signin');
        }, 2000);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Set New Password</h1>
          <p className="text-gray-400">Enter your new password below</p>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-xl p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-700/30 rounded-lg">
              <p className="text-red-300 mb-3">{error}</p>
              <Link 
                href="/auth/forgot-password" 
                className="text-blue-400 hover:text-blue-300 transition text-sm"
              >
                ← Request new password reset
              </Link>
            </div>
          )}

          {message && (
            <div className="mb-6 p-4 bg-green-900/20 border border-green-700/30 rounded-lg">
              <p className="text-green-300">{message}</p>
            </div>
          )}

          {!error && (
            <>
              <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                New Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 border border-gray-600 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 border border-gray-600 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showConfirmPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link 
              href="/auth/signin" 
              className="text-blue-400 hover:text-blue-300 transition"
            >
              Back to Sign In
            </Link>
          </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading...</p>
          </div>
        </div>
      </main>
    }>
      <ClientOnly
        fallback={
          <main className="container mx-auto px-4 py-8">
            <div className="max-w-md mx-auto">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-4 text-gray-400">Loading...</p>
              </div>
            </div>
          </main>
        }
      >
        <ResetPasswordForm />
      </ClientOnly>
    </Suspense>
  );
} 