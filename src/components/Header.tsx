import React from "react";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  return (
    <header className="w-full border-b bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        
        {/* Left: Logo */}
        <div className="flex items-center">
          <img
            src="CollabFlow-logo.svg"
            alt="CollabFlow"
            className="h-12 font-bold w-auto"
          />
        </div>

        {/* Right: Auth buttons */}
        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="rounded-lg px-4 py-2 font-bold text-xl hover:bg-blue-500 "
          >
            Login
          </Link>

          <Link
            to="/signup"
            className="rounded-lg px-4 py-2  font-bold text-xl hover:bg-blue-500 "
          >
            Sign up
          </Link>
        </div>

      </div>
    </header>
  );
};

export default Header;
