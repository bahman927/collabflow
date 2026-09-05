// src/context/WorkspaceProvider.tsx

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";

import {
  Workspace,
  WorkspaceCreateData,
  WorkspaceUpdateData,
  WorkspaceMember
} from "../types/workspace";

import { workspaceService } from "../services/workspaceService";
import { useAuth } from "../hooks/useAuth";
import { Task } from "@/types/task";
import { useProject } from "../context/ProjectProvider";
import { useTask } from "../context/TaskProvider";
import { useMember } from "../context/MemberProvider";
import { useActivity } from "../context/ActivityProvider";


interface WorkspaceContextType {
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  loading: boolean;
  error: string | null;

  setCurrentWorkspace: (ws: Workspace | null) => void;

  fetchWorkspaces: () => Promise<void>;
  selectWorkspace: (id: number) => Promise<void>;
  createWorkspace: (data: WorkspaceCreateData) => Promise<void>;
  updateWorkspace: (id: number, data: WorkspaceUpdateData) => Promise<void>;
  deleteWorkspace: (id: number) => Promise<void>;

  currentWorkspaceMember: WorkspaceMember | null;
  role: WorkspaceMember["role"] | null;

  canCreateProject: boolean;
  canCreateTask: boolean;
  canInvite: boolean;
  canEditTask: (task: Task) => boolean;
  
}

export const WorkspaceContext = createContext<WorkspaceContextType | null>(null);

export const WorkspaceProvider = ({ children }: { children: React.ReactNode }) => {
  const { apiFetch, user, tokens } = useAuth();
  // const { apiFetch, user, tokens, isAuthenticated } = useAuth();
  const isAuthenticated = !!user
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null);
  const [currentWorkspaceMember, setCurrentWorkspaceMember] =
    useState<WorkspaceMember | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  /**
   * Fetch all workspaces
   */
  const fetchWorkspaces = useCallback(
  async (preferredWorkspaceId?: number) => {
    try {
      setLoading(true);
      setError(null);

      const { url, options } = workspaceService.list();

      const data = await apiFetch<Workspace[]>(url, options);

      setWorkspaces(data);

      if (preferredWorkspaceId) {
        const invitedWorkspace = data.find(
          workspace => workspace.id === preferredWorkspaceId
        );

        if (invitedWorkspace) {
          setCurrentWorkspace(invitedWorkspace);
          return;
        }
      }

      if (!currentWorkspace && data.length > 0) {
        setCurrentWorkspace(data[0]);
      }

    } catch (err: any) {
      console.error("WORKSPACES ERROR:", err);
      setError(err.message || "Failed to load workspaces");
    } finally {
      setLoading(false);
    }
  },
  [apiFetch, currentWorkspace]
);

    /**
   * Select a workspace
   */
  const selectWorkspace = useCallback(
    async (id: number) => {
      try {
        setLoading(true);
        setError(null);

        const { url, options } = workspaceService.get(id);
        const ws = await apiFetch<Workspace>(url, options);

        setCurrentWorkspace(ws);
      } catch (err: any) {
        setError(err.message || "Failed to load workspace");
      } finally {
        setLoading(false);
      }
    },
    [apiFetch]
  );

  /**
   * Create workspace (optimistic)
   */
  const createWorkspace = useCallback(
    async (data: WorkspaceCreateData) => {
      try {
        setLoading(true);
        setError(null);

        const { url, options } = workspaceService.create(data);
        const ws = await apiFetch<Workspace>(url, options);

        setWorkspaces((prev) => [...prev, ws]);
        setCurrentWorkspace(ws);
      } catch (err: any) {
        setError(err.message || "Failed to create workspace");
      } finally {
        setLoading(false);
      }
    },
    [apiFetch]
  );

  /**
   * Update workspace
   */
  const updateWorkspace = useCallback(
    async (id: number, data: WorkspaceUpdateData) => {
      try {
        setLoading(true);
        setError(null);

        const { url, options } = workspaceService.update(id, data);
        const updated = await apiFetch<Workspace>(url, options);

        setWorkspaces((prev) =>
          prev.map((ws) => (ws.id === id ? updated : ws))
        );

        if (currentWorkspace?.id === id) {
          setCurrentWorkspace(updated);
        }
      } catch (err: any) {
        setError(err.message || "Failed to update workspace");
      } finally {
        setLoading(false);
      }
    },
    [apiFetch, currentWorkspace]
  );

  /**
   * Delete workspace (optimistic)
   */
  const deleteWorkspace = useCallback(
    async (id: number) => {
      try {
        setLoading(true);
        setError(null);

        // Optimistic UI update
        setWorkspaces((prev) => prev.filter((ws) => ws.id !== id));

        const { url, options } = workspaceService.delete(id);
        await apiFetch(url, options);

        if (currentWorkspace?.id === id) {
          setCurrentWorkspace(null);
        }
      } catch (err: any) {
        setError(err.message || "Failed to delete workspace");
      } finally {
        setLoading(false);
      }
    },
    [apiFetch, currentWorkspace]
  );

  

  /**
   * Auto-load workspaces when user logs in
   */

  useEffect(() => {

    if (!isAuthenticated || !tokens?.access) {
        return;
    }

    fetchWorkspaces();

  }, [
    isAuthenticated,
    tokens,
    fetchWorkspaces
  ]);
  
  useEffect(() => {
    if (!isAuthenticated) {
      setWorkspaces([]);
      setCurrentWorkspace(null);
      setCurrentWorkspaceMember(null);
      setError(null);
      setLoading(false);
    }
  }, [isAuthenticated]);

  // ---------------------------------------------------------
  // Load current user's membership for selected workspace
  // ---------------------------------------------------------
   useEffect(() => {
      if (!currentWorkspace) return;

      const loadMember = async () => {
        try {
           console.log(
            "loadMember currentWorkspace:",
            currentWorkspace
          );

          console.log(
            "loadMember workspace ID:",
            currentWorkspace?.id
          );

          const { url, options } = workspaceService.getMembership(currentWorkspace.id);
          const member = await apiFetch<WorkspaceMember>(url, options);
         

          setCurrentWorkspaceMember(member);
        } catch (err) {
          console.error("Failed to load workspace member", err);
          setCurrentWorkspaceMember(null);
        }
      };

     loadMember();
     
    }, [currentWorkspace?.id, apiFetch]);

    const role = currentWorkspaceMember?.role ?? null;

    const canCreateProject = role === "owner";
    const canCreateTask = role === "owner";
    const canInvite = role === "owner";

    const canEditTask = (task: Task) =>
      task.assignees?.some((a) => a.id === user?.id);

  return (
    <WorkspaceContext.Provider
      value={{
        workspaces,
        role,
        currentWorkspace,
        loading,
        error,
        setCurrentWorkspace,
        fetchWorkspaces,
        selectWorkspace,
        createWorkspace,
        updateWorkspace,
        deleteWorkspace,
        currentWorkspaceMember,
        canCreateProject,
        canCreateTask,
        canInvite,
        canEditTask,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error("useWorkspace must be used inside WorkspaceProvider");
  return ctx;
};



 