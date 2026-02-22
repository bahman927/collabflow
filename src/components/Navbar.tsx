// src/components/Navbar.tsx
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useWorkspace } from "../hooks/useWorkspace";

export default function Navbar() {
  const { user, logout } = useAuth();
  const {
    workspaces,
    currentWorkspace,
    setCurrentWorkspace,
  } = useWorkspace();

  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  return (
    <header className="h-14 flex items-center justify-between px-6 bg-white border-b">
      {/* Left: Workspace selector */}
      <div className="relative">
        <button
          onClick={() => setWorkspaceOpen(!workspaceOpen)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-md border text-sm font-medium hover:bg-gray-50"
        >
          <span>{currentWorkspace?.name ?? "Select workspace"}</span>
          <span className="text-xs">▾</span>
        </button>

        {workspaceOpen && (
          <div className="absolute mt-2 w-56 bg-white border rounded-md shadow-lg z-10">
            {workspaces.map(ws => (
              <button
                key={ws.id}
                onClick={() => {
                  setCurrentWorkspace(ws.id);
                  setWorkspaceOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              >
                {ws.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right: User dropdown */}
      <div className="relative">
        <button
          onClick={() => setUserOpen(!userOpen)}
          className="flex items-center gap-3"
        >
          {/* Avatar */}
          <div className="h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-semibold">
            {user?.email?.[0].toUpperCase()}
          </div>
        </button>

        {userOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-10">
            <div className="px-4 py-2 border-b">
              <p className="text-sm font-medium">{user?.email}</p>
            </div>

            <button
              onClick={logout}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}




// // src/components/Navbar.tsx
// import { useAuth } from "../hooks/useAuth";

// export default function Navbar() {
//   const { user, logout } = useAuth();

//   return (
//     <header className="h-14 flex items-center justify-between px-6 border-b bg-white">
//       {/* Left */}
//       <div className="text-lg font-semibold text-gray-800">
//         CollabFlow
//       </div>

//       {/* Right */}
//       <div className="flex items-center gap-4">
//         <span className="text-sm text-gray-600">
//           {user?.email}
//         </span>

//         <button
//           onClick={logout}
//           className="text-sm px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600"
//         >
//           Logout
//         </button>
//       </div>
//     </header>
//   );
// }



// import { useAuth } from "../hooks/useAuth";

// const Navbar = () => {
//   const { user, logout } = useAuth();

//   return (
//     <header className="h-14 flex items-center justify-between px-6 border-b">
//       <h1 className="font-semibold text-lg">CollabFlow</h1>

//       {user && (
//         <button
//           onClick={logout}
//           className="text-sm text-red-600 hover:underline"
//         >
//           Logout
//         </button>
//       )}
//     </header>
//   );
// };

