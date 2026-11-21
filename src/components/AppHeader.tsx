// // src/components/AppHeader.tsx

import { Link }          from "react-router-dom";
import { useState }      from "react";
import { useAuth }       from "../hooks/useAuth";
import WorkspaceSwitcher from "./WorkspaceSwitcher";
import { Bell, UserCircle }          from "lucide-react";

export default function AppHeader() {
  const [profileOpen, setProfileOpen] = useState(false);
  const { user } = useAuth();

  const capName = user?.full_name;
  const [imageError, setImageError] = useState(false);

  const profileImage = user?.avatar || "";

  return (
    <header className="w-full bg-white border-b shadow-sm mt-2 mb-4">

      {/* Main Header Row */}
      <div className="flex items-center justify-between px-3 sm:px-5 lg:px-6 min-h-16 sm:min-h-20">

        {/* Logo */}
        <Link to="/home" className="flex items-center gap-2 shrink-0">
          <img
            src="/CollabFlow-logo.png"
            className="h-12 w-24 sm:h-16 sm:w-32 lg:h-20 lg:w-40 object-contain"
            alt="CollabFlow"
          />

          <h1 className="hidden sm:block text-xl lg:text-3xl font-bold">
            <span className="text-indigo-600">CollabFlow</span>
          </h1>
        </Link>

        {/* Desktop Workspace Switcher */}
        <div className="hidden sm:block">
          <WorkspaceSwitcher />
        </div>

        {/* Profile */}
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 px-2 sm:px-3 py-2 rounded hover:bg-gray-100 transition"
          >
            <div className="h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center">
              {profileImage && !imageError ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  onError={() => setImageError(true)}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <UserCircle size={32} className="text-gray-500" />
              )}
            </div>

            <span className="hidden sm:block font-medium text-blue-700">
              Welcome {capName}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Workspace Switcher */}
      <div className="sm:hidden px-3 pb-3">
        <WorkspaceSwitcher />
      </div>

    </header>
  );
}






// import { Link }          from "react-router-dom";
// import { useState }      from "react";
// import { useAuth }       from "../hooks/useAuth";
// import WorkspaceSwitcher from "./WorkspaceSwitcher";
// import { Bell, UserCircle }          from "lucide-react";

// export default function AppHeader() {
//   const [profileOpen, setProfileOpen] = useState(false);
//   const { user } = useAuth();
//   const name = user?.email.split("@")[0] ?? "";
//   // const capName = name?.charAt(0).toUpperCase() + name.slice(1);
//    const capName = user?.full_name
//   const [imageError, setImageError] = useState(false);

//   const profileImage = user?.avatar || "";

//   return (
//     <header className="w-full  bg-white border-b shadow-sm flex justify-between items-center mt-3 mb-4   h-22">

//       {/* Left Section: Logo + Workspace Switcher */}
//       <div className="flex items-center gap-6 ">

//         {/* Logo */}
//         <Link
//           to="/home" className="flex items-center gap-3">
//           <img src="/CollabFlow-logo.png" className="h-22 w-40" alt="CollabFlow" />
//           <h1 className="text-3xl font-bold">
//             <span className="text-indigo-600">CollabFlow</span>
//           </h1>
//         </Link>

//         {/* Workspace Switcher */}
        
//       </div>
//       <div>
//          <WorkspaceSwitcher />
//       </div>
      
//       <div className="flex items-center gap-4">
 
//         {/* Profile */}
//         <div className="relative">
//           <button
//             onClick={() => setProfileOpen(!profileOpen)}
//             className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 transition"
//           >
//             <div className="h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-semibold">
//             {profileImage && !imageError ? (
//             <img
//                   src={profileImage}
//                   alt="profile"
//                   onError={() => setImageError(true)}
//                   className="w-8 h-8 rounded-full object-cover shrink-0"
//                 />
//               ) : (
//                 <UserCircle
//                       size={32}
//                   className="text-gray-500 shrink-0"
//                 />
//               )}
            
//             </div>
//             <span className="font-medium text-blue-700">
//               Welcome {capName}
//             </span>
//           </button>

           
//         </div>
//       </div>
//     </header>
//   );
// }






 