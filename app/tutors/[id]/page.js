import { tutors } from "../../data/tutors";
import { Star, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function TutorProfile({ params }) {
  const tutor = tutors.find((t) => t.id === parseInt(params.id));

  if (!tutor) {
    return <p className="p-6">Tutor not found.</p>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-green-800 mb-4 hover:underline"
      >
        <ArrowLeft size={18} />
        Back to all tutors
      </Link>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900">{tutor.name}</h1>
        <p className="text-gray-600 mt-1">{tutor.subject}</p>
        <p className="text-yellow-600 flex items-center gap-1 mt-2">
          <Star size={18} fill="currentColor" />
          {tutor.rating}
        </p>
        <p className="mt-4 text-gray-700">
          Specialization: <span className="font-medium">{tutor.option}</span>
        </p>

        <button className="mt-6 bg-green-800 text-white px-5 py-2 rounded font-medium hover:bg-green-900 transition-colors">
          Book a Session
        </button>
      </div>
    </div>
  );
}