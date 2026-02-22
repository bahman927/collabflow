// src/hooks/useWorkspace.ts
import { useContext } from "react";
import { WorkspaceContext } from "../context";

export const useWorkspace = () => useContext(WorkspaceContext);
