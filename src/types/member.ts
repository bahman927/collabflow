export type MemberRole = 'owner' | 'admin' | 'member' | 'viewer';
export interface MemberProject {
  id: number;
  name: string;
}

export interface MemberTask {
  id: number;
  name: string;
  status: string;
  projectId: number;
  project: {
    id: number;
    name: string;
  };
}

export interface Member {
  id: number;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  avatarUrl: string | null;
  role: MemberRole;
  joinedAt: string;
  isActive: boolean;
  projects: MemberProject[];   
  tasks: MemberTask[];  
}

export interface MemberInvite {
  email: string;
  role: MemberRole;
  message?: string;
  taskIds?: number[];   
}


export interface MemberUpdate {
  role?: MemberRole;
  isActive?: boolean;
}

export interface MemberFilters {
  search: string;
  role: MemberRole | 'all';
  status: 'active' | 'inactive' | 'all';
}

interface AssignmentRow {
  project: { id: number; name: string } | null;
  task: MemberTask | null;
}

