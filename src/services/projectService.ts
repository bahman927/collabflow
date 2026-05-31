// src/services/projectService.ts

const BASE_URL = "http://localhost:8000";

export const projectService = {

  get(projectId: number) {
  return {
    url: `${BASE_URL}/api/projects/${projectId}/`,
    options: {
      method: "GET",
      auth: true,
    },
  };
},

  // -----------------------------------------
  // LIST PROJECTS (requires auth)
  // -----------------------------------------
  list(workspaceId: number) {
    return {
      url: `${BASE_URL}/api/projects/?workspace=${workspaceId}`,
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
      url: `${BASE_URL}/api/projects/`,
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

   // -----------------------------------------
  // UPDATE PROJECT (requires auth)
  // -----------------------------------------

 update(id: number, data: any) {
    return {
      url: `${BASE_URL}/api/projects/${id}/`,
      options: {
        method: "PATCH",
        auth: true, 
        body: JSON.stringify(data),
      },
    };
  },

  // -----------------------------------------
  // DELETE PROJECT (requires auth)
  // -----------------------------------------
  delete(id: number) {
    return {
      url: `${BASE_URL}/api/projects/${id}/`,
      options: {
        method: "DELETE",
        auth: true, 
      },
    };
  },
};
