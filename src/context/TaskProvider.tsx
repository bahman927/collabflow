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
import { useWorkspace } from "../hooks/useWorkspace";

interface TaskContextType {
  tasks: Task[];
  groupedTasks: Record<TaskStatus, Task[]>; 
  currentTask: Task | null;
  setCurrentTask: (task: Task | null) => void;
  loadTasks: (projectId?: number) => Promise<void>;
  loading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  createTask: (data: TaskCreateData) => Promise<void>;
  updateTask: (id: string, data: TaskUpdateData) => Promise<void>; 
  deleteTask: (id: number) => Promise<void>;                       
  moveTask: (id: number, status: TaskStatus) => Promise<void>; 
  getWorkspaceTasks: (workspaceId: number) => Task[];
  getCurrentWorkspaceTasks: () => Task[];

}


const TaskContext = createContext<TaskContextType | null>(null);

export const TaskProvider = ({ children }: { children: React.ReactNode }) => {
  const { apiFetch, isAuthenticated } = useAuth();
  const { currentProject } = useProject();
  const { role, currentWorkspace, currentWorkspaceMember } = useWorkspace();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [workspaceTasks, setWorkspaceTasks] = useState<Task[]>([]);
  // const [projectTasks, setProjectTasks] = useState<Task[]>([]);


  // const normalizeStatus = (s: string): TaskStatus =>
  //    s.toLowerCase() as TaskStatus;

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
          let projectTasks = projectId
            ? allTasks.filter((t) => t.project === projectId)
            : allTasks;

          // 3. Filter by membership (owner sees all, member sees assigned)
          if (role !== "owner") {
            const userId = currentWorkspaceMember?.user.id;

            projectTasks = projectTasks.filter((task) =>
              task.assignees?.some((a) => a.id === userId)
            );
          }

          // 4. Update state
          setTasks(projectTasks);

          // 5. Auto-select first task
          if (!currentTask && projectTasks.length > 0) {
            setCurrentTask(projectTasks[0]);
          }
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
        role,
        currentTask,
      ]
    );


  const projectTasks = useMemo(() => {
      return tasks.filter(t => t.project_id === currentProject?.id);
  }, [tasks, currentProject?.id]);

  const groupedTasks = useMemo(() => {
      console.log('projectTasks : ', projectTasks)
      return projectTasks.reduce((acc, task) => {
        const key = normalizeStatus(task.status);
        if (!acc[key]) acc[key] = [];
        
        acc[key].push(task);
        return acc;
      }, {} as Record<TaskStatus, Task[]>);
    }, [projectTasks]);

  console.log('groupedTasks in taskProvider : ', groupedTasks)

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
        // t => t.workspace === workspaceId);
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
  const fetchTasks = useCallback(async () => {
      if (!currentProject) return;

      try {
        setLoading(true);
        setError(null);

        const { url, options } = taskService.list(currentProject.id);
        const data = await apiFetch<Task[]>(url, options);

        setTasks(data);

        // Auto-select first task if none selected
        if (!currentTask && data.length > 0) {
          setCurrentTask(data[0]);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load tasks");
      } finally {
        setLoading(false);
      }
  }, [apiFetch, currentProject]);

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
        // setWorkspaceTasks(data);

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
        description: data.description ?? "",   // ⭐ never undefined

        status: "todo",         // ⭐ fallback
        priority: data.priority ?? "medium",   // ⭐ fallback

        due_date: data.due_date ?? null,       // ⭐ null is allowed

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
          (t) => (t.name ?? "").toLowerCase() === (name ?? "").toLowerCase()

        );

        if (nameExists) {
          alert("A task with this name already exists.");
          return;
        }

       // ✅ NEW — passes everything through
        const { url, options } = taskService.create({
          name: data.name,
          description: data.description,
          project_id: currentProject?.id!,
          assignee_ids: data.assignee_ids,
          priority: data.priority,
          due_date: data.due_date,
        });


        const created = await apiFetch<Task>(url, options);

        setTasks((prev) =>
          prev.map((t) => (t.id === tempId ? created : t))
        );
      } catch (err) {
        setTasks((prev) => prev.filter((t) => t.id !== tempId));
        throw err;
      }
    },
  [apiFetch, currentProject]
);

  // -----------------------------
  // Update task (optimistic)
  // -----------------------------

 const updateTask = useCallback(
  async (id: string, data: TaskUpdateData) => {
    const numericId = Number(id);

    const { url, options } = taskService.update(numericId, data);
    const updated = await apiFetch<Task>(url, options);

    setTasks(prev =>
      prev.map(t => (t.id === numericId ? updated : t))
    );

    if (currentTask?.id === numericId) {
      setCurrentTask(updated);
    }
  },
  [apiFetch, currentTask]
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

    // Store previous state for rollback
    const previous = tasksRef.current;

    // Optimistic update
    setTasks((prev) => prev.filter((t) => t.id !== numericId));

    try {
      const { url, options } = taskService.delete(String(numericId));
      await apiFetch(url, options);

      // Ensure state stays clean after server confirms
      setTasks((prev) => prev.filter((t) => t.id !== numericId));

      // Clear currentTask if it was deleted
      if (currentTask?.id === numericId) {
        setCurrentTask(null);
      }
      console.log("ProjectPage rendered", tasks.length);

    } catch (err) {
      // Rollback on failure
      setTasks(previous);
      throw err;
    }
  },
  [apiFetch, currentTask]
);
 

  const moveTask = useCallback(
      async (id: number, status: TaskStatus) => {
        const numericId = Number(id);
        // optimistic update
        setTasks(prev =>
          prev.map(t =>
            t.id === numericId ? { ...t, status, updated_at: new Date().toISOString() } : t
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
        } catch (err) {
          await fetchTasks(); // rollback
          throw err;
        }
      },
  [apiFetch, currentTask, fetchTasks]
);

 
   useEffect(() => {
    console.log('currentTask in effect-dashboard :', currentTask)
      if (currentWorkspace) {
        fetchWorkspaceTasks();
         setCurrentTask(null);  
      }
    }, [currentWorkspace, fetchWorkspaceTasks]);

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
