// src/components/AddMemberModal.tsx

import { useState, useEffect, useMemo } from 'react';
import { useAuth }             from '../../hooks/useAuth';
import { useWorkspace }        from '../../context/WorkspaceProvider';
import { invitationService }   from '../../services/invitationService';
import { projectService }      from '../../services/projectService';
import { taskService }         from '../../services/taskService';
import   apiFetch              from '../../api/apiFetch2';
import {useTask}               from "../../context/TaskProvider"
// import { useMember }           from '../../context/MemberProvider';
import { MemberRole, Member, MemberInvite }          from '../../types/member';
import { useMember } from "../../context/MemberProvider";


interface Props {
  isOpen: boolean;
  onClose: () => void;
  inviteMember: (data: MemberInvite) => Promise<Member>;
}

interface ProjectOption {
  id: number;
  name: string;
}

interface TaskOption {
  id: number;
  title: string;
  projectId: number;
}
 

export default function AddMemberModal({ isOpen, onClose, inviteMember }: Props) {
  const { tokens, setTokens, logout } = useAuth();
  const { currentWorkspace } = useWorkspace();
  const [role, setRole] = useState<MemberRole>('member');
  const [email, setEmail] = useState('');
  const [selectedProjects, setSelectedProjects] = useState<number[]>([]);
  const [selectedTasks, setSelectedTasks] = useState<number[]>([]);
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { members, setMembers } = useMember();
  const { fetchTasks } = useTask();   // ⭐ import from TaskProvider

  const { tasks: allTasks } = useTask();

  // ── Load projects when modal opens ──────────────────
  useEffect(() => {
    if (!isOpen || !currentWorkspace) return;

    const loadProjects = async () => {
      try {
        const config = projectService.list(currentWorkspace.id);
        const data = await apiFetch<ProjectOption[]>(
          config.url,
          config.options,
          () => tokens,
          setTokens,
          logout
        );

        setProjects(data ?? []);
        console.log("data -projects :", data)
        console.log("projects state :", projects)
      } catch (err) {
        console.error('Failed to load projects:', err);
      }
    };

    loadProjects();
  }, [isOpen, currentWorkspace]);


const filteredTasks = useMemo(() => {
  if (selectedProjects.length === 0) return [];
  return allTasks
    .filter(t => selectedProjects.includes(t.project_id))
    .map(t => ({
      id: t.id,
      title: t.name,        // API returns 'name', not 'title'
      projectId: t.project_id,
    }));
}, [selectedProjects, allTasks]);

  useEffect(() => {
    if (!isOpen) {
      setEmail('');
      setRole('member');
      setSelectedProjects([]);
      setSelectedTasks([]);
      setProjects([]);
      // setTasks([]);
      setError('');
    }
  }, [isOpen]);

  // ── Handlers ───────────────────────────────────────
  const toggleProject = (id: number) => {
    setSelectedProjects((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const toggleTask = (id: number) => {
    setSelectedTasks((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!currentWorkspace) return;
  setError('');
  setLoading(true);
  try {
    const res = await inviteMember({
      email,
      role,
      taskIds: selectedTasks,
    });
    // Update member list safely (prevents duplicate React keys)
    setMembers(prev =>
     prev.some(m =>
     m.id === res.id &&
     m.tasks?.some(t => t.id === res.tasks?.[0]?.id)
     ) ? prev : [...prev, res]
    );

    await fetchTasks(currentWorkspace.id);
   // refresh task list immediately
    onClose();
  } catch (err: any) {
    const backendError =
      err?.response?.data?.error ||
      err?.response?.data?.detail ||
      err?.message ||
      'Failed to send invitation.';

    setError(backendError);
  } finally {
    setLoading(false);
  }
};

 
  // ── Render ─────────────────────────────────────────
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Invite Member
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jane@example.com"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as MemberRole)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>

          {/* Project Assignment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assign to Projects
              <span className="text-gray-400 font-normal ml-1">(optional)</span>
            </label>
            {projects.length === 0 ? (
              <p className="text-sm text-gray-400">
                No projects in this workspace yet.
              </p>
            ) : (
              <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-3">
                {projects.map((project) => (
                  <label
                    key={project.id}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedProjects.includes(project.id)}
                      onChange={() => toggleProject(project.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">
                      {project.name}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Task Assignment — only shows when projects are selected */}
     {filteredTasks.length > 0 && (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Assign to Tasks
          <span className="text-gray-400 font-normal ml-1">(optional)</span>
        </label>
        <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-3">
          {filteredTasks.map((task) => (
            <label key={task.id} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedTasks.includes(task.id)}
                onChange={() => toggleTask(task.id)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">
                {task.title}
              </span>
            </label>
          ))}
        </div>
      </div>
    )}


      {/* Error */}
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Sending...' : 'Send Invite'}
        </button>
      </div>
    </form>
   </div>
   </div>
  );
}
