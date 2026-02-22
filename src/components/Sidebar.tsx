//  


import { NavLink } from "react-router-dom";
import {
  Home,
  FolderKanban,
  FolderPlus,
  CheckSquare,
  Activity,
  Users,
} from "lucide-react";

interface SidebarProps {
   userRole?: "Owner" | "Member" | "Viewer";
  onAssignProjectClick: () => void;
}

export default function Sidebar({ userRole = "Owner", onAssignProjectClick }: SidebarProps) {
  // Base nav items
  const navItems: Array<{
    label: string;
    path?: string;      
    icon: React.ElementType;
    onClick?: () => void;
    showFor?: ("Owner" | "Member" | "Viewer")[]; // optional visibility
  }> = [
    { label: "Home",     path: "/",         icon: Home },
    { label: "Projects", path: "/projects", icon: FolderKanban },
    { label: "Tasks",    path: "/tasks",    icon: CheckSquare },
    { label: "Activity", path: "/activity", icon: Activity },
    // Owner-only Assign Project item
     
  ];

  return (
    <aside className="w-70 bg-gray-200 text-black  mt-6" >
      
      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems
          .filter(item => !item.showFor || item.showFor.includes(userRole!))
          .map(({ label, path, icon: Icon, onClick }) =>
            onClick ? (
              // Modal button
              <button
                key={label}
                onClick={onClick}
                className="flex items-center gap-3 px-4 py-2 rounded-md text-md font-medium text-blue-400 hover:bg-gray-300 hover:text-white w-full text-left"
              >
                <Icon size={28} />
                {label}
              </button>
            ) : (
              // Normal NavLink
             <NavLink
  key={path}
  to={path!}
  end={path === "/"}
>
  {({ isActive }) => (
    <div
      className={`flex items-center gap-3 px-4 py-2 rounded-md text-lg font-semibold transition
      ${
        isActive
          ? "bg-gray-300 text-black"
          : "text-black hover:bg-gray-300"
      }`}
    >
      <Icon
        size={28}
        className={`transition-colors duration-200
        ${
          isActive
            ? "text-blue-600"
            : "text-gray-500 hover:text-blue-500"
        }`}
      />
      {label}
    </div>
  )}
</NavLink>

 
            )
          )}
          {/* OWNER-ONLY ACTION BUTTON */}
         {userRole === "Owner" && (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();      // ⛔ stop navigation
        onAssignProjectClick();  // ✅ open modal
      }}
      className="
        flex items-center gap-3 px-4 py-2 rounded-md text-xl font-bold        text-blue-500 hover:bg-gray-800 hover:text-white
        w-full text-left transition
      "
    >
      <FolderPlus size={28} />
      Assign Project
    </button>
    )}
      </nav>
    </aside>
  );
}



// // import { NavLink } from "react-router-dom";
// // import AssignProject from "../components/AssignProject"; // <-- import new module
// // import {
// //   Home,
// //   FolderKanban,
// //   CheckSquare,
// //   FileText,
// //   Activity,
// //   Settings,
// // } from "lucide-react";


// // const navItems = [
// //   { label: "Home", path: "/", icon: Home },
// //   { label: "Projects", path: "/projects", icon: FolderKanban },
// //   { label: "Tasks", path: "/tasks", icon: CheckSquare },
// //   { label: "Files", path: "/files", icon: FileText },
// //   { label: "Activity", path: "/activity", icon: Activity },
// // ];

// // interface SidebarProps {
// //   userRole?: "Owner" | "Member" | "Viewer"; // optional, defaults to Owner for testing
// // }

// // export default function Sidebar({ userRole = "Owner" }: SidebarProps) {
// //   return (
// //     <aside className="w-64 bg-gray-200 text-black flex flex-col">
// //       {/* Logo */}
// //       <div className="h-14 flex items-center px-6 text-lg font-semibold border-b border-gray-300">
// //         CollabFlow
// //       </div>

// //       {/* Navigation */}
// //       <nav className="flex-1 px-3 py-4 space-y-1">
// //         {navItems.map(({ label, path, icon: Icon }) => (
// //           <NavLink
// //             key={path}
// //             to={path}
// //             end={path === "/"}
// //             className={({ isActive }) =>
// //               [
// //                 "flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition",
// //                 isActive
// //                   ? "bg-gray-400 text-white"
// //                   : "text-gray-400 hover:bg-gray-800 hover:text-white",
// //               ].join(" ")
// //             }
// //           >
// //             <Icon size={18} />
// //             {label}
// //           </NavLink>
// //         ))}
// //       </nav>

// //       {/* Owner-only Assign Project module */}
// //       {userRole === "Owner" && <AssignProject userRole={userRole} />}
// //     </aside>
// //   );
// // }


// // {/* Bottom section */}
// //       <div className="px-3 py-4 border-t border-gray-800">
// //         <NavLink
// //           to="/settings"
// //           className={({ isActive }) =>
// //             [
// //               "flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition",
// //               isActive
// //                 ? "bg-gray-800 text-white"
// //                 : "text-gray-400 hover:bg-gray-800 hover:text-white",
// //             ].join(" ")
// //           }
// //         >
// //           <Settings size={18} />
// //           Settings
// //         </NavLink>
// //       </div>




// // // src/components/Sidebar.tsx
// // import { NavLink } from "react-router-dom";

// // export default function Sidebar() {
// //   const linkClass =
// //     "block px-4 py-2 rounded text-sm text-gray-300 hover:bg-gray-700 hover:text-white";

// //   const activeClass =
// //     "bg-gray-800 text-white";

// //   return (
// //     <aside className="w-60 bg-gray-900 text-white flex flex-col">
// //       {/* Logo / App name */}
// //       <div className="h-14 flex items-center px-4 font-bold text-lg border-b border-gray-800">
// //         CollabFlow
// //       </div>

// //       {/* Navigation */}
// //       <nav className="flex-1 px-2 py-4 space-y-1">
// //         <NavLink
// //           to="/"
// //           className={({ isActive }) =>
// //             `${linkClass} ${isActive ? activeClass : ""}`
// //           }
// //           end
// //         >
// //           Dashboard
// //         </NavLink>

// //         <NavLink
// //           to="/upload"
// //           className={({ isActive }) =>
// //             `${linkClass} ${isActive ? activeClass : ""}`
// //           }
// //         >
// //           Upload
// //         </NavLink>
// //       </nav>

// //       {/* Footer */}
// //       <div className="px-4 py-3 text-xs text-gray-400 border-t border-gray-800">
// //         © 2026 CollabFlow
// //       </div>
// //     </aside>
// //   );
// // }
