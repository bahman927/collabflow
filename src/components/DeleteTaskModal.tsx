// components/tasks/DeleteTaskModal.tsx
import { useState } from "react";
import { Task } from "@/types/task";

interface DeleteTaskModalProps {
  task: Task;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export default function DeleteTaskModal({ task, onClose, onConfirm }: DeleteTaskModalProps) {
  const [confirmName, setConfirmName] = useState("");

  const isMatch = confirmName.trim() === task.name.trim();

  return (
  <div className="min-w-0 space-y-4 p-4 sm:p-5">

    {/* Confirmation Message */}
    <p className="wrap-break-word text-sm text-gray-600">
      Type the task name to confirm deletion:
      <span className="ml-1 font-semibold text-gray-800">
        {task.name}
      </span>
    </p>

    {/* Task Name Input */}
    <input
      type="text"
      value={confirmName}
      onChange={(e) => setConfirmName(e.target.value)}
      className="w-full min-w-0 rounded-md border border-gray-300 px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-red-500 sm:py-2 sm:text-sm"
      placeholder="Enter task name"
    />

    {/* Match Status */}
    {confirmName.length > 0 && (
      <div>
        <span
          className={`inline-block max-w-full wrap-break-word rounded px-2 py-1 text-xs ${
            isMatch
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {isMatch ? "Matched" : "Not matched"}
        </span>
      </div>
    )}

    {/* Actions */}
    <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end sm:gap-3">

      <button
        type="button"
        onClick={onClose}
        className="w-full rounded px-4 py-3 text-sm text-gray-600 transition hover:bg-gray-100 sm:w-auto sm:py-2"
      >
        Cancel
      </button>

      <button
        type="button"
        disabled={!isMatch}
        onClick={onConfirm}
        className={`w-full rounded px-4 py-3 text-sm text-white transition sm:w-auto sm:py-2 ${
          isMatch
            ? "bg-red-600 hover:bg-red-700"
            : "cursor-not-allowed bg-red-300"
        }`}
      >
        Delete
      </button>

    </div>
  </div>
);
}
