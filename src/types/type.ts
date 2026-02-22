export type Status = "To Do" | "In Progress" | "Done" | "Overdue";

export interface Task {
  id: number;
  title: string;
  projectId: number;
  projectName: string;
  assignedTo: string; // developer name or id
  status: Status;
}

export interface Project {
  id: number;
  name: string;
}
