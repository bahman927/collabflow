import { Status } from "../types/type";


import { useState, useEffect, useRef } from "react";

export interface Project {
  id: number;
  name: string;
}

export interface Developer {
  id: number;
  name: string;
}

export interface AssignProjectProps {
  projects: Project[];
  developers: Developer[];
  onAssign: (data: {
    projectId: number;
    taskDescription: string;
    assignedTo: number[];
    status: Status;
  }) => void;
  onClose: () => void;
  userRole: "Owner" | "Member" | "Viewer";
}

export default function AssignProject({
  projects,
  developers,
  onAssign,
  onClose,
  userRole,
}: AssignProjectProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [selectedProject, setSelectedProject] = useState<number>(
    projects[0]?.id || 0
  );
  const [selectedDevelopers, setSelectedDevelopers] = useState<number[]>([]);
  const [taskDescription, setTaskDescription] = useState("");
  const [status, setStatus] = useState<Status>("To Do");

  // Close modal on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Close when clicking outside modal
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  // Toggle developer selection
  const toggleDeveloper = (id: number) => {
    setSelectedDevelopers((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  // Assign button handler
  const handleAssign = () => {
    if (!selectedProject || selectedDevelopers.length === 0 || !taskDescription) {
      alert("Please select a project, developers, and enter a task description.");
      return;
    }

    onAssign({
      projectId: selectedProject,
      assignedTo: selectedDevelopers,
      taskDescription,
      status,
    });

    // Reset form
    setSelectedProject(projects[0]?.id || 0);
    setSelectedDevelopers([]);
    setTaskDescription("");
    setStatus("To Do");
    onClose();
  };

  if (userRole !== "Owner") return null; // Only Owner can see this

 return (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-3 sm:p-5"
    onClick={handleOverlayClick}
  >
    <div
      ref={modalRef}
      className="flex max-h-[90dvh] w-full max-w-xl flex-col overflow-hidden rounded-xl bg-white shadow-xl"
    >
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-gray-100 px-4 py-3 sm:px-6 sm:py-4">
        <h2 className="min-w-0 wrap-break-word text-lg font-semibold sm:text-xl">
          Assign Project Task
        </h2>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="shrink-0 rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      {/* Scrollable Form Content */}
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6">

        {/* Project Selector */}
        <label className="mb-1 block text-sm font-medium">
          Project
        </label>

        <select
          className="mb-4 w-full min-w-0 rounded-lg border p-3 text-base sm:p-2 sm:text-sm"
          value={selectedProject}
          onChange={(e) => setSelectedProject(Number(e.target.value))}
        >
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        {/* Developers Multi-select */}
        <label className="mb-1 block text-sm font-medium">
          Assign to Developers
        </label>

        <div className="mb-4 max-h-40 overflow-y-auto rounded border p-2">
          {developers.map((dev) => (
            <label
              key={dev.id}
              className="flex items-start gap-3 rounded py-2 text-sm"
            >
              <input
                type="checkbox"
                checked={selectedDevelopers.includes(dev.id)}
                onChange={() => toggleDeveloper(dev.id)}
                className="mt-0.5 h-4 w-4 shrink-0"
              />
              <span className="min-w-0 wrap-break-word">
                {dev.name}
              </span>
            </label>
          ))}
        </div>

        {/* Task Description */}
        <label className="mb-1 block text-sm font-medium">
          Task Description
        </label>

        <textarea
          className="mb-4 w-full min-w-0 rounded-lg border p-3 text-base sm:p-2 sm:text-sm"
          rows={3}
          placeholder="Explain what the task does..."
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
        />

        {/* Status */}
        <label className="mb-1 block text-sm font-medium">
          Status
        </label>

        <select
          className="mb-4 w-full min-w-0 rounded-lg border p-3 text-base sm:p-2 sm:text-sm"
          value={status}
          onChange={(e) => setStatus(e.target.value as Status)}
        >
          <option>To Do</option>
          <option>In Progress</option>
          <option>Done</option>
          <option>Overdue</option>
        </select>
      </div>

      {/* Assign Button */}
      <div className="shrink-0 border-t border-gray-100 bg-white px-4 py-3 sm:px-6 sm:py-4">
        <button
          type="button"
          onClick={handleAssign}
          className="w-full rounded-lg bg-blue-600 py-3 text-sm font-medium text-white transition hover:bg-blue-700 sm:py-2"
        >
          Assign Task
        </button>
      </div>
    </div>
  </div>
);
}

