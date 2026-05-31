import React from 'react';
import { AvatarChip } from './AvatarChip';

interface AvatarChipGroupProps {
  members: Array<{
    id: string;
    displayName: string;
    avatarUrl: string | null;
  }>;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  onRemove?: (id: string) => void;
}

export function AvatarChipGroup({
  members,
  max = 3,
  size = 'sm',
  onRemove,
}: AvatarChipGroupProps) {
  const visible = members.slice(0, max);
  const overflow = members.length - max;

  return (
    <div className="flex items-center flex-wrap gap-1.5">
      {visible.map((m) => (
        <AvatarChip
          key={m.id}
          name={m.displayName}
          avatarUrl={m.avatarUrl}
          size={size}
          showName={members.length === 1}
          onRemove={
            onRemove
              ? () => onRemove(m.id)
              : undefined
          }
        />
      ))}
      {overflow > 0 && (
        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
          +{overflow}
        </div>
      )}
    </div>
  );
}
