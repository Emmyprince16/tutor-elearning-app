"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { GraduationCap, Menu, X, ChevronDown, LogOut } from "lucide-react";

function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

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
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function handleLogout() {
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/";
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
          <a href="#" className="hover:text-yellow-400 transition-colors">Home</a>
          <a href="#" className="hover:text-yellow-400 transition-colors">Tutors</a>
          <a href="#" className="hover:text-yellow-400 transition-colors">Departments</a>
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
          <a href="#" className="hover:text-yellow-400 transition-colors">Home</a>
          <a href="#" className="hover:text-yellow-400 transition-colors">Tutors</a>
          <a href="#" className="hover:text-yellow-400 transition-colors">Departments</a>
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