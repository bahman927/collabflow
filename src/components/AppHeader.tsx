// src/components/AppHeader.tsx

import { Link }          from "react-router-dom";
import { useState }      from "react";
import { useAuth }       from "../hooks/useAuth";
import WorkspaceSwitcher from "./WorkspaceSwitcher";
import { Bell }          from "lucide-react";

export default function AppHeader() {
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  // console.log("user  : ", user)

  return (
    <header className="w-full bg-white border-b shadow-sm flex justify-between items-center px-6 h-19">

      {/* Left Section: Logo + Workspace Switcher */}
      <div className="flex items-center gap-6">

        {/* Logo */}
        <Link
          to="/home" className="flex items-center gap-3">
          <img src="/CollabFlow-logo.png" className="h-19" alt="CollabFlow" />
          <h1 className="text-3xl font-bold">
            <span className="text-indigo-600">CollabFlow</span>
          </h1>
        </Link>

        {/* Workspace Switcher */}
        
      </div>
      <div>
         <WorkspaceSwitcher />
      </div>
      {/* <div>
        <Link
              to="/dashboard"
              className="block px-4 py-2 hover:bg-gray-100 text-blue-400 text-medium font-medium"
            >
              Dashboard
        </Link>
      </div> */}
      {/* Right Section: Notifications + Profile */}
      <div className="flex items-center gap-4">
 
        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 transition"
          >
            <div className="h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-semibold">
            {user?.email?.[0].toUpperCase()}
            </div>
            <span className="font-medium text-gray-700">
              Welcome {user?.full_name}
            </span>
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg py-2 animate-fadeIn">
              <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">
                Profile
              </Link>
              <Link to="/settings" className="block px-4 py-2 hover:bg-gray-100">
                Settings
              </Link>
              <button
              onClick={logout}
              className=" w-full  px-4 py-2  text-red-600 hover:bg-gray-100"
            >
              Logout
            </button>
             
            </div>
          )}
        </div>
      </div>
    </header>
  );
}






 