// src/services/taskService.ts

import { Task, TaskStatus, TaskUpdateData, TaskCreateData } from "../types/task";

// const BASE_URL = "http://localhost:8000/api/workspaces"
const WORKSPACES_BASE = "http://localhost:8000/api/workspaces";
const TASKS_BASE      = "http://localhost:8000/api/tasks";

export  const taskService = {
  list(workspaceId: number) {
    return {
       url: `${WORKSPACES_BASE}/${workspaceId}/tasks/`,
      options: { method: "GET", auth: true},
    };
  },
 
  listByWorkspace(workspaceId: number) {
    return {
      url: `${WORKSPACES_BASE}/?workspace=${workspaceId}`,
      options: { method: "GET", auth: true },
    };
  },

  get(taskId: number) {
    return {
      url: `${TASKS_BASE}/${taskId}/`,
      options: { method: "GET", auth: true },
    };
  },

  create(data: {
    name: string;
    description?: string;
    project_id: number;
    workspace: number;
    priority?: string;
    due_date?: string | null;
    assignee_ids?: number[];
  }) {
  return {
    url: `${TASKS_BASE}/`,
    options: {
      method: "POST",
      auth: true,
      body: JSON.stringify(data),
    },
  };
},

 

  assign(
    taskId: number,
    memberId: number
  ) {
      return {
          url: `${TASKS_BASE}/${taskId}/assignees/${memberId}/`,
          options: {
              method: "POST",
              auth: true
          },
          
      
      }
  },

   unassign(taskId: number, memberId: number) {
    return {
      url: `${TASKS_BASE}/${taskId}/assignees/${memberId}/`,
      options: {
        method: "DELETE",
        auth: true,
      },
    };
  },



  update(taskId: number, data: TaskUpdateData) {
    return {
      url: `${TASKS_BASE}/${taskId}/`,
      options: {
        method: "PATCH",
        body: JSON.stringify(data),
        auth: true,
      },
    };
  },

  delete(taskId: string) {
    return {
      url: `${TASKS_BASE}/${taskId}/`,
      options: { method: "DELETE", auth: true},
    };
  },


    workspaceTasks(workspaceId: number) {
      return {
        url: `${WORKSPACES_BASE}/${workspaceId}/tasks/`,
        options: {
          method: "GET",
          auth: true,
        }
      };
    }

  }
