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
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-1 flex items-center gap-2">
        <Users size={24} />
        Registered Students
      </h1>
      <p className="text-gray-600 mb-6">
        All students registered on the platform ({students.length}), sorted alphabetically.
      </p>

      {students.length === 0 ? (
        <p className="text-gray-500">No students registered yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {students.map((s) => (
            <div
              key={s.id}
              className="bg-white rounded-lg shadow-md p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
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
  );
}