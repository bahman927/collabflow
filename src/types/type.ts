// export type Status = "To Do" | "In Progress" | "Done" | "Overdue";
export type TaskStatus = "todo" | "in_progress" | "done" | "overdue";

export type Status = "To Do" | "In Progress" | "Done" | "Overdue";


export interface Task {
  id: number;
  name: string;
  projectId: number;
  projectName: string;
  assignedTo: string; // developer name or id
  status: Status;
}

export interface Project {
  id: number;
  name: string;
}
