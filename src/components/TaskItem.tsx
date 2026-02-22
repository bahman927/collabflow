import { Status } from "../types/type";

interface TaskItemProps {
  title: string;
  project: string;
  assignee: string;
  status: Status;
}

export default function TaskItem({ title, project, assignee, status }: TaskItemProps) {
  return (
    <li className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm text-gray-500">
          {project} · {assignee}
        </p>
      </div>
      <span className="text-sm text-blue-600">{status}</span>
    </li>
  );
}
