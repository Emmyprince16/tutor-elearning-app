import Hero from "./components/Hero";
import TutorCard from "./components/TutorCard";
import { tutors } from "./data/tutors";
import Link from "next/link";

export default function Home() {
  const featuredTutors = tutors.slice(0, 3);

  return (
    <div>
      <Hero />
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Featured Tutors</h2>
          <Link href="/tutors" className="text-green-800 font-medium hover:underline">
            View All Tutors →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredTutors.map((tutor) => (
            <TutorCard
              key={tutor.id}
              id={tutor.id}
              name={tutor.name}
              subject={tutor.subject}
              rating={tutor.rating}
            />
          ))}
        </div>
      </div>
    </div>
  );
}