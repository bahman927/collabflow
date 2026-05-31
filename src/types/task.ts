export type TaskStatus =
  | "todo"
  | "in_progress"
  | "done"
  | "overdue"

export type TaskPriority = "low" | "medium" | "high" | "urgent";  

export interface Person {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}


export interface Task {
  id: number;
  name: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string | null;
  project_id: number;
  project: number;
  workspace: number;      // ⭐ CORRECT
  assignees: any[];
  assignee_emails: string[];
  created_at: string;
  updated_at: string;
}


export interface TaskFilters {
  status?: TaskStatus;
  assigneeId?: string;
  search?: string;
}

export interface CreateTaskModalData {
  name: string;
  description: string;
  priority: TaskPriority;
  due_date: string | null;
}

 
export interface TaskCreateData {
  name: string;
  description?: string;
  project_id?: number;
  workspace_id?: number;
  priority?: TaskPriority;       
  due_date?: string | null;      
  assignee_ids?: number[];       // ← was assigneeIds
}

export interface TaskUpdateData {
  name?: string;
  description?: string;
  status?: TaskStatus;
  project_id?: number;
  due_date?: string | null;  
  assignee_ids?: number[];       
}




export type TaskSortKey = "createdAt" | "updatedAt" | "name";
export type TaskSortDirection = "asc" | "desc";

