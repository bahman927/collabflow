import { Status } from "../types/type";

interface TaskItemProps {
  title: string;
  project: string;
  assignee: string;
  status: Status;
}

export default function TaskItem({ title, project, assignee, status }: TaskItemProps) {
 return (
  <li className="flex min-w-0 flex-col gap-2 rounded-lg bg-gray-50 p-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">

    {/* TASK DETAILS */}
    <div className="min-w-0 flex-1">
      <p className="wrap-break-word text-sm font-medium text-gray-800 sm:text-base">
        {title}
      </p>

      <p className="mt-1 wrap-break-word text-xs text-gray-500 sm:text-sm">
        {project} · {assignee}
      </p>
    </div>

    {/* STATUS */}
    <span className="w-fit shrink-0 text-xs font-medium text-blue-600 sm:text-sm">
      {status}
    </span>

  </li>
);
}
