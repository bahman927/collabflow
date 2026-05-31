// src/pages/Landing.tsx
import React from "react";
import { Link } from "react-router-dom";

const Landing: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center mt-2 bg-slate-50 px-6 text-center">
      
      <h1 className="text-3xl font-bold text-blue-700 mb-4 mt-2">
        Welcome to CollabFlow
      </h1>
      <p className="text-xl font-bold text-slate-600 mb-6">
        Streamline your team collaboration and manage projects effortlessly.
      </p>
      <img src="/CollabFlow.jpeg" alt="CollabFlow Landing" className="h-140 w-230" />
      <div className="flex gap-4">
        <Link
          to="/signup"
          className="rounded-lg bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-700 transition"
        >
          Get Started
        </Link>

        <Link
          to="/login"
          className="rounded-lg border border-blue-600 px-6 py-3 text-blue-600 font-semibold hover:bg-blue-50 transition"
        >
          Login
        </Link>
      </div>
    </div>
  );
};

export default Landing;
