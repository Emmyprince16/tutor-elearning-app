import TutorCard from "./components/TutorCard";
import Hero from "./components/Hero";
import { tutors } from "./data/tutors";

export default function Home() {
  return (
    <div>
      <Hero />
      <div className="p-6 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Available Tutors</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tutors.map((tutor) => (
            <TutorCard
              key={tutor.id}
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