// src/components/ProjectSelector.tsx

import { useProject } from "../context/ProjectProvider";
import { ChevronDown } from "lucide-react";

export default function ProjectSelector() {
  const { projects, currentProject, setCurrentProject } = useProject();

  return (
  <div className="relative inline-block w-full min-w-0 sm:w-auto">

    {/* Project Selector Button */}
    <button
      type="button"
      className="flex w-full min-w-0 items-center justify-between gap-2 rounded-lg bg-gray-100 px-3 py-3 text-sm transition hover:bg-gray-200 sm:w-auto sm:py-2"
    >
      <span className="min-w-0 flex-1 truncate text-left font-medium sm:max-w-48">
        {currentProject?.name || "Select Project"}
      </span>

      <ChevronDown size={16} className="shrink-0" />
    </button>

    {/* Project Dropdown */}
    <div className="absolute left-0 top-full z-50 mt-1 max-h-64 w-full min-w-0 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg sm:w-56">
      {projects.map((project) => (
        <button
          key={project.id}
          type="button"
          onClick={() => setCurrentProject(project)}
          className={`block w-full min-w-0 px-3 py-3 text-left text-sm transition hover:bg-gray-100 sm:py-2 ${
            currentProject?.id === project.id
              ? "bg-gray-200 font-medium"
              : ""
          }`}
        >
          <span className="block wrap-break-word">
            {project.name}
          </span>
        </button>
      ))}

      {projects.length === 0 && (
        <p className="px-3 py-3 text-sm text-gray-500">
          No projects available
        </p>
      )}
    </div>
  </div>
);
}
