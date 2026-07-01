// src/services/activityService.ts
// src/services/activityService.ts
import apiFetch from "../api/apiFetch2";
import { Tokens } from "../types/auth";

const BASE_URL = "http://localhost:8000";

export function createActivityService(
  getTokens: () => Tokens | null,
  setTokens: (t: Tokens | null) => void,
  logout: () => void
) {
  return {
    getCurrent(workspaceId: number) {
      return apiFetch(
        `${BASE_URL}/api/workspaces/${workspaceId}/activity/current/`,
        { method: "GET", auth: true },
        getTokens,
        setTokens,
        logout
      );
    },

    getWeekly(workspaceId: number) {
      return apiFetch(
        `${BASE_URL}/api/workspaces/${workspaceId}/activity/weekly/`,
        { method: "GET", auth: true },
        getTokens,
        setTokens,
        logout
      );
    },
  };
}

