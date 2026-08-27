"use client";

import { useState } from "react";
import Image from "next/image";
import { GraduationCap, Menu, X } from "lucide-react";

function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);

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

        <div className="hidden md:flex gap-6 font-medium">
          <a href="#" className="hover:text-yellow-400 transition-colors">Home</a>
          <a href="#" className="hover:text-yellow-400 transition-colors">Tutors</a>
          <a href="#" className="hover:text-yellow-400 transition-colors">Departments</a>
          <a href="/login" className="hover:text-yellow-400 transition-colors">Login</a>
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
          <a href="/login" className="hover:text-yellow-400 transition-colors">Login</a>
        </div>
      )}
    </nav>
  );
}

export default NavBar;