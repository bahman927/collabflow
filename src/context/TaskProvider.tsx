import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo
} from "react";

import {
  Task,
  TaskStatus,
  TaskCreateData,
  TaskUpdateData,
} from "../types/task";

import { taskService }  from "../services/taskService";
import { useAuth }      from "../hooks/useAuth";
import { useProject }   from "./ProjectProvider";
import { useMember }    from "./MemberProvider";
import { useWorkspace } from "../hooks/useWorkspace";
import { useActivity } from "../context/ActivityProvider";



interface TaskContextType {
  tasks: Task[];
  groupedTasks: Record<TaskStatus, Task[]>; 
  currentTask: Task | null;
  setCurrentTask: (task: Task | null) => void;
  loadTasks: (projectId?: number) => Promise<void>;
  loading: boolean;
  error: string | null;
  fetchTasks: (workspaceId: number) => Promise<void>;
  createTask: (data: TaskCreateData) => Promise<void>;
  updateTask: (id: string | number, data: TaskUpdateData) => Promise<void>; 
  deleteTask: (id: number) => Promise<void>;                       
  moveTask: (id: number, status: TaskStatus) => Promise<void>; 
  getWorkspaceTasks: (workspaceId: number) => Task[];
  getCurrentWorkspaceTasks: () => Task[];
  removeAssignee: (taskId: number, memberId: number) => Promise<void>;
  updateTaskInState: (taskId: number, patch: Partial<Task>) => void;
  

}


const TaskContext = createContext<TaskContextType | null>(null);

export const TaskProvider = ({ children }: { children: React.ReactNode }) => {

  const { apiFetch, isAuthenticated } = useAuth();
  const { currentProject, projects, setCurrentProject } = useProject();
  const { role, currentWorkspace, currentWorkspaceMember } = useWorkspace();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [workspaceTasks, setWorkspaceTasks] = useState<Task[]>([]);
  const { setMembers } = useMember();
  const activity = useActivity();

 const normalizedRole = role?.toLowerCase();
 const normalizeStatus = (s: string): TaskStatus => {
  if (!s) return "todo"; // fallback
  switch (s.toUpperCase()) {
    case "TODO":
      return "todo";
    case "IN_PROGRESS":
    case "IN-PROGRESS":
    case "IN PROGRESS":
      return "in_progress";
    case "DONE":
      return "done";
    case "OVERDUE":
      return "overdue";
    default:
      return "todo";
  }
};

  const loadTasks = useCallback(
      async (projectId?: number) => {
        if (!currentWorkspace) return;

        try {
          setLoading(true);
          setError(null);

          // 1. Fetch all tasks for the workspace
          const { url, options } = taskService.list(currentWorkspace.id);
          const allTasks = await apiFetch<Task[]>(url, options);
         
          // 2. Filter by project (if provided)
          let filtered = projectId
            ? allTasks.filter((t) => t.project === projectId)
            : allTasks;

          // 3. Filter by membership (owner sees all, member sees assigned)
          const normalizedRole = role?.toLowerCase();

          if (normalizedRole !== "owner") {
            const userId = currentWorkspaceMember?.user?.id;

            filtered = filtered.filter((task) =>
              task.assignees?.some((a) => a.id === userId)
            );
          }

          // 4. Update state
          setTasks(filtered);

           
        } catch (err: any) {
          console.error("TASK LOAD ERROR:", err);
          setError(err.message || "Failed to load tasks");
        } finally {
          setLoading(false);
        }
      },
      [
        apiFetch,
        currentWorkspace,
        currentWorkspaceMember,
        // role,
        normalizedRole,
        currentTask,
      ]
    );


  const projectTasks = useMemo(() => {
      return tasks.filter(t => t.project_id === currentProject?.id);
  }, [tasks, currentProject?.id]);

  const groupedTasks = useMemo(() => {
      return projectTasks.reduce((acc, task) => {
        const key = normalizeStatus(task.status);
        if (!acc[key]) acc[key] = [];
        
        acc[key].push(task);
        return acc;
      }, {} as Record<TaskStatus, Task[]>);
    }, [projectTasks]);


// fetch from the backend
  const fetchProjectTasks = useCallback(async () => {
    if (!currentProject) return;

    const { url, options } = taskService.list(currentProject.id);
    const data = await apiFetch<Task[]>(url, options);

    // setProjectTasks(data);
  }, [apiFetch, currentProject]);


  const getWorkspaceTasks = useCallback(
    (WorkspaceId: number) => {
      return tasks.filter(
        t => t.workspace === WorkspaceId )
    },
    [tasks]
  );
  
  const getCurrentWorkspaceTasks = useCallback(() => {
    return tasks.filter(
      t => t.workspace === (currentWorkspace?.id ?? -1)
    );
  }, [tasks, currentWorkspace]);
 
  // -----------------------------
  // Fetch tasks for selected project
  // -----------------------------
  const fetchTasks = useCallback(
    async (workspaceId: number) => {
      if (!workspaceId) return;

      try {
        setLoading(true);
        setError(null);

        const { url, options } = taskService.list(workspaceId);
        const data = await apiFetch<Task[]>(url, options);

        setTasks(data);
 
      } catch (err: any) {
        setError(err.message || "Failed to load tasks");
      } finally {
        setLoading(false);
      }
  }, [apiFetch]);

   const fetchWorkspaceTasks = useCallback(async () => {
      if (!currentWorkspace) return;

      try {
        setLoading(true);
        setError(null);

        const { url, options } = taskService.list(
          currentWorkspace.id
        );

        const data = await apiFetch<Task[]>(url, options);
        setTasks(data);

      } catch (err: any) {
        setError(err.message || "Failed to load workspace tasks");
      } finally {
        setLoading(false);
      }
    }, [apiFetch, currentWorkspace]);

  // -----------------------------
  // Create task (optimistic)
  // -----------------------------
const createTask = useCallback(
  async (data: TaskCreateData) => {
    if (!currentProject) return;

    const tempId = -Math.floor(Math.random() * 1000000);

    const optimistic: Task = {
      id: tempId,
      name: data.name ?? "",
      description: data.description ?? "",
      status: "todo",
      priority: data.priority ?? "medium",
      due_date: data.due_date ?? null,
      project_id: currentProject!.id,
      project: currentProject!.id,
      workspace: currentWorkspace!.id,
      assignees: [],
      assignee_emails: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setTasks((prev) => [...prev, optimistic]);

    try {
      const nameExists = tasks.some(
        (t) => (t.name ?? "").toLowerCase() === (data.name ?? "").toLowerCase()
      );

      if (nameExists) {
        alert("A task with this name already exists.");
        return;
      }

      const { url, options } = taskService.create({
        name: data.name,
        description: data.description,
        project_id: currentProject.id,
        workspace: currentWorkspace!.id,
        assignee_ids: data.assignee_ids,
        priority: data.priority,
        due_date: data.due_date,
      });

      const created = await apiFetch<Task>(url, options);

      setTasks((prev) =>
        prev.map((t) => (t.id === tempId ? created : t))
      );

      // ⭐ NEW — refresh activity feed
      await activity.refresh();

    } catch (err) {
      setTasks((prev) => prev.filter((t) => t.id !== tempId));
      throw err;
    }
  },
  [apiFetch, currentProject, currentWorkspace, tasks, activity]
);

 

const updateTaskInState = (taskId: number, patch: Partial<Task>) => {
  setTasks(prev =>
    prev.map(t =>
      t.id === taskId
        ? { ...t, ...patch }
        : t
    )
  );
};

const removeAssignee = async (taskId: number, memberId: number) => {
  const task = tasks.find(t => t.id === taskId);
  if (!task) return;

  const { url, options } = taskService.removeAssignee(
    task.workspace,
    taskId,
    memberId
  );

  await apiFetch(url, options);
  const memberEmail = task.assignees.find(a => a.id === memberId)?.email;

  // ⭐ Update UI state
  setTasks(prev =>
    prev.map(t =>
      t.id === taskId
        ? {
            ...t,
            assignees: t.assignees.filter(a => a.id !== memberId),
             assignee_emails: memberEmail
              ? t.assignee_emails.filter(e => e !== memberEmail)
              : t.assignee_emails
          }
        : t
    )
  );

  // ⭐ NEW — refresh activity feed
  await activity.refresh();
};

 
  // -----------------------------
  // Update task (optimistic)
  // -----------------------------

 const updateTask = useCallback(
  async (id: string | number, data: TaskUpdateData) => {
    const numericId = Number(id);

    const existing = tasks.find(t => t.id === numericId);
    if (!existing) throw new Error("Task not found in state");

    const payload = {
      ...existing,
      ...data,
      project: existing.project,
      workspace: existing.workspace,
    };

    const { url, options } = taskService.update(numericId, data);
    const updated = await apiFetch<Task>(url, options);

    setTasks(prev =>
      prev.map(t => (t.id === numericId ? updated : t))
    );

    if (currentTask?.id === numericId) {
      setCurrentTask(updated);
    }

    // ⭐ NEW — refresh activity feed
    await activity.refresh();
  },
  [apiFetch, currentTask, tasks, activity]
);


  
   const tasksRef = useRef<Task[]>([]);

  useEffect(() => {
     tasksRef.current = tasks;
  }, [tasks]);


  // -----------------------------
  // Delete task (optimistic)
  // -----------------------------
const deleteTask = useCallback(
  async (id: number) => {
    const numericId = Number(id);

    const previous = tasksRef.current;

    // Optimistic removal
    setTasks(prev => prev.filter(t => t.id !== numericId));

    try {
      const { url, options } = taskService.delete(String(numericId));
      await apiFetch(url, options);

      setTasks(prev => prev.filter(t => t.id !== numericId));

      if (currentTask?.id === numericId) {
        setCurrentTask(null);
      }

      // ⭐ NEW — refresh activity feed
      await activity.refresh();

    } catch (err) {
      setTasks(previous);
      throw err;
    }
  },
  [apiFetch, currentTask, activity]
);

 

const moveTask = useCallback(
  async (id: number, status: TaskStatus) => {
    const numericId = Number(id);

    // ⭐ Optimistic update
    setTasks(prev =>
      prev.map(t =>
        t.id === numericId
          ? { ...t, status, updated_at: new Date().toISOString() }
          : t
      )
    );

    try {
      const { url, options } = taskService.update(id, { status });
      const updated = await apiFetch<Task>(url, options);

      setTasks(prev =>
        prev.map(t => (t.id === numericId ? updated : t))
      );

      if (currentTask?.id === numericId) {
        setCurrentTask(updated);
      }

      // ⭐ NEW — refresh activity feed
      await activity.refresh();

    } catch (err) {
      if (currentWorkspace?.id) {
        await fetchTasks(currentWorkspace.id);
      }
      throw err;
    }
  },
  [apiFetch, currentTask, fetchTasks, currentWorkspace, activity]
);


 
useEffect(() => {
  if (projects.length > 0 && !currentProject) {
    setCurrentProject(projects[0]);
  }
}, [projects, currentProject]);


  // -----------------------------
  // Reset on logout
  // -----------------------------
  useEffect(() => {
    if (!isAuthenticated) {
      setTasks([]);
      setCurrentTask(null);
      setError(null);
      setLoading(false);
    }
  }, [isAuthenticated]);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        groupedTasks,
        currentTask,
        setCurrentTask,
        loading,
        error,
        fetchTasks,
        createTask,
        updateTask,
        deleteTask,
        moveTask,
        getWorkspaceTasks,
        getCurrentWorkspaceTasks,
        loadTasks,
        removeAssignee,
        updateTaskInState,

      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = () => {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error("useTask must be used inside TaskProvider");
  return ctx;
};
