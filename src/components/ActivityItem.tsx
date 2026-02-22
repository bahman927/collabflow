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
    <li className="flex items-start gap-4">
      {/* Avatar */}
      <img
        src={avatar}
        alt={name}
        className="w-10 h-10 rounded-full object-cover"
      />

      {/* Content */}
      <div>
        <p className="text-base">
          <span className="font-semibold">{name}</span> {action}
        </p>
        <p className="text-sm text-gray-500">{time}</p>
      </div>
    </li>
  );
};

export default ActivityItem;
