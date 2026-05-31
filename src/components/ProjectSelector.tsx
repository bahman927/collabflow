// src/components/ProjectSelector.tsx

import { useProject } from "../context/ProjectProvider";
import { ChevronDown } from "lucide-react";

export default function ProjectSelector() {
  const { projects, currentProject, setCurrentProject } = useProject();

  return (
    <div className="relative inline-block">
      <button className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded hover:bg-gray-200">
        <span>{currentProject?.name || "Select Project"}</span>
        <ChevronDown size={16} />
      </button>

      <div className="absolute mt-1 w-48 bg-white shadow-lg rounded border z-10">
        {projects.map((project) => (
          <button
            key={project.id}
            onClick={() => setCurrentProject(project)}
            className={`block w-full text-left px-3 py-2 hover:bg-gray-100 ${
              currentProject?.id === project.id ? "bg-gray-200" : ""
            }`}
          >
            {project.name}
          </button>
        ))}
      </div>
    </div>
  );
}
