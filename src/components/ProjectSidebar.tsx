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
  console.log("ProjectSidebar - projects : ", projects)
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
    <aside className="w-50 shrink-0 bg-gray-100 border-r p-7  space-y-4 ml-0.5 ">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Projects</h2>
      {role?.toLowerCase() === "owner" && (
        <button onClick={() => setShowModal(true)} className="p-1 rounded hover:bg-gray-200">
          <Plus size={18} />
        </button>
       )}  
      </div>
     
     
       <nav className="space-y-1">
         {projects.map((project) => (
          <button
             key={project.id}
             onClick={() => setCurrentProject(project)}
             className={`flex items-center gap-2 w-full px-3 py-2 rounded-md text-left
             ${
               currentProject?.id === project.id
                  ? "bg-indigo-500 text-white"
                  : "hover:bg-gray-200"
             }
             `}
           >
            <FolderKanban size={18} />
            {project.name}
          </button>
        ))}
       </nav> 
        {projects.length === 0 && (
        <p className="text-sm text-gray-500 text-center py-4">
          No project yet. Create one to get started.
        </p>
      )}
       <CreateProjectModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onCreate={handleCreate}
        />
        
    </aside>
  );
}

 