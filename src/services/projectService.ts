// src/services/projectService.ts

import { API_BASE_URL } from "../api/config";

export const projectService = {

  get(projectId: number, workspaceId: number) {
    return {
      url: `${API_BASE_URL}/projects/${projectId}/?workspace=${workspaceId}`,
      options: {
        method: "GET",
        auth: true,
      },
    };
  },

  update(id: number, workspaceId: number, data: any) {
    return {
      url: `${API_BASE_URL}/projects/${id}/?workspace=${workspaceId}`,
      options: {
        method: "PATCH",
        auth: true,
        body: JSON.stringify(data),
      },
    };
  },

  // -----------------------------------------
  // LIST PROJECTS (requires auth)
  // -----------------------------------------
  list(workspaceId: number) {
    return {
      url: `${API_BASE_URL}/projects/?workspace=${workspaceId}`,
      options: {
        method: "GET",
        auth: true, 
      },
    };
  },

  // -----------------------------------------
  // CREATE PROJECT (requires auth)
  // -----------------------------------------
  create(data: {
      name: string;
      description?: string;
      workspace_id: number;
      member_ids?: number[];
    }) {
      return {
        url: `${API_BASE_URL}/projects/`,
        options: {
          method: "POST",
          auth: true,
          body: JSON.stringify({
            name: data.name,
            description: data.description,
            workspace_id: data.workspace_id,
            member_ids: data.member_ids ?? [],
          }),
        },
      };
    },

  assignMember: (projectId: number, memberId: number) => ({
    url: `${API_BASE_URL}/projects/${projectId}/assign_member/`,
    options: {
      method: "POST",
      body: JSON.stringify({
        member_id: memberId,
      }),
      auth: true,
    },
  }),

  // -----------------------------------------
  // DELETE PROJECT (requires auth)
  // -----------------------------------------
 delete(id: number, workspaceId: number) {
  return {
    url: `${API_BASE_URL}/projects/${id}/?workspace=${workspaceId}`,
    options: {
      method: "DELETE",
      auth: true,
    },
  };
},
};
