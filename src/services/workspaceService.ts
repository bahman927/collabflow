// src/services/workspaceService.ts

import { Workspace, WorkspaceCreateData, WorkspaceUpdateData } from "../types/workspace";
import { Tokens } from "../types/auth";
const BASE_URL = "http://localhost:8000/api/workspaces";

export const workspaceService = {
  list() {
    return {
      url: `${BASE_URL}/`,
      options: { method: "GET", auth: true },
    };
  },

  get(workspaceId: number) {
    return {
      url: `${BASE_URL}/${workspaceId}/`,
      options: { method: "GET", auth: true },
    };
  },

   getMembership(workspaceId: number) {
    return {
      url: `${BASE_URL}/${workspaceId}/members/me/`,
      options: {
        method: "GET",
        auth: true,
      },
    };
  },

  create(data: WorkspaceCreateData) {
    return {
      url: `${BASE_URL}/`,
      options: {
        method: "POST",
        body: JSON.stringify(data),
        auth: true,
      },
    };
  },

  update(workspaceId: number, data: WorkspaceUpdateData) {
    return {
      url: `${BASE_URL}/${workspaceId}/`,
      options: {
        method: "PATCH",
        body: JSON.stringify(data),
        auth: true,
      },
    };
  },


  delete(workspaceId: number) {
    return {
      url: `${BASE_URL}/${workspaceId}/`,
      options: { method: "DELETE", auth: true },
    };
  },

  listMembers(workspaceId: number) {
    return {
      url: `${BASE_URL}/${workspaceId}/members/`,
      options: { method: "GET", auth: true },
    };
  },

  addMember(workspaceId: number, userId: number) {
    return {
      url: `${BASE_URL}/${workspaceId}/members/`,
      options: {
        method: "POST",
        body: JSON.stringify({ user_id: userId }),
        auth: true,
      },
    };
  },

  removeMember(workspaceId: number, userId: number) {
    return {
      url: `${BASE_URL}/${workspaceId}/members/${userId}/`,
      options: { method: "DELETE", auth: true },
    };
  },
};
