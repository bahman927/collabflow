// src/services/invitationService.ts

const BASE_URL = "http://localhost:8000";

export const invitationService = {
  // -----------------------------------------
  // LIST PENDING INVITATIONS
  // -----------------------------------------
  list(workspaceId: number) {
    return {
      url: `${BASE_URL}/api/workspaces/${workspaceId}/invitations/`,
      options: {
        method: "GET",
        auth: true,
      },
    };
  },

  // -----------------------------------------
  // CREATE INVITATION WITH ASSIGNMENTS
  // -----------------------------------------
  create(workspaceId: number, data: {
    email: string;
    role: string;
    project_ids?: number[];
    task_ids?: number[];
  }) {
    return {
      url: `${BASE_URL}/api/workspaces/${workspaceId}/invitations/`,
      options: {
        method: "POST",
        auth: true,
        body: JSON.stringify(data),
      },
    };
  },

  // -----------------------------------------
  // GET INVITATION BY TOKEN (no auth needed)
  // -----------------------------------------
  getByToken(token: string) {
    return {
      url: `${BASE_URL}/api/invitations/${token}/`,
      options: {
        method: "GET",
        auth: false,
      },
    };
  },
};
