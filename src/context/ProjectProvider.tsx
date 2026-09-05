// src/context/ProjectProvider.tsx

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";

import { Project, ProjectCreateData, ProjectUpdateData } from "../types/project";
import { projectService }    from "../services/projectService";
import { useAuth }           from "../hooks/useAuth";
import { useWorkspace }      from "./WorkspaceProvider";
import { useActivity }          from "../context/ActivityProvider";

interface ProjectContextType {
  projects: Project[];
  currentProject: Project | null;
  setCurrentProject: (project: Project | null) => void;
  fetchProjects: () => Promise<void>;
  createProject: (data: ProjectCreateData) => Promise<void>;
  updateProject: (id: number, data: ProjectUpdateData) => Promise<void>;
  deleteProject: (id: number) => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType | null>(null);

export const ProjectProvider = ({ children }: { children: React.ReactNode }) => {
  const { apiFetch } = useAuth();
  const { currentWorkspace } = useWorkspace();
  const activity = useActivity();
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);

  // -----------------------------
  // Fetch projects for workspace
  // -----------------------------
 const fetchProjects = useCallback(async() => {
  if (!currentWorkspace) return;

  const { url, options } = projectService.list(currentWorkspace.id);

  try {
    const data = await apiFetch<any>(url, options);

    // Handle both paginated and flat responses
    const list: Project[] = Array.isArray(data) ? data : data.results ?? [];

    console.log("fetchProjects API data:", data);
    console.log("fetchProjects list:", list);
    console.log("fetchProjects list.length:", list.length);

    setProjects(list);

    // if (!currentProject && list.length > 0) {
    //   setCurrentProject(list[0]);
    // }
    // Only auto-select AFTER full list is loaded
    if (list.length > 0) {
      setCurrentProject(list[0]);
    } else {
      setCurrentProject(null);
    }

  } catch (err) {
    console.error("fetchProjects FAILED:", err);
  }
}, [apiFetch, currentWorkspace]);


  // -----------------------------
  // Create project (optimistic)
  // -----------------------------
const createProject = useCallback(
  async (data: ProjectCreateData) => {
    const tempId = Date.now();

    const optimistic: Project = {
      id: tempId,
      workspace: data.workspace_id,
      name: data.name,
      description: data.description ?? "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setProjects((prev) => [...prev, optimistic]);
    setCurrentProject(optimistic);

    try {
      const { url, options } = projectService.create(data);
      const created = await apiFetch<Project>(url, options);

      setProjects((prev) =>
        prev.map((p) => (p.id === tempId ? created : p))
      );

      setCurrentProject(created);

      // ⭐ NEW — refresh activity feed
      await activity.fetchActivity();

    } catch (err) {
      setProjects((prev) => prev.filter((p) => p.id !== tempId));
      setCurrentProject(null);
      throw err;
    }
  },
  [apiFetch, activity]
);

  // -----------------------------
  // Update project (optimistic)
  // -----------------------------
  const updateProject = useCallback(
  // async (id: number, data: ProjectUpdateData) => {
   async (id: number, data: ProjectUpdateData): Promise<void> => {
    // ⭐ Optimistic update
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...data } : p))
    );

    try {
      const { url, options } = projectService.update(id, data);
      const updated = await apiFetch<Project>(url, options);

      // Replace optimistic with real
      setProjects((prev) =>
        prev.map((p) => (p.id === id ? updated : p))
      );

      if (currentProject?.id === id) {
        setCurrentProject(updated);
      }

      // ⭐ NEW — refresh activity feed
      await activity.fetchActivity();
      
    } catch (err) {
      // Roll back optimistic update
      await fetchProjects();
      throw err;
    }
  },
  [apiFetch, currentProject, fetchProjects, activity]
);

  // -----------------------------
  // Delete project (optimistic)
  // -----------------------------
  const deleteProject = useCallback(
  async (id: number) => {
    const previous = projects;

    // ⭐ Optimistic removal
    setProjects((prev) => prev.filter((p) => p.id !== id));

    try {
      const { url, options } = projectService.delete(id);
      await apiFetch(url, options);

      if (currentProject?.id === id) {
        setCurrentProject(null);
      }

      // ⭐ NEW — refresh activity feed
      await activity.fetchActivity();

    } catch (err) {
      // Roll back optimistic removal
      setProjects(previous);
      throw err;
    }
  },
  [apiFetch, projects, currentProject, activity]
);


  // -----------------------------
  // Auto-load when workspace changes
  // -----------------------------
  useEffect(() => {
    if (currentWorkspace) {
      fetchProjects();
    } else {
      setProjects([]);
      setCurrentProject(null);
    }
  }, [currentWorkspace, fetchProjects]);

  useEffect(() => {
  // When workspace changes, reset currentProject
  setCurrentProject(null);
}, [currentWorkspace]);


  return (
    <ProjectContext.Provider
      value={{
        projects,
        currentProject,
        setCurrentProject,
        fetchProjects,
        createProject,
        updateProject,
        deleteProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const ctx = useContext(ProjectContext);
  if (!ctx) throw new Error("useProject must be used inside ProjectProvider");
  return ctx;
};
