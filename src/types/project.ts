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



///////////////////////////////////////////////////////////
// Example Project JSON From Django

// Your API might return something like:

// {
//   "id": 12,
//   "name": "CollabFlow Frontend",
//   "description": "React frontend for CollabFlow",
//   "workspace": 3,
//   "owner": 7,
//   "created_at": "2026-03-14T10:22:11Z",
//   "updated_at": "2026-03-14T10:22:11Z"
// }

// TypeScript will map that to:

// const project: Project = {
//   id: 12,
//   name: "CollabFlow Frontend",
//   description: "React frontend for CollabFlow",
//   workspace: 3,
//   owner: 7,
//   created_at: "2026-03-14T10:22:11Z",
//   updated_at: "2026-03-14T10:22:11Z"
// };
////////////////////////////////////////////////////////////