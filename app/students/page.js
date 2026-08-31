"use client";

import { useState, useEffect } from "react";
import { IdCard, GraduationCap, BookOpen, Users } from "lucide-react";

export default function StudentsPage() {
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
    if (!user || user.role !== "tutor") {
      setLoading(false);
      return;
    }

    fetch(`/api/students`)
      .then((res) => res.json())
      .then((data) => {
        setStudents(data.students || []);
        setLoading(false);
      });
  }, [user]);

  if (loading) {
    return <p className="p-6">Loading students...</p>;
  }

  if (!user) {
    return <p className="p-6">Please log in to view this page.</p>;
  }

  if (user.role !== "tutor") {
    return <p className="p-6">This page is only available to tutors.</p>;
  }

  return (
    <div>
      <div className="relative bg-gradient-to-br from-green-900 via-green-800 to-green-950 text-white py-10 px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06]">
          <div className="absolute inset-0" style={{
            backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
            backgroundSize: "26px 26px",
          }}></div>
        </div>

        <div className="relative z-10 max-w-3xl mx-auto animate-fade-in-scale">
          <h1
            className="text-2xl font-bold mb-1 flex items-center gap-2"
            style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
          >
            <Users size={24} />
            Registered Students
          </h1>
          <p className="text-green-100 text-sm">
            {students.length} student{students.length !== 1 ? "s" : ""} on the platform, sorted alphabetically.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto p-6 -mt-4 relative z-20">
        {students.length === 0 ? (
          <p className="text-gray-500">No students registered yet.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {students.map((s, index) => (
              <div
                key={s.id}
                className={`bg-white rounded-xl shadow-md p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 card-lift animate-stagger animate-stagger-${Math.min(index + 1, 6)}`}
              >
                <p className="font-medium text-gray-900">
                  {s.firstName}, {s.lastName}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <IdCard size={14} /> {s.matricNumber || "N/A"}
                  </span>
                  <span className="flex items-center gap-1">
                    <GraduationCap size={14} /> {s.level ? `${s.level} Level` : "N/A"}
                  </span>
                  {s.option && (
                    <span className="flex items-center gap-1">
                      <BookOpen size={14} /> {s.option}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}