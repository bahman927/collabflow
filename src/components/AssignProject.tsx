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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={handleOverlayClick}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-xl shadow-xl w-full max-w-xl p-6"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Assign Project Task</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-lg"
          >
            ✕
          </button>
        </div>

        {/* Project Selector */}
        <label className="block mb-1 text-sm font-medium">Project</label>
        <select
          className="w-full border rounded-lg p-2 mb-4"
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
        <label className="block mb-1 text-sm font-medium">Assign to Developers</label>
        <div className="mb-4 max-h-32 overflow-y-auto border rounded p-2 space-y-1">
          {developers.map((dev) => (
            <label key={dev.id} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={selectedDevelopers.includes(dev.id)}
                onChange={() => toggleDeveloper(dev.id)}
              />
              {dev.name}
            </label>
          ))}
        </div>

        {/* Task Description */}
        <label className="block mb-1 text-sm font-medium">Task Description</label>
        <textarea
          className="w-full border rounded-lg p-2 mb-4"
          rows={3}
          placeholder="Explain what the task does..."
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
        />

        {/* Status */}
        <label className="block mb-1 text-sm font-medium">Status</label>
        <select
          className="w-full border rounded-lg p-2 mb-4"
          value={status}
          onChange={(e) => setStatus(e.target.value as Status)}
        >
          <option>To Do</option>
          <option>In Progress</option>
          <option>Done</option>
          <option>Overdue</option>
        </select>

        {/* Assign Button */}
        <button
          onClick={handleAssign}
          className="w-full bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700 transition"
        >
          Assign Task
        </button>
      </div>
    </div>
  );
}


// interface AssignProjectProps {
//   userRole: "Owner" | "Member" | "Viewer";
// }



// interface AssignProjectProps {
//   projects: { id: number; name: string }[];
//   onAssign: (payload: {
//     projectId: number;
//     taskTitle: string;
//     assignedTo: string;
//     status: Status;
//   }) => void;
// }

// export default function AssignProject({ projects, onAssign }: AssignProjectProps) {
//   const [projectId, setProjectId] = useState<number>(projects[0]?.id);
//   const [taskTitle, setTaskTitle] = useState("");
//   const [assignedTo, setAssignedTo] = useState("");
//   const [status, setStatus] = useState<Status>("To Do");

//   return (
//     <div className="space-y-4">
//       <h2 className="text-xl font-semibold">Assign Project Task</h2>

//       {/* Project */}
//       <select
//         className="w-full border rounded-lg p-2"
//         value={projectId}
//         onChange={(e) => setProjectId(Number(e.target.value))}
//       >
//         {projects.map(p => (
//           <option key={p.id} value={p.id}>{p.name}</option>
//         ))}
//       </select>

//       {/* Task */}
//       <input
//         className="w-full border rounded-lg p-2"
//         placeholder="Task title"
//         value={taskTitle}
//         onChange={(e) => setTaskTitle(e.target.value)}
//       />

//       {/* Developer */}
//       <input
//         className="w-full border rounded-lg p-2"
//         placeholder="Assign to (name or ID)"
//         value={assignedTo}
//         onChange={(e) => setAssignedTo(e.target.value)}
//       />

//       {/* Status */}
//       <select
//         className="w-full border rounded-lg p-2"
//         value={status}
//         onChange={(e) => setStatus(e.target.value as Status)}
//       >
//         <option>To Do</option>
//         <option>In Progress</option>
//         <option>Done</option>
//         <option>Overdue</option>
//       </select>

//       <button
//         onClick={() =>
//           onAssign({ projectId, taskTitle, assignedTo, status })
//         }
//         className="w-full bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700"
//       >
//         Assign Task
//       </button>
//     </div>
//   );
// }


// const AssignProject: React.FC<AssignProjectProps> = ({ userRole }) => {
//   const [selectedProject, setSelectedProject] = useState<number | "">("");
//   const [selectedDevelopers, setSelectedDevelopers] = useState<number[]>([]);
//   const [taskDescription, setTaskDescription] = useState("");

//   // Handle developer checkbox toggle
//   const toggleDeveloper = (id: number) => {
//     setSelectedDevelopers(prev =>
//       prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
//     );
//   };

//   // Handle assign button click
//   const handleAssign = () => {
//     if (!selectedProject || selectedDevelopers.length === 0 || !taskDescription) {
//       alert("Please select project, developers, and enter task description");
//       return;
//     }

//     // Frontend placeholder: log the assignment
//     console.log({
//       projectId: selectedProject,
//       developers: selectedDevelopers,
//       taskDescription,
//     });

//     // Reset form
//     setSelectedProject("");
//     setSelectedDevelopers([]);
//     setTaskDescription("");
//     alert("Project assigned to developers (frontend only)");
//   };

//   if (userRole !== "Owner") return null; // Only show for Owner

//   return (
//     <div className="bg-white p-4 rounded-xl shadow mt-4">
//       <h3 className="font-semibold text-lg mb-2">Assign Project</h3>

//       {/* Project selector */}
//       <label className="block mb-2 text-sm font-medium">Select Project</label>
//       <select
//         className="w-full border rounded px-2 py-1 mb-4"
//         value={selectedProject}
//         onChange={e => setSelectedProject(Number(e.target.value))}
//       >
//         <option value="">-- Choose a project --</option>
//         {projects.map(p => (
//           <option key={p.id} value={p.id}>
//             {p.name}
//           </option>
//         ))}
//       </select>

//       {/* Developers multi-select */}
//       <label className="block mb-2 text-sm font-medium">Select Developers</label>
//       <div className="mb-4 space-y-1">
//         {developers.map(dev => (
//           <label key={dev.id} className="flex items-center gap-2 text-sm">
//             <input
//               type="checkbox"
//               checked={selectedDevelopers.includes(dev.id)}
//               onChange={() => toggleDeveloper(dev.id)}
//             />
//             {dev.name}
//           </label>
//         ))}
//       </div>

//       {/* Task description */}
//       <label className="block mb-2 text-sm font-medium">Task Description</label>
//       <textarea
//         className="w-full border rounded px-2 py-1 mb-4"
//         rows={3}
//         placeholder="Explain what the tasks do..."
//         value={taskDescription}
//         onChange={e => setTaskDescription(e.target.value)}
//       />

//       {/* Assign button */}
//       <button
//         className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
//         onClick={handleAssign}
//       >
//         Assign
//       </button>
//     </div>
//   );
// };

// export default AssignProject;
