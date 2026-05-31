// src/components/WorkspaceSidebar.tsx
import { useWorkspace } from "../context/WorkspaceProvider";
import { useProject }   from "../context/ProjectProvider";
import { Building2, Plus } from "lucide-react";
import { useState } from "react";
import CreateWorkspaceModal from "./CreateWorkspaceModal";

export default function WorkspaceSidebar() {
  const {
    workspaces,
    currentWorkspace,
    setCurrentWorkspace,
    createWorkspace,
    role
  } = useWorkspace();

  const { projects } = useProject();
  const [showModal, setShowModal] = useState(false);

  const handleCreate = async (data: { name: string; description: string }) => {
  await createWorkspace(data);
};

  // Count projects per workspace
  const projectsByWorkspace = projects.reduce((acc, project) => {
    const wsId = project.workspace;
    if (!acc[wsId]) acc[wsId] = 0;
    acc[wsId]++;
    return acc;
  }, {} as Record<number, number>);

  console.log("role : ", role)

  return (
    <aside className="w-64 bg-gray-100 border-r p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Workspaces</h2>
        {role?.toLowerCase() === "owner" && (
            <button onClick={() => setShowModal(true)} className="p-1 rounded hover:bg-gray-200">
              <Plus size={18} />
            </button>
        )}
      </div>

      <nav className="space-y-1">
        {workspaces.map((ws) => (
          <button
            key={ws.id}
            onClick={() => setCurrentWorkspace(ws)}
            className={`flex items-center justify-between w-full px-3 py-2 rounded-md text-left
              ${
                currentWorkspace?.id === ws.id
                  ? "bg-indigo-500 text-white"
                  : "hover:bg-gray-200"
              }
            `}
          >
            <span className="flex items-center gap-2">
              <Building2 size={18} />
              {ws.name}
            </span>
            {projectsByWorkspace[ws.id] > 0 && (
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full ${
                  currentWorkspace?.id === ws.id
                    ? "bg-indigo-400 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {projectsByWorkspace[ws.id]}
              </span>
            )}
          </button>
        ))}
      </nav>

      {workspaces.length === 0 && (
        <p className="text-sm text-gray-500 text-center py-4">
          No workspaces yet. Create one to get started.
        </p>
      )}
      <CreateWorkspaceModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onCreate={handleCreate}
      />
    </aside>
  );
}
