"use client";

import { useState, useEffect } from "react";
import { IdCard, GraduationCap, Users, BookOpen, Briefcase } from "lucide-react";

export default function DepartmentsPage() {
  const [user, setUser] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user || user.role !== "student") {
      setLoading(false);
      return;
    }

    const hasOption = Boolean(user.option);
    const query = hasOption
      ? `option=${encodeURIComponent(user.option)}`
      : `level=${encodeURIComponent(user.level)}&studyMode=${encodeURIComponent(user.studyMode)}`;

    fetch(`/api/students?${query}`)
      .then((res) => res.json())
      .then((data) => {
        setStudents(data.students || []);
        setLoading(false);
      });
  }, [user]);

  if (loading) {
    return <p className="p-6">Loading department information...</p>;
  }

  if (!user) {
    return <p className="p-6">Please log in to view your department.</p>;
  }

  if (user.role !== "student") {
    return <p className="p-6">This page is only available to students.</p>;
  }

  const classmates = students.filter((s) => s.id !== user.id);
  const hasOption = Boolean(user.option);
  const groupLabel = hasOption
    ? user.option
    : `${user.level} Level, ${user.studyMode}`;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1
        className="text-2xl font-bold text-gray-900 mb-1"
        style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
      >
        Computer Sciences Department
      </h1>
      <p className="text-gray-600 mb-6">
        Your profile and classmates in the same {hasOption ? "option" : "level and study mode"}.
      </p>

      <div className="bg-green-800 text-white rounded-xl p-5 mb-6 shadow-md animate-fade-in-scale">
        <p className="text-sm text-green-200 mb-1">Your Profile</p>
        <p className="text-xl font-bold">
          {user.firstName}, {user.lastName}
        </p>
        <div className="flex flex-wrap gap-4 mt-3 text-sm">
          <span className="flex items-center gap-1">
            <IdCard size={14} /> {user.matricNumber}
          </span>
          <span className="flex items-center gap-1">
            <GraduationCap size={14} /> {user.level} Level
          </span>
          {hasOption ? (
            <span className="flex items-center gap-1">
              <BookOpen size={14} /> {user.option}
            </span>
          ) : (
            user.studyMode && (
              <span className="flex items-center gap-1">
                <Briefcase size={14} /> {user.studyMode}
              </span>
            )
          )}
        </div>
      </div>

      <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
        <Users size={18} />
        Classmates in {groupLabel} ({classmates.length})
      </h2>

      {classmates.length === 0 ? (
        <p className="text-gray-500">No other students found in your group yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {classmates.map((s, index) => (
            <div
              key={s.id}
              className={`bg-white rounded-lg shadow-md p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 card-lift animate-stagger animate-stagger-${Math.min(index + 1, 6)}`}
            >
              <p className="font-medium text-gray-900">
                {s.firstName}, {s.lastName}
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <IdCard size={14} /> {s.matricNumber}
                </span>
                <span className="flex items-center gap-1">
                  <GraduationCap size={14} /> {s.level} Level
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}