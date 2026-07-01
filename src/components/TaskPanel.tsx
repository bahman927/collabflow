// src/components/TaskPanel.tsx

import { useTask }    from "../context/TaskProvider";
import { TaskStatus } from "../types/task";
import { ClipboardList } from "lucide-react";

const STATUS_OPTIONS: { value: TaskStatus; label: string; color: string }[] = [
  { value: "todo",        label: "To Do",        color: "bg-gray-400 text-gray-800" },
  { value: "in_progress", label: "In Progress",  color: "bg-blue-500 text-blue-800" },
  { value: "done",        label: "Done",         color: "bg-green-500 text-green-800" },
  { value: "overdue",     label: "Overdue",      color: "bg-red-500 text-red-800" },
];

const AVATAR_COLORS = [
  "bg-blue-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-teal-500",
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function TaskPanel() {
  const { currentTask, moveTask } = useTask();

  // ── No task selected ──
  if (!currentTask) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-3">
        <ClipboardList size={48} />
        <p className="text-lg">Select a task to view details</p>
      </div>
    );
  }

  const currentStatus = STATUS_OPTIONS.find(
    (s) => s.value === currentTask.status
  );

  const handleStatusChange = async (newStatus: TaskStatus) => {
    try {
      // await moveTask(String(currentTask.id), newStatus);
      await moveTask(currentTask.id, newStatus);
    } catch (err: any) {
      console.error("STATUS UPDATE ERROR:", err);
      alert(err?.message || "Failed to update status");
    }
  };

  return (
    <div className="flex-1 p-8 max-w-3xl space-y-6">
      {/* ── Header ── */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">{currentTask.name}</h1>
        {currentTask.description && (
          <p className="text-gray-500">{currentTask.description}</p>
        )}
      </div>

      {/* ── Status ── */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Status</label>
        <div className="flex gap-2 flex-wrap ">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleStatusChange(opt.value)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium bg-amber-500 transition
                ${
                  currentTask.status === opt.value
                    ? `${opt.color} ring-2 ring-offset-1 ring-indigo-400`
                    : "bg-gray-200 text-gray-500 hover:bg-gray-200"
                }
              `}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Assignees ── */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Assignees</label>

        {currentTask.assignees?.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {currentTask.assignees.map((person, i) => (
              <div
                key={person.id}
                className="flex items-center gap-2 bg-gray-100 rounded-full pl-1 pr-3 py-1"
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white
                    ${AVATAR_COLORS[i % AVATAR_COLORS.length]}
                  `}
                >
                  {getInitials(person.name)}
                </div>
                <span className="text-sm text-gray-700">{person.name}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400 italic">No one assigned</p>
        )}
      </div>

      {/* ── Metadata ── */}
      <div className="border-t pt-4 text-sm text-gray-400 space-y-1">
        <p>Created: {new Date(currentTask.created_at).toLocaleDateString()}</p>
        <p>Updated: {new Date(currentTask.updated_at).toLocaleDateString()}</p>
      </div>
    </div>
  );
}
