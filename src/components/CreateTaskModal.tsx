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
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">

      {/* Task Name */}
      <div className="min-w-0">
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Task Name
        </label>

        <input
          autoFocus
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Design homepage mockup"
          className="w-full min-w-0 rounded-lg border border-gray-300 px-3 py-3 text-base transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:py-2.5 sm:text-sm"
        />
      </div>

      {/* Description */}
      <div className="min-w-0">
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Description{" "}
          <span className="font-normal text-gray-400">(optional)</span>
        </label>

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What needs to be done?"
          rows={3}
          className="w-full min-w-0 resize-none rounded-lg border border-gray-300 px-3 py-3 text-base transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:py-2.5 sm:text-sm"
        />
      </div>

      {/* Priority & Due Date */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

        {/* Priority */}
        <div className="min-w-0">
          <label className="mb-2 flex items-center gap-1.5 text-sm font-medium text-gray-700">
            <Flag size={14} />
            Priority
          </label>

          <div className="flex flex-wrap gap-2">
            {PRIORITIES.map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => setPriority(p.value)}
                className={`flex items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-medium transition
                  ${
                    priority === p.value
                      ? "border-indigo-500 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-500"
                      : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                  }`}
              >
                <span className={`h-2 w-2 shrink-0 rounded-full ${p.dot}`} />
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Due Date */}
        <div className="min-w-0">
          <label className="mb-2 flex items-center gap-1.5 text-sm font-medium text-gray-700">
            <Calendar size={14} />
            Due Date
          </label>

          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            className="w-full min-w-0 rounded-lg border border-gray-300 px-3 py-3 text-base transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:py-2 sm:text-sm"
          />

          {dueDate && (
            <button
              type="button"
              onClick={() => setDueDate("")}
              className="mt-2 py-1 text-xs text-gray-400 transition hover:text-gray-600"
            >
              Clear date
            </button>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col-reverse gap-2 border-t pt-4 sm:flex-row sm:justify-end sm:gap-3">

        <button
          type="button"
          onClick={handleClose}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-700 transition hover:bg-gray-50 sm:w-auto sm:py-2"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={!name.trim() || loading}
          className="w-full rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white transition-all hover:bg-indigo-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:py-2"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
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


 