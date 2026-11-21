// src/components/task/TaskDetailDrawer.tsx

import { useState, useEffect, useRef } from "react";
import { taskService } from "@/services/taskService";
import { useAuth }           from "../../hooks/useAuth";
import { useTask }           from "@/context/TaskProvider";
import { TaskAssignee } from "../../types/task";
import { useWorkspace }    from "../../context/WorkspaceProvider";





import type { Task, TaskStatus, TaskPriority, TaskUpdateData } from "../../types/task";

const AVATAR_COLORS = [
  "bg-blue-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-orange-500",
  "bg-teal-500",
];

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

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
        className={`group -mx-2 cursor-pointer rounded-md px-2 py-2 transition hover:bg-gray-50 ${className}`}
      >
        <span className={`wrap-break-word ${value ? "" : "text-gray-400 italic"}`}>
          {value || placeholder}
        </span>

        <span className="ml-2 inline-block text-gray-300 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100">
          <IconEdit />
        </span>
      </div>

      // <div
      //   onClick={() => setEditing(true)}
      //   className={`group cursor-pointer rounded-md px-2 py-1 -mx-2 hover:bg-gray-50 transition ${className}`}
      // >
      //   <span className={value ? "" : "text-gray-400 italic"}>
      //     {value || placeholder}
      //   </span>
      //   <span className="ml-2 opacity-0 group-hover:opacity-100 text-gray-300 transition inline-block">
      //     <IconEdit />
      //   </span>
      // </div>
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
        className="w-full resize-none rounded-lg border border-indigo-300 px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:py-2 sm:text-sm"
        // className="w-full rounded-lg border border-indigo-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
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
      className="w-full min-w-0 rounded-lg border border-indigo-300 px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:py-2 sm:text-sm"

      // className="w-full rounded-lg border border-indigo-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      placeholder={placeholder}
    />
  );
}

/* ────────────────────────── main component ───────────────────────── */

interface Props {
  task: Task | null;
  onClose: () => void;
  onUpdate: (id: string | number, data: TaskUpdateData) => Promise<void>;
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
  const [confirmRemoveId, setConfirmRemoveId] = useState<number | null>(null);
  const { apiFetch, user } = useAuth();
  const { updateTaskInState, unassign } = useTask();
  const { role } = useWorkspace();
  const [assigneeToRemove, setAssigneeToRemove] = useState<number | null>(null);
  const [assignees, setAssignees] = useState(task?.assignees ?? []);

useEffect(() => {
  setAssignees(task?.assignees ?? []);
}, [task]);
   
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


const handleConfirmRemove = async (memberId: number) => {
  const { url, options } = taskService.unassign(
    task.id,
    memberId
  );

  await apiFetch(url, options);
 

  // 1️⃣ Compute updated assignees
  const updatedAssignees = task.assignees.filter(
    a => a.member_id !== memberId
  );

  // 2️⃣ Update backend (PATCH) — ONLY assignee_ids allowed
  await onUpdate(task.id, {
    assignee_ids: updatedAssignees.map(a => a.member_id)
  });

  // 3️⃣ Update UI state locally — NOT through onUpdate()
  updateTaskInState(task.id, {
    assignees: updatedAssignees
  });

  setConfirmRemoveId(null);
};

  const normalizeAssignee = (person: any) => {
      return {
        memberId: person.member_id,     // ✔ correct ID for DELETE
        fullName: person.name || person.email || "Unknown",
      };
    };

  const currentPriority =
    PRIORITY_OPTIONS.find((p) => p.value === (task as any).priority) ??
    PRIORITY_OPTIONS[1];

  return (
    <>
    
        {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/30 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className="fixed inset-y-0 right-0 z-50 flex h-dvh w-full max-w-lg flex-col overflow-hidden rounded-none bg-white shadow-2xl animate-slide-in sm:inset-y-4 sm:h-auto sm:rounded-l-xl"
      >

       {/* Header */}
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-gray-100 px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex min-w-0 items-center gap-2 text-xs text-gray-400">
          <IconClock />
          <span className="truncate">
            Updated {timeAgo(task.updated_at)}
          </span>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close task details"
          className="shrink-0 rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
        >
          <IconX />
        </button>
      </div>

        {/* Body */}
        <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-4 py-4 sm:px-6">
        {/* <div className="flex-1 overflow-y-auto space-y-6 px-6 py-4"> */}

          {/* Task name */}
          <EditableText
            value={task.name}
            onSave={(name) => onUpdate((task.id), { name })}
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
              onSave={(description) => onUpdate((task.id), { description })}
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
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
              <div className="flex w-full shrink-0 items-center gap-2 text-sm text-gray-500 sm:w-28">

            {/* <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 w-28 text-sm text-gray-500"> */}
                <IconStatus />
                Status
              </div>
              <div className="flex flex-wrap gap-2">
                {STATUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => onUpdate((task.id), { status: opt.value })}
                    className={`rounded-full px-3 py-2 text-xs font-medium transition-all ${
                      task.status === opt.value
                        ? `${opt.color} ring-2 ring-offset-1 ring-current`
                        : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                    }`}

                    // className={`text-xs px-3 py-1 rounded-full font-medium transition-all ${
                    //   task.status === opt.value
                    //     ? `${opt.color} ring-2 ring-offset-1 ring-current`
                    //     : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                    // }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Priority */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
              <div className="flex w-full shrink-0 items-center gap-2 text-sm text-gray-500 sm:w-28">

            {/* <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 w-28 text-sm text-gray-500"> */}
                <IconFlag />
                Priority
              </div>
              <div className="flex flex-wrap gap-2">
                {PRIORITY_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => onUpdate((task.id), { priority: opt.value } as any)}
                    className={`flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium transition-all ${
                      (task as any).priority === opt.value
                        ? `bg-white ring-2 ${opt.ring} ring-offset-1 text-gray-800`
                        : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                    }`}
                                        // className={`text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1.5 transition-all ${
                    //   (task as any).priority === opt.value
                    //     ? `bg-white ring-2 ${opt.ring} ring-offset-1 text-gray-800`
                    //     : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                    // }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${opt.dot}`} />
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Due date */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
            <div className="flex w-full shrink-0 items-center gap-2 text-sm text-gray-500 sm:w-28">
              <IconCalendar />
              Due date
            </div>

            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <input
                type="date"
                value={toInputDate(task.due_date)}
                onChange={(e) =>
                  onUpdate(task.id, {
                    due_date: e.target.value || null,
                  })
                }
                className="w-full min-w-0 rounded-lg border border-gray-200 px-3 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:w-auto sm:py-1.5 sm:text-sm"
              />

              {task.due_date && (
                <button
                  type="button"
                  onClick={() => onUpdate(task.id, { due_date: null })}
                  className="py-2 text-xs text-gray-400 transition hover:text-red-500"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

            {/* <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 w-28 text-sm text-gray-500">
                <IconCalendar />
                Due date
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={toInputDate(task.due_date)}
                  onChange={(e) =>
                    onUpdate((task.id), { due_date: e.target.value || null })
                  }
                  className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {task.due_date && (
                  <button
                    onClick={() => onUpdate((task.id), { due_date: null })}
                    className="text-xs text-gray-400 hover:text-red-500 transition"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div> */}

          {/* Assignees */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-3">
           <div className="flex w-full shrink-0 items-center gap-2 text-sm text-gray-500 sm:mt-1 sm:w-28">
              <IconUser />
              Assignees
            </div>

            <div className="flex min-w-0 max-w-full flex-wrap gap-2">
              {assignees?.length ? (
                
                assignees.map((person, i) => {
                  const { memberId, fullName } = normalizeAssignee(person);
                  // console.log("TaskDetailDrawer memberId", memberId)
                  return (
                    <div
                      key={person.id}
                      className="flex max-w-full min-w-0 items-center gap-2 rounded-full bg-gray-100 py-1 pl-1 pr-2"
                    >
                      {/* Avatar */}
                      {person.email ? (
                        <img
                          src={`/${person.email.split("@")[0]}.JPG`}
                          alt={fullName}
                          className="w-7 h-7 rounded-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                            AVATAR_COLORS[i % AVATAR_COLORS.length]
                          }`}
                        >
                          {getInitials(fullName)}
                        </div>
                      )}

                      {/* Name */}
                      <span className="min-w-0 wrap-breakword text-sm text-gray-700">
                        {fullName}
                      </span>

                      {/* Remove button - Owner only */}
                      {role?.toLowerCase() === "owner" && (
                        <button
                          type="button"
                          className="ml-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-400 hover:bg-gray-200 hover:text-red-600"
                          onClick={() => setAssigneeToRemove(memberId)}
                          title="Remove assignee"
                          aria-label={`Remove ${fullName}`}
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  );
                })
              ) : (
                <span className="text-xs text-gray-400 italic py-1">
                  No assignees
                </span>
              )}
            </div>
          </div>
          </div>
          {assigneeToRemove !== null && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 p-3 sm:p-5">
              <div className="w-full max-w-md rounded-lg bg-white p-4 shadow-xl sm:p-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Remove assignee?
                </h2>

                <p className="mt-2 text-sm text-gray-600">
                  Are you sure you want to remove this person from the task?
                </p>

                <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
                  <button
                    type="button"
                    onClick={() => setAssigneeToRemove(null)}
                    className="w-full rounded-md border px-4 py-3 text-sm sm:w-auto sm:py-2"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await unassign(task.id, assigneeToRemove);

                        setAssignees((prev) =>
                          prev.filter((person) => {
                            const { memberId } = normalizeAssignee(person);
                            return memberId !== assigneeToRemove;
                          })
                        );

                        setAssigneeToRemove(null);
                      } catch (error) {
                        console.error("Failed to remove assignee:", error);
                      }
                    }}
                    className="w-full rounded-md bg-red-600 px-4 py-3 text-sm text-white hover:bg-red-700 sm:w-auto sm:py-2"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="space-y-1 border-t border-gray-100 pt-4">
            <p className="wrap-break-word text-xs text-gray-400">
              Created {new Date(task.created_at).toLocaleString()}
            </p>
            <p className="wrap-break-word text-xs text-gray-400">
              Last updated {timeAgo(task.updated_at)}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
 