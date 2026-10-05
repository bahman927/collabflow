import React from "react";
import { Folder, Palette, Bug, LayoutDashboard, UserCircle} from "lucide-react";
import { getInitials, getAvatarColor } from "../utils/projectHelpers";
import { useWorkspace }    from "../context/WorkspaceProvider";
import { useAuth } from "../hooks/useAuth";
import { useTask } from "../context/TaskProvider";
import { Task } from "../types/task";
import { TaskStatus } from "../types/type";
import { AvatarChip } from "./shared/AvatarChip";
import { Pencil, Trash2 } from "lucide-react";

type Status = "To Do" | "In Progress" | "Done" | "Overdue";



interface ProjectItemProps {
  task: Task;
  taskId: number;
  title: string;
  status: Status;
  onDelete?: (id: number) => void;
  editable?: boolean;
  deletable: boolean;
  onClick?: () => void;
  onRequestDelete?: (task: Task) => void;
}

// Map known projects to icons
const projectIcons: Record<string, React.ReactElement> = {
  "Design Dashboard UI": <Palette className="w-5 h-5 text-purple-500" />,
  "API Integration": <LayoutDashboard className="w-5 h-5 text-blue-500" />,
  "Fix Login Bug": <Bug className="w-5 h-5 text-red-500" />,
};

// Status badge colors
const statusStyles: Record<Status, string> = {
  "To Do": "text-blue-600 bg-blue-100",
  "In Progress": "text-yellow-700 bg-yellow-100",
  Done: "text-green-700 bg-green-100",
  Overdue: "text-red-700 bg-red-100",
};

const MAX_VISIBLE = 4;

const ProjectItem: React.FC<ProjectItemProps> = ({
  task,
  taskId,
  title,
  status,
  editable = false,
  deletable,
  onClick,
  onDelete,
  onRequestDelete,
} : ProjectItemProps) => {

  const { user } = useAuth();
  const {role} = useWorkspace()
  const { updateTask } = useTask();
  if (!task) return null;

 const assignees = (task.assignees || []).filter(
  (a, i, arr) => arr.findIndex((x) => x.id === a.id) === i
);


  const visible = assignees.slice(0, MAX_VISIBLE);
  const remaining = assignees.length - MAX_VISIBLE;

  const isAssignee =
  task.assignees?.some((a) => Number(a.id) === user?.id) ?? false;

  const canChangeStatus = true;
  const icon = projectIcons[title];
  const initials = getInitials(title);
  const avatarColor = getAvatarColor(title);

  const updateTaskStatus = (status: TaskStatus) => {
    updateTask(taskId.toString(), { status });
  };
  
  return (
    <li className="flex items-center justify-between p-1 bg-gray-50 rounded-lg hover:bg-gray-100 transition shadow-sm hover:shadow-md"  >

      {/* Left: icon + title + assignee avatars */}
      <div className="flex items-center gap-3 min-w-0 ">
      
        <div className=" mr-3 gap-2">
       
        {task.created_by?.avatar ? (
          <img
            src={task.created_by.avatar}
            alt={task.created_by.name}
            className="w-7 h-7 rounded-full object-cover"
          />
        ) : (
          <UserCircle className="w-7 h-7 text-gray-400" />
        )}

      </div>

        <span className="font-semibold truncate">{title}</span>

        {/* Assignee avatars */}
        {assignees.length > 0 && (
          <div className="flex items-center -space-x-2 ml-2 mt-2">
            {visible.map((assignee) => (
              <div
                key={assignee.id}
                className="ring-2 ring-gray-50 rounded-full"
                title={assignee.name || assignee.email || 'Unknown'}
              >
                <AvatarChip
                  name={assignee.name}
                    avatarUrl={
                      assignee.email
                        ? `/${assignee.email.split("@")[0]}.JPG`
                        : null
                    }
                  size="sm"
                  showName={false}
                />
              </div>
            ))}
            {remaining > 0 && (
              <div
                className="w-6 h-6 rounded-full bg-gray-200 text-gray-600
                  text-xs font-medium flex items-center justify-center
                  ring-2 ring-gray-50"
              >
                +{remaining}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right: status + delete */}
      <div className="flex items-center gap-3">
      {editable ? (
          <select
            value={task.status}
            onChange={(e) => updateTaskStatus(e.target.value as TaskStatus)}
            onClick={(e) => e.stopPropagation()}
            className={`text-sm font-serif border rounded-full px-1 py-1 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
              {
                todo:        "bg-gray-200 text-gray-700 border-gray-300",
                in_progress: "bg-blue-100 text-blue-700 border-blue-200",
                done:        "bg-green-100 text-green-700 border-green-200",
                overdue:     "bg-red-100 text-red-700 border-red-200",
              }[task.status] ?? "bg-gray-100 text-gray-600 border-gray-200"
            }`}
          >
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
            <option value="overdue">Overdue</option>
          </select>

        ) : (
          <span
            className={`px-3 py-1 rounded-full font-medium text-sm ${
              statusStyles[status] ?? "bg-gray-100 text-gray-600"
            }`}
          >
            {status}
          </span>
        )}
        { editable && (
         <div>
           <button
            onClick={(e) => {
              e.stopPropagation();
              onClick?.();
              
                }}
                className="text-blue-500 cursor-pointer hover:text-blue-700 ml-4  "
                title="Edit task"
              >
            <Pencil size={18} />
           </button>
         </div>  
        )}

         {  deletable  && (
            <div className="px-6 py-3 border-t border-gray-100">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRequestDelete?.(task);
                }}
                className="text-sm font-serif cursor-pointer  text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg transition"
              >
                 <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
      </div>
    </li>
  );
};

export default ProjectItem;
