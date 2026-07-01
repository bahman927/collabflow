// src/types/activity.ts
export interface CurrentActivityItem {
  id: number;
  workspace: number;
  activity_type: string;
  actorName: string;        // ⭐ ADD THIS
  description: string;      // ⭐ Already exists or must be added
  created_at: string;
  relativeTime: string;     // ⭐ ADD THIS if missing
}


export interface WeeklyMemberSummary {
  memberId: number;
  memberName: string;
  role: string;
  tasksCompleted: number;
  tasksAssigned: number;
  comments: number;
  statusChanges: number;
}
