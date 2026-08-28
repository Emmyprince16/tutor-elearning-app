"use client";

import { useState, useEffect, use } from "react";
import { tutors } from "../../data/tutors";
import { Star, ArrowLeft, Calendar, Clock, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function TutorProfile({ params }) {
  const resolvedParams = use(params);
  const tutor = tutors.find((t) => t.id === parseInt(resolvedParams.id));

  const [user, setUser] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

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

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: user.id,
          tutorName: tutor.name,
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

      setSuccess(true);
    } catch (err) {
      setError("Network error. Please try again.");
    }
  }

  if (!tutor) {
    return <p className="p-6">Tutor not found.</p>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-green-800 mb-4 hover:underline"
      >
        <ArrowLeft size={18} />
        Back to all tutors
      </Link>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900">{tutor.name}</h1>
        <p className="text-gray-600 mt-1">{tutor.subject}</p>
        <p className="text-yellow-600 flex items-center gap-1 mt-2">
          <Star size={18} fill="currentColor" />
          {tutor.rating}
        </p>
        <p className="mt-4 text-gray-700">
          Specialization: <span className="font-medium">{tutor.option}</span>
        </p>

        <hr className="my-6" />

        {success ? (
          <div className="flex flex-col items-center text-center gap-2 py-6">
            <CheckCircle className="text-green-700" size={40} />
            <h2 className="text-xl font-bold text-gray-900">Session Booked!</h2>
            <p className="text-gray-600">
              Your session with {tutor.name} on {date} at {time} has been requested.
            </p>
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
                onChange={(e) => setDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-700"
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
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-700"
              />
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <button
              type="submit"
              className="bg-green-800 text-white px-5 py-2 rounded font-medium hover:bg-green-900 transition-colors"
            >
              {user ? "Book a Session" : "Log in to Book"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}