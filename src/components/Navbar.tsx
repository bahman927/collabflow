// // src/components/Navbar.tsx

import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useWorkspace } from "../hooks/useWorkspace";

export default function Navbar() {
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  const { user, logout } = useAuth();

  const {
    workspaces,
    currentWorkspace,
  } = useWorkspace();

  return (
    <header className="min-h-14 flex items-center justify-between gap-2 px-3 sm:px-6 py-2 bg-white border-b">

      {/* Left: Workspace selector */}
      <div className="relative min-w-0">
        <button
          type="button"
          onClick={() => {
            setWorkspaceOpen(!workspaceOpen);
            setUserOpen(false);
          }}
          className="flex items-center gap-2 max-w-55 sm:max-w-xs px-3 py-2 rounded-md border text-sm font-medium hover:bg-gray-50"
        >
          <span className="truncate">
            {currentWorkspace?.name ?? "Select workspace"}
          </span>

          <span className="text-emerald-500 shrink-0">▾</span>
        </button>

        {workspaceOpen && (
          <div className="absolute left-0 top-full mt-2 w-56 max-w-[calc(100vw-24px)] bg-white border rounded-md shadow-lg z-50 max-h-64 overflow-y-auto">

            {workspaces.length > 0 ? (
              workspaces.map(ws => (
                <button
                  key={ws.id}
                  type="button"
                  onClick={() => {
                    setWorkspaceOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 text-sm hover:bg-gray-100"
                >
                  {ws.name}
                </button>
              ))
            ) : (
              <p className="px-4 py-3 text-sm text-gray-500">
                No workspaces available
              </p>
            )}
          </div>
        )}
      </div>

      {/* Right: User dropdown */}
      <div className="relative shrink-0">
        <button
          type="button"
          onClick={() => {
            setUserOpen(!userOpen);
            setWorkspaceOpen(false);
          }}
          className="flex items-center gap-2 p-1.5 rounded-md hover:bg-gray-100"
          aria-label="User menu"
          aria-expanded={userOpen}
        >
          <div className="h-9 w-9 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-semibold">
            {user?.email?.[0]?.toUpperCase() ?? "U"}
          </div>

          <span className="hidden sm:block text-sm font-medium text-gray-700">
            {user?.full_name}
          </span>

          <span className="hidden sm:block text-gray-500">▾</span>
        </button>

        {userOpen && (
          <div className="absolute right-0 top-full mt-2 w-56 max-w-[calc(100vw-24px)] bg-white border rounded-md shadow-lg z-50">

            <div className="px-4 py-3 border-b">
              <p className="text-sm font-medium text-gray-800 truncate">
                {user?.full_name}
              </p>

              <p className="text-xs text-gray-500 break-all">
                {user?.email}
              </p>
            </div>

            <button
              type="button"
              onClick={logout}
              className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}



// import { useState } from "react";
// import { useAuth } from "../hooks/useAuth";
// import { useWorkspace } from "../hooks/useWorkspace";

// export default function Navbar() {
//   const [workspaceOpen, setWorkspaceOpen] = useState(false);
//   const [userOpen, setUserOpen] = useState(false);
//   const { user, logout } = useAuth();

//   const {
//     workspaces,
//     currentWorkspace,
//   } = useWorkspace();

  

//   return (
//     <header className="h-14 flex items-center justify-between px-6 bg-white border-b">
//       {/* Left: Workspace selector */}
//       <div className="relative">
//         <button
//           onClick={() => setWorkspaceOpen(!workspaceOpen)}
//           className="flex items-center gap-2 px-3 py-1.5 rounded-md border text-sm font-medium hover:bg-gray-50"
//         >
//           <span>{currentWorkspace?.name ?? "Select workspace"}</span>
//           <span className="text-emerald-300">▾</span>
//         </button>

//         {workspaceOpen && (
//           <div className="absolute mt-2 w-56 bg-white border rounded-md shadow-lg z-10">
//             {workspaces.map(ws => (
//               <button
//                 key={ws.id}
//                 onClick={() => {
//                   setWorkspaceOpen(false);
//                 }}
//                 className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
//               >
//                 {ws.name}
//               </button>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Right: User dropdown */}
//       <div className="relative">
//         <button
//           onClick={() => setUserOpen(!userOpen)}
//           className="flex items-center gap-3"
//         >
//           {/* Avatar */}
//           <div className="h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-semibold">
//             {user?.email?.[0].toUpperCase()}
//           </div>
//         </button>

//         {userOpen && (
//           <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-10">
//             <div className="px-4 py-2 border-b">
//               <p className="text-sm font-medium">{user?.email}</p>
//             </div>

//             <button
//               onClick={logout}
//               className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
//             >
//               Logout
//             </button>
//           </div>
//         )}
//       </div>
//     </header>
//   );
// }



 