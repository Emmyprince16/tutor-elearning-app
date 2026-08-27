"use client";

import Link from "next/link";
import { useState } from "react";
import { Star } from "lucide-react";


function TutorCard(props) {
  const [booked, setBooked] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-xl transition-shadow">
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

      <button
        onClick={() => setBooked(true)}
        className="mt-3 bg-green-800 text-white px-4 py-2 rounded font-medium hover:bg-green-900 transition-colors"
      >
        {booked ? "Booked!" : "Book Session"}
      </button>
    </div>
  );
}

export default TutorCard;