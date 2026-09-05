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
import DeleteTaskModal     from "@/components/DeleteTaskModal"


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

  const handleRequestDelete = (task: Task) => {setConfirmDeleteId(task.id)};    

  const canEditTask = (task: Task) => {
    const currentRole = role?.toLowerCase();

    // Owner can edit every task
    if (currentRole === "owner") {
      return true;
    }

    // Member can edit ONLY tasks assigned to himself
    if (currentRole === "member") {
      return task.assignees?.some(
        (assignee) =>
          Number(assignee.member_id) ===
          Number(loggedInWorkspaceMember?.id)
      ) ?? false;
    }

    // Viewer cannot edit
    return false;
    
  };

  const loggedInWorkspaceMember = members.find(
     member => member.userId === String(user?.id)
  );

  // console.log( "LOGGED MEMBER:", loggedInWorkspaceMember);

  // console.log("loggedInWorkspaceMember:", loggedInWorkspaceMember)
  // console.log("currentWorkspace:", currentWorkspace)
  // console.log("PROJECT TASKS:", projectTasks);

// projectTasks.forEach((task) => {
//   console.log("ASSIGNEES:", task.assignees);

//   task.assignees?.forEach((assignee) => {
//     console.log(
//       "assignee.member_id =",
//       assignee.member_id
//     );
//   });
// });

  // const visibleProjectTasks = role?.toLowerCase() === "owner"
  //   ? projectTasks
  //   : projectTasks.filter((task) =>
  //       task.assignees?.some(
  //         (assignee) =>
  //           assignee.member_id ===
  //           loggedInWorkspaceMember?.id
  //       )
  //     );

 const visibleProjectTasks = projectTasks

  // console.log('visibleProjectTasks :', visibleProjectTasks)

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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
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
  // window.location.href = `/workspace/${currentWorkspace?.id}`;
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
  
 if  (!currentProject) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-80px)] text-center  ">
        <img
          src={!currentProject ? "No-Project.png" : "/empty-state.png"}
          alt={!currentProject ? "No-Project" : "No project selected"}
          className="object-contain mb-2 opacity-90"
        />
        <h2 className="text-xl font-semibold text-gray-800">
          {!currentProject ? "No project Yet" : "No Project Selected"}
        </h2>
        <p className="text-sm text-gray-500 mt-2 max-w-sm">
          {!currentProject
            ? "Set up a project to start collaborating with your team."
            : "Select a project from the sidebar or create a new one to get started."}
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold mt-1">
            {currentProject.name} 
          </h1>
          {currentProject.description && (
            <p className="text-sm text-gray-500 mt-1">
              {currentProject.description}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
           <Link
            to={`/workspace/${currentWorkspace?.id}/project/${currentProject.id}/board`}
            className="px-3 py-2 bg-cyan-50 text-sm rounded-md border border-blue-200 hover:bg-gray-50 m-2"
          >
            Open board
          </Link>
          {(role?.toLowerCase() === "owner" || role?.toLowerCase() ===  'member') &&  (
            <>
              <button className="px-3 py-2 text-sm rounded-md bg-yellow-50 text-black hover:bg-blue-200 p-1 border border-blue-200 " 
                onClick={() => setShowModal(true)}>
                New task
              </button>
              {role?.toLowerCase() === "owner"  &&
                <div className="relative">
                    <button
                      onClick={() => setShowMenu(!showMenu)}
                      className="p-2 rounded-md border border-blue-600 text-blue-600 hover:bg-blue-50 ml-2"
                    >
                      <MoreHorizontal size={18} className="text-gray-500" />
                    </button>

                    {  showMenu && (
                      <div className="absolute right-0 mt-1 w-44 bg-white rounded-lg shadow-lg border z-50 py-1">
                        <button
                          onClick={() => { setShowMenu(false); setShowEditModal(true); }}
                          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <Pencil size={14} /> Edit project
                        </button>
                        <button
                          onClick={() => { setShowMenu(false); setShowDeleteModal(true); }}
                          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <Trash2 size={14} /> Delete project
                        </button>
                      </div>
                    )}
                  </div>
                }
             </>
          )} 
        </div>
      </header>

       
        { hasTask() &&
          (<div className="bg-white rounded-xl shadow p-4 mb-6">
            <div className="flex flex-wrap gap-4 justify-between">
              <button className="flex-1 rounded-md bg-blue-300 text-white font-semibold hover:bg-blue-700 transition text-sm">
                {groupedTasks.todo?.length || 0} Todo
              </button>
              <button className="flex-1 rounded-md bg-yellow-100 text-yellow-700 font-semibold hover:bg-yellow-200 transition">
                {groupedTasks.in_progress?.length || 0} In Progress
              </button>
              <button className="flex-1 rounded-lg bg-green-100 text-green-700 font-semibold hover:bg-green-200 transition">
                 {groupedTasks.done?.length || 0} Done
              </button>
              <button className="flex-1 rounded-lg bg-red-100 text-red-700 font-semibold hover:bg-red-200 transition">
                 {groupedTasks.overdue?.length || 0} Overdue
              </button>
            </div>
          </div>
        )}
    
 <div className="bg-white rounded-xl shadow p-6 ">
  <h2 className="text-xl font-semibold mb-10">Recent Tasks</h2>

  {/* {projectTasks.length === 0 ? ( */}
  {visibleProjectTasks.length === 0 ? (
    <>
    <p className="text-gray-500 italic">No task assigned to you  in this project yet</p>
    <img  src="CollabFlow image.avif"  className="w-50" />
    </>
  ) : (
     <ul className="space-y-3 text-lg">
         {visibleProjectTasks.map((task) => (
          <ProjectItem
            key={task.id}
            task={task}
            taskId={task.id}
            title={task.name}
            status={STATUS_LABELS[normalizeStatus(task.status)]}
            onDelete={(id) => deleteTask(id)}
            editable={canEditTask(task)}
            onClick={() => setCurrentTask(task)}
            onRequestDelete={handleRequestDelete}
          />
        ))}
      </ul>
  )}
    {taskToDelete && (
      <Modal
        isOpen={!!taskToDelete}
        onClose={() => setTaskToDelete(null)}
        title="Delete Task"
      >
        <DeleteTaskModal
          task={taskToDelete}
          onClose={() => setTaskToDelete(null)}
          onConfirm={async () => {
            await deleteTask(taskToDelete.id);
            setTaskToDelete(null);
            setCurrentTask(null); 
          }}
        />
      </Modal>
    )}

    </div>
        <CreateTaskModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onCreate={handleCreate}
        />  

       {currentTask && (
          <TaskDetailDrawer
            task={currentTask}
            onClose={() => setCurrentTask(null)}
            onUpdate={updateTask}
            onRequestDelete={(task) => setTaskToDelete(task)}
          />
        )}


        <EditProjectModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSave={handleEditProject}
          initialName={currentProject?.name ?? ""}
          initialDescription={currentProject?.description ?? ""}
        />

        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="Delete Project"
        >
          <DeleteProjectModal
            onClose={() => setShowDeleteModal(false)}
            onConfirm={handleDeleteProject}
            projectName={currentProject?.name ?? ""}
          />
        </Modal>

    </div>
    
  );
}

 