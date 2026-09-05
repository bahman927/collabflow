import React from 'react';
import { AvatarChip } from '../shared/AvatarChip';
import { Member, MemberTask } from '../../types/member';
import { Pencil } from 'lucide-react';
import { useAuth }            from '../../hooks/useAuth';
import { useMember }          from '../../context/MemberProvider';

 
 
interface MemberCardProps {
  member: Member;
  onEdit: () => void;
  canEdit: boolean;
}

const ROLE_BADGES: Record<string, string> = {
  owner: 'bg-amber-100 text-amber-800',
  admin: 'bg-blue-100 text-blue-800',
  member: 'bg-gray-100 text-gray-700',
  viewer: 'bg-green-100 text-green-700',
};

interface AssignmentRow {
  project: { id: number; name: string } | null;
  task: MemberTask | null;
}

export function MemberCard({
  member,
  onEdit,
  canEdit,
}: MemberCardProps) {
  const { user } = useAuth();
  const {members} = useMember()
  const currentMembership = members.find((m) => m.userId === user?.id.toString());

  // -----------------------------
  // Build assignment rows
  // -----------------------------
  let assignmentRows: AssignmentRow[] = [];

  // 1. One row per task (task already includes project)
  if (member.tasks?.length > 0) {
    assignmentRows = member.tasks.map(task => ({
      project: task.project,
      task
    }));
  }
  
  if (assignmentRows.length === 0 && member.projects?.length > 0) {
    assignmentRows = member.projects.map(project => ({
      project,
      task:null
    }));
  }

  if (member.projects?.length > 0 && member.tasks?.length > 0) {
    assignmentRows = member.tasks.map(task => {
      const project = member.projects.find(p => p.id === task.projectId) || null;
      return {
        project,
        task
      };
    });
  }
  
  // 3. If no tasks and no projects → empty row
  if (assignmentRows.length === 0) {
    assignmentRows = [{ project: null, task: null }];
  }

  // -----------------------------
  // Remove duplicate (project + task) rows
  // -----------------------------
  const uniqueRows: AssignmentRow[] = [];
  const seen = new Set<string>();

  assignmentRows.forEach(row => {
    const key = `${row.project?.id || 'none'}-${row.task?.id || 'none'}`;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueRows.push(row);
    }
  });
  // -----------------------------
  // Render
  // -----------------------------
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
      <div className="flex items-center gap-3">
        <AvatarChip
          name={member.displayName}
          avatarUrl={member.avatarUrl}
          size="md"
          showName={false}
        />

        <div className="flex flex-col gap-1">
          {/* Member Name */}
          <div className="font-medium text-gray-900">
            {member.displayName}
          </div>

          {/* Assignment rows */}
          {uniqueRows.map((row) => (
            <div
              key={`${member.id}-${row.project?.id || 'none'}-${row.task?.id || 'none'}`}
              className="flex items-center gap-3"
            >
              {/* Project badge */}
              {row.project ? (
                <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-blue-800">
                  project: {row.project.name}
                </span>
              ) : (
                <span className="text-gray-400 text-xs">No project</span>
              )}

              {/* Task badge */}
              {row.task ? (
                <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  task: {row.task.name}
                </span>
              ) : (
                <span className="text-gray-400 text-xs">No task</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Role + Edit button */}
      <div className="flex items-center gap-3">
        <span
          className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${ROLE_BADGES[member.role]}`}
        >
          {member.role}
        </span>

        { canEdit && (
          <button
            onClick={onEdit}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Pencil className="w-4 h-4 text-gray-400" />
          </button>
        )}

        
      </div>
    </div>
  );
}
