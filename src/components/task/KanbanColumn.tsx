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
      className={`min-w-50 max-w-xs flex-1 rounded-xl bg-gray-50/80 border border-gray-200 border-t-4
                  ${COLUMN_COLORS[status]} flex flex-col transition-colors
                  ${isOver ? "bg-indigo-50/60 border-indigo-200" : ""}`}
    >
      {/* Column header */}
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-gray-700">{label}</h3>
          <span
            className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full ${COUNT_COLORS[status]}`}
          >
            {tasks.length}
          </span>
        </div>
      </div>

      {/* Cards */}
      <div ref={setNodeRef} className="px-2 pb-3 space-y-2 flex-1 min-h-15">
        <SortableContext items={ids} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onClick={onTaskClick} />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <div
            className={`flex items-center justify-center h-20 rounded-lg border-2 border-dashed
                        ${isOver ? "border-indigo-300 bg-indigo-50" : "border-gray-200"} transition-colors`}
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
