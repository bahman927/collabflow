// src/pages/Landing.tsx
import React from "react";
import { Link } from "react-router-dom";

const Landing: React.FC = () => {
  return (
  <div className="flex min-h-full min-w-0 flex-col items-center justify-center bg-slate-50 px-3 py-6 text-center sm:px-6 sm:py-8">
    {/* Heading */}
    <h1 className="mb-3 mt-2 wrap-break-word text-2xl font-bold text-blue-700 sm:mb-4 sm:text-3xl">
      Welcome to CollabFlow
    </h1>

    {/* Description */}
    <p className="mb-5 max-w-2xl text-base font-bold leading-relaxed text-slate-600 sm:mb-6 sm:text-xl">
      Streamline your team collaboration and manage projects effortlessly.
    </p>

    {/* Landing Image */}
    <img
      src="/CollabFlow.jpeg"
      alt="CollabFlow Landing"
      className="mb-6 h-auto max-h-64 w-full max-w-4xl rounded-lg object-contain sm:mb-8 sm:max-h-96 lg:max-h-140"
    />

    {/* Navigation Buttons */}
    <div className="flex w-full max-w-sm flex-col gap-3 sm:w-auto sm:max-w-none sm:flex-row sm:gap-4">
      <Link
        to="/signup"
        className="w-full rounded-lg bg-blue-600 px-6 py-3 text-center font-medium text-white transition hover:bg-blue-700 sm:w-auto"
      >
        Get Started
      </Link>

      <Link
        to="/login"
        className="w-full rounded-lg border border-blue-600 px-6 py-3 text-center font-semibold text-blue-600 transition hover:bg-blue-50 sm:w-auto"
      >
        Login
      </Link>
    </div>
  </div>
);
};

export default Landing;
