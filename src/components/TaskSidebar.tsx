// src/components/TaskSidebar.tsx
import {useState}            from "react"
import { useTask }           from "../context/TaskProvider";
import CreateTaskModal       from "./CreateTaskModal";
import { CheckSquare, Plus } from "lucide-react";
import { useProject }        from "../context/ProjectProvider";
import { useWorkspace }      from "../hooks/useWorkspace";
import type { TaskCreateData } from "../types/task";
import Projects from "../pages/Projects";

/** First letter of each word → "Jane Doe" → "JD" */
function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const AVATAR_COLORS = [
  "bg-blue-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-teal-500",
];

export default function TaskSidebar() {
  const {
    tasks,
    currentTask,
    setCurrentTask,
    createTask,
  } = useTask();
  const [showModal, setShowModal] = useState(false);
  const { currentProject }   = useProject();
  const { currentWorkspace } = useWorkspace();

 
const handleCreate = async (
  data: Omit<TaskCreateData, "project_id" | "workspace_id" | "assignee_ids">
) => {
  try {
    await createTask({
      ...data,
      project_id: currentProject!.id,
      workspace_id: currentWorkspace!.id,
    });
  } catch (err: any) {
    console.error("CREATE TASK ERROR:", err);
  }
};


 return (
  <aside className="flex w-full min-w-0 shrink-0 flex-col gap-4 border-b border-gray-200 bg-gray-50 p-4 sm:p-5 lg:w-64 lg:border-b-0 lg:border-r lg:p-4">

    {/* HEADER */}
    <div className="flex items-center justify-between gap-2">
      <h2 className="text-lg font-semibold">Tasks</h2>

      <button
        type="button"
        onClick={() => setShowModal(true)}
        aria-label="Create task"
        title="Create task"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition hover:bg-gray-200"
      >
        <Plus size={18} />
      </button>
    </div>

    {/* TASK LIST */}
    <nav className="flex min-w-0 flex-col gap-1">
      {tasks.map((task) => {
        const isActive = currentTask?.id === task.id;

        return (
          <button
            key={task.id}
            type="button"
            onClick={() => setCurrentTask(task)}
            className={`flex min-w-0 w-full items-center justify-between gap-2 rounded-md px-3 py-3 text-left text-sm transition sm:py-2 ${
              isActive
                ? "bg-indigo-500 text-white"
                : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            {/* LEFT: ICON + NAME */}
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <CheckSquare size={18} className="shrink-0" />

              <span className="min-w-0 flex-1 wrap-break-word">
                {task.name}
              </span>
            </div>

            {/* RIGHT: ASSIGNEE AVATARS */}
            {task.assignees?.length > 0 && (
              <div className="ml-1 flex shrink-0 items-center -space-x-1.5">
                {task.assignees.slice(0, 3).map((person, i) => (
                  <div
                    key={person.id}
                    title={person.name}
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white ring-2 ${
                      isActive ? "ring-indigo-500" : "ring-gray-50"
                    } ${
                      AVATAR_COLORS[i % AVATAR_COLORS.length]
                    }`}
                  >
                    {/* {getInitials(person.name)} */}
                  </div>
                ))}

                {task.assignees.length > 3 && (
                  <div
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-300 text-[10px] font-medium text-gray-700 ring-2 ${
                      isActive ? "ring-indigo-500" : "ring-gray-50"
                    }`}
                  >
                    +{task.assignees.length - 3}
                  </div>
                )}
              </div>
            )}
          </button>
        );
      })}

      {tasks.length === 0 && (
        <p className="py-4 text-center text-sm text-gray-500">
          No tasks available.
        </p>
      )}
    </nav>

    {/* CREATE TASK MODAL */}
    <CreateTaskModal
      isOpen={showModal}
      onClose={() => setShowModal(false)}
      onCreate={handleCreate}
    />

  </aside>
);
}





 
