"use client";

import { useState } from "react";
import { Mail, Lock, User, GraduationCap, AlertCircle, Check, X } from "lucide-react";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState("student");

  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  function validate() {
    const newErrors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      newErrors.email = "Enter a valid email address (e.g. name@gmail.com)";
    }

    const passwordRegex =
  /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,20}$/;
if (!passwordRegex.test(password)) {
  newErrors.password =
    "Password must be 8-20 characters, with at least 1 capital letter, 1 number, and 1 symbol";
}

    if (!isLogin) {
      if (!lastName.trim()) newErrors.lastName = "Last name is required";
      if (!firstName.trim()) newErrors.firstName = "First name is required";
      if (!middleName.trim()) newErrors.middleName = "Middle name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const hasLength = password.length >= 8 && password.length <= 20;
const hasCapital = /[A-Z]/.test(password);
const hasNumber = /[0-9]/.test(password);
const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  function handleSubmit(e) {
    e.preventDefault();
    const isValid = validate();
    if (isValid) {
      alert(isLogin ? "Login successful (demo)" : "Account created (demo)");
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4 py-10">
      <div className="bg-white rounded-lg shadow-md w-full max-w-3xl flex flex-col md:flex-row overflow-hidden">
        <div
          className="hidden md:block md:w-1/2 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80')",
          }}
        ></div>
        <div className="w-full md:w-1/2 p-8">
          <div className="flex justify-center mb-4">
            <GraduationCap size={36} className="text-green-800" />
          </div>
          <h1 className="text-2xl font-bold text-center text-gray-900 mb-1">
            {isLogin ? "Welcome Back" : "Create an Account"}
          </h1>
          <p className="text-center text-gray-500 mb-6">
            FPI Computer Sciences E-Learning Portal
          </p>

          <div className="flex mb-6 border border-gray-300 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => setRole("student")}
              className={`flex-1 py-2 font-medium transition-colors ${
                role === "student"
                  ? "bg-green-800 text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => setRole("tutor")}
              className={`flex-1 py-2 font-medium transition-colors ${
                role === "tutor"
                  ? "bg-green-800 text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              Tutor
            </button>
          </div>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <div>
                  <div className="relative">
                    <User
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="text"
                      placeholder="Last Name (Surname)"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-700"
                    />
                  </div>
                  {errors.lastName && (
                    <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle size={14} /> {errors.lastName}
                    </p>
                  )}
                </div>

                <div>
                  <div className="relative">
                    <User
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="text"
                      placeholder="First Name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-700"
                    />
                  </div>
                  {errors.firstName && (
                    <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle size={14} /> {errors.firstName}
                    </p>
                  )}
                </div>

                <div>
                  <div className="relative">
                    <User
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="text"
                      placeholder="Middle Name"
                      value={middleName}
                      onChange={(e) => setMiddleName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-700"
                    />
                  </div>
                  {errors.middleName && (
                    <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle size={14} /> {errors.middleName}
                    </p>
                  )}
                </div>
              </>
            )}

            <div>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-700"
                />
              </div>
              {errors.email && (
                <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.email}
                </p>
              )}
            </div>

                       <div>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-700"
                />
              </div>

              {!isLogin && password.length > 0 && (
               <ul className="mt-2 text-sm flex flex-col gap-1">
  <li className={`flex items-center gap-1 ${hasLength ? "text-green-700" : "text-gray-400"}`}>
    {hasLength ? <Check size={14} /> : <X size={14} />}
    8- 20 characters
  </li>
  <li className={`flex items-center gap-1 ${hasCapital ? "text-green-700" : "text-gray-400"}`}>
    {hasCapital ? <Check size={14} /> : <X size={14} />}
    At least one capital letter
  </li>
  <li className={`flex items-center gap-1 ${hasNumber ? "text-green-700" : "text-gray-400"}`}>
    {hasNumber ? <Check size={14} /> : <X size={14} />}
    At least one number
  </li>
  <li className={`flex items-center gap-1 ${hasSymbol ? "text-green-700" : "text-gray-400"}`}>
    {hasSymbol ? <Check size={14} /> : <X size={14} />}
    At least one symbol
  </li>
</ul>
              )}

              {errors.password && (
                <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.password}
                </p>
              )}
            </div>

                        <button
              type="submit"
              className="bg-green-800 text-white py-2 rounded-lg font-medium hover:bg-green-900 transition-colors mt-2"
            >
              {isLogin ? "Log In" : "Sign Up"}
            </button>
          </form>

          <p className="text-center text-gray-500 mt-6">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setErrors({});
              }}
              className="text-green-800 font-medium hover:underline"
            >
              {isLogin ? "Sign Up" : "Log In"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}