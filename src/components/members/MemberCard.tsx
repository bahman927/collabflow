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

if (member.projects?.length > 0) {

  member.projects.forEach(project => {
    member.projects?.forEach(project => {
 
  const projectTasks =
    member.tasks?.filter(task => task.projectId === project.id) || [];

  // ...
});
    const projectTasks =
      member.tasks?.filter(task => task.projectId === project.id) || [];

    if (projectTasks.length > 0) {
      // Project has tasks → one row for each task
      projectTasks.forEach(task => {
        assignmentRows.push({
          project,
          task,
        });
      });
    } else {
      // Project has no tasks → show project once
      assignmentRows.push({
        project,
        task: null,
      });
    }
  });
} else {
  assignmentRows = [
    {
      project: null,
      task: null,
    },
  ];
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
  <div className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white px-3 py-3 transition-colors hover:border-gray-300 sm:flex-row sm:items-center sm:justify-between sm:px-4">

    {/* Member information + assignments */}
    <div className="flex min-w-0 items-start gap-3">

      <div className="shrink-0">
        <AvatarChip
          name={member.displayName}
          avatarUrl={member.avatarUrl}
          size="md"
          showName={false}
        />
      </div>

      <div className="flex min-w-0 flex-col gap-1">

        {/* Member Name */}
        <div className="font-medium text-gray-900 wrap-break-word">
          {member.displayName}
        </div>

        {/* Assignment rows */}
        {uniqueRows.map((row) => (
          <div
            key={`${member.id}-${row.project?.id || 'none'}-${row.task?.id || 'none'}`}
            className="flex flex-wrap items-center gap-2 sm:gap-3"
          >

            {/* Project badge */}
            {row.project ? (
              <span className="inline-flex max-w-full rounded-full bg-pink-100 px-2.5 py-1 text-xs font-medium text-blue-800 wrap-break-word">
                project: {row.project.name}
              </span>
            ) : (
              <span className="text-xs text-gray-400">
                No project
              </span>
            )}

            {/* Task badge */}
            {row.task ? (
              <span className="inline-flex max-w-full rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-800 wrap-break-word">
                task: {row.task.name}
              </span>
            ) : (
              <span className="text-xs text-gray-400">
                No task
              </span>
            )}

          </div>
        ))}
      </div>
    </div>

    {/* Role + Edit button */}
    <div className="flex shrink-0 items-center justify-between gap-3 border-t border-gray-100 pt-2 sm:justify-end sm:border-0 sm:pt-0">

      <span
        className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${ROLE_BADGES[member.role]}`}
      >
        {member.role}
      </span>

      {canEdit && member.role?.toLowerCase() !== "owner" && (
        <button
          type="button"
          onClick={onEdit}
          aria-label={`Edit ${member.displayName}`}
          className="shrink-0 rounded-lg p-2 transition-colors hover:bg-gray-100"
        >
          <Pencil className="h-4 w-4 text-gray-400" />
        </button>
      )}

    </div>
  </div>
);

   
}
