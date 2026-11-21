// src/components/MarketingHeader.tsx
import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
 

export default function MarketingHeader() {
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [mobileSolutionsOpen, setMobileSolutionsOpen] = useState(false);

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
  <header className="relative z-50 w-full border-b border-gray-200 bg-white shadow-sm">
    <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-3 px-3 sm:px-5 lg:px-8">

      {/* Logo */}
      <Link to="/" className="flex min-w-0 shrink-0 items-center gap-2 sm:gap-3">
        <img
          src="/CollabFlow-logo.png"
          alt="CollabFlow logo"
          className="h-12 w-auto object-contain sm:h-16 lg:h-20"
        />

        <h1 className="whitespace-nowrap text-xl font-semibold sm:text-2xl lg:text-3xl">
          Collab<span className="text-teal-500">Flow</span>
        </h1>
      </Link>

      {/* Desktop Navigation */}
      <nav className="hidden items-center gap-6 font-semibold text-gray-700 md:flex lg:gap-8">
        <Link
          to="/features"
          className="text-base transition hover:text-indigo-600 lg:text-lg"
        >
          Features
        </Link>

        {/* Mega Menu */}
        <div
          className="relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <button
            type="button"
            aria-expanded={megaOpen}
            className="text-base transition hover:text-indigo-600 lg:text-lg"
          >
            Solutions
          </button>

          <div
            className={`absolute left-1/2 top-full mt-4 w-[min(700px,calc(100vw-32px))] -translate-x-1/2 rounded-2xl border border-gray-200 bg-white p-5 shadow-2xl transition-all duration-300 ease-out lg:p-8
              ${
                megaOpen
                  ? "visible translate-y-0 opacity-100"
                  : "invisible -translate-y-2 opacity-0"
              }`}
          >
            <div className="grid grid-cols-3 gap-4 lg:gap-8">

              {/* Column 1 */}
              <div>
                <h4 className="mb-3 font-semibold text-gray-900 lg:mb-4">
                  For Teams
                </h4>

                <div className="space-y-3 text-sm text-gray-600">
                  <Link to="/solutions/startups" className="flex items-center gap-2 hover:text-indigo-600">
                    <span>🚀</span>
                    <span>Startups</span>
                  </Link>

                  <Link to="/solutions/agencies" className="flex items-center gap-2 hover:text-indigo-600">
                    <span>🎨</span>
                    <span>Agencies</span>
                  </Link>

                  <Link to="/solutions/remote" className="flex items-center gap-2 hover:text-indigo-600">
                    <span>🌍</span>
                    <span>Remote Teams</span>
                  </Link>
                </div>
              </div>

              {/* Column 2 */}
              <div>
                <h4 className="mb-3 font-semibold text-gray-900 lg:mb-4">
                  For Industries
                </h4>

                <div className="space-y-3 text-sm text-gray-600">
                  <Link to="/solutions/tech" className="flex items-center gap-2 hover:text-indigo-600">
                    <span>💻</span>
                    <span>Technology</span>
                  </Link>

                  <Link to="/solutions/healthcare" className="flex items-center gap-2 hover:text-indigo-600">
                    <span>🏥</span>
                    <span>Healthcare</span>
                  </Link>

                  <Link to="/solutions/finance" className="flex items-center gap-2 hover:text-indigo-600">
                    <span>💰</span>
                    <span>Finance</span>
                  </Link>
                </div>
              </div>

              {/* Column 3 */}
              <div>
                <h4 className="mb-3 font-semibold text-gray-900 lg:mb-4">
                  Resources
                </h4>

                <div className="space-y-3 text-sm text-gray-600">
                  <Link to="/blog" className="flex items-center gap-2 hover:text-indigo-600">
                    <span>📰</span>
                    <span>Blog</span>
                  </Link>

                  <Link to="/docs" className="flex items-center gap-2 hover:text-indigo-600">
                    <span>📘</span>
                    <span>Documentation</span>
                  </Link>

                  <Link to="/api" className="flex items-center gap-2 hover:text-indigo-600">
                    <span>🔌</span>
                    <span>API</span>
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </div>
      </nav>

      {/* Desktop Actions */}
      <div className="hidden shrink-0 items-center gap-4 md:flex">
        <Link
          to="/login"
          className="whitespace-nowrap text-base font-semibold text-gray-600 transition hover:text-indigo-600 lg:text-lg"
        >
          Login
        </Link>

        <Link
          to="/signup"
          className="whitespace-nowrap rounded-xl bg-blue-500 px-4 py-2 text-base text-white shadow-md transition hover:bg-indigo-700 lg:px-5 lg:text-lg"
        >
          Get Started
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <button
        type="button"
        onClick={() => setMobileOpen((prev) => !prev)}
        aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={mobileOpen}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-2xl text-gray-700 transition hover:bg-gray-100 md:hidden"
      >
        {mobileOpen ? "✕" : "☰"}
      </button>
    </div>

    {/* Mobile Menu */}
    {mobileOpen && (
      <div className="border-t border-gray-200 bg-white px-4 py-4 shadow-lg md:hidden">

        <div className="space-y-1">

          <Link
            to="/features"
            onClick={() => setMobileOpen(false)}
            className="block rounded-lg px-3 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-indigo-600"
          >
            Features
          </Link>

          {/* Mobile Solutions Dropdown */}
          <div>
            <button
              type="button"
              onClick={() => setMobileSolutionsOpen((prev) => !prev)}
              aria-expanded={mobileSolutionsOpen}
              className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-left text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-indigo-600"
            >
              Solutions
              <span className="text-xs">
                {mobileSolutionsOpen ? "▲" : "▼"}
              </span>
            </button>

            {mobileSolutionsOpen && (
              <div className="space-y-1 border-l-2 border-indigo-100 py-2 pl-4">

                <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  For Teams
                </p>

                <Link to="/solutions/startups" onClick={() => setMobileOpen(false)} className="block rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-indigo-600">
                  🚀 Startups
                </Link>

                <Link to="/solutions/agencies" onClick={() => setMobileOpen(false)} className="block rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-indigo-600">
                  🎨 Agencies
                </Link>

                <Link to="/solutions/remote" onClick={() => setMobileOpen(false)} className="block rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-indigo-600">
                  🌍 Remote Teams
                </Link>

                <p className="px-3 pb-1 pt-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  For Industries
                </p>

                <Link to="/solutions/tech" onClick={() => setMobileOpen(false)} className="block rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-indigo-600">
                  💻 Technology
                </Link>

                <Link to="/solutions/healthcare" onClick={() => setMobileOpen(false)} className="block rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-indigo-600">
                  🏥 Healthcare
                </Link>

                <Link to="/solutions/finance" onClick={() => setMobileOpen(false)} className="block rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-indigo-600">
                  💰 Finance
                </Link>

                <p className="px-3 pb-1 pt-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Resources
                </p>

                <Link to="/blog" onClick={() => setMobileOpen(false)} className="block rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-indigo-600">
                  📰 Blog
                </Link>

                <Link to="/docs" onClick={() => setMobileOpen(false)} className="block rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-indigo-600">
                  📘 Documentation
                </Link>

                <Link to="/api" onClick={() => setMobileOpen(false)} className="block rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-indigo-600">
                  🔌 API
                </Link>

              </div>
            )}
          </div>

          <Link
            to="/login"
            onClick={() => setMobileOpen(false)}
            className="block rounded-lg px-3 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-indigo-600"
          >
            Login
          </Link>

          <Link
            to="/signup"
            onClick={() => setMobileOpen(false)}
            className="mt-2 block w-full rounded-xl bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Get Started
          </Link>

        </div>
      </div>
    )}
  </header>
);

}