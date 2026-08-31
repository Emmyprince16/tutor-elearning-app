"use client";

import { useState, useEffect } from "react";
import { User, BookOpen, Tag, FileText, CheckCircle, Star } from "lucide-react";

export default function TutorDashboard() {
  const [user, setUser] = useState(null);
  const [bio, setBio] = useState("");
  const [subject, setSubject] = useState("");
  const [option, setOption] = useState("General");
  const [isAvailable, setIsAvailable] = useState(true);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const options = ["AI", "NCC", "Cybersecurity", "SWD", "General"];

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setBio(parsedUser.bio || "");
      setSubject(parsedUser.subject || "");
      setOption(parsedUser.option || "General");
      setIsAvailable(
        parsedUser.isAvailable !== undefined ? parsedUser.isAvailable : true
      );
    }
  }, []);

  async function handleSave(e) {
    e.preventDefault();
    setLoading(true);
    setSaved(false);

    try {
      const response = await fetch("/api/tutors/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user.id, bio, subject, option, isAvailable }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data.tutor));
        setUser(data.tutor);
        setSaved(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (!user) {
    return <p className="p-6">Please log in to view your dashboard.</p>;
  }

  if (user.role !== "tutor") {
    return <p className="p-6">This page is only available to tutors.</p>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1
        className="text-2xl font-bold mb-1 text-gray-900"
        style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
      >
        Your Tutor Profile
      </h1>
      <p className="text-gray-600 mb-6">
        This is what students will see when they view your profile.
      </p>

      {/* Live preview strip — mirrors the gradient header on /tutors/[id] */}
      <div className="bg-gradient-to-r from-green-900 to-green-800 rounded-xl px-6 py-5 mb-6 shadow-md animate-fade-in-scale">
        <div className="flex items-center justify-between">
          <h2
            className="text-xl font-bold text-white"
            style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
          >
            {user.firstName}, {user.lastName}
          </h2>
          <span
            className={`text-xs font-medium px-3 py-1 rounded-full ${
              isAvailable ? "bg-green-400/20 text-green-200" : "bg-white/15 text-white"
            }`}
          >
            {isAvailable ? "Available" : "Unavailable"}
          </span>
        </div>
        <p className="text-green-100 mt-1">{subject || "No subject set yet"}</p>
        <p className="text-yellow-400 flex items-center gap-1 mt-2 text-sm">
          <Star size={14} fill="currentColor" />
          {user.rating}
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-xl shadow-md p-6 flex flex-col gap-4 card-lift">
        <div>
          <label className="text-sm font-medium text-gray-700 flex items-center gap-1 mb-1">
            <User size={16} /> Name
          </label>
          <p className="text-gray-900 font-medium">
            {user.firstName}, {user.lastName}
          </p>
        </div>

        <div className="flex items-center justify-between border border-gray-200 rounded-lg px-4 py-3">
          <div>
            <p className="text-sm font-medium text-gray-700">Availability</p>
            <p className="text-xs text-gray-500">
              {isAvailable
                ? "Students can currently book sessions with you."
                : "You're marked unavailable — students can't book you."}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsAvailable(!isAvailable)}
            className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
              isAvailable ? "bg-green-700" : "bg-gray-300"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${
                isAvailable ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 flex items-center gap-1 mb-1">
            <BookOpen size={16} /> Subject / Course You Teach
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g. Machine Learning & AI"
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent transition-shadow"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 flex items-center gap-1 mb-1">
            <Tag size={16} /> Specialization Option
          </label>
          <select
            value={option}
            onChange={(e) => setOption(e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-700"
          >
            {options.map((opt) => (
              <option key={opt} value={opt} className="text-gray-900">
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 flex items-center gap-1 mb-1">
            <FileText size={16} /> Short Bio
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell students a bit about your background and teaching style..."
            rows={4}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent transition-shadow"
          />
        </div>

        {saved && (
          <p className="text-green-700 text-sm flex items-center gap-1 animate-fade-in">
            <CheckCircle size={16} /> Profile updated successfully!
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-green-800 text-white py-2.5 rounded-lg font-medium hover:bg-green-900 hover:scale-[1.02] transition-all duration-200 disabled:opacity-60"
        >
          {loading ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
}