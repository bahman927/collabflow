import React, { useState, useMemo } from 'react';
import { useWorkspace } from '../../context/WorkspaceProvider';
import { Modal } from '../shared/Modal';
import {
  MultiSelectDropdown,
  SelectOption,
} from '../shared/MultiSelectDropdown';
import { AvatarChipGroup } from '../shared/AvatarChipGroup';
import { useMember } from '../../context/MemberProvider';
import { useTask } from '../../context/TaskProvider';
import { useProject } from '../../context/ProjectProvider';

type Priority = 'none' | 'low' | 'medium' | 'high' | 'urgent';

interface TaskCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultProjectId?: number;
}

export function TaskCreationModal({
  isOpen,
  onClose,
  defaultProjectId,
}: TaskCreationModalProps) {
  const { activeMembers } = useMember();
  const { createTask } = useTask();
  const { projects } = useProject();
  const { currentWorkspace } = useWorkspace();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assigneeIds, setAssigneeIds] = useState<string[]>([]);
  const [projectId, setProjectId] = useState<number | null>(
  defaultProjectId ?? null
);
  const [priority, setPriority] = useState<Priority>('none');
  const [dueDate, setDueDate] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Map members to dropdown options
  const memberOptions: SelectOption[] = useMemo(
    () =>
      activeMembers.map((m) => ({
        id: m.id.toString(),
        label: m.displayName,
        sublabel: m.email,
        avatarUrl: m.avatarUrl,
      })),
    [activeMembers]
  );

  // Get selected member objects for preview
  const selectedMembers = useMemo(
    () =>
      activeMembers.filter((m) =>
        assigneeIds.includes(m.id.toString())
      ),
    [activeMembers, assigneeIds]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
   if (!title.trim() || !currentWorkspace || !projectId) return;

    setSubmitting(true);
    setError(null);
    try {
      await createTask({
        name: title.trim(),
        description: description.trim() || undefined,
        assignee_ids: assigneeIds.map(Number),
        project_id: projectId,
        workspace_id: currentWorkspace.id, 
        
      });
      resetForm();
      onClose();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to create task'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setAssigneeIds([]);
    setProjectId(defaultProjectId || null);
    setPriority('none');
    setDueDate('');
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };
  return (
  <Modal
    isOpen={isOpen}
    onClose={handleClose}
    title="Create Task"
    size="lg"
    footer={
      <div className="flex w-full flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">

        <button
          type="button"
          onClick={handleClose}
          className="w-full rounded-lg px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 sm:w-auto sm:py-2"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!title.trim() || submitting}
          className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm text-white hover:bg-blue-700 disabled:opacity-50 sm:w-auto sm:py-2"
        >
          {submitting ? "Creating..." : "Create Task"}
        </button>

      </div>
    }
  >
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-3 text-sm text-red-700 wrap-break-word sm:px-4">
          {error}
        </div>
      )}

      {/* Title */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          Title
        </label>

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 sm:py-2 sm:text-sm"
          autoFocus
          required
        />
      </div>

      {/* Description */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          Description
        </label>

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add more details..."
          rows={3}
          className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-base outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 sm:py-2 sm:text-sm"
        />
      </div>

      {/* Project + Priority */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

        {/* Project */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Project
          </label>

          <select
            value={projectId ?? ""}
            onChange={(e) =>
              setProjectId(
                e.target.value ? Number(e.target.value) : null
              )
            }
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base sm:py-2 sm:text-sm"
          >
            <option value="">No project</option>

            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Priority */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Priority
          </label>

          <select
            value={priority}
            onChange={(e) =>
              setPriority(e.target.value as Priority)
            }
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base sm:py-2 sm:text-sm"
          >
            <option value="none">None</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>

      </div>

      {/* Assignees */}
      <MultiSelectDropdown
        label="Assignees"
        options={memberOptions}
        selected={assigneeIds}
        onChange={setAssigneeIds}
        placeholder="Search members to assign..."
      />

      {/* Due Date */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          Due Date
        </label>

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 sm:py-2 sm:text-sm"
        />
      </div>

    </form>
  </Modal>
);

  // return (
  //   <Modal
  //     isOpen={isOpen}
  //     onClose={handleClose}
  //     title="Create Task"
  //     size="lg"
  //     footer={
  //       <>
  //         <button
  //           onClick={handleClose}
  //           className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
  //         >
  //           Cancel
  //         </button>
  //         <button
  //           onClick={handleSubmit}
  //           disabled={!title.trim() || submitting}
  //           className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
  //         >
  //           {submitting ? 'Creating...' : 'Create Task'}
  //         </button>
  //       </>
  //     }
  //   >
  //     <form onSubmit={handleSubmit} className="space-y-4">
  //       {error && (
  //         <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
  //           {error}
  //         </div>
  //       )}

  //       {/* Title */}
  //       <div>
  //         <label className="block text-sm font-medium text-gray-700 mb-1.5">
  //           Title
  //         </label>
  //         <input
  //           type="text"
  //           value={title}
  //           onChange={(e) => setTitle(e.target.value)}
  //           placeholder="What needs to be done?"
  //           className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
  //           autoFocus
  //           required
  //         />
  //       </div>

  //       {/* Description */}
  //       <div>
  //         <label className="block text-sm font-medium text-gray-700 mb-1.5">
  //           Description
  //         </label>
  //         <textarea
  //           value={description}
  //           onChange={(e) => setDescription(e.target.value)}
  //           placeholder="Add more details..."
  //           rows={3}
  //           className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
  //         />
  //       </div>

  //       {/* Two-column row: Project + Priority */}
  //       <div className="grid grid-cols-2 gap-4">
  //         <div>
  //           <label className="block text-sm font-medium text-gray-700 mb-1.5">
  //             Project
  //           </label>
  //           // ✅ After — convert string to number at the boundary
  //           <select
  //             value={projectId ?? ''}
  //             onChange={(e) =>
  //               setProjectId(
  //                 e.target.value ? Number(e.target.value) : null
  //               )
  //             }
  //             className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white"
  //           >
  //             <option value="">No project</option>
  //             {projects.map((p) => (
  //               <option key={p.id} value={p.id}>
  //                 {p.name}
  //               </option>
  //             ))}
  //           </select>

  //         </div>
  //         <div>
  //           <label className="block text-sm font-medium text-gray-700 mb-1.5">
  //             Priority
  //           </label>
  //           <select
  //             value={priority}
  //             onChange={(e) =>
  //               setPriority(e.target.value as Priority)
  //             }
  //             className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white"
  //           >
  //             <option value="none">None</option>
  //             <option value="low">Low</option>
  //             <option value="medium">Medium</option>
  //             <option value="high">High</option>
  //             <option value="urgent">Urgent</option>
  //           </select>
  //         </div>
  //       </div>

  //       {/* Assignees - Multi-select dropdown */}
  //       <MultiSelectDropdown
  //         label="Assignees"
  //         options={memberOptions}
  //         selected={assigneeIds}
  //         onChange={setAssigneeIds}
  //         placeholder="Search members to assign..."
  //       />

  //       {/* Due Date */}
  //       <div>
  //         <label className="block text-sm font-medium text-gray-700 mb-1.5">
  //           Due Date
  //         </label>
  //         <input
  //           type="date"
  //           value={dueDate}
  //           onChange={(e) => setDueDate(e.target.value)}
  //           className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
  //         />
  //       </div>
  //     </form>
  //   </Modal>
  // );
}
