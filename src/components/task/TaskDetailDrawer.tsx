// src/components/task/TaskDetailDrawer.tsx

import { useState, useEffect, useRef } from "react";
import type { Task, TaskStatus, TaskPriority, TaskUpdateData } from "../../types/task";

/* ───────────────────────────── constants ─────────────────────────── */

const STATUS_OPTIONS: { value: TaskStatus; label: string; color: string }[] = [
  { value: "todo",        label: "To Do",        color: "bg-gray-200 text-gray-700" },
  { value: "in_progress", label: "In Progress",  color: "bg-blue-100 text-blue-700" },
  { value: "done",        label: "Done",          color: "bg-green-100 text-green-700" },
  { value: "overdue",     label: "Overdue",       color: "bg-red-100 text-red-700" },
];

const PRIORITY_OPTIONS: {
  value: TaskPriority;
  label: string;
  dot: string;
  ring: string;
}[] = [
  { value: "low",    label: "Low",    dot: "bg-blue-400",   ring: "ring-blue-300" },
  { value: "medium", label: "Medium", dot: "bg-yellow-400", ring: "ring-yellow-300" },
  { value: "high",   label: "High",   dot: "bg-orange-500", ring: "ring-orange-300" },
  { value: "urgent", label: "Urgent", dot: "bg-red-500",    ring: "ring-red-300" },
];

/* ───────────────────────────── helpers ───────────────────────────── */

function toInputDate(dateStr: string | null): string {
  if (!dateStr) return "";
  return new Date(dateStr).toISOString().split("T")[0];
}

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const mins = Math.floor((now - then) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "yesterday";
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

/* ───────────────────────────── icons ─────────────────────────────── */

const IconX = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

const IconCalendar = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);

const IconEdit = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const IconUser = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const IconFlag = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7" />
  </svg>
);

const IconStatus = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="9" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

const IconClock = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 3" />
  </svg>
);

/* ────────────────── editable text field ──────────────────────────── */

function EditableText({
  value,
  onSave,
  as = "input",
  className = "",
  placeholder = "",
}: {
  value: string;
  onSave: (v: string) => void;
  as?: "input" | "textarea";
  className?: string;
  placeholder?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const ref = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  useEffect(() => {
    if (editing) ref.current?.focus();
  }, [editing]);

  const commit = () => {
    setEditing(false);
    if (draft.trim() !== value) onSave(draft.trim());
  };

  if (!editing) {
    return (
      <div
        onClick={() => setEditing(true)}
        className={`group cursor-pointer rounded-md px-2 py-1 -mx-2 hover:bg-gray-50 transition ${className}`}
      >
        <span className={value ? "" : "text-gray-400 italic"}>
          {value || placeholder}
        </span>
        <span className="ml-2 opacity-0 group-hover:opacity-100 text-gray-300 transition inline-block">
          <IconEdit />
        </span>
      </div>
    );
  }

  if (as === "textarea") {
    return (
      <textarea
        ref={ref as React.RefObject<HTMLTextAreaElement>}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            setDraft(value);
            setEditing(false);
          }
        }}
        rows={4}
        className="w-full rounded-lg border border-indigo-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
        placeholder={placeholder}
      />
    );
  }

  return (
    <input
      ref={ref as React.RefObject<HTMLInputElement>}
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === "Enter") commit();
        if (e.key === "Escape") {
          setDraft(value);
          setEditing(false);
        }
      }}
      className="w-full rounded-lg border border-indigo-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      placeholder={placeholder}
    />
  );
}

/* ────────────────────────── main component ───────────────────────── */

interface Props {
  task: Task | null;
  onClose: () => void;
  onUpdate: (id: string, data: TaskUpdateData) => Promise<void>;
  onRequestDelete?: (task: Task) => void; 
}

export default function TaskDetailDrawer({
  task,
  onClose,
  onUpdate,
  onRequestDelete,
}: Props) {

  // Reset delete confirm UI (no longer used)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Reset internal UI when task changes
  useEffect(() => {}, [task?.id]);

  useEffect(() => {
    setShowDeleteConfirm(false);
  }, [task?.id]);

  // Close on ESC
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (task) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [task, onClose]);

  if (!task) return null;

  const currentPriority =
    PRIORITY_OPTIONS.find((p) => p.value === (task as any).priority) ??
    PRIORITY_OPTIONS[1];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full max-w-lg bg-white shadow-2xl z-50 flex flex-col animate-slide-in">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <IconClock />
            <span>Updated {timeAgo(task.updated_at)}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition"
          >
            <IconX />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto space-y-6 px-6 py-4">

          {/* Task name */}
          <EditableText
            value={task.name}
            onSave={(name) => onUpdate(String(task.id), { name })}
            className="text-xl font-bold text-gray-900"
            placeholder="Task name"
          />

          {/* Description */}
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1 block">
              Description
            </label>
            <EditableText
              value={task.description ?? ""}
              onSave={(description) => onUpdate(String(task.id), { description })}
              as="textarea"
              className="text-sm text-gray-700"
              placeholder="Add a description..."
            />
          </div>

          {/* Properties */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
              Properties
            </h3>

            {/* Status */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 w-28 text-sm text-gray-500">
                <IconStatus />
                Status
              </div>
              <div className="flex flex-wrap gap-2">
                {STATUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => onUpdate(String(task.id), { status: opt.value })}
                    className={`text-xs px-3 py-1 rounded-full font-medium transition-all ${
                      task.status === opt.value
                        ? `${opt.color} ring-2 ring-offset-1 ring-current`
                        : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Priority */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 w-28 text-sm text-gray-500">
                <IconFlag />
                Priority
              </div>
              <div className="flex flex-wrap gap-2">
                {PRIORITY_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => onUpdate(String(task.id), { priority: opt.value } as any)}
                    className={`text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1.5 transition-all ${
                      (task as any).priority === opt.value
                        ? `bg-white ring-2 ${opt.ring} ring-offset-1 text-gray-800`
                        : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${opt.dot}`} />
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Due date */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 w-28 text-sm text-gray-500">
                <IconCalendar />
                Due date
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={toInputDate(task.due_date)}
                  onChange={(e) =>
                    onUpdate(String(task.id), { due_date: e.target.value || null })
                  }
                  className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {task.due_date && (
                  <button
                    onClick={() => onUpdate(String(task.id), { due_date: null })}
                    className="text-xs text-gray-400 hover:text-red-500 transition"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Assignees */}
            <div className="flex items-start gap-3">
              <div className="flex items-center gap-2 w-28 text-sm text-gray-500 mt-1">
                <IconUser />
                Assignees
              </div>
              <div className="flex flex-wrap gap-2">
                {task.assignees?.length ? (
                  task.assignees.map((person) => (
                    <span
                      key={person.id}
                      className="inline-flex items-center gap-1.5 text-xs bg-gray-100 text-gray-700 rounded-full px-3 py-1"
                    >
                      <span className="w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center text-[10px] font-bold">
                        {person.name
                          .split(" ")
                          .map((n:string) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </span>
                      {person.name}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-gray-400 italic py-1">
                    No assignees
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="border-t border-gray-100 pt-4 space-y-1">
            <p className="text-xs text-gray-400">
              Created {new Date(task.created_at).toLocaleString()}
            </p>
            <p className="text-xs text-gray-400">
              Last updated {timeAgo(task.updated_at)}
            </p>
          </div>

        </div>

        {/* Footer — Delete Button */}
        {onRequestDelete && (
          <div className="px-6 py-3 border-t border-gray-100">
            <button
              onClick={() => onRequestDelete(task)}   // ← correct call
              className="text-sm text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg transition"
            >
              Delete task
            </button>
          </div>
        )}
      </div>
    </>
  );
}


 