import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { Task, TaskStatus } from "../../types/task";
import TaskCard from "./TaskCard";

const COLUMN_COLORS: Record<TaskStatus, string> = {
  todo:        "border-t-gray-400",
  in_progress: "border-t-blue-500",
  done:        "border-t-emerald-500",
  overdue:     "border-t-red-500",
};

const COUNT_COLORS: Record<TaskStatus, string> = {
  todo:        "bg-gray-100 text-gray-600",
  in_progress: "bg-blue-100 text-blue-700",
  done:        "bg-emerald-100 text-emerald-700",
  overdue:     "bg-red-100 text-red-700",
};

interface Props {
  status: TaskStatus;
  label: string;
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
}

export default function KanbanColumn({ status, label, tasks, onTaskClick }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  const ids = tasks.map((t) => String(t.id));

 return (
  <div
    className={`flex w-[210px] min-w-[210px] shrink-0 flex-col rounded-xl border border-t-4 border-gray-200 bg-gray-50/80 transition-colors
      ${COLUMN_COLORS[status]}
      ${isOver ? "border-indigo-200 bg-indigo-50/60" : ""}`}
  >
    {/* Column header */}
    <div className="flex items-center justify-between gap-2 px-3 py-3 sm:px-4">
      <div className="flex min-w-0 items-center gap-2">
        <h3 className="wrap-break-word text-sm font-semibold text-gray-700">
          {label}
        </h3>

        <span
          className={`shrink-0 rounded-full px-1.5 py-0.5 text-[11px] font-bold ${COUNT_COLORS[status]}`}
        >
          {tasks.length}
        </span>
      </div>
    </div>

    {/* Cards */}
    <div
      ref={setNodeRef}
      className="min-h-15 min-w-0 flex-1 space-y-2 px-2 pb-3"
    >
      <SortableContext
        items={ids}
        strategy={verticalListSortingStrategy}
      >
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onClick={onTaskClick}
          />
        ))}
      </SortableContext>

      {tasks.length === 0 && (
        <div
          className={`flex h-20 items-center justify-center rounded-lg border-2 border-dashed transition-colors
            ${isOver
              ? "border-indigo-300 bg-indigo-50"
              : "border-gray-200"}`}
        >
          <p className="text-xs text-gray-400">
            {isOver ? "Drop here" : "No tasks"}
          </p>
        </div>
      )}
    </div>
  </div>
);

   
}
