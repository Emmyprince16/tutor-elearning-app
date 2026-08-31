"use client";

import { BookOpen, Users, Video } from "lucide-react";
import Link from "next/link";

const badges = [
  { label: "AI", top: "12%", left: "8%", delay: "0s", duration: "5s" },
  { label: "Cybersecurity", top: "68%", left: "6%", delay: "0.6s", duration: "6s" },
  { label: "NCC", top: "20%", left: "88%", delay: "1s", duration: "5.5s" },
  { label: "SWD", top: "72%", left: "90%", delay: "0.3s", duration: "6.5s" },
];

function Hero() {
  return (
    <div className="relative bg-gradient-to-br from-green-900 via-green-800 to-green-950 text-white py-20 px-4 overflow-hidden">
      <div className="absolute inset-0 opacity-[0.06]">
        <div className="absolute inset-0" style={{
          backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
          backgroundSize: "26px 26px",
        }}></div>
      </div>

      {/* Floating specialization badges — one orchestrated background motif */}
      {badges.map((b) => (
        <span
          key={b.label}
          className="hidden md:block absolute text-xs font-medium bg-white/10 border border-white/15 text-green-100 px-3 py-1.5 rounded-full backdrop-blur-sm animate-float"
          style={{ top: b.top, left: b.left, animationDelay: b.delay, animationDuration: b.duration }}
        >
          {b.label}
        </span>
      ))}

      <div className="relative z-10 max-w-3xl mx-auto text-center animate-fade-in-scale">
        <h1
          className="text-3xl md:text-5xl font-bold mb-4 leading-tight"
          style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
        >
          FPI Computer Sciences E-Learning Portal
        </h1>
        <p className="text-green-100 text-lg mb-8 max-w-xl mx-auto">
          Connecting Computer Sciences students with departmental tutors for live,
          one-on-one learning sessions.
        </p>

        <Link
          href="/tutors"
          className="inline-block bg-yellow-400 text-green-950 px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
        >
          Browse Tutors
        </Link>

        <div className="flex flex-wrap justify-center gap-4 mt-10">
          <div className="flex items-center gap-2 bg-white/10 border border-white/15 rounded-lg px-4 py-2.5 backdrop-blur-sm">
            <Users className="text-yellow-400" size={18} />
            <span className="text-sm">Verified Tutors</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 border border-white/15 rounded-lg px-4 py-2.5 backdrop-blur-sm">
            <Video className="text-yellow-400" size={18} />
            <span className="text-sm">Live Video Sessions</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 border border-white/15 rounded-lg px-4 py-2.5 backdrop-blur-sm">
            <BookOpen className="text-yellow-400" size={18} />
            <span className="text-sm">All Computer Sciences Options</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;