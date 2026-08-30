"use client";

import { GraduationCap, Menu, X, ChevronDown, LogOut, User, Calendar, Bell, KeyRound, Users } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [notifications, setNotifications] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!user || user.role !== "student") return;

    const fetchNotifications = () => {
      fetch(`/api/notifications?studentId=${user.id}`)
        .then((res) => res.json())
        .then((data) => setNotifications(data.notifications || []))
        .catch((err) => console.error("Error fetching notifications:", err));
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 20000);

    return () => clearInterval(interval);
  }, [user]);

  function handleLogout() {
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/";
  }

  function handleNotifToggle() {
    setNotifOpen(!notifOpen);
  }

  async function handleMarkOneRead(bookingId) {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, studentId: user.id }),
      });

      setNotifications((prev) => prev.filter((n) => n.id !== bookingId));
    } catch (err) {
      console.error("Error marking notification read:", err);
    }
  }

  return (
    <nav className="bg-green-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image src="/fpi-logo.png" alt="FPI Logo" width={40} height={40} />
          <div>
            <p className="font-bold text-lg leading-tight">FPI E-Learning</p>
            <p className="text-xs text-green-200 leading-tight">
              Computer Sciences Department
            </p>
          </div>
        </div>

        <div className="hidden md:flex gap-6 font-medium items-center">
          
          <a  href={user && user.role === "tutor" ? "/tutor-home" : "/"}
            className="hover:text-yellow-400 transition-colors"
          >
            Home
          </a>
          <a href="/tutors" className="hover:text-yellow-400 transition-colors">Tutors</a>
          {user && user.role !== "tutor" && (
  <a href="/departments" className="hover:text-yellow-400 transition-colors">Departments</a>
)}

          {user && user.role === "student" && (
            <Link href="/join" className="hover:text-yellow-400 transition-colors flex items-center gap-1">
              <KeyRound size={16} />
              Join
            </Link>
          )}

          {user && user.role === "tutor" && (
  <Link href="/students" className="hover:text-yellow-400 transition-colors flex items-center gap-1">
    <Users size={16} />
    Students
  </Link>
)}

          {user && user.role === "student" && (
            <div className="relative" ref={notifRef}>
              <button
                onClick={handleNotifToggle}
                className="relative focus:outline-none"
              >
                <Bell size={22} />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white text-gray-900 rounded-lg shadow-lg overflow-hidden max-h-96 overflow-y-auto">
                  <div className="px-4 py-3 border-b border-gray-100 font-medium">
                    Notifications
                  </div>

                  {notifications.length === 0 ? (
                    <p className="px-4 py-4 text-sm text-gray-500">
                      No new notifications.
                    </p>
                  ) : (
                    notifications.map((n) => (
                      <button
                        key={n.id}
                        onClick={() => handleMarkOneRead(n.id)}
                        className="w-full text-left px-4 py-3 border-b border-gray-50 hover:bg-gray-50"
                      >
                        <p className="text-sm text-gray-800">
                          {n.status === "confirmed" && (
                            <>
                              Your booking with <span className="font-semibold">{n.tutorName}</span> for{" "}
                              <span className="font-semibold">{n.subject}</span> has been confirmed.
                            </>
                          )}
                          {n.status === "cancelled" && (
                            <>
                              Your booking with <span className="font-semibold">{n.tutorName}</span> for{" "}
                              <span className="font-semibold">{n.subject}</span> was cancelled by the tutor.
                            </>
                          )}
                          {n.status === "pending" && n.rescheduled && (
                            <>
                              <span className="font-semibold">{n.tutorName}</span> proposed a new time for your{" "}
                              <span className="font-semibold">{n.subject}</span> session.
                            </>
                          )}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {n.date} at {n.time}
                        </p>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-1 focus:outline-none"
              >
                <div className="w-9 h-9 rounded-full bg-yellow-400 text-green-900 font-bold flex items-center justify-center">
                  {user.firstName.charAt(0).toUpperCase()}
                </div>
                <ChevronDown size={16} />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white text-gray-900 rounded-lg shadow-lg overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="font-medium">{user.firstName} {user.lastName}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>

                  <Link
                    href="/bookings"
                    className="w-full text-left px-4 py-2 flex items-center gap-2 hover:bg-gray-50 text-gray-700"
                  >
                    <Calendar size={16} />
                    My Bookings
                  </Link>

                  {user.role === "tutor" && (
                    <Link
                      href="/dashboard"
                      className="w-full text-left px-4 py-2 flex items-center gap-2 hover:bg-gray-50 text-gray-700"
                    >
                      <User size={16} />
                      My Profile
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 flex items-center gap-2 hover:bg-gray-50 text-red-600"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <a href="/login" className="hover:text-yellow-400 transition-colors">Login</a>
          )}
        </div>

        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden flex flex-col gap-3 px-4 pb-4 font-medium bg-green-900">
          
           <a href={user && user.role === "tutor" ? "/tutor-home" : "/"}
            className="hover:text-yellow-400 transition-colors"
          >
            Home
          </a>
          <a href="/tutors" className="hover:text-yellow-400 transition-colors">Tutors</a>
          {user && user.role !== "tutor" && (
  <a href="/departments" className="hover:text-yellow-400 transition-colors">Departments</a>
)}
          {user && user.role === "student" && (
            <Link href="/join" className="hover:text-yellow-400 transition-colors">
              Join a Session
            </Link>
          )}
          {user ? (
            <div className="flex items-center gap-3">
              <span>Hi, {user.firstName}</span>
              <button onClick={handleLogout} className="hover:text-yellow-400 transition-colors">
                Logout
              </button>
            </div>
          ) : (
            <a href="/login" className="hover:text-yellow-400 transition-colors">Login</a>
          )}
        </div>
      )}
    </nav>
  );
}

export default NavBar;