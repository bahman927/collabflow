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
    <aside className="w-64 bg-gray-50 border-r p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Tasks</h2>
        <button onClick={() => setShowModal(true)} className="p-1 rounded hover:bg-gray-200">
          <Plus size={18} />
        </button>
      </div>

      <nav className="space-y-1">
        {tasks.map((task) => {
          const isActive = currentTask?.id === task.id;

          return (
            <button
              key={task.id}
              onClick={() => setCurrentTask(task)}
              className={`flex items-center justify-between w-full px-3 py-2 rounded-md text-left transition
                ${isActive ? "bg-indigo-500 text-white" : "hover:bg-gray-200"}
              `}
            >
              {/* Left: icon + name */}
              <div className="flex items-center gap-2 min-w-0">
                <CheckSquare size={18} className="shrink-0" />
                <span className="truncate">{task.name}</span>
              </div>

              {/* Right: assignee avatars */}
              {task.assignees?.length > 0 && (
                <div className="flex -space-x-1.5 ml-2 shrink-0">
                  {task.assignees.slice(0, 3).map((person, i) => (
                    <div
                      key={person.id}
                      title={person.name}
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white ring-2
                        ${isActive ? "ring-indigo-500" : "ring-gray-50"}
                        ${AVATAR_COLORS[i % AVATAR_COLORS.length]}
                      `}
                    >
                      {getInitials(person.name)}
                    </div>
                  ))}
                  {task.assignees.length > 3 && (
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-medium bg-gray-300 text-gray-700 ring-2
                        ${isActive ? "ring-indigo-500" : "ring-gray-50"}
                      `}
                    >
                      +{task.assignees.length - 3}
                    </div>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </nav>
     
      <CreateTaskModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onCreate={handleCreate}
      />
    </aside>
  );
}





 
