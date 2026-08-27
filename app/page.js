import TutorCard from "./components/TutorCard";

export default function Home() {
  return (
    <div>
      <h1>Available Tutors</h1>
      <TutorCard name="Aisha Bello" subject="Mathematics" rating="4.8" />
      <TutorCard name="John Okafor" subject="Physics" rating="4.6" />
    </div>
  );
}