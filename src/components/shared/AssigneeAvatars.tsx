import React from 'react';
import { AvatarChip } from './AvatarChip';

interface Assignee {
  id: number;
  name?: string;
  email?: string;
  avatar_url?: string | null;
}

interface AssigneeAvatarsProps {
  assignees: Assignee[];
  max?: number;           // how many to show before "+N"
  size?: 'sm' | 'md';
}

export function AssigneeAvatars({
  assignees,
  max = 3,
  size = 'sm',
}: AssigneeAvatarsProps) {
  if (!assignees?.length) return null;

  const visible = assignees.slice(0, max);
  const remaining = assignees.length - max;

  return (
  <div className="flex w-fit max-w-full shrink-0 items-center -space-x-2">

    {visible.map((assignee) => (
      <div
        key={assignee.id}
        className="shrink-0 rounded-full ring-2 ring-white"
        title={assignee.name || assignee.email || "Unknown"}
      >
        <AvatarChip
          name={assignee.name}
          avatarUrl={assignee.avatar_url}
          size={size}
          showName={false}
        />
      </div>
    ))}

    {remaining > 0 && (
      <div
        className={`
          ${size === "sm" ? "h-6 w-6 text-xs" : "h-8 w-8 text-sm"}
          flex shrink-0 items-center justify-center
          rounded-full bg-gray-200 font-medium text-gray-600
          ring-2 ring-white
        `}
      >
        +{remaining}
      </div>
    )}

  </div>
);
}
