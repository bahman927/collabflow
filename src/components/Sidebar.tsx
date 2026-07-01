 
import { NavLink } from "react-router-dom";
import {
  Home,
  FolderKanban,
  LayoutDashboard,
  FolderPlus,
  CheckSquare,
  Activity,
  Users,
  Building2,
  Settings
 }
  from "lucide-react";

interface SidebarProps {
  userRole?: "Owner" | "Member" | "Viewer";
  onAssignProjectClick: () => void;
}

export default function Sidebar({ userRole = "Owner", onAssignProjectClick }: SidebarProps) {
  // Base nav items
  const navItems: Array<{
    label: string;
    color: string,
    path?: string;      
    icon: React.ElementType;
    onClick?: () => void;
    showFor?: ("Owner" | "Member" | "Viewer")[]; // optional visibility
  }> = [

  { label: "Dashboard", path: "/dashboard", icon: Home,  color: "#4f46e5" }, 
  { label: "Workspaces", path: "/workspaces", icon: Building2,  color: "#4f46e5" },
  { label: "Projects",  path: "/projects",  icon: FolderKanban, color: "#16a34a" },
  { label: "Activity",  path: "/activity",  icon: Activity,     color: "#ea580c" },
  { label: "Members",   path: "/members",   icon: Users,        color: "#0ea5e9" },
  { label: "Settings",   path: "/setting",   icon: Settings,        color: "#0ea5e9" },
];

  return (
    <aside className="w-48 bg-gray-50 text-black  mt-10" >
      
      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems
          .filter(item => !item.showFor || item.showFor.includes(userRole!))
          .map(({ label, path, icon: Icon,color, onClick }) =>
            onClick ? (
              // Modal button
              <button
                key={label}
                onClick={onClick}
                className="flex items-center gap-3 px-4 py-2 rounded-md font-bold text-2xl text-blue-400 hover:bg-gray-300 hover:text-white w-full text-left"
              >
                <Icon size={20}  color={color} />
                {label}
              </button>
           ) : (
              // Normal NavLink
              <NavLink key={path} to={path!} end={path === "/"}>
                    {({ isActive }) => (
                    <div  className={`flex items-center gap-3 px-4 py-2 rounded-md text-md font-semibold transition
                      ${isActive ? "bg-gray-200 text-black" : "text-black hover:bg-gray-300" }`}
                      >
                    <Icon
                      size={26}
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
       
      </nav>
    </aside>
  );
}


 