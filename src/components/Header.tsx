// // src/components/Header.tsx

import { Link } from "react-router-dom";
import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobileMenu = () => {
    setMobileOpen(false);
    setOpen(false);
  };

  return (
    <header className="w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 sm:py-4">

        {/* Logo */}
        <Link to="/" onClick={closeMobileMenu} className="shrink-0">
          <img
            src="/CollabFlo-logo.png"
            alt="CollabFlow"
            className="h-12 sm:h-14 w-auto object-contain"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-gray-700 font-medium">

          <Link to="/features" className="hover:text-indigo-600 transition">
            Features
          </Link>

          {/* Solutions Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpen(!open)}
              className="flex items-center gap-1 hover:text-indigo-600 transition"
            >
              Solutions
              <ChevronDown size={16} />
            </button>

            {open && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
                <Link
                  to="/solutions/startups"
                  onClick={() => setOpen(false)}
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Startups
                </Link>

                <Link
                  to="/solutions/enterprise"
                  onClick={() => setOpen(false)}
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Enterprise
                </Link>

                <Link
                  to="/solutions/agencies"
                  onClick={() => setOpen(false)}
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Agencies
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* Desktop Login / Signup */}
        <div className="hidden md:flex items-center gap-4">
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

        {/* Mobile Hamburger */}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <nav className="md:hidden border-t border-gray-200 bg-white px-5 py-4 space-y-3">

          <Link
            to="/features"
            onClick={closeMobileMenu}
            className="block py-2 text-gray-700 font-medium hover:text-indigo-600"
          >
            Features
          </Link>

          {/* Mobile Solutions */}
          <div>
            <button
              type="button"
              onClick={() => setOpen(!open)}
              className="flex w-full items-center justify-between py-2 text-gray-700 font-medium"
            >
              Solutions
              <ChevronDown
                size={18}
                className={`transition-transform ${open ? "rotate-180" : ""}`}
              />
            </button>

            {open && (
              <div className="pl-4 space-y-2 border-l-2 border-indigo-100 ml-1 mt-2">
                <Link
                  to="/solutions/startups"
                  onClick={closeMobileMenu}
                  className="block py-1 text-gray-600 hover:text-indigo-600"
                >
                  Startups
                </Link>

                <Link
                  to="/solutions/enterprise"
                  onClick={closeMobileMenu}
                  className="block py-1 text-gray-600 hover:text-indigo-600"
                >
                  Enterprise
                </Link>

                <Link
                  to="/solutions/agencies"
                  onClick={closeMobileMenu}
                  className="block py-1 text-gray-600 hover:text-indigo-600"
                >
                  Agencies
                </Link>
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 pt-3 flex flex-col gap-3">
            <Link
              to="/login"
              onClick={closeMobileMenu}
              className="text-gray-700 font-medium py-2"
            >
              Login
            </Link>

            <Link
              to="/signup"
              onClick={closeMobileMenu}
              className="block text-center bg-indigo-600 text-white px-5 py-3 rounded-xl hover:bg-indigo-700 transition"
            >
              Get Started
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}





// import { Link } from "react-router-dom";
// import { useState } from "react";

// export default function Header() {
//   const [open, setOpen] = useState(false);

//   return (
//     <header className="w-full bg-white border-b border-gray-200 shadow-sm">
//       <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-4">
        
//         {/* Logo */}
//         <Link to="/" className="">
//           <div className="flex items-center ">
//             <img  
//               src="CollabFlow-logo.png"
//               alt="CollabFlow"
              
//             />
//           </div>
//         </Link>

//         {/* Navigation */}
//         <nav className="hidden md:flex items-center space-x-8 text-gray-700 font-medium">
//           <Link to="/features" className="hover:text-indigo-600 transition">
         
//              Features 
//           </Link>

//           {/* Solutions Dropdown */}
//           <div className="relative">
//             <button
//               onClick={() => setOpen(!open)}
//               className="hover:text-indigo-600 transition"
//             >
//               Solutions
//             </button>

//             {open && (
//               <div className="absolute top-8 left-0 w-48 bg-white border rounded-lg shadow-lg py-2">
//                 <Link
//                   to="/solutions/startups"
//                   className="block px-4 py-2 hover:bg-gray-100"
//                 >
//                   Startups
//                 </Link>
//                 <Link
//                   to="/solutions/enterprise"
//                   className="block px-4 py-2 hover:bg-gray-100"
//                 >
//                   Enterprise
//                 </Link>
//                 <Link
//                   to="/solutions/agencies"
//                   className="block px-4 py-2 hover:bg-gray-100"
//                 >
//                   Agencies
//                 </Link>
//               </div>
//             )}
//           </div>

          
//         </nav>

//         {/* Right Side */}
//         <div className="flex items-center space-x-4">
//           <Link
//             to="/login"
//             className="text-gray-600 hover:text-indigo-600 font-medium"
//           >
//             Login
//           </Link>

//           <Link
//             to="/signup"
//             className="bg-indigo-600 text-white px-5 py-2 rounded-xl hover:bg-indigo-700 transition shadow-md"
//           >
//             Get Started
//           </Link>
//         </div>
//       </div>
//     </header>
//   );
// }

 