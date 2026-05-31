// src/types/workspace.ts
import { MemberRole } from './member';

export interface Workspace {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  currentUserRole: MemberRole;
}

/**
 * Used when creating a workspace.
 * Required: name
 * Optional: description
 */
export interface WorkspaceCreateData {
  name?: string;
  description?: string;
}

/**
 * Used when updating a workspace.
 * All fields optional because PATCH is partial.
 */
export interface WorkspaceUpdateData {
  name?: string;
  description?: string;
}

export type WorkspaceMemberRole = "owner" | "admin" | "member" | "viewer";
export interface WorkspaceMember {
  id: number;
  workspace: number;        // workspace_id from backend
  user: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    avatar_url?: string | null;
  };
  role: WorkspaceMemberRole;
  joined_at: string;
}
 

