"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Star, MessageCircle, Calendar } from "lucide-react";

function TutorCard(props) {
  const [isTutor, setIsTutor] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setIsTutor(user.role === "tutor");
    }
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-xl transition-shadow animate-fade-in">
      <Link href={`/tutors/${props.id}`}>
        <h2 className="text-xl font-bold text-gray-900 hover:text-green-800 transition-colors cursor-pointer">
          {props.name}
        </h2>
      </Link>
      <p className="text-gray-600">Subject: {props.subject}</p>
      <p className="text-yellow-600 flex items-center gap-1">
        <Star size={16} fill="currentColor" />
        {props.rating}
      </p>

      <Link
        href={`/tutors/${props.id}`}
        className="mt-3 inline-flex items-center gap-2 bg-green-800 text-white px-4 py-2 rounded font-medium hover:bg-green-900 hover:scale-105 transition-all duration-200 text-center"
      >
        {isTutor ? (
          <>
            <MessageCircle size={16} />
            View Profile
          </>
        ) : (
          <>
            <Calendar size={16} />
            Book Session
          </>
        )}
      </Link>
    </div>
  );
}

export default TutorCard;