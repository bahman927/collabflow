import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Calendar, GripVertical } from "lucide-react";
import type { Task, TaskPriority } from "../../types/task";
import AvatarGroup from "../shared/AvatarGroup";

const PRIORITY_STYLES: Record<TaskPriority, { dot: string; label: string }> = {
  urgent: { dot: "bg-red-500",    label: "Urgent" },
  high:   { dot: "bg-orange-500", label: "High" },
  medium: { dot: "bg-yellow-400", label: "Medium" },
  low:    { dot: "bg-blue-400",   label: "Low" },
};

function formatDue(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = d.getTime() - now.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

  if (days < 0) return { text: `${Math.abs(days)}d overdue`, color: "text-red-600" };
  if (days === 0) return { text: "Today", color: "text-orange-600" };
  if (days === 1) return { text: "Tomorrow", color: "text-yellow-600" };
  return {
    text: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    color: "text-gray-500",
  };
}

interface Props {
  task: Task;
  onClick?: (task: Task) => void;
}

export default function TaskCard({ task, onClick }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: String(task.id), data: { task } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const priority = task.priority ? PRIORITY_STYLES[task.priority] : null;
  const due = task.due_date ? formatDue(task.due_date) : null;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group rounded-lg bg-white border border-gray-200 p-3 shadow-sm hover:shadow-md
                  transition-shadow cursor-pointer ${isDragging ? "opacity-50 shadow-lg ring-2 ring-indigo-300" : ""}`}
      onClick={() => onClick?.(task)}
    >
      {/* Top row: drag handle + priority */}
      <div className="flex items-start gap-2">
        <button
          {...attributes}
          {...listeners}
          className="mt-0.5 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-gray-600"
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical size={14} />
        </button>

        <div className="flex-1 min-w-0">
          {/* Priority badge */}
          {priority && (
            <div className="flex items-center gap-1 mb-1.5">
              <span className={`w-2 h-2 rounded-full ${priority.dot}`} />
              <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">
                {priority.label}
              </span>
            </div>
          )}

          {/* Task name */}
          <h3 className="text-sm font-semibold text-gray-800 leading-snug">
            task: {task.name}
          </h3>

          {/* Description */}
          {task.description && (
            <p className="mt-1 text-xs text-gray-500 line-clamp-2 leading-relaxed">
              {task.description}
            </p>
          )}
        </div>
      </div>

      {/* Bottom row: due date + assignees */}
      {(due || task.assignees.length > 0) && (
        <div className="mt-3 flex items-center justify-between">
          {due ? (
            <div className={`flex items-center gap-1 text-[11px] font-medium ${due.color}`}>
              <Calendar size={12} />
              {due.text}
            </div>
          ) : (
            <span />
          )}

          {task.assignees.length > 0 && (
            <AvatarGroup people={task.assignees} max={3} size="sm" />
          )}
        </div>
      )}
    </div>
  );
}
