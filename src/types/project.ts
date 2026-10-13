export interface Project {
  id: number;
  workspace: number; // ✔ correct
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

 
export interface ProjectCreateData {
  workspace_id: number;      // required
  name: string;           // required
  description?: string;   // optional
}

export interface ProjectUpdateData {
  name?: string;
  description?: string;
}



 