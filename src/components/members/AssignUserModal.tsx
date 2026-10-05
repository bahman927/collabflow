// src/components/AddMemberModal.tsx

import { useState, useEffect } from 'react';
import { useAuth }             from '../../hooks/useAuth';
import { useWorkspace }        from '../../context/WorkspaceProvider';
import { projectService }      from '../../services/projectService';
import   apiFetch              from '../../api/ApiFetch2';
import {useTask}               from "../../context/TaskProvider"
import { useActivity }       from "../../context/ActivityProvider"
import { useMember } from "../../context/MemberProvider";


interface Props {
  isOpen: boolean;
  onClose: () => void;
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
 

export default function AssignUserModal({ isOpen, onClose }: Props) {
  const { tokens, setTokens, logout } = useAuth();
  const { currentWorkspace }          = useWorkspace();
  const [email, setEmail]             = useState('');
  const [selectedProjects, setSelectedProjects] = useState<number[]>([]);
  const [selectedTasks, setSelectedTasks] = useState<number[]>([]);
  const [projects, setProjects]       = useState<ProjectOption[]>([]);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState('');
  const { fetchTasks, loadTasks, assign }     = useTask();   
  const [filteredTasks, setFilteredTasks] = useState<TaskOption[]>([]);
  const [projectTasksMap, setProjectTasksMap] = useState<Record<number, TaskOption[]>>({});
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);
  const { members, fetchMembers } = useMember();
  const { fetchActivity } = useActivity();
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
        // console.log("data -projects :", data)
        // console.log("projects state :", projects)
      } catch (err) {
        console.error('Failed to load projects:', err);
      }
    };

    loadProjects();
  }, [isOpen, currentWorkspace]);

  
  useEffect(() => {
    if (!isOpen) {
      setEmail('');
      setSelectedProjects([]);
      setSelectedTasks([]);
      setProjects([]);
      setError('');
    }
  }, [isOpen]);

  // ── Handlers ───────────────────────────────────────
 
 

const toggleProject = async (projectId: number) => {
  setSelectedProjects(prev => {
    const next = prev.includes(projectId)
      ? prev.filter(id => id !== projectId)
      : [...prev, projectId];

     
    // if none selected after toggle, you can clear tasks if you want
    if (next.length === 0) {
       setSelectedTasks([]);
      // optional: clear tasks in local state if you keep a separate list
    }

    return next;
  });
};

useEffect(() => {
  if (selectedProjects.length === 0) {
    setFilteredTasks([]);
    return;
  }

  const load = async () => {
    const newMap: Record<number, TaskOption[]> = {};

    for (const projectId of selectedProjects) {
      const tasksForProject = await loadTasks(projectId); // ⭐ modify loadTasks to return tasks
      newMap[projectId] = tasksForProject.map(t => ({
        id: t.id,
        title: t.name,
        projectId: t.project,
      }));
    }

    setProjectTasksMap(newMap);

    // merge all selected project tasks
    const merged = Object.values(newMap).flat();
    setFilteredTasks(merged);
  };

  load();
}, [selectedProjects]);


  
  const toggleTask = (id: number) => {
    setSelectedTasks((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };
 

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  //  console.log("=== HANDLE SUBMIT START ===");
  // console.log("selectedMemberId:", selectedMemberId);
  // console.log("selectedProjects:", selectedProjects);
  // console.log("selectedTasks:", selectedTasks);
  // console.log("BEFORE MEMBER CHECK");

  if (!selectedMemberId){
    //  console.log("STOP: no selected member");
  setError("Please select a member.");
    return;
  }

  // console.log("PASSED MEMBER CHECK");

  //   if (selectedTasks.length === 0) {
  //   return;
  // }

  if (selectedProjects.length === 0 && selectedTasks.length === 0) {
      // console.log("STOP: no project or task selected");
    setError("Please select at least one project or task.");
    return;
  }

  // console.log("PASSED PROJECT/TASK CHECK");

  setLoading(true);
  setError('');

console.log("LOADING SET");

  try {
  // -----------------------------------------
    // 1. Assign member to selected projects
    // -----------------------------------------
    for (const projectId of selectedProjects) {
      //  console.log("ABOUT TO ASSIGN PROJECT:", projectId);
      const config = projectService.assignMember(
        projectId,
        selectedMemberId
      );

  //      console.log("ASSIGN PROJECT");
  // console.log("projectId:", projectId);
  // console.log("selectedMemberId:", selectedMemberId);
  // console.log("url:", config.url);
  // console.log("options:", config.options);


      const result = await apiFetch(
        config.url,
        config.options,
        () => tokens,
        setTokens,
        logout
      );

      // console.log("PROJECT ASSIGN RESPONSE:", result);

    }


    

    for (const taskId of selectedTasks) {
      await assign(taskId, selectedMemberId);
    }
    await fetchMembers()
    await fetchTasks();
    await fetchActivity();

    onClose();

  } catch (err) {
    console.error("Assignment failed:", err);
    setError("Failed to assign member.");

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
          User Assignment
        </h2>
         {/* Member Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Assign User
          </label>

          <select
            value={selectedMemberId ?? ""}
            onChange={(e) =>
              setSelectedMemberId(Number(e.target.value))
            }
            className=" mb-8 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
          >
            <option value="">
              Select member
            </option>

            {/* {members.map((member) => ( */}
            {members
              .filter(
                (member) => member.role?.toLowerCase() !== "viewer"
              )
              .map((member) => (
              <option
                key={member.id}
                value={member.id}
              >
                {member.email}
              </option>
            ))}
          </select>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5 ">
          
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
              {loading ? 'Assigning...' : 'Assign'}
            </button>
          </div>
        </form>
       
   </div>
   </div>
  );
}
