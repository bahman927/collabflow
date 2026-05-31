// src/components/WorkspaceSwitcher.tsx

import { useWorkspace } from "../context/WorkspaceProvider";
import { ChevronDown, Building2 } from "lucide-react";
import { useState } from "react";

export default function WorkspaceSwitcher() {
  const { workspaces, currentWorkspace, setCurrentWorkspace } = useWorkspace();
  // console.log("workspace related : ", {workspaces, currentWorkspace})
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded hover:bg-gray-100 border-b transition"
      >
        <Building2 size={18} />
        <span className="font-medium">
          {currentWorkspace
            ? `${currentWorkspace.name.split("@")[0]} Workspace`
            : "No Workspace"}
        </span>

        <ChevronDown size={16} />
      </button>

      {open && (
        <div className="absolute mt-2 w-56 bg-white shadow-lg rounded border z-20 animate-fadeIn">
          {workspaces.map((ws) => (
            <button
              key={ws.id}
              onClick={() => {
                setCurrentWorkspace(ws);
                setOpen(false);
              }}
              className={`block w-full text-left px-3 py-2 hover:bg-gray-100 ${
                currentWorkspace?.id === ws.id ? "bg-gray-200" : ""
              }`}
            >
             <span className="font-bold "> {ws.name} </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
