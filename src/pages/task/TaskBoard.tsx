// src/pages/task/TaskBoard.tsx

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import { useWorkspace }     from "../../context/WorkspaceProvider";
import { useProject }       from "../../context/ProjectProvider";
import { useTask }          from "../../context/TaskProvider";
import KanbanColumn         from "../../components/task/KanbanColumn";
import TaskCard             from "../../components/task/TaskCard";
import TaskDetailDrawer     from "../../components/task/TaskDetailDrawer";
import type { Task, TaskStatus } from "../../types/task";
import DeleteTaskModal from "@/components/DeleteTaskModal";
import CreateTaskModal     from "../../components/CreateTaskModal";

const COLUMNS: { key: TaskStatus; label: string }[] = [
  { key: "todo",        label: "To Do" },
  { key: "in_progress", label: "In Progress" },
  { key: "done",        label: "Done" },
  { key: "overdue",     label: "Overdue" },
];

export default function TaskBoard() {
  const { workspaceId, projectId } = useParams();
  const { currentWorkspace } = useWorkspace();
  const { projects, currentProject, setCurrentProject }   = useProject();
  const { currentTask,  setCurrentTask, groupedTasks, moveTask, updateTask, deleteTask, createTask, fetchTasks } = useTask();

  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [showModal, setShowModal] = useState(false);

   const handleCreate = async (data: { name: string; description: string }) => {
  try {
    await createTask({
      name: data.name,
      description: data.description,
      project_id: currentProject!.id,
      workspace_id: currentWorkspace!.id,
    });
  } catch (err: any) {
    console.error("CREATE TASK ERROR:", err);
  }
};

  // -----------------------------
  // 2. CRITICAL: Clear drawer when TaskBoard loads OR project changes
  // -----------------------------
  useEffect(() => {
    setCurrentTask(null);
  }, []);

  // -----------------------------
  // 3. Sync currentProject with URL
  // -----------------------------
  useEffect(() => {
    console.log('projectId  in taskBoard : ', projectId)
    if (!projectId) return;

    const id = Number(projectId);
    const match = projects.find((p) => p.id === id);
    console.log('match in taskBoard : ', match)
    setCurrentProject(match || null);
    console.log('currentProject in taskBoard : ', currentProject)
}, [projectId, projects]);


   // -----------------------------
  // 4. Drag handlers
  // -----------------------------
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  // ---- Drag handlers ----
  const handleDragStart = (event: DragStartEvent) => {
    const task = event.active.data.current?.task as Task | undefined;
    if (task) setActiveTask(task);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const taskId = String(active.id);
    const targetStatus = over.id as TaskStatus;
    const currentStatus = (active.data.current?.task as Task)?.status;

    if (currentStatus && currentStatus !== targetStatus) {
      void moveTask(Number(taskId), targetStatus);
    }
  };
  if (!currentWorkspace || !currentProject) {
    return (
      <div className="p-6">
        <p className="text-sm text-gray-500">Loading board…</p>
      </div>
    );
  }

   
  return (
    <div className="p-6 space-y-4 h-full">
      {/* Breadcrumbs & title */}
      <header>
        <p className="text-xs text-gray-600">
          <Link to={`/workspace/${workspaceId}`} className="hover:underline">
            {currentWorkspace.name}
          </Link>{" "}
          /{" "}
          <Link
            to={`/workspace/${workspaceId}/project/${projectId}`}
            className="hover:underline"
          >
            {currentProject.name}
          </Link>{" "}
          / Board
        </p>
        <h1 className="text-2xl font-bold mt-1 text-gray-900">Task Board</h1>
      </header>

      {/* Kanban columns */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
          {COLUMNS.map((col) => (
            <KanbanColumn
              key={col.key}
              status={col.key}
              label={col.label}
              tasks={groupedTasks[col.key] ?? []}
              // tasks={currentTask}
              onTaskClick={(task) => setCurrentTask(task)}

            />
          ))}
        </div>

        <DragOverlay>
          {activeTask ? (
            <div className="rotate-3 scale-105">
              <TaskCard task={activeTask} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

     <CreateTaskModal
               isOpen={showModal}
               onClose={() => setShowModal(false)}
               onCreate={handleCreate}
             />  
     
      {/* -----------------------------
          Delete Task Modal
      ------------------------------ */}
      {taskToDelete && (
        <DeleteTaskModal
          task={taskToDelete}
          onClose={() => setTaskToDelete(null)}
          onConfirm={async () => {
            await deleteTask(taskToDelete.id);
            setTaskToDelete(null);
            setCurrentTask(null); 
          }}
        />
      )}


    </div>
  );
}
