import React       from "react";
import ProjectItem from "./ProjectItem";
import { useProject } from "@/context/ProjectProvider";


 
const DashboardLayout: React.FC = () => {
  const { projects } = useProject();
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>

        <input
          type="text"
          placeholder="Search…"
          className="px-4 py-2 border rounded-lg"
        />
      </div>

      {/* Status buttons */}
      <div className="flex gap-3">
        {["All", "Active", "Completed", "Archived"].map((s) => (
          <button
            key={s}
            className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-indigo-100"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Projects */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
       {projects.map((project) => (
         <ProjectItem
            key={project.id}
            task={project}
            taskId={project.id}
            title={project.title}
            status={project.status}
            onDelete={handleDeleteTask}
/>

))}

      </div>
    </div>
  );
};

export default DashboardLayout;
