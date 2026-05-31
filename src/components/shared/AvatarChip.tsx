import React from 'react';
import { X } from 'lucide-react';

interface AvatarChipProps {
  name?: string;                    
  avatarUrl?: string | null;
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
  onRemove?: () => void;
}

function getInitials(name?: string): string {
  if (!name) return '?';            // ← guard
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function getColorFromName(name?: string): string {
  const colors = [
    'bg-blue-500',
    'bg-emerald-500',
    'bg-violet-500',
    'bg-amber-500',
    'bg-rose-500',
    'bg-cyan-500',
    'bg-indigo-500',
    'bg-pink-500',
  ];
  if (!name) return colors[0];      // ← guard
  const index = name
    .split('')
    .reduce(
      (acc, char) => acc + char.charCodeAt(0),
      0
    );
  return colors[index % colors.length];
}

export function AvatarChip({
  name,
  avatarUrl,
  size = 'md',
  showName = true,
  onRemove,
}: AvatarChipProps) {
  const displayName = name || 'Unknown';   // ← fallback

  const sizeClasses = {
    sm: {
      avatar: 'w-6 h-6 text-xs',
      chip: 'h-7 text-xs pl-1 pr-2',
      remove: 'w-4 h-4',
    },
    md: {
      avatar: 'w-8 h-8 text-sm',
      chip: 'h-9 text-sm pl-1 pr-3',
      remove: 'w-5 h-5',
    },
    lg: {
      avatar: 'w-10 h-10 text-base',
      chip: 'h-11 text-base pl-1 pr-3',
      remove: 'w-5 h-5',
    },
  }[size];

  const avatar = avatarUrl ? (
    <img
      src={avatarUrl}
      alt={displayName}
      className={`${sizeClasses.avatar} rounded-full object-cover`}
    />
  ) : (
    <div
      className={`${sizeClasses.avatar} rounded-full flex items-center justify-center text-white font-medium ${getColorFromName(name)}`}
    >
      {getInitials(name)}
    </div>
  );

  if (!showName && !onRemove) return avatar;

  return (
    <div
      className={`inline-flex items-center gap-1.5 ${sizeClasses.chip} rounded-full bg-gray-100 border border-gray-200`}
    >
      {avatar}
      {showName && (
        <span className="font-medium text-gray-700 truncate max-w-30">
          {displayName}
        </span>
      )}
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-0.5 p-0.5 rounded-full hover:bg-gray-300 transition-colors"
        >
          <X
            className={`${sizeClasses.remove} text-gray-400`}
          />
        </button>
      )}
    </div>
  );
}
