// src/components/Header.tsx
import { Link } from "react-router-dom";
import { useState } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-4">
        
        {/* Logo */}
        <Link to="/" className="">
          <div className="flex items-center ">
            <img  
              src="CollabFlow-logo.png"
              alt="CollabFlow"
              
            />
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-8 text-gray-700 font-medium">
          <Link to="/features" className="hover:text-indigo-600 transition">
         
             Features 
          </Link>

          {/* Solutions Dropdown */}
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="hover:text-indigo-600 transition"
            >
              Solutions
            </button>

            {open && (
              <div className="absolute top-8 left-0 w-48 bg-white border rounded-lg shadow-lg py-2">
                <Link
                  to="/solutions/startups"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Startups
                </Link>
                <Link
                  to="/solutions/enterprise"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Enterprise
                </Link>
                <Link
                  to="/solutions/agencies"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Agencies
                </Link>
              </div>
            )}
          </div>

          <Link to="/pricing" className="hover:text-indigo-600 transition">
            Pricing
          </Link>
        </nav>

        {/* Right Side */}
        <div className="flex items-center space-x-4">
          <Link
            to="/login"
            className="text-gray-600 hover:text-indigo-600 font-medium"
          >
            Login
          </Link>

          <Link
            to="/signup"
            className="bg-indigo-600 text-white px-5 py-2 rounded-xl hover:bg-indigo-700 transition shadow-md"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}

 