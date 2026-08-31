"use client";

import { useState, useEffect, use } from "react";
import { Star, ArrowLeft, Calendar, Clock, CheckCircle, XCircle, MessageCircle, User } from "lucide-react";
import Link from "next/link";

export default function TutorProfile({ params }) {
  const resolvedParams = use(params);
  const [tutor, setTutor] = useState(null);
  const [loadingTutor, setLoadingTutor] = useState(true);

  const [user, setUser] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [createdBooking, setCreatedBooking] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    fetch(`/api/tutors/${resolvedParams.id}`)
      .then((res) => res.json())
      .then((data) => {
        setTutor(data.tutor || null);
        setLoadingTutor(false);
      });
  }, [resolvedParams.id]);

  async function handleBooking(e) {
    e.preventDefault();
    setError("");

    if (!user) {
      window.location.href = "/login";
      return;
    }

    if (!date || !time) {
      setError("Please select both a date and time.");
      return;
    }

    const selectedDateTime = new Date(`${date}T${time}`);
    const now = new Date();

    if (selectedDateTime < now) {
      setError("You can't book a session in the past. Please choose a future date and time.");
      return;
    }

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: user.id,
          studentName: `${user.firstName}, ${user.lastName}`,
          tutorId: tutor.id,
          tutorName: `${tutor.firstName}, ${tutor.lastName}`,
          subject: tutor.subject,
          date,
          time,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error);
        return;
      }

      setCreatedBooking(data.booking);
      setSuccess(true);
    } catch (err) {
      setError("Network error. Please try again.");
    }
  }

  if (loadingTutor) {
    return <p className="p-6">Loading tutor profile...</p>;
  }

  if (!tutor) {
    return <p className="p-6">Tutor not found.</p>;
  }

  const isTutorViewingTutor = user && user.role === "tutor" && user.id !== tutor.id;
  const isOwnProfile = user && user.role === "tutor" && user.id === tutor.id;

  return (
    <div className="max-w-2xl mx-auto p-6 animate-fade-in">
      <Link
        href="/tutors"
        className="inline-flex items-center gap-1 text-green-800 mb-4 link-sweep"
      >
        <ArrowLeft size={18} />
        Back to all tutors
      </Link>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-fade-in-scale">
        {/* Header strip — ties into the site's gradient identity */}
        <div className="bg-gradient-to-r from-green-900 to-green-800 px-6 py-5">
          <div className="flex items-center justify-between">
            <h1
              className="text-2xl font-bold text-white"
              style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
            >
              {tutor.firstName}, {tutor.lastName}
            </h1>
            {!tutor.isAvailable && (
              <span className="text-xs font-medium bg-white/15 text-white px-3 py-1 rounded-full">
                Unavailable
              </span>
            )}
          </div>
          <p className="text-green-100 mt-1">{tutor.subject}</p>
          <p className="text-yellow-400 flex items-center gap-1 mt-2">
            <Star size={16} fill="currentColor" />
            {tutor.rating}
          </p>
        </div>

        <div className="p-6">
          <p className="text-gray-700">
            Specialization: <span className="font-medium">{tutor.option}</span>
          </p>
          {tutor.bio && <p className="mt-3 text-gray-700">{tutor.bio}</p>}

          <hr className="my-6" />

          {isOwnProfile ? (
            <div className="flex flex-col items-center text-center gap-4 py-10 animate-fade-in-scale">
              <div className="relative">
                <div className="absolute inset-0 bg-green-200 rounded-full blur-xl opacity-50 animate-glow-pulse"></div>
                <div className="relative bg-gradient-to-br from-green-700 to-green-900 text-white rounded-full p-5 shadow-lg">
                  <User size={40} />
                </div>
              </div>

              <div>
                <h2
                  className="text-xl font-bold text-gray-900"
                  style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
                >
                  This is your own profile
                </h2>
                <p className="text-gray-500 text-sm mt-1 max-w-sm">
                  Students and fellow tutors see this page — keep it polished! Head to
                  your dashboard to update your bio, subject, or availability.
                </p>
              </div>

              <Link
                href="/dashboard"
                className="group mt-2 inline-flex items-center gap-2 bg-gradient-to-r from-green-700 to-green-900 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                Go to My Dashboard
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>
          ) : isTutorViewingTutor ? (
            <div className="flex flex-col items-center text-center gap-3 py-6">
              <MessageCircle className="text-green-800" size={40} />
              <h2 className="text-lg font-semibold text-gray-800">
                Get in touch with {tutor.firstName}
              </h2>
              <p className="text-gray-500 text-sm">
                You can message fellow tutors directly instead of booking a session.
              </p>
              <Link
                href={`/messages/${tutor.id}?name=${encodeURIComponent(`${tutor.firstName}, ${tutor.lastName}`)}`}
                className="mt-2 bg-green-800 text-white px-5 py-2 rounded-lg font-medium hover:bg-green-900 hover:scale-[1.02] transition-all duration-200"
              >
                Send a Message
              </Link>
            </div>
          ) : success ? (
            <div className="flex flex-col items-center text-center gap-3 py-6">
              <CheckCircle className="text-green-700" size={40} />
              <h2
                className="text-xl font-bold text-gray-900"
                style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
              >
                Session Booked!
              </h2>
              <p className="text-gray-600">
                Your session with {tutor.firstName} on {date} at {time} has been requested.
              </p>
              <Link
                href={`/session/${createdBooking?.roomId}`}
                className="mt-2 bg-green-800 text-white px-5 py-2 rounded-lg font-medium hover:bg-green-900 hover:scale-[1.02] transition-all duration-200"
              >
                Join Video Session
              </Link>
            </div>
          ) : !tutor.isAvailable ? (
            <div className="flex flex-col items-center text-center gap-3 py-6">
              <XCircle className="text-gray-400" size={40} />
              <h2 className="text-lg font-semibold text-gray-800">
                This tutor isn't taking bookings right now
              </h2>
              <p className="text-gray-500 text-sm">
                Check back later, or browse other available tutors.
              </p>
              <Link
                href="/tutors"
                className="mt-2 bg-green-800 text-white px-5 py-2 rounded-lg font-medium hover:bg-green-900 hover:scale-[1.02] transition-all duration-200"
              >
                Browse Other Tutors
              </Link>
            </div>
          ) : (
            <form onSubmit={handleBooking} className="flex flex-col gap-4">
              <h2 className="font-semibold text-gray-900">Book a Session</h2>

              <div className="relative">
                <Calendar
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="date"
                  value={date}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-700"
                />
              </div>

              <div className="relative">
                <Clock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-700"
                />
              </div>

              {error && <p className="text-red-600 text-sm">{error}</p>}

              <button
                type="submit"
                className="bg-green-800 text-white px-5 py-2 rounded-lg font-medium hover:bg-green-900 hover:scale-[1.02] transition-all duration-200"
              >
                {user ? "Book a Session" : "Log in to Book"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}