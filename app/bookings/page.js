"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, Video, User, CheckCircle, X, Copy, Lock, KeyRound, XCircle, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function MyBookingsPage() {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmingId, setConfirmingId] = useState(null);
  const [confirmedCode, setConfirmedCode] = useState(null);
  const [copied, setCopied] = useState(false);

  const [joiningBooking, setJoiningBooking] = useState(null);
  const [codeInput, setCodeInput] = useState("");
  const [joinError, setJoinError] = useState("");

  const [rejectingId, setRejectingId] = useState(null);

  const [reschedulingBooking, setReschedulingBooking] = useState(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [reschedulingLoading, setReschedulingLoading] = useState(false);

  const router = useRouter();

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

      if (updated.sessionCode) {
        setConfirmedCode(updated.sessionCode);
        setCopied(false);
      }
    } catch (err) {
      console.error("Error confirming booking:", err);
      alert("Something went wrong confirming the booking.");
    } finally {
      setConfirmingId(null);
    }
  };

  const handleReject = async (bookingId) => {
    if (!confirm("Are you sure you want to cancel/reject this booking?")) return;

    setRejectingId(bookingId);
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "cancelled", tutorId: user.id }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Failed to reject booking.");
        return;
      }

      const updated = await res.json();
      setBookings((prev) =>
        prev.map((b) => (b.id === updated.id ? updated : b))
      );
    } catch (err) {
      console.error("Error rejecting booking:", err);
      alert("Something went wrong rejecting the booking.");
    } finally {
      setRejectingId(null);
    }
  };

  function handleOpenReschedule(booking) {
    setReschedulingBooking(booking);
    setNewDate(booking.date);
    setNewTime(booking.time);
  }

  async function handleSubmitReschedule(e) {
    e.preventDefault();
    setReschedulingLoading(true);

    try {
      const res = await fetch(`/api/bookings/${reschedulingBooking.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tutorId: user.id,
          date: newDate,
          time: newTime,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Failed to reschedule booking.");
        return;
      }

      const updated = await res.json();
      setBookings((prev) =>
        prev.map((b) => (b.id === updated.id ? updated : b))
      );
      setReschedulingBooking(null);
    } catch (err) {
      console.error("Error rescheduling booking:", err);
      alert("Something went wrong rescheduling the booking.");
    } finally {
      setReschedulingLoading(false);
    }
  }

  function handleCopyCode() {
    if (!confirmedCode) return;
    navigator.clipboard.writeText(confirmedCode);
    setCopied(true);
  }

  function isJoinTimeNear(booking) {
    const sessionTime = new Date(`${booking.date}T${booking.time}`);
    const now = new Date();
    const diffMinutes = (sessionTime - now) / (1000 * 60);
    return diffMinutes <= 15;
  }

  function handleOpenJoinModal(booking) {
    setJoiningBooking(booking);
    setCodeInput("");
    setJoinError("");
  }

  function handleSubmitCode(e) {
    e.preventDefault();

    if (codeInput.trim() === joiningBooking.sessionCode) {
      router.push(`/session/${joiningBooking.roomId}`);
    } else {
      setJoinError("Incorrect code. Please check with your tutor and try again.");
    }
  }

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
          {bookings.map((booking) => {
            const isConfirmed = booking.status === "confirmed";
            const isCancelled = booking.status === "cancelled";
            const canJoin = isConfirmed && isJoinTimeNear(booking);

            return (
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
                  {user.role === "tutor" && isConfirmed && (
  <button
    onClick={() => handleReject(booking.id)}
    disabled={rejectingId === booking.id}
    className="flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded font-medium hover:bg-red-700 hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100"
  >
    <XCircle size={16} />
    {rejectingId === booking.id ? "Cancelling..." : "Cancel"}
  </button>
)}

                  {user.role === "tutor" && isCancelled && (
                    <button
                      onClick={() => handleOpenReschedule(booking)}
                      className="flex items-center justify-center gap-2 bg-blue-700 text-white px-4 py-2 rounded font-medium hover:bg-blue-800 hover:scale-105 transition-all duration-200"
                    >
                      <RefreshCw size={16} />
                      Reschedule
                    </button>
                  )}

                  {user.role === "tutor" ? (
                    <>
                      {!isCancelled && (
                        
                        <a  href={`/api/bookings/${booking.id}/ics`}
                          className="flex items-center justify-center gap-2 bg-gray-700 text-white px-4 py-2 rounded font-medium hover:bg-gray-800 hover:scale-105 transition-all duration-200"
                        >
                          <Calendar size={16} />
                          Add to Calendar
                        </a>
                      )}

                      {!isCancelled && (
                        <Link
                          href={`/session/${booking.roomId}`}
                          className="flex items-center justify-center gap-2 bg-green-800 text-white px-4 py-2 rounded font-medium hover:bg-green-900 hover:scale-105 transition-all duration-200"
                        >
                          <Video size={16} />
                          Join Session
                        </Link>
                      )}
                    </>
                  ) : (
                    <>
                      {!isCancelled && (
                        <>
                          {isConfirmed ? (
                            
                            <a  href={`/api/bookings/${booking.id}/ics`}
                              className="flex items-center justify-center gap-2 bg-gray-700 text-white px-4 py-2 rounded font-medium hover:bg-gray-800 hover:scale-105 transition-all duration-200"
                            >
                              <Calendar size={16} />
                              Add to Calendar
                            </a>
                          ) : (
                            <button
                              disabled
                              className="flex items-center justify-center gap-2 bg-gray-300 text-gray-500 px-4 py-2 rounded font-medium cursor-not-allowed"
                            >
                              <Lock size={16} />
                              Add to Calendar
                            </button>
                          )}

                          {canJoin ? (
                            <button
                              onClick={() => handleOpenJoinModal(booking)}
                              className="flex items-center justify-center gap-2 bg-green-800 text-white px-4 py-2 rounded font-medium hover:bg-green-900 hover:scale-105 transition-all duration-200"
                            >
                              <Video size={16} />
                              Join Session
                            </button>
                          ) : (
                            <button
                              disabled
                              className="flex items-center justify-center gap-2 bg-gray-300 text-gray-500 px-4 py-2 rounded font-medium cursor-not-allowed"
                            >
                              <Lock size={16} />
                              {isConfirmed ? "Available soon" : "Join Session"}
                            </button>
                          )}
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {confirmedCode && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full relative">
            <button
              onClick={() => setConfirmedCode(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>

            <h2 className="text-lg font-bold text-gray-900 mb-2">
              Booking Confirmed
            </h2>
            <p className="text-gray-500 text-sm mb-4">
              Share this code with your student — they'll need it to join the session.
            </p>

            <div className="flex items-center justify-center gap-2 bg-gray-100 rounded-lg py-4 mb-4">
              <span className="text-3xl font-bold tracking-widest text-gray-900">
                {confirmedCode}
              </span>
            </div>

            <button
              onClick={handleCopyCode}
              className="w-full flex items-center justify-center gap-2 bg-gray-700 text-white py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              <Copy size={16} />
              {copied ? "Copied!" : "Copy Code"}
            </button>
          </div>
        </div>
      )}

      {joiningBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full relative">
            <button
              onClick={() => setJoiningBooking(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>

            <KeyRound className="mx-auto text-green-800 mb-3" size={32} />
            <h2 className="text-lg font-bold text-gray-900 mb-2 text-center">
              Enter Session Code
            </h2>
            <p className="text-gray-500 text-sm mb-4 text-center">
              Enter the code your tutor shared with you to join this session.
            </p>

            <form onSubmit={handleSubmitCode} className="flex flex-col gap-3">
              <input
                type="text"
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value)}
                placeholder="e.g. 482913"
                className="w-full text-center text-xl tracking-widest px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-700"
              />

              {joinError && <p className="text-red-600 text-sm text-center">{joinError}</p>}

              <button
                type="submit"
                className="bg-green-800 text-white py-2 rounded-lg font-medium hover:bg-green-900 hover:scale-105 transition-all duration-200"
              >
                Join Session
              </button>
            </form>
          </div>
        </div>
      )}

      {reschedulingBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full relative">
            <button
              onClick={() => setReschedulingBooking(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>

            <RefreshCw className="mx-auto text-blue-700 mb-3" size={32} />
            <h2 className="text-lg font-bold text-gray-900 mb-2 text-center">
              Propose a New Time
            </h2>
            <p className="text-gray-500 text-sm mb-4 text-center">
              This will notify {reschedulingBooking.studentName} of the new date and time.
            </p>

            <form onSubmit={handleSubmitReschedule} className="flex flex-col gap-3">
              <input
                type="date"
                value={newDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-700"
              />

              <input
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-700"
              />

              <button
                type="submit"
                disabled={reschedulingLoading}
                className="bg-blue-700 text-white py-2 rounded-lg font-medium hover:bg-blue-800 hover:scale-105 transition-all duration-200 disabled:opacity-60"
              >
                {reschedulingLoading ? "Sending..." : "Send New Time"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}