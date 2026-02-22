import React from "react";
import { Folder, Palette, Bug, LayoutDashboard } from "lucide-react";
import { getInitials, getAvatarColor } from "../utils/projectHelpers";

type Status = "To Do" | "In Progress" | "Done" | "Overdue";

interface ProjectItemProps {
  title: string;
  status: Status;
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

const ProjectItem: React.FC<ProjectItemProps> = ({ title, status }) => {
  const icon = projectIcons[title];
  const initials = getInitials(title);
  const avatarColor = getAvatarColor(title);

  return (
    <li className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-3">
        {/* Icon or initials avatar */}
        {icon ? (
          <div className="p-2 bg-white rounded-md shadow">{icon}</div>
        ) : (
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center
            font-semibold text-sm ${avatarColor}`}
          >
            {initials}
          </div>
        )}
        <span className="font-medium">{title}</span>
      </div>

      <span className={`text-sm px-3 py-1 rounded-full font-medium ${statusStyles[status]}`}>
        {status}
      </span>
    </li>
  );
};

export default ProjectItem;
