import { useCallback } from "react";
import { useProject } from "../context/ProjectProvider";
import { useTask } from "../context/TaskProvider";
import { useMember } from "../context/MemberProvider";
import { useActivity } from "../context/ActivityProvider";
import { useWorkspace } from "../hooks/useWorkspace";

export function useWorkspaceRefresh() {
  const { fetchProjects, currentProject } = useProject();
  const { fetchTasks } = useTask();
  const { fetchMembers } = useMember();
  const activity = useActivity();
  const { currentWorkspace } = useWorkspace();

  const workspaceRefresh = useCallback(async () => {
    await fetchProjects();

    if (currentProject?.id) {
      await fetchTasks(currentProject.id);
    }

    await fetchMembers();
    await activity.fetchActivity();
  }, [fetchProjects, fetchTasks, fetchMembers, activity, currentProject]);

  return workspaceRefresh;
}
