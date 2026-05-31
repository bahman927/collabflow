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
    <div className="flex items-center -space-x-2">
      {visible.map((assignee) => (
        <div
          key={assignee.id}
          className="ring-2 ring-white rounded-full"
          title={assignee.name || assignee.email || 'Unknown'}
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
            ${size === 'sm' ? 'w-6 h-6 text-xs' : 'w-8 h-8 text-sm'}
            rounded-full bg-gray-200 text-gray-600 font-medium
            flex items-center justify-center ring-2 ring-white
          `}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
}
