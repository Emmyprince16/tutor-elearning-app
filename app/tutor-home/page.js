"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, User, CheckCircle, Bell, Settings, Zap, Copy, X } from "lucide-react";
import Link from "next/link";

export default function TutorHomePage() {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [quickSession, setQuickSession] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user) return;

    fetch(`/api/bookings?tutorName=${encodeURIComponent(`${user.firstName}, ${user.lastName}`)}`)
      .then((res) => res.json())
      .then((data) => {
        setBookings(data.bookings || []);
        setLoading(false);
      });
  }, [user]);

  async function handleStartInstantSession() {
    setGenerating(true);
    try {
      const res = await fetch("/api/quick-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tutorId: user.id,
          tutorName: `${user.firstName}, ${user.lastName}`,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to generate session code.");
        return;
      }

      setQuickSession(data.session);
      setCopied(false);
    } catch (err) {
      console.error("Error generating instant session:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setGenerating(false);
    }
  }

  function handleCopyCode() {
    if (!quickSession) return;
    navigator.clipboard.writeText(quickSession.code);
    setCopied(true);
  }

  if (loading) {
    return <p className="p-6">Loading your dashboard...</p>;
  }

  if (!user || user.role !== "tutor") {
    return <p className="p-6">This page is only available to tutors.</p>;
  }

  const pendingCount = bookings.filter((b) => b.status === "pending").length;
  const confirmedCount = bookings.filter((b) => b.status === "confirmed").length;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">
        Welcome back, {user.firstName}
      </h1>
      <p className="text-gray-600 mb-6">
        Here's a quick look at your tutoring activity.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-5">
          <p className="text-sm text-gray-500 flex items-center gap-1 mb-1">
            <Bell size={14} /> Pending Requests
          </p>
          <p className="text-3xl font-bold text-yellow-600">{pendingCount}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-5">
          <p className="text-sm text-gray-500 flex items-center gap-1 mb-1">
            <CheckCircle size={14} /> Confirmed Sessions
          </p>
          <p className="text-3xl font-bold text-green-700">{confirmedCount}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-5">
          <p className="text-sm text-gray-500 flex items-center gap-1 mb-1">
            <User size={14} /> Availability
          </p>
          <p
            className={`text-lg font-semibold ${
              user.isAvailable ? "text-green-700" : "text-gray-500"
            }`}
          >
            {user.isAvailable ? "Available" : "Unavailable"}
          </p>
        </div>
      </div>

      <button
        onClick={handleStartInstantSession}
        disabled={generating}
        className="w-full flex items-center justify-center gap-2 bg-yellow-500 text-gray-900 px-5 py-3 rounded-lg font-semibold hover:bg-yellow-600 hover:scale-105 transition-all duration-200 disabled:opacity-60 mb-6"
      >
        <Zap size={18} />
        {generating ? "Generating..." : "Start Instant Session"}
      </button>

      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <Link
          href="/bookings"
          className="flex-1 flex items-center justify-center gap-2 bg-green-800 text-white px-5 py-3 rounded-lg font-medium hover:bg-green-900 hover:scale-105 transition-all duration-200"
        >
          <Calendar size={18} />
          View My Bookings
        </Link>

        <Link
          href="/dashboard"
          className="flex-1 flex items-center justify-center gap-2 bg-gray-700 text-white px-5 py-3 rounded-lg font-medium hover:bg-gray-800 hover:scale-105 transition-all duration-200"
        >
          <Settings size={18} />
          Edit My Profile
        </Link>
      </div>

      {pendingCount > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800 text-sm">
            You have <span className="font-semibold">{pendingCount}</span>{" "}
            pending booking{pendingCount > 1 ? "s" : ""} awaiting your confirmation.{" "}
            <Link href="/bookings" className="underline font-medium">
              Review now
            </Link>
          </p>
        </div>
      )}

      {quickSession && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full relative">
            <button
              onClick={() => setQuickSession(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>

            <h2 className="text-lg font-bold text-gray-900 mb-2">
              Instant Session Ready
            </h2>
            <p className="text-gray-500 text-sm mb-4">
              Share this code with your student so they can join via the "Join" page.
            </p>

            <div className="flex items-center justify-center gap-2 bg-gray-100 rounded-lg py-4 mb-4">
              <span className="text-3xl font-bold tracking-widest text-gray-900">
                {quickSession.code}
              </span>
            </div>

            <button
              onClick={handleCopyCode}
              className="w-full flex items-center justify-center gap-2 bg-gray-700 text-white py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors mb-3"
            >
              <Copy size={16} />
              {copied ? "Copied!" : "Copy Code"}
            </button>

            <Link
              href={`/session/${quickSession.roomId}`}
              className="w-full flex items-center justify-center gap-2 bg-green-800 text-white py-2 rounded-lg font-medium hover:bg-green-900 transition-colors"
            >
              Enter Session Now
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}