// src/context/WorkspaceContext.ts
import { createContext } from "react";
import type { Workspace } from "../types/workspace";

export type WorkspaceContextType = {
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  setCurrentWorkspace(id: number): void;
};

export const WorkspaceContext = createContext<WorkspaceContextType>(
  {} as WorkspaceContextType
);
