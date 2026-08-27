"use client";

import { useState } from "react";
import { Mail, Lock, User, GraduationCap } from "lucide-react";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState("student");

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
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

          <form className="flex flex-col gap-4">
            {!isLogin && (
              <div className="relative">
                <User
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-700"
                />
              </div>
            )}

            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="email"
                placeholder="Email Address"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-700"
              />
            </div>

            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-700"
              />
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
              onClick={() => setIsLogin(!isLogin)}
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