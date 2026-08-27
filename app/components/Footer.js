import { GraduationCap, Mail, MapPin, Phone } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-green-900 text-green-100 mt-12">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <GraduationCap className="text-yellow-400" size={24} />
            <span className="font-bold text-white">FPI E-Learning</span>
          </div>
          <p className="text-sm">
            A tutor and student meeting platform for the Computer Sciences
            Department, Federal Polytechnic, Ilaro.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-white mb-3">Quick Links</h3>
          <ul className="flex flex-col gap-2 text-sm">
            <li><a href="/" className="hover:text-yellow-400 transition-colors">Home</a></li>
            <li><a href="#" className="hover:text-yellow-400 transition-colors">Tutors</a></li>
            <li><a href="#" className="hover:text-yellow-400 transition-colors">Departments</a></li>
            <li><a href="/login" className="hover:text-yellow-400 transition-colors">Login</a></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-white mb-3">Contact</h3>
          <ul className="flex flex-col gap-2 text-sm">
            <li className="flex items-center gap-2">
              <MapPin size={16} /> Ilaro, Ogun State, Nigeria
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} /> cs-dept@federalpolyilaro.edu.ng
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} /> +234 800 000 0000
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-green-800 text-center text-sm py-4">
        © {new Date().getFullYear()} Federal Polytechnic Ilaro — Computer Sciences Department
      </div>
    </footer>
  );
}

export default Footer;