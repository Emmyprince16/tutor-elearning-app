import { GraduationCap, Cpu, Shield, Code, Network } from "lucide-react";

const levels = [
  {
    name: "ND1",
    description: "National Diploma, Year 1",
    tracks: ["Full Time", "Part Time"],
    icon: GraduationCap,
  },
  {
    name: "ND2",
    description: "National Diploma, Year 2",
    tracks: ["Full Time", "Part Time"],
    icon: GraduationCap,
  },
  {
    name: "HND1",
    description: "Higher National Diploma, Year 1",
    tracks: ["AI", "NCC", "Cybersecurity", "SWD"],
    icon: Cpu,
  },
  {
    name: "HND2",
    description: "Higher National Diploma, Year 2",
    tracks: ["NCC", "Cybersecurity", "SWD"],
    icon: Cpu,
  },
];

const optionIcons = {
  AI: Cpu,
  NCC: Network,
  Cybersecurity: Shield,
  SWD: Code,
};

export default function DepartmentsPage() {
  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">Computer Sciences Department</h1>
      <p className="text-gray-600 mb-8">
        Federal Polytechnic, Ilaro — Programme structure and specialization options.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {levels.map((level) => {
          const Icon = level.icon;
          return (
            <div
              key={level.name}
              className="bg-white rounded-lg shadow-md p-6 animate-fade-in"
            >
              <div className="flex items-center gap-3 mb-2">
                <Icon className="text-green-800" size={28} />
                <h2 className="text-xl font-bold text-gray-900">{level.name}</h2>
              </div>
              <p className="text-gray-600 mb-4">{level.description}</p>
              <div className="flex flex-wrap gap-2">
                {level.tracks.map((track) => {
                  const TrackIcon = optionIcons[track];
                  return (
                    <span
                      key={track}
                      className="flex items-center gap-1 bg-green-50 text-green-800 text-sm px-3 py-1 rounded-full"
                    >
                      {TrackIcon && <TrackIcon size={14} />}
                      {track}
                    </span>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}