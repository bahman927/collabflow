// src/context/ActivityProvider.tsx
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
} from 'react';
import { useWorkspace } from './WorkspaceProvider';
import { CurrentActivityItem, WeeklyMemberSummary } from '../types/activity';
import { useAuth }           from "../hooks/useAuth";

interface ActivityContextType {
  loading: boolean;
  error: string | null;
  currentActivity: CurrentActivityItem[];
  weeklySummary: WeeklyMemberSummary[];
  refresh: () => Promise<void>;
}

const ActivityContext = createContext<ActivityContextType | null>(null);

export function ActivityProvider({ children }: { children: React.ReactNode }) {
  const { apiFetch } = useAuth();
  const { currentWorkspace } = useWorkspace();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentActivity, setCurrentActivity] = useState<CurrentActivityItem[]>([]);
  const [weeklySummary, setWeeklySummary] = useState<WeeklyMemberSummary[]>([]);

  const workspaceId = currentWorkspace?.id;

  const fetchActivity = useCallback(async () => {
    if (!workspaceId) return;
    setLoading(true);
    setError(null);
    try {
      const [currentRes, weeklyRes] = await Promise.all([
        apiFetch(`http://localhost:8000/api/workspaces/${workspaceId}/activity/current/`, { auth: true }),
        apiFetch(`http://localhost:8000/api/workspaces/${workspaceId}/activity/weekly/`, { auth: true }),
      ]);

      setCurrentActivity(currentRes as CurrentActivityItem[]);
      setWeeklySummary(weeklyRes as WeeklyMemberSummary[]);
    } catch (err) {
      console.error("fetchActivity error", err);
      setError("Failed to load activity");
    } finally {
      setLoading(false);
    }
  }, [workspaceId]);

// ⭐ THIS WAS MISSING
useEffect(() => {
  fetchActivity();
}, [fetchActivity]);

 
  const value = useMemo(
    () => ({
      loading,
      error,
      currentActivity,
      weeklySummary,
      refresh: fetchActivity,
    }),
    [loading, error, currentActivity, weeklySummary, fetchActivity]
  );

  return (
    <ActivityContext.Provider value={value}>
      {children}
    </ActivityContext.Provider>
  );
}

export function useActivity(): ActivityContextType {
  const ctx = useContext(ActivityContext);
  if (!ctx) throw new Error('useActivity must be used within ActivityProvider');
  return ctx;
}
