// src/components/WorkspaceSwitcher.tsx

import { useWorkspace } from "../context/WorkspaceProvider";
import { ChevronDown, Building2 } from "lucide-react";
import { useState } from "react";

export default function WorkspaceSwitcher() {
  const { workspaces, currentWorkspace, setCurrentWorkspace } = useWorkspace();
  // console.log("workspace related : ", {workspaces, currentWorkspace})
  const [open, setOpen] = useState(false);

 return (
  <div className="relative w-full min-w-0 sm:w-auto">

    {/* SWITCHER BUTTON */}
    <button
      type="button"
      onClick={() => setOpen((prev) => !prev)}
      aria-expanded={open}
      className="flex w-full min-w-0 items-center gap-2 rounded border-b bg-gray-50 px-3 py-3 text-left transition hover:bg-gray-100 sm:w-auto sm:py-2"
    >
      <Building2 size={18} className="shrink-0" />

      <span className="min-w-0 flex-1 truncate font-medium sm:max-w-48">
        {currentWorkspace
          ? `${currentWorkspace.name.split("@")[0]} Workspace`
          : "No Workspace"}
      </span>

      <ChevronDown
        size={16}
        className={`shrink-0 transition-transform ${
          open ? "rotate-180" : ""
        }`}
      />
    </button>

    {/* DROPDOWN */}
    {open && (
      <div className="absolute left-0 top-full z-50 mt-2 max-h-64 w-full min-w-0 overflow-y-auto rounded border border-gray-200 bg-white shadow-lg animate-fadeIn sm:w-56">

        {workspaces.map((ws) => (
          <button
            key={ws.id}
            type="button"
            onClick={() => {
              setCurrentWorkspace(ws);
              setOpen(false);
            }}
            className={`block w-full min-w-0 px-3 py-3 text-left text-sm transition hover:bg-gray-100 sm:py-2 ${
              currentWorkspace?.id === ws.id
                ? "bg-gray-200"
                : ""
            }`}
          >
            <span className="block wrap-break-word font-bold">
              {ws.name}
            </span>
          </button>
        ))}

        {workspaces.length === 0 && (
          <p className="px-3 py-3 text-sm text-gray-500">
            No workspaces available
          </p>
        )}

      </div>
    )}
  </div>
);
}
