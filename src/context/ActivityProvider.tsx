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

import { Activity, CurrentActivityItem, WeeklyMemberSummary, FullActivityItem } from '../types/activity';
import { useAuth }           from "../hooks/useAuth";


export interface ActivityContextType {
  loading: boolean;
  error: string | null;
  currentActivity: CurrentActivityItem[];
  weeklySummary: WeeklyMemberSummary[];
  fullActivity: FullActivityItem[]; 
  fetchActivity: () => Promise<void>;   
}
 
const ActivityContext = createContext<ActivityContextType | null>(null);
const BASE_URL      = "http://localhost:8000";

export function ActivityProvider({ children }: { children: React.ReactNode }) {
  const { apiFetch } = useAuth();
  const { currentWorkspace } = useWorkspace();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentActivity, setCurrentActivity] = useState<CurrentActivityItem[]>([]);
  const [weeklySummary, setWeeklySummary] = useState<WeeklyMemberSummary[]>([]);
  const [fullActivity, setFullActivity] = useState<FullActivityItem[]>([]);
  const {tokens, setTokens, logout} = useAuth()


  const workspaceId = currentWorkspace?.id;

  const fetchActivity = useCallback(async () => {
    if (!workspaceId) return;
    setLoading(true);
    setError(null);
    try {
      const [currentRes, weeklyRes, fullRes] = await Promise.all([
      apiFetch<CurrentActivityItem[]>(
        `${BASE_URL}/api/workspaces/${workspaceId}/activity/current/`,
        { auth: true },
       
      ),
      apiFetch<WeeklyMemberSummary[]>(
        `${BASE_URL}/api/workspaces/${workspaceId}/activity/weekly/`,
        { auth: true },
        
      ),
      apiFetch<FullActivityItem[]>(
        `${BASE_URL}/api/workspaces/${workspaceId}/activity/full/`,
        { auth: true },
      
      ),
    ]);
      setCurrentActivity(currentRes as CurrentActivityItem[]);
      setWeeklySummary(weeklyRes as WeeklyMemberSummary[]);
      setFullActivity(fullRes as FullActivityItem[]);

    } catch (err) {
      console.error("fetchActivity error", err);
      setError("Failed to load activity");
    } finally {
      setLoading(false);
    }
  }, [workspaceId]);
 
    useEffect(() => {
      fetchActivity();
    }, [fetchActivity]);
   
   const value: ActivityContextType = {
    loading,
    error,
    currentActivity,
    weeklySummary,
    fullActivity,
    fetchActivity,
  };

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

