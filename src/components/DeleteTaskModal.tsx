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
    <div className="space-y-4">
      <p className="text-sm text-gray-600">
        Type the task name to confirm deletion:
        <span className="font-semibold ml-1">{task.name}</span>
      </p>

      <input
        value={confirmName}
        onChange={(e) => setConfirmName(e.target.value)}
        className="w-full border rounded px-3 py-2"
        placeholder="Enter task name"
      />

      {confirmName.length > 0 && (
        <span
          className={`text-xs px-2 py-1 rounded ${
            isMatch ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {isMatch ? "Matched" : "Not matched"}
        </span>
      )}

      <div className="flex justify-end gap-2">
        <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded">
          Cancel
        </button>

        <button
          disabled={!isMatch}
          onClick={onConfirm}
          className={`px-4 py-2 text-sm text-white rounded ${
            isMatch ? "bg-red-600 hover:bg-red-700" : "bg-red-300 cursor-not-allowed"
          }`}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
