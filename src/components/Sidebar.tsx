 import { NavLink } from "react-router-dom";
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
  // const { theme, setTheme } = useTheme();

  const capName =
    user?.email
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

   
  

  const profileImage = user?.email
    ? `/${user.email.split("@")[0]}.JPG`
    : "";

  return (
    // <aside className=" left-38 bottom-25   w-55 shrink-0  bg-gray-50 text-black  flex flex-col">
    <aside className="w-55 shrink-0  bg-gray-50 text-black  flex flex-col">

      {/* ========================= */}
      {/* NAVIGATION */}
      {/* ========================= */}
       <p>
        <img src="image2-vibrant.png" alt=""  className="h-20 w-55 bg-gray-300 " />
       </p>
      <nav className="flex-1 px-3 py-6 space-y-1">
     
        {navItems
          .filter(
            item =>
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
                  onClick={onClick}
                  className="group flex items-center gap-6 px-4 py-6 rounded-md font-semibold w-full text-left hover:bg-gray-300"
                >
                  <Icon
                    size={26}
                    className={`
                      transition-colors duration-200
                      ${iconColor}
                      group-hover:text-blue-500
                    `}
                  />

                  {label}
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
                        group flex items-center gap-3
                        px-4 py-2 rounded-md
                        text-md font-semibold transition

                        ${
                          isActive
                            ? "bg-gray-200 text-black"
                            : "text-black hover:bg-gray-300"
                        }
                      `}
                    >
                      <Icon
                        size={26}
                        className={`
                          transition-colors duration-200

                          ${
                            isActive
                              ? "text-blue-600"
                              : iconColor
                          }

                          group-hover:text-blue-500
                        `}
                      />

                      {label}
                    </div>
                  )}
                </NavLink>
              )
          )}

      </nav>


      {/* ========================= */}
      {/* USER MENU */}
      {/* ========================= */}

      <div className="relative border-t border-gray-300 p-3">

        {/* USER BUTTON */}

        <button
          onClick={() =>
            setShowUserMenu(prev => !prev)
          }
          className="w-full text-left rounded-md p-2 hover:bg-gray-200 transition"
        >

          <div className="flex items-center gap-2">

            {profileImage && !imageError ? (
                <img
                  src={profileImage}
                  alt="profile"
                  onError={() => setImageError(true)}
                  className="w-8 h-8 rounded-full object-cover shrink-0"
                />
              ) : (
                <UserCircle
                  size={32}
                  className="text-gray-500 shrink-0"
                />
              )}

            <div className="min-w-0">

              <p className="text-sm font-semibold text-gray-800 truncate">
                {user?.full_name || capName}
              </p>

              <p className="text-xs text-gray-500 truncate">
                {user?.email}
              </p>
              <p className="text-xs text-blue-600 font-medium mt-1">
                  {role}
              </p>
              

            </div>

          </div>

        </button>


        {/* ========================= */}
        {/* DROPDOWN */}
        {/* ========================= */}

        {showUserMenu && (
          <div
            className="
              absolute
              bottom-full
              left-3
              right-3
              mb-4
              bg-white
              border
              border-gray-200
              rounded-lg
              shadow-lg
              overflow-hidden
              z-50
            "
          >

            {/* PROFILE */}

            <button
              onClick={() => {
                setShowUserMenu(false);

                // Navigate to profile later
              }}
              className="
                w-full
                text-left
                px-4
                py-3
                hover:bg-gray-100
                transition
              "
            >
              Profile
            </button>


            {/* THEME */}

            {/* <button
              onClick={() => {
                setShowUserMenu(false);
                setTheme(theme === "dark" ? "light" : "dark");
              }}
              className="
                w-full
                text-left
                px-4
                py-3
                hover:bg-gray-100
                transition
              "
            >
               Theme: {theme}
            </button> */}


            {/* LOGOUT */}

            <button
              onClick={() => {
                setShowUserMenu(false);
                logout();
              }}
              className="
                w-full
                text-left
                px-4
                py-3
                text-red-600
                hover:bg-gray-100
                transition
              "
            >
              Logout
            </button>

          </div>
        )}

      </div>

    </aside>
  );
}



     