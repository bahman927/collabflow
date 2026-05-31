import React from 'react';

// ── Types ──────────────────────────────────────────────
interface AvatarChipProps {
  name?: string;
  email?: string;
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
  onRemove?: () => void;
}

// ── Color from name ────────────────────────────────────
const COLORS = [
  '#EF4444', '#F97316', '#F59E0B', '#10B981',
  '#06B6D4', '#3B82F6', '#6366F1', '#8B5CF6',
  '#EC4899', '#14B8A6', '#84CC16', '#F43F5E',
];

const getColorFromName = (name?: string): string => {
  if (!name) return '#9CA3AF'; // fallback gray
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return COLORS[hash % COLORS.length];
};

// ── Initials from name ─────────────────────────────────
const getInitials = (name?: string, email?: string): string => {
  if (name) {
    const parts = name.trim().split(' ').filter(Boolean);
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return parts[0]?.[0]?.toUpperCase() || '?';
  }
  if (email) return email[0].toUpperCase();
  return '?';
};

// ── Size classes ───────────────────────────────────────
const sizeClasses = {
  sm: { avatar: 'w-6 h-6 text-xs',   chip: 'text-xs px-2 py-0.5' },
  md: { avatar: 'w-8 h-8 text-sm',   chip: 'text-sm px-2.5 py-1' },
  lg: { avatar: 'w-10 h-10 text-base', chip: 'text-sm px-3 py-1.5' },
};

// ── Component ──────────────────────────────────────────
const AvatarChip: React.FC<AvatarChipProps> = ({
  name,
  email,
  size = 'md',
  showName = true,
  onRemove,
}) => {
  const displayName = name || email || 'Unknown';
  const initials = getInitials(name, email);
  const bgColor = getColorFromName(name || email);
  const classes = sizeClasses[size];

  return (
    <span className={`inline-flex items-center gap-1.5 bg-gray-100 rounded-full ${classes.chip}`}>
      {/* Avatar circle */}
      <span
        className={`inline-flex items-center justify-center rounded-full text-white font-medium shrink-0 ${classes.avatar}`}
        style={{ backgroundColor: bgColor }}
        title={displayName}
      >
        {initials}
      </span>

      {/* Name */}
      {showName && (
        <span className="truncate max-w-30 text-gray-700">{displayName}</span>
      )}

      {/* Remove button */}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-0.5 text-gray-400 hover:text-gray-600"
          aria-label={`Remove ${displayName}`}
        >
          ×
        </button>
      )}
    </span>
  );
};

export default AvatarChip;
