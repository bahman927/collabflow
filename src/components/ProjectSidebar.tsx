// src/components/ProjectSidebar.tsx
import { Link } from "react-router-dom";
import { useProject }         from "../context/ProjectProvider";
import { FolderKanban, Plus } from "lucide-react";
import { useWorkspace }       from "../context/WorkspaceProvider";
import { useTask }            from "../context/TaskProvider";
import {Task}                 from  "../types/task"
import { useState } from "react";
import CreateProjectModal from "./CreateProjectModal";

export default function ProjectSidebar() {
  const {currentWorkspace, workspaces, role} = useWorkspace()
  const { tasks } = useTask();
  const [showModal, setShowModal] = useState(false);
  const {
    projects,
    currentProject,
    setCurrentProject,
    createProject,
  } = useProject();
  const handleCreate = async (data: { name: string; description: string }) => {
      await createProject({
        ...data,
        workspace_id: currentWorkspace?.id!,
      });
    };
  
  const tasksByProject = tasks.reduce((acc, task) => {
    if (!acc[task.project_id]) acc[task.project_id] = [];
    acc[task.project_id].push(task);
    return acc;
  }, {} as Record<number, Task[]>);

 return (
  <aside className="flex w-full min-w-0 shrink-0 flex-col gap-4 border-b border-gray-200 bg-gray-100 p-4 sm:p-5 lg:w-50 lg:border-b-0 lg:border-r lg:p-7">

    {/* Header */}
    <div className="flex items-center justify-between gap-2">
      <h2 className="text-lg font-semibold text-gray-800">
        Projects
      </h2>

      {role?.toLowerCase() === "owner" && (
        <button
          type="button"
          onClick={() => setShowModal(true)}
          aria-label="Create project"
          title="Create project"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition hover:bg-gray-200"
        >
          <Plus size={18} />
        </button>
      )}
    </div>

    {/* Project Navigation */}
    <nav className="flex min-w-0 flex-col gap-1">
      {projects.map((project) => (
        <button
          key={project.id}
          type="button"
          onClick={() => setCurrentProject(project)}
          className={`flex min-w-0 w-full items-center gap-2 rounded-md px-3 py-3 text-left text-sm transition sm:py-2 ${
            currentProject?.id === project.id
              ? "bg-indigo-500 text-white"
              : "text-gray-700 hover:bg-gray-200"
          }`}
        >
          <FolderKanban size={18} className="shrink-0" />

          <span className="min-w-0 flex-1 wrap-break-word">
            {project.name}
          </span>
        </button>
      ))}
    </nav>

    {/* Empty State */}
    {projects.length === 0 && (
      <p className="py-4 text-center text-sm text-gray-500">
        No project yet. Create one to get started.
      </p>
    )}

    {/* Create Project Modal */}
    <CreateProjectModal
      isOpen={showModal}
      onClose={() => setShowModal(false)}
      onCreate={handleCreate}
    />

  </aside>
);
}

 