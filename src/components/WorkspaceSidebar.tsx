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

 return (
  <aside className="ml-0 flex w-full min-w-0 shrink-0 flex-col gap-4 border-b border-gray-200 bg-gray-100 p-4 sm:p-5 lg:ml-1 lg:w-53 lg:border-b-0 lg:border-r lg:p-6">

    {/* HEADER */}
    <div className="flex items-center justify-between gap-2">
      <h2 className="text-lg font-semibold">Workspaces</h2>

      {(role?.toLowerCase() === "owner" || !role) && (
        <button
          type="button"
          onClick={() => setShowModal(true)}
          aria-label="Create workspace"
          title="Create workspace"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition hover:bg-gray-200"
        >
          <Plus size={18} />
        </button>
      )}
    </div>

    {/* WORKSPACE LIST */}
    <nav className="flex min-w-0 flex-col gap-1">
      {Array.isArray(workspaces) &&
        workspaces.map((ws) => (
          <button
            key={ws.id}
            type="button"
            onClick={() => setCurrentWorkspace(ws)}
            className={`flex min-w-0 w-full items-center justify-between gap-2 rounded-md px-3 py-3 text-left text-sm transition sm:py-2 ${
              currentWorkspace?.id === ws.id
                ? "bg-indigo-500 text-white"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            {/* WORKSPACE NAME */}
            <span className="flex min-w-0 flex-1 items-center gap-2">
              <Building2 size={18} className="shrink-0" />

              <span className="min-w-0 wrap-break-word">
                {ws.name}
              </span>
            </span>

            {/* PROJECT COUNT */}
            {projectsByWorkspace[ws.id] > 0 && (
              <span
                className={`shrink-0 rounded-full px-1.5 py-0.5 text-xs ${
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

    {/* EMPTY STATE */}
    {workspaces.length === 0 && (
      <p className="py-4 text-center text-sm text-gray-500">
        No workspaces yet. Create one to get started.
      </p>
    )}

    {/* CREATE WORKSPACE MODAL */}
    <CreateWorkspaceModal
      isOpen={showModal}
      onClose={() => setShowModal(false)}
      onCreate={handleCreate}
    />

  </aside>
);
}
