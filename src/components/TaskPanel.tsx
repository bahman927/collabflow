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
  // console.log("TaskPanel - currentTask:", currentTask)

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
  <div className="min-w-0 w-full max-w-3xl flex-1 space-y-6 p-4 sm:p-6 lg:p-8">

    {/* HEADER */}
    <div className="min-w-0 space-y-2">
      <h1 className="wrap-break-word text-xl font-bold sm:text-2xl">
        {currentTask.name}
      </h1>

      {currentTask.description && (
        <p className="wrap-break-word text-sm leading-relaxed text-gray-500 sm:text-base">
          {currentTask.description}
        </p>
      )}
    </div>

    {/* STATUS */}
    <div className="space-y-3">
      <label className="text-sm font-medium text-gray-700">
        Status
      </label>

      <div className="flex flex-wrap gap-2">
        {STATUS_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => handleStatusChange(opt.value)}
            className={`rounded-full px-3 py-2 text-xs font-medium transition sm:px-4 sm:py-1.5 sm:text-sm ${
              currentTask.status === opt.value
                ? `${opt.color} ring-2 ring-offset-1 ring-indigo-400`
                : "bg-gray-200 text-gray-500 hover:bg-gray-300"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>

    {/* ASSIGNEES */}
    <div className="space-y-3">
      <label className="text-sm font-medium text-gray-700">
        Assignees
      </label>

      {currentTask.assignees?.length > 0 ? (
        <div className="flex min-w-0 flex-wrap gap-2">
          {currentTask.assignees.map((person, i) => (
            <div
              key={person.id}
              className="flex min-w-0 items-center gap-2 rounded-full bg-gray-100 py-1 pl-1 pr-3"
            >
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${
                  AVATAR_COLORS[i % AVATAR_COLORS.length]
                }`}
              >
                {/* {getInitials(person.name)} */}
              </div>

              {/* <span className="min-w-0 wrap-break-word text-sm text-gray-700">{person.name}</span> */}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm italic text-gray-400">
          No one assigned
        </p>
      )}
    </div>

    {/* METADATA */}
    <div className="space-y-2 border-t pt-4 text-xs text-gray-400 sm:text-sm">
      <p>
        Created: {new Date(currentTask.created_at).toLocaleDateString()}
      </p>

      <p>
        Updated: {new Date(currentTask.updated_at).toLocaleDateString()}
      </p>
    </div>

  </div>
);
}
