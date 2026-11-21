 import { Navigate, NavLink, useNavigate } from "react-router-dom";
 import { useState } from "react";
 import { useAuth } from "../context/AuthProvider2";
 import {useWorkspace} from "../context/WorkspaceProvider";
 import { UserCircle } from "lucide-react";
 import { useTheme } from "../context/ThemeProvider";

import {
  Home,
  FolderKanban,
  Activity,
  Users,
  Building2,
} from "lucide-react";


interface SidebarProps {
  userRole?: "Owner" | "Member" | "Viewer";
  onAssignProjectClick?: () => void;
}

export default function Sidebar({
  userRole,
  onAssignProjectClick,
}: SidebarProps) {

  const { user, logout } = useAuth();
  const [imageError, setImageError] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { role } = useWorkspace();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const capName = user?.email
                  ? user.email.charAt(0).toUpperCase() +
                    user.email.slice(1)
                  : "User";

  const navItems: Array<{
    label: string;
    path?: string;
    icon: React.ElementType;
    iconColor: string;
    onClick?: () => void;
    showFor?: ("Owner" | "Member" | "Viewer")[];
   }> = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: Home,
      iconColor: "text-indigo-600",
    },
    {
      label: "Workspaces",
      path: "/workspaces",
      icon: Building2,
      iconColor: "text-purple-600",
    },
    {
      label: "Projects",
      path: "/projects",
      icon: FolderKanban,
      iconColor: "text-green-600",
    },
    {
      label: "Activity",
      path: "/activity",
      icon: Activity,
      iconColor: "text-orange-600",
    },
    {
      label: "Members",
      path: "/members",
      icon: Users,
      iconColor: "text-sky-600",
    },
  ];
 
  const profileImage = user?.avatar || "";
  return (

   <aside className="lg:w-55 shrink-0  bg-gray-50 text-black  flex flex-col">

      {/* ========================= */}
      {/* NAVIGATION */}
      {/* ========================= */}
       <p>
        <img src="image2-vibrant.png" alt=""  className="h-16 lg:w-55 bg-gray-300 " />
       </p>
 

    {/* NAVIGATION */}
    <nav className="flex min-w-0 flex-1 flex-col gap-1 px-3 py-3 sm:py-4 lg:py-6">

      {navItems
        .filter(
          (item) =>
            !item.showFor ||
            (userRole && item.showFor.includes(userRole))
        )
        .map(
          ({
            label,
            path,
            icon: Icon,
            iconColor,
            onClick,
          }) =>
            onClick ? (
              <button
                key={label}
                type="button"
                onClick={onClick}
                className="group flex min-w-0 w-full items-center gap-3 rounded-md px-3 py-3 text-left text-sm font-semibold transition hover:bg-gray-300 sm:px-4 lg:gap-6 lg:py-4"
              >
                <Icon
                  size={24}
                  className={`shrink-0 transition-colors duration-200 ${iconColor} group-hover:text-blue-500`}
                />

                <span className="min-w-0 wrap-break-word">
                  {label}
                </span>
              </button>
            ) : (
              <NavLink
                key={path}
                to={path!}
                end={path === "/"}
              >
                {({ isActive }) => (
                  <div
                    className={`
                      group flex min-w-0 items-center gap-3
                      rounded-md px-3 py-3 text-sm font-semibold
                      transition sm:px-4 lg:py-2

                      ${
                        isActive
                          ? "bg-gray-200 text-black"
                          : "text-black hover:bg-gray-300"
                      }
                    `}
                  >
                    <Icon
                      size={24}
                      className={`
                        shrink-0 transition-colors duration-200
                        ${isActive ? "text-blue-600" : iconColor}
                        group-hover:text-blue-500
                      `}
                    />

                    <span className="min-w-0 wrap-break-word">
                      {label}
                    </span>
                  </div>
                )}
              </NavLink>
            )
        )}

    </nav>

    {/* USER MENU */}
    <div className="relative border-t border-gray-300 p-5">

      {/* USER BUTTON */}
      <button
        type="button"
        onClick={() => setShowUserMenu((prev) => !prev)}
        aria-expanded={showUserMenu}
        className="w-full rounded-md p-3 text-left transition hover:bg-gray-200"
      >
        <div className="flex min-w-0 items-center gap-3">

          {profileImage && !imageError ? (
            <img
              src={profileImage}
              alt="Profile"
              onError={() => setImageError(true)}
              className="h-9 w-9 shrink-0 rounded-full object-cover"
            />
          ) : (
            <UserCircle
              size={36}
              className="shrink-0 text-gray-500"
            />
          )}

          <div className="min-w-0 flex-1">

            <p className="truncate text-sm font-semibold text-gray-800">
              {user?.full_name || capName}
            </p>

            <p className="truncate text-xs text-gray-500">
              {user?.email}
            </p>

            <p className="mt-1 text-xs font-medium text-blue-600">
              {role}
            </p>

          </div>

        </div>
      </button>

      {/* DROPDOWN */}
      {showUserMenu && (
        <div
          className="
            absolute bottom-full left-3 right-3 z-50 mb-2
            overflow-hidden rounded-lg border border-gray-200
            bg-white shadow-lg
          "
        >

          {/* PROFILE */}
          <button
            type="button"
            onClick={() => {
              setShowUserMenu(false);
              navigate("/profile");
            }}
            className="w-full px-4 py-3 text-left text-sm transition hover:bg-gray-100"
          >
            Profile
          </button>

          {/* THEME */}
          <button
            type="button"
            onClick={() => {
              setShowUserMenu(false);
              setTheme(theme === "dark" ? "light" : "dark");
            }}
            className="w-full px-4 py-3 text-left text-sm transition hover:bg-gray-100"
          >
            Theme: {theme}
          </button>

          {/* LOGOUT */}
          <button
            type="button"
            onClick={() => {
              setShowUserMenu(false);
              logout();
            }}
            className="w-full px-4 py-3 text-left text-sm text-red-600 transition hover:bg-gray-100"
          >
            Logout
          </button>

        </div>
      )}

    </div>

  </aside>
);
}



     