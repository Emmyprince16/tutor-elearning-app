import { BookOpen, Users, Video } from "lucide-react";

function Hero() {
  return (
    <div className="bg-gradient-to-r from-green-900 to-green-700 text-white py-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">
          FPI Computer Sciences E-Learning Portal
        </h1>
        <p className="text-green-100 text-lg mb-8">
          Connecting Computer Sciences students with departmental tutors for live,
          one-on-one learning sessions.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-6 mt-8">
          <div className="flex items-center gap-2 justify-center">
            <Users className="text-yellow-400" size={22} />
            <span>Verified Tutors</span>
          </div>
          <div className="flex items-center gap-2 justify-center">
            <Video className="text-yellow-400" size={22} />
            <span>Live Video Sessions</span>
          </div>
          <div className="flex items-center gap-2 justify-center">
            <BookOpen className="text-yellow-400" size={22} />
            <span>All Computer Sciences Options</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;