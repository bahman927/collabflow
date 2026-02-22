// src/api/workspace.api.ts
import { apiFetch } from "./client";
import type { Workspace } from "../types/workspace";

export const fetchWorkspacesApi = (token: string) =>
  apiFetch<Workspace[]>("/workspaces/", {}, token);
