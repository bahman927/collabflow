// src/components/CreateTaskModal.tsx
import { useState } from "react";
import { Calendar, Flag } from "lucide-react";
import Modal from "./shared/Modal2";
import type { TaskPriority } from "../types/task";
import type { TaskCreateData } from "../types/task";
const PRIORITIES: { value: TaskPriority; label: string; dot: string }[] = [
  { value: "low",    label: "Low",    dot: "bg-blue-400" },
  { value: "medium", label: "Medium", dot: "bg-yellow-400" },
  { value: "high",   label: "High",   dot: "bg-orange-500" },
  { value: "urgent", label: "Urgent", dot: "bg-red-500" },
];

import type { CreateTaskModalData } from "../types/task";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: CreateTaskModalData) => Promise<void>;
}

export default function CreateTaskModal({ isOpen, onClose, onCreate }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setName("");
    setDescription("");
    setPriority("medium");
    setDueDate("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      await onCreate({
        name: name.trim(),
        description: description.trim(),
        priority,
        due_date: dueDate || null,
      });
      resetForm();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create Task">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Task Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Task Name
          </label>
          <input
            autoFocus
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Design homepage mockup"
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description{" "}
            <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What needs to be done?"
            rows={3}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition resize-none"
          />
        </div>

        {/* Priority & Due Date — side by side */}
        <div className="grid grid-cols-2 gap-4">
          {/* Priority */}
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1">
              <Flag size={14} />
              Priority
            </label>
            <div className="flex flex-wrap gap-1.5">
              {PRIORITIES.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setPriority(p.value)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition
                    ${
                      priority === p.value
                        ? "border-indigo-500 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-500"
                        : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                >
                  <span className={`w-2 h-2 rounded-full ${p.dot}`} />
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1">
              <Calendar size={14} />
              Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
            {dueDate && (
              <button
                type="button"
                onClick={() => setDueDate("")}
                className="text-[11px] text-gray-400 hover:text-gray-600 mt-1"
              >
                Clear date
              </button>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2 border-t">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!name.trim() || loading}
            className="px-5 py-2 text-sm rounded-lg bg-indigo-600 text-white font-medium
                       hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating…
              </span>
            ) : (
              "Create Task"
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}






// // src/components/CreateTaskModal.tsx
// import { useState } from "react";
// import Modal from "./shared/Modal2";

// interface Props {
//   isOpen: boolean;
//   onClose: () => void;
//   onCreate: (data: { name: string; description: string }) => Promise<void>;
// }

// export default function CreateTaskModal({ isOpen, onClose, onCreate }: Props) {
//   const [name, setName] = useState("");
//   const [description, setDescription] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!name.trim()) return;

//     setLoading(true);
//     await onCreate({ name: name.trim(), description: description.trim() });
//     setLoading(false);
//     setName("");
//     setDescription("");
//     onClose();
//   };

//   return (
//     <Modal isOpen={isOpen} onClose={onClose} title="Create Task">
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Task Name
//           </label>
//           <input
//             autoFocus
//             type="text"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             placeholder="e.g. Design homepage mockup"
//             className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-yellow-100"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Description (optional)
//           </label>
//           <textarea
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             placeholder="What needs to be done?"
//             rows={3}
//             className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-yellow-100"
//           />
//         </div>

//         <div className="flex justify-end gap-2 pt-2">
//           <button
//             type="button"
//             onClick={onClose}
//             className="px-4 py-2 text-sm rounded-md border hover:bg-gray-50"
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             disabled={!name.trim() || loading}
//             className="px-4 py-2 text-sm rounded-md bg-blue-500 text-white hover:bg-indigo-600 disabled:opacity-50"
//           >
//             {loading ? "Creating..." : "Create"}
//           </button>
//         </div>
//       </form>
//     </Modal>
//   );
// }
