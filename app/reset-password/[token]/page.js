"use client";

import { useState, use } from "react";
import { Lock, AlertCircle, CheckCircle, Check, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage({ params }) {
  const resolvedParams = use(params);
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const hasLength = password.length >= 8 && password.length <= 20;
  const hasCapital = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: resolvedParams.token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push("/login"), 2500);
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full animate-fade-in-scale">
        <h1
          className="text-xl font-bold text-center text-gray-900 mb-1"
          style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
        >
          Set a new password
        </h1>
        <p className="text-center text-gray-500 text-sm mb-6">
          Choose a strong password for your account.
        </p>

        {success ? (
          <div className="flex flex-col items-center text-center gap-2 py-4 animate-fade-in">
            <CheckCircle className="text-green-700" size={32} />
            <p className="text-gray-700 text-sm">
              Password reset successfully. Redirecting to login...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="password"
                  placeholder="New Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent transition-shadow"
                />
              </div>

              {password.length > 0 && (
                <ul className="mt-2 text-sm flex flex-col gap-1">
                  <li className={`flex items-center gap-1 transition-colors ${hasLength ? "text-green-700" : "text-gray-400"}`}>
                    {hasLength ? <Check size={14} /> : <X size={14} />} 8-20 characters
                  </li>
                  <li className={`flex items-center gap-1 transition-colors ${hasCapital ? "text-green-700" : "text-gray-400"}`}>
                    {hasCapital ? <Check size={14} /> : <X size={14} />} At least one capital letter
                  </li>
                  <li className={`flex items-center gap-1 transition-colors ${hasNumber ? "text-green-700" : "text-gray-400"}`}>
                    {hasNumber ? <Check size={14} /> : <X size={14} />} At least one number
                  </li>
                  <li className={`flex items-center gap-1 transition-colors ${hasSymbol ? "text-green-700" : "text-gray-400"}`}>
                    {hasSymbol ? <Check size={14} /> : <X size={14} />} At least one symbol
                  </li>
                </ul>
              )}
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent transition-shadow"
              />
            </div>

            {error && (
              <p className="text-red-600 text-sm flex items-center gap-1">
                <AlertCircle size={14} /> {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="bg-green-800 text-white py-2.5 rounded-lg font-medium hover:bg-green-900 hover:scale-[1.02] transition-all duration-200 disabled:opacity-60"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}

        <p className="text-center text-gray-500 mt-6 text-sm">
          <Link href="/login" className="text-green-800 font-medium hover:underline">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}