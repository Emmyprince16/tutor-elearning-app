"use client";

import { useState, useEffect } from "react";
import TutorCard from "../components/TutorCard";
import { Search } from "lucide-react";

export default function TutorsPage() {
  const [tutors, setTutors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOption, setSelectedOption] = useState("All");

  useEffect(() => {
    fetch("/api/tutors")
      .then((res) => res.json())
      .then((data) => setTutors(data.tutors || []));
  }, []);

  const options = ["All", "AI", "NCC", "Cybersecurity", "SWD", "General"];

  const filteredTutors = tutors.filter((tutor) => {
    const fullName = `${tutor.firstName} ${tutor.lastName}`.toLowerCase();
    const matchesSearch =
      fullName.includes(searchTerm.toLowerCase()) ||
      (tutor.subject || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesOption =
      selectedOption === "All" || tutor.option === selectedOption;
    return matchesSearch && matchesOption;
  });

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1
        className="text-2xl font-bold mb-1 text-gray-900"
        style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
      >
        All Tutors
      </h1>
      <p className="text-gray-500 mb-6 text-sm">
        Browse verified tutors across every specialization.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by name or subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent transition-shadow"
          />
        </div>

        <select
          value={selectedOption}
          onChange={(e) => setSelectedOption(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2.5 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-700"
        >
          {options.map((opt) => (
            <option key={opt} value={opt} className="text-gray-900">
              {opt}
            </option>
          ))}
        </select>
      </div>

      {filteredTutors.length === 0 ? (
        <p className="text-gray-500">No tutors match your search.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTutors.map((tutor, index) => (
            <div key={tutor.id} className={`animate-stagger animate-stagger-${Math.min(index + 1, 6)}`}>
              <TutorCard
                id={tutor.id}
                name={`${tutor.prefix ? tutor.prefix + " " : ""}${tutor.firstName}, ${tutor.lastName}`}
                subject={tutor.subject}
                rating={tutor.rating}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}