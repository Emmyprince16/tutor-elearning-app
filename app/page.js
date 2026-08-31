"use client";

import { useState, useEffect } from "react";
import Hero from "./components/Hero";
import TutorCard from "./components/TutorCard";
import Link from "next/link";

export default function Home() {
  const [tutors, setTutors] = useState([]);

  useEffect(() => {
    fetch("/api/tutors")
      .then((res) => res.json())
      .then((data) => setTutors(data.tutors || []));
  }, []);

  const featuredTutors = tutors.slice(0, 3);

  return (
    <div>
      <Hero />
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2
            className="text-2xl font-bold text-gray-900"
            style={{ fontFamily: "var(--font-heading), Georgia, serif" }}
          >
            Featured Tutors
          </h2>
          <Link href="/tutors" className="text-green-800 font-medium link-sweep">
            View All Tutors
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredTutors.map((tutor, index) => (
            <div key={tutor.id} className={`animate-stagger animate-stagger-${index + 1}`}>
              <TutorCard
                id={tutor.id}
                name={`${tutor.firstName}, ${tutor.lastName}`}
                subject={tutor.subject}
                rating={tutor.rating}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}