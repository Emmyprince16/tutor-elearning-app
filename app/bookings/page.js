"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, Video, User, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function MyBookingsPage() {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmingId, setConfirmingId] = useState(null);

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

    const query =
      user.role === "tutor"
        ? `tutorName=${encodeURIComponent(`${user.firstName}, ${user.lastName}`)}`
        : `studentId=${user.id}`;

    fetch(`/api/bookings?${query}`)
      .then((res) => res.json())
      .then((data) => {
        setBookings(data.bookings || []);
        setLoading(false);
      });
  }, [user]);

  const handleConfirm = async (bookingId) => {
    setConfirmingId(bookingId);
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "confirmed", tutorId: user.id }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Failed to confirm booking.");
        return;
      }

      const updated = await res.json();
      setBookings((prev) =>
        prev.map((b) => (b.id === updated.id ? updated : b))
      );
    } catch (err) {
      console.error("Error confirming booking:", err);
      alert("Something went wrong confirming the booking.");
    } finally {
      setConfirmingId(null);
    }
  };

  if (loading) {
    return <p className="p-6">Loading your bookings...</p>;
  }

  if (!user) {
    return <p className="p-6">Please log in to view your bookings.</p>;
  }

  const statusStyles = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Bookings</h1>

      {bookings.length === 0 ? (
        <p className="text-gray-500">You have no bookings yet.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-lg shadow-md p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
            >
              <div>
                <p className="font-semibold text-gray-900 flex items-center gap-2">
                  <User size={16} />
                  {user.role === "tutor" ? booking.studentName : booking.tutorName}
                </p>
                <p className="text-gray-600 text-sm mt-1">{booking.subject}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} /> {booking.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={14} /> {booking.time}
                  </span>
                </div>
                <span
                  className={`inline-block mt-2 text-xs font-medium px-2 py-1 rounded-full ${
                    statusStyles[booking.status] || "bg-gray-100 text-gray-700"
                  }`}
                >
                  {booking.status}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                {user.role === "tutor" && booking.status === "pending" && (
                  <button
                    onClick={() => handleConfirm(booking.id)}
                    disabled={confirmingId === booking.id}
                    className="flex items-center justify-center gap-2 bg-yellow-600 text-white px-4 py-2 rounded font-medium hover:bg-yellow-700 hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100"
                  >
                    <CheckCircle size={16} />
                    {confirmingId === booking.id ? "Confirming..." : "Confirm"}
                  </button>
                )}

                
              <a href={`/api/bookings/${booking.id}/ics`}
                  className="flex items-center justify-center gap-2 bg-gray-700 text-white px-4 py-2 rounded font-medium hover:bg-gray-800 hover:scale-105 transition-all duration-200"
                >
                  <Calendar size={16} />
                  Add to Calendar
                </a>

                <Link
                  href={`/session/tutor${booking.tutorId}-${booking.date}-${booking.time}`.replace(/[: ,]/g, "")}
                  className="flex items-center justify-center gap-2 bg-green-800 text-white px-4 py-2 rounded font-medium hover:bg-green-900 hover:scale-105 transition-all duration-200"
                >
                  <Video size={16} />
                  Join Session
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}