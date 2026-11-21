import React from "react";

interface ActivityItemProps {
  name: string;
  action: string;
  time: string;
  avatar: string;
}

const ActivityItem: React.FC<ActivityItemProps> = ({
  name,
  action,
  time,
  avatar,
}) => {
  return (
  <li className="flex min-w-0 items-start gap-3 sm:gap-4">
    {/* Avatar */}
    <img
      src={avatar}
      alt={name}
      className="h-9 w-9 shrink-0 rounded-full object-cover sm:h-10 sm:w-10"
    />

    {/* Content */}
    <div className="min-w-0 flex-1">
      <p className="wrap-break-word text-sm sm:text-base">
        <span className="font-semibold">{name}</span>{" "}
        {action}
      </p>

      <p className="mt-1 text-xs text-gray-500 sm:text-sm">
        {time}
      </p>
    </div>
  </li>
);
};

export default ActivityItem;
