// src/pages/Projects.tsx
import React from "react";

const Projects: React.FC = () => {
  const sampleProjects = [
    { id: 1, name: "Website Redesign" },
    { id: 2, name: "Mobile App Launch" },
    { id: 3, name: "Marketing Campaign" },
  ];

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">Projects</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sampleProjects.map((project) => (
          <div
            key={project.id}
            className="rounded-lg bg-white p-6 shadow hover:shadow-lg transition cursor-pointer"
          >
            <h2 className="text-xl font-semibold text-slate-800">
              {project.name}
            </h2>
            <p className="text-slate-600 mt-2">Project description here...</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
