"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, ArrowRight } from "lucide-react";

export default function JoinPage() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleJoin(e) {
    e.preventDefault();
    setError("");

    if (!code.trim()) {
      setError("Please enter a session code.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/quick-session?code=${encodeURIComponent(code.trim())}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid code.");
        return;
      }

      router.push(`/session/${data.session.roomId}`);
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
        <KeyRound className="mx-auto text-green-800 mb-3" size={36} />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Join a Session</h1>
        <p className="text-gray-500 mb-6">
          Enter the session code your tutor shared with you.
        </p>

        <form onSubmit={handleJoin} className="flex flex-col gap-4">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="e.g. 482913"
            className="w-full text-center text-xl tracking-widest px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-700"
          />

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-green-800 text-white py-3 rounded-lg font-medium hover:bg-green-900 hover:scale-105 transition-all duration-200 disabled:opacity-60"
          >
            {loading ? "Checking..." : "Join Session"}
            <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}