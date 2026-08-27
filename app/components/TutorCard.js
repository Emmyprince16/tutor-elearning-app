"use client";

import { useState } from "react";

function TutorCard(props) {
  const [booked, setBooked] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 m-4 max-w-sm">
      <h2 className="text-xl font-bold text-gray-900">{props.name}</h2>
      <p className="text-gray-600">Subject: {props.subject}</p>
      <p className="text-yellow-600">Rating: {props.rating}</p>

      <button
        onClick={() => setBooked(true)}
        className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {booked ? "Booked!" : "Book Session"}
      </button>
    </div>
  );
}

export default TutorCard;