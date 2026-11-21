// src/pages/Projects.tsx
import React from "react";

const Projects: React.FC = () => {
  const sampleProjects = [
    { id: 1, name: "Website Redesign" },
    { id: 2, name: "Mobile App Launch" },
    { id: 3, name: "Marketing Campaign" },
  ];

 return (
  <div className="min-h-screen min-w-0 bg-slate-50 p-3 sm:p-4 lg:p-6">
    <h1 className="mb-5 text-2xl font-bold text-slate-900 sm:mb-6 sm:text-3xl">
      Projects
    </h1>

    <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
      {sampleProjects.map((project) => (
        <div
          key={project.id}
          className="min-w-0 cursor-pointer rounded-lg bg-white p-4 shadow transition hover:shadow-lg sm:p-5 lg:p-6"
        >
          <h2 className="wrap-break-word text-lg font-semibold text-slate-800 sm:text-xl">
            {project.name}
          </h2>

          <p className="mt-2 wrap-break-word text-sm leading-relaxed text-slate-600 sm:text-base">
            Project description here...
          </p>
        </div>
      ))}
    </div>
  </div>
);
};

export default Projects;
