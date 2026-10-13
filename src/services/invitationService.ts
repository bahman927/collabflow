// src/services/invitationService.ts
import { API_BASE_URL } from "../api/config";


 
export const invitationService = {

  // -----------------------------------------
  // LIST PENDING INVITATIONS
  // -----------------------------------------
  list(workspaceId: number) {
    return {
      url: `${API_BASE_URL}/workspaces/${workspaceId}/invitations/`,
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
      url: `${API_BASE_URL}/workspaces/${workspaceId}/invitations/`,
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
      url: `${API_BASE_URL}/invitations/${token}/`,
      options: {
        method: "GET",
        auth: false,
      },
    };
  },

    // -----------------------------------------
  // ACCEPT INVITATION
  // -----------------------------------------
  accept(token: string) {
    return {
      url: `${API_BASE_URL}/invitations/accept/`,
      options: {
        method: "POST",
        auth: true,
        headers: {
         "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
        }),
      },
    };
  },

  validate(token:string) {
    return {
        url: `${API_BASE_URL}/invitations/validate/${token}/`,
        options: {
            method: "GET",
            auth: false
        }
    };

}
 
 };
