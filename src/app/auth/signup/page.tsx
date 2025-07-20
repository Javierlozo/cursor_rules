"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiCheck, FiX } from "react-icons/fi";

interface PasswordRequirements {
  length: boolean;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
  special: boolean;
}

export default function SignUpPage() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [passwordRequirements, setPasswordRequirements] = useState<PasswordRequirements>({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  // Check password requirements in real-time
  useEffect(() => {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    setPasswordRequirements(requirements);
  }, [password]);

  const isPasswordValid = Object.values(passwordRequirements).every(Boolean);
  const doPasswordsMatch = password === confirmPassword && confirmPassword.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate password requirements
    if (!isPasswordValid) {
      setError("Please meet all password requirements");
      setLoading(false);
      return;
    }

    // Validate password confirmation
    if (!doPasswordsMatch) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    // Validate terms acceptance
    if (!acceptedTerms) {
      setError("Please accept the Terms of Service and Privacy Policy");
      setLoading(false);
      return;
    }

    try {
      const { error } = await signUp(email, password, username);
      
      if (error) {
        setError(error.message);
      } else {
        // Show success message and redirect
        alert("Account created successfully! Please check your email to verify your account.");
        router.push("/auth/signin");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Sign Up</h1>
          <p className="text-gray-400">Join the Cursor Rules Hub community</p>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-xl p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-700/30 rounded-lg">
              <p className="text-red-300">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
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
                  className="w-full pl-10 pr-3 py-3 border border-gray-600 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 border border-gray-600 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

              {/* Password Requirements */}
              <div className="mt-3 p-3 bg-gray-700/50 rounded-lg">
                <p className="text-sm font-medium text-gray-300 mb-2">Password Requirements:</p>
                <div className="space-y-1">
                  <div className={`flex items-center text-sm ${passwordRequirements.length ? 'text-green-400' : 'text-gray-400'}`}>
                    {passwordRequirements.length ? <FiCheck className="w-3 h-3 mr-2" /> : <FiX className="w-3 h-3 mr-2" />}
                    At least 8 characters
                  </div>
                  <div className={`flex items-center text-sm ${passwordRequirements.uppercase ? 'text-green-400' : 'text-gray-400'}`}>
                    {passwordRequirements.uppercase ? <FiCheck className="w-3 h-3 mr-2" /> : <FiX className="w-3 h-3 mr-2" />}
                    One uppercase letter
                  </div>
                  <div className={`flex items-center text-sm ${passwordRequirements.lowercase ? 'text-green-400' : 'text-gray-400'}`}>
                    {passwordRequirements.lowercase ? <FiCheck className="w-3 h-3 mr-2" /> : <FiX className="w-3 h-3 mr-2" />}
                    One lowercase letter
                  </div>
                  <div className={`flex items-center text-sm ${passwordRequirements.number ? 'text-green-400' : 'text-gray-400'}`}>
                    {passwordRequirements.number ? <FiCheck className="w-3 h-3 mr-2" /> : <FiX className="w-3 h-3 mr-2" />}
                    One number
                  </div>
                  <div className={`flex items-center text-sm ${passwordRequirements.special ? 'text-green-400' : 'text-gray-400'}`}>
                    {passwordRequirements.special ? <FiCheck className="w-3 h-3 mr-2" /> : <FiX className="w-3 h-3 mr-2" />}
                    One special character
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    confirmPassword.length > 0
                      ? doPasswordsMatch
                        ? 'border-green-500 bg-gray-800 text-white'
                        : 'border-red-500 bg-gray-800 text-white'
                      : 'border-gray-600 bg-gray-800 text-white'
                  }`}
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
              {confirmPassword.length > 0 && (
                <p className={`text-sm mt-1 ${doPasswordsMatch ? 'text-green-400' : 'text-red-400'}`}>
                  {doPasswordsMatch ? 'Passwords match' : 'Passwords do not match'}
                </p>
              )}
            </div>

            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="terms"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-1 h-4 w-4 text-blue-500 border-gray-600 rounded focus:ring-blue-500 focus:ring-2 bg-gray-700"
              />
              <label htmlFor="terms" className="text-sm text-gray-300">
                I agree to the{" "}
                <Link href="/terms" className="text-blue-400 hover:text-blue-300">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-blue-400 hover:text-blue-300">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || !isPasswordValid || !doPasswordsMatch || !acceptedTerms}
              className="w-full bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating Account...
                </>
              ) : (
                <>
                  <FiCheck className="mr-2" />
                  Sign Up
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Already have an account?{" "}
              <Link href="/auth/signin" className="text-blue-400 hover:text-blue-300">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
} 