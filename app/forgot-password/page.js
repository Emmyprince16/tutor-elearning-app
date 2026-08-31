"use client";

import { useState } from "react";
import { Mail, KeyRound, AlertCircle, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Something went wrong.");
        return;
      }

      setSubmitted(true);
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full animate-fade-in-scale">
        <div className="flex justify-center mb-4">
          <div className="relative">
            <div className="absolute inset-0 bg-green-200 rounded-full blur-xl opacity-40 animate-glow-pulse"></div>
            <div className="relative bg-gradient-to-br from-green-700 to-green-900 text-white rounded-full p-4">
              <KeyRound size={28} />
            </div>
          </div>
        </div>

        <h1
          className="text-xl font-bold text-center text-gray-900 mb-1"
          style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
        >
          Forgot your password?
        </h1>
        <p className="text-center text-gray-500 text-sm mb-6">
          Enter your email and we'll send you a reset link.
        </p>

        {submitted ? (
          <div className="flex flex-col items-center text-center gap-2 py-4 animate-fade-in">
            <CheckCircle className="text-green-700" size={32} />
            <p className="text-gray-700 text-sm">
              If that email exists, a reset link has been sent. Check your inbox.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
              {loading ? "Sending..." : "Send Reset Link"}
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