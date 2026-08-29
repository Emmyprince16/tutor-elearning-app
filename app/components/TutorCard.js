"use client";

import Link from "next/link";
import { Star } from "lucide-react";


function TutorCard(props) {

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
  className="mt-3 inline-block bg-green-800 text-white px-4 py-2 rounded font-medium hover:bg-green-900 transition-colors text-center"
>
  Book Session
</Link>
    </div>
  );
}

export default TutorCard;