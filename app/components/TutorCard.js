"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Star, MessageCircle, Calendar } from "lucide-react";

function TutorCard(props) {
  const [isTutor, setIsTutor] = useState(false);
  const [isSelf, setIsSelf] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setIsTutor(user.role === "tutor");
      setIsSelf(user.role === "tutor" && user.id === props.id);
    }
  }, [props.id]);

  return (
    <div className="bg-white rounded-xl shadow-md p-4 card-lift">
      {isSelf ? (
        <h2 className="text-xl font-bold text-gray-900">{props.name}</h2>
      ) : (
        <Link href={`/tutors/${props.id}`}>
          <h2 className="text-xl font-bold text-gray-900 hover:text-green-800 transition-colors cursor-pointer">
            {props.name}
          </h2>
        </Link>
      )}
      <p className="text-gray-600 text-sm mt-1">Subject: {props.subject}</p>
      <p className="text-yellow-600 flex items-center gap-1 mt-1">
        <Star size={16} fill="currentColor" />
        {props.rating}
      </p>

      {isSelf ? (
        <span className="mt-3 inline-flex items-center gap-2 bg-gray-100 text-gray-400 px-4 py-2 rounded-lg font-medium cursor-not-allowed">
          This is you
        </span>
      ) : (
        <Link
          href={`/tutors/${props.id}`}
          className="mt-3 inline-flex items-center gap-2 bg-green-800 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-900 hover:scale-[1.02] transition-all duration-200 text-center"
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
      )}
    </div>
  );
}

export default TutorCard;