// src/pages/project/ProjectPage.tsx
import {useEffect}         from 'react'
import { useParams, Link, useNavigate } from "react-router-dom";
import { useWorkspace }    from "../../context/WorkspaceProvider";
import { useProject }      from "../../context/ProjectProvider";
import { useTask }         from "../../context/TaskProvider"
import { useMember }         from "../../context/MemberProvider"
import { useAuth }         from '../../hooks/useAuth';
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import EditProjectModal    from "../../components/EditProjectModal";
import DeleteProjectModal  from "../../components/ConfirmDeleteModal";
import Modal                 from "../../components/shared/Modal2";
import ProjectItem         from "../../components/ProjectItem";
import {TaskStatus}        from "../../types/type"
import { Status }          from '../../types/type';
import { Task }            from '../../types/task';
import { useState }        from "react";
import CreateTaskModal     from "../../components/CreateTaskModal";
import TaskDetailDrawer    from "../../components/task/TaskDetailDrawer";


export default function ProjectPage() {
  const { role } = useWorkspace();

  const navigate = useNavigate();
  const { currentWorkspace }       = useWorkspace();
  const { currentTask, setCurrentTask, createTask, deleteTask, updateTask,fetchTasks,  loadTasks } = useTask();
  const { projects, currentProject, setCurrentProject, updateProject, deleteProject: removeProject } = useProject();
  const { user, tokens, setTokens, logout } = useAuth();
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [showModal, setShowModal] = useState(false);
  const {members} = useMember();
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const { getWorkspaceTasks} = useTask();

  const wsTasks = currentWorkspace ? getWorkspaceTasks(currentWorkspace.id) : [];

  const projectTasks = currentProject
      ? wsTasks.filter((task: Task) => task.project === currentProject.id)
      : [];

  const handleRequestDelete = (task: Task) => {
    setTaskToDelete(task);
    setShowDeleteTaskModal(true);
  };
  
  const canEditTask = (task: Task) => {
    const currentRole = role?.toLowerCase();

    // Owner can edit every task
    if (currentRole === "owner") {
      return true;
    }

    // Member can edit only tasks created by himself
    if (currentRole === "member") {
      return (
        Number(task.created_by?.id) ===
        Number(user?.id)
      );
    }

    // Viewer cannot edit
    return false;
};

const canDeleteTask = (task: Task) => {
  const currentRole = role?.toLowerCase();

  if (currentRole === "owner") {
    return true;
  }

  if (currentRole === "member") {
    return Number(task.created_by?.id) === Number(user?.id);
  }

  return false;
};

  const loggedInWorkspaceMember = members.find(
     member => member.userId === String(user?.id)
  );
  
  const visibleProjectTasks = projectTasks
  const normalizeStatus = (s: string) =>
    s.toLowerCase() as TaskStatus;

    const STATUS_LABELS: Record<TaskStatus, Status> = {
      todo: "To Do",
      in_progress: "In Progress",
      done: "Done",
      overdue: "Overdue",
  };
    

  const groupedTasks = visibleProjectTasks.reduce((groups, task) => {
      const status = normalizeStatus(task.status);

      if (!groups[status]) {
        groups[status] = [];
      }

      groups[status].push(task);

      return groups;
    },
    {} as Record<string, Task[]>
  );    

  const [showEditModal, setShowEditModal] = useState(false);

  const [showDeleteProjectModal, setShowDeleteProjectModal] =  useState(false);
  const [showDeleteTaskModal, setShowDeleteTaskModal] = useState(false);

  const [showMenu, setShowMenu] = useState(false);

  const handleEditProject = async (data: { name: string; description: string }) => {
    if (!currentProject) return;
       await updateProject(currentProject.id, data);
    };

  const handleDeleteProject = async () => {
    if (!currentProject) return;
    await removeProject(currentProject.id);
    setCurrentProject(null);
    navigate(`/home`);
  };


  useEffect(() => {
    setCurrentTask(null);
  }, [currentProject?.id]);

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


const hasTask = () => {
      return (
        (groupedTasks.todo?.length ?? 0) > 0 ||
        (groupedTasks.in_progress?.length ?? 0) > 0 ||
        (groupedTasks.done?.length ?? 0) > 0 ||
        (groupedTasks.overdue?.length ?? 0) > 0
      );
    }


 if (!currentProject) {
  return (
    <div className="flex min-h-[calc(100dvh-80px)] min-w-0 flex-col items-center justify-center px-4 py-8 text-center">
      <img
        src={!currentProject ? "No-Project.png" : "/empty-state.png"}
        alt={!currentProject ? "No-Project" : "No project selected"}
        className="mb-2 max-h-56 w-full max-w-xs object-contain opacity-90 sm:max-h-64"
      />
      <h2 className="wrap-break-word text-xl font-semibold text-gray-800 sm:text-2xl">
        {!currentProject ? "No project Yet" : "No Project Selected"}
      </h2>
      <p className="mt-2 max-w-sm wrap-break-word text-sm text-gray-500 sm:text-base">
        {!currentProject
          ? "Set up a project to start collaborating with your team."
          : "Select a project from the sidebar or create a new one to get started."}
      </p>
    </div>
  );
}

return (
  <div className="min-w-0 space-y-4 p-3 sm:p-4 lg:p-6">
    {/* Project Header */}
    <header className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0 flex-1">
        <h1 className="mt-1 wrap-break-word text-xl font-semibold sm:text-2xl">
          project: {currentProject.name}
        </h1>

        {currentProject.description && (
          <p className="mt-1 wrap-break-word text-sm leading-relaxed text-gray-500 sm:text-base">
            {currentProject.description}
          </p>
        )}
      </div>

      {/* Project Actions */}
      <div className="flex min-w-0 flex-wrap items-center gap-2 sm:shrink-0 sm:justify-end">
        <Link
          to={`/workspace/${currentWorkspace?.id}/project/${currentProject.id}/board`}
          className="rounded-md border border-blue-200 bg-cyan-50 px-3 py-2 text-center text-sm transition hover:bg-gray-50"
        >
          Open board
        </Link>

        {(role?.toLowerCase() === "owner" ||
          role?.toLowerCase() === "member") && (
          <>
            <button
              type="button"
              className="rounded-md border border-blue-200 bg-yellow-50 px-3 py-2 text-sm text-black transition hover:bg-blue-200"
              onClick={() => setShowModal(true)}
            >
              New task
            </button>

            {role?.toLowerCase() === "owner" && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowMenu(!showMenu)}
                  aria-expanded={showMenu}
                  aria-label="Project options"
                  className="ml-0 rounded-md border border-blue-600 p-2 text-blue-600 transition hover:bg-blue-50 sm:ml-2"
                >
                  <MoreHorizontal size={18} className="text-gray-500" />
                </button>

                {showMenu && (
                  <div className="absolute right-0 z-50 mt-1 w-44 rounded-lg border bg-white py-1 shadow-lg">
                    <button
                      type="button"
                      onClick={() => {
                        setShowMenu(false);
                        setShowEditModal(true);
                      }}
                      className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-gray-700 transition hover:bg-gray-50 sm:py-2"
                    >
                      <Pencil size={14} />
                      Edit project
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setShowMenu(false);
                        setShowDeleteProjectModal(true);
                      }}
                      className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-red-600 transition hover:bg-red-50 sm:py-2"
                    >
                      <Trash2 size={14} />
                      Delete project
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </header>

    {/* Task Status Summary */}
    {hasTask() && (
      <div className="mb-6 rounded-xl bg-white p-3 shadow sm:p-4">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          <button className="min-w-0 rounded-md bg-blue-300 px-2 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 sm:text-base">
            {groupedTasks.todo?.length || 0} Todo
          </button>

          <button className="min-w-0 rounded-md bg-yellow-100 px-2 py-3 text-sm font-semibold text-yellow-700 transition hover:bg-yellow-200 sm:text-base">
            {groupedTasks.in_progress?.length || 0} In Progress
          </button>

          <button className="min-w-0 rounded-lg bg-green-100 px-2 py-3 text-sm font-semibold text-green-700 transition hover:bg-green-200 sm:text-base">
            {groupedTasks.done?.length || 0} Done
          </button>

          <button className="min-w-0 rounded-lg bg-red-100 px-2 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-200 sm:text-base">
            {groupedTasks.overdue?.length || 0} Overdue
          </button>
        </div>
      </div>
    )}

    {/* Recent Tasks */}
    <div className="min-w-0 rounded-xl bg-white p-3 shadow sm:p-5 lg:p-6">
      <h2 className="mb-6 text-lg font-semibold sm:mb-8 sm:text-xl">
        Recent Tasks
      </h2>

      {visibleProjectTasks.length === 0 ? (
        <div className="flex min-w-0 flex-col items-center gap-3 py-4 text-center">
          <p className="wrap-break-word text-sm italic text-gray-500 sm:text-base">
            No task assigned to you in this project yet
          </p>

          <img
            src="CollabFlow image.avif"
            alt="CollabFlow"
            className="h-auto w-40 max-w-full object-contain sm:w-50"
          />
        </div>
      ) : (
        <ul className="min-w-0 space-y-3 text-base sm:text-lg">
          {visibleProjectTasks.map((task) => (
            <ProjectItem
              key={task.id}
              task={task}
              taskId={task.id}
              title={task.name}
              status={STATUS_LABELS[normalizeStatus(task.status)]}
              onDelete={(id) => deleteTask(id)}
              editable={canEditTask(task)}
              deletable={canDeleteTask(task)}
              onClick={() => setCurrentTask(task)}
              onRequestDelete={handleRequestDelete}
            />
          ))}
        </ul>
      )}
    </div>

    {/* Create Task Modal */}
    <CreateTaskModal
      isOpen={showModal}
      onClose={() => setShowModal(false)}
      onCreate={handleCreate}
    />

    {/* Task Details Drawer */}
    {currentTask && (
      <TaskDetailDrawer
        task={currentTask}
        onClose={() => setCurrentTask(null)}
        onUpdate={updateTask}
        onRequestDelete={(task) => setTaskToDelete(task)}
      />
    )}

    {/* Edit Project Modal */}
    <EditProjectModal
      isOpen={showEditModal}
      onClose={() => setShowEditModal(false)}
      onSave={handleEditProject}
      initialName={currentProject?.name ?? ""}
      initialDescription={currentProject?.description ?? ""}
    />

    {/* Delete Project Modal */}
    <Modal
      isOpen={showDeleteProjectModal}
      onClose={() => setShowDeleteProjectModal(false)}
      title="Delete Project"
    >
      <DeleteProjectModal
        onClose={() => setShowDeleteProjectModal(false)}
        onConfirm={handleDeleteProject}
        projectName={currentProject?.name ?? ""}
      />
    </Modal>

    {/* Delete Task Modal */}
    <Modal
      isOpen={showDeleteTaskModal}
      onClose={() => setShowDeleteTaskModal(false)}
      title="Delete Task"
    >
      <div className="space-y-4">
        <p className="wrap-break-word text-sm text-gray-600">
          Are you sure you want to delete{" "}
          <span className="font-semibold">{taskToDelete?.name}</span>?
        </p>

        <div className="flex flex-col-reverse justify-end gap-2 sm:flex-row sm:gap-3">
          <button
            type="button"
            onClick={() => setShowDeleteTaskModal(false)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm transition hover:bg-gray-50 sm:w-auto sm:py-2"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => {
              if (taskToDelete) {
                deleteTask(taskToDelete.id);
              }

              setShowDeleteTaskModal(false);
              setTaskToDelete(null);
            }}
            className="w-full rounded-lg bg-red-500 px-4 py-3 text-sm text-white transition hover:bg-red-600 sm:w-auto sm:py-2"
          >
            Delete
          </button>
        </div>
      </div>
    </Modal>
  </div>
);   
  
 
}

 