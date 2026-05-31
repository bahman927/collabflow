import { createContext } from "react";
import type { Project } from "../types/project";

interface ProjectContextType {
  projects: Project[];
  loading: boolean;
}

export const ProjectContext =
  createContext<ProjectContextType | null>(null);