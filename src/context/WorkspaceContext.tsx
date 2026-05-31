import { createContext } from "react";
import type { Workspace } from "../types/workspace";

interface WorkspaceContextType {
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  loading: boolean;
  switchWorkspace: (workspaceId: number) => void;
}

export const WorkspaceContext =
  createContext<WorkspaceContextType | null>(null);

 