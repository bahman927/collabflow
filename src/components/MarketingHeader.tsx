// src/components/MarketingHeader.tsx
import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

export default function MarketingHeader() {
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

   const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);


  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setMegaOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setMegaOpen(false);
    }, 150); // small delay prevents flicker
  };

  

  return (
    <header className="w-full bg-white  border-gray-200 shadow-sm relative">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 ">

        {/* Logo */}
        <div className="flex items-center gap-3 ">
         <img src="CollabFlow-logo.png" className=" h-25" />

         <h1 className="text-3xl font-semibold">
           Collab<span className="text-teal-500">Flow</span>
         </h1>
        </div>
          

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8 text-gray-700 font-semibold">
          <Link to="/features" className="hover:text-indigo-600 transition font-medium text-xl">
            Features
          </Link>

          {/* Mega Menu */}
          <div
           className="relative hidden md:block"
           onMouseEnter={handleMouseEnter}
           onMouseLeave={handleMouseLeave}
            >
            <button
              className="hover:text-indigo-600 transition text-xl"
            >
              Solutions
            </button>

            {/* Animated Mega Menu */}
            <div
              className={`absolute left-1/2 transform -translate-x-1/2 mt-6 w-175
                bg-white border rounded-2xl shadow-2xl p-8 z-50
                transition-all duration-300 ease-out
                ${megaOpen
                  ? "opacity-100 translate-y-0 visible"
                  : "opacity-0 -translate-y-4 invisible"}`}
            >
              <div className="grid grid-cols-3 gap-8">

                {/* Column 1 */}
                <div>
                  <h4 className="text-gray-900 font-semibold mb-4">
                    For Teams
                  </h4>
                  <div className="space-y-3 text-sm text-gray-600">

                    <Link to="/solutions/startups" className="flex items-center space-x-2 hover:text-indigo-600">
                      <span>🚀</span>
                      <span>Startups</span>
                    </Link>

                    <Link to="/solutions/agencies" className="flex items-center space-x-2 hover:text-indigo-600">
                      <span>🎨</span>
                      <span>Agencies</span>
                    </Link>

                    <Link to="/solutions/remote" className="flex items-center space-x-2 hover:text-indigo-600">
                      <span>🌍</span>
                      <span>Remote Teams</span>
                    </Link>

                  </div>
                </div>

                {/* Column 2 */}
                <div>
                  <h4 className="text-gray-900 font-semibold mb-4">
                    For Industries
                  </h4>
                  <div className="space-y-3 text-sm text-gray-600">

                    <Link to="/solutions/tech" className="flex items-center space-x-2 hover:text-indigo-600">
                      <span>💻</span>
                      <span>Technology</span>
                    </Link>

                    <Link to="/solutions/healthcare" className="flex items-center space-x-2 hover:text-indigo-600">
                      <span>🏥</span>
                      <span>Healthcare</span>
                    </Link>

                    <Link to="/solutions/finance" className="flex items-center space-x-2 hover:text-indigo-600">
                      <span>💰</span>
                      <span>Finance</span>
                    </Link>

                  </div>
                </div>

                {/* Column 3 */}
                <div>
                  <h4 className="text-gray-900 font-semibold mb-4">
                    Resources
                  </h4>
                  <div className="space-y-3 text-sm text-gray-600">

                    <Link to="/blog" className="flex items-center space-x-2 hover:text-indigo-600">
                      <span>📰</span>
                      <span>Blog</span>
                    </Link>

                    <Link to="/docs" className="flex items-center space-x-2 hover:text-indigo-600">
                      <span>📘</span>
                      <span>Documentation</span>
                    </Link>

                    <Link to="/api" className="flex items-center space-x-2 hover:text-indigo-600">
                      <span>🔌</span>
                      <span>API</span>
                    </Link>

                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* <Link to="/pricing" className="hover:text-indigo-600 transition text-xl">
            Pricing
          </Link> */}
        </nav>

        {/* Right Side */}
        <div className="hidden md:flex items-center space-x-4">
          <Link
            to="/login"
            className="text-gray-600 hover:text-indigo-600 font-semibold text-xl"
          >
            Login
          </Link>

          <Link
            to="/signup"
            className="bg-blue-500 text-xl  text-white! px-5 py-2 rounded-xl hover:bg-indigo-700 transition shadow-md"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Button */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-6 py-6 space-y-4">
          <Link to="/features" className="block hover:text-indigo-600">
            Features
          </Link>
          {/* <Link to="/pricing" className="block hover:text-indigo-600">
            Pricing
          </Link> */}
          <Link to="/login" className="block hover:text-indigo-600">
            Login
          </Link>
          <Link
            to="/signup"
            className="block bg-blue-600 text-white text-center py-2 rounded-xl w-full"
          >
            Get Started
          </Link>
        </div>
      )}
    </header>
  );
}