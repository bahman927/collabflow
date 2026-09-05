
//providers/MemberProvider.tsx
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from 'react';
import {
  Member,
  MemberInvite,
  MemberUpdate,
  MemberFilters,
  MemberRole,
} from '../types/member';

import { createMemberService }  from "../services/memberService";
import { useAuth }              from "../hooks/useAuth";
import { useWorkspace }         from "./WorkspaceProvider";
import { useProject }           from "../context/ProjectProvider";
import { useTask }              from "../context/TaskProvider";
import { getTokens }            from '../services/authService';
import { useActivity }          from "../context/ActivityProvider";


interface MemberContextType {
  members: Member[];
  activeMembers: Member[];
  loading: boolean;
  error: string | null;
  setMembers: React.Dispatch<React.SetStateAction<Member[]>>;
  getMemberById: (id: number) => Member | undefined;
  removeMember: (memberId: number) => Promise<void>;
  updateMember: (memberId: number, update: MemberUpdate) => Promise<Member>;
  inviteMember: (data: MemberInvite) => Promise<Member>;
  fetchMembers: () => Promise<void>;
}

 const MemberContext =
  createContext<MemberContextType | null>(null);

  export function MemberProvider({ children }: { children: React.ReactNode
    }) {
      const { user } = useAuth();
      // const { members } = useMember();
      const {apiFetch, tokens, setTokens, logout } = useAuth();
      const { currentWorkspace } = useWorkspace();
      const activity = useActivity();
      const { fetchProjects, currentProject } = useProject();
      const { fetchTasks } = useTask();
      const [members, setMembers] = useState<Member[]>([]);
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState<string | null>(null);
      const { fetchActivity } = useActivity();
      const [filters, setFiltersState] = useState<MemberFilters>({
          search: '',
          role: 'all',
          status: 'active',
        });

  // ✅ Create service with auth functions — same pattern as other providers
  const memberService = useMemo(
    () => createMemberService(getTokens, setTokens, logout),
    [tokens, setTokens, logout]
  );

  const workspaceId = currentWorkspace?.id;
 
  
  useEffect(() => {
    if (currentWorkspace?.id) {
      fetchMembers();
    } else {
      setMembers([]);
    }
  }, [currentWorkspace?.id]);
  

  const fetchMembers = useCallback(async () => {
    if (!workspaceId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await memberService.getAll( workspaceId);
      setMembers(data);
    } catch (err) {
       console.error('fetchMembers error:', err);  
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to fetch members'
      );
    } finally {
      setLoading(false);
    }
  }, [workspaceId]);


const inviteMember = useCallback(
  async (invite: MemberInvite): Promise<Member> => {
    if (!workspaceId) throw new Error("No workspace selected");

    const member = await memberService.invite(workspaceId, invite);

     // update local member state
    setMembers(prev => [...prev, member]);

    return member;
  },
  [workspaceId]
);




const updateMember = useCallback(
  async (memberId: number, update: MemberUpdate): Promise<Member> => {
    if (!workspaceId) throw new Error("No workspace selected");

    const updated = await memberService.update(workspaceId, memberId, update);

    setMembers(prev =>
      prev.map(m => (m.id === memberId ? updated : m))
    );

    await activity.fetchActivity();

    // ⭐ NEW — refresh projects
    await fetchProjects();

    // ⭐ NEW — refresh tasks for the current project
    if (currentProject?.id) {
      await fetchTasks();
    }

    return updated;
  },
  [workspaceId, activity, fetchProjects, fetchTasks, currentProject]
);


const removeMember = useCallback(
  async (memberId: number): Promise<void> => {
    if (!workspaceId) throw new Error("No workspace selected");

    await memberService.remove(workspaceId, memberId); 

    setMembers(prev => prev.filter(m => m.id !== memberId));

    await activity.fetchActivity();

    // ⭐ NEW — refresh projects
    await fetchProjects();

    // ⭐ NEW — refresh tasks for the current project
    if (currentProject?.id) {
      await fetchTasks();
    }
  },
  [workspaceId, activity, fetchProjects, fetchTasks, currentProject]
);





  const setFilters = useCallback(
    (partial: Partial<MemberFilters>) => {
      setFiltersState((prev) => ({
        ...prev,
        ...partial,
      }));
    },
    []
  );

  const getMemberById = useCallback(
    (id: number) => members.find((m) => m.id === id),
    [members]
  );

  const getMembersByRole = useCallback(
    (role: MemberRole) =>
      members.filter((m) => m.role === role),
    [members]
  );

  const activeMembers = useMemo(
    () => members.filter((m) => m.isActive),
    [members]
  );

  


  const value = useMemo<MemberContextType>(
    () => ({
      members,
      setMembers,
      loading,
      error,
      filters,
      fetchMembers,
      inviteMember,
      updateMember,
      removeMember,
      setFilters,
      getMemberById,
      getMembersByRole,
      activeMembers,
    
    }),
    [
      members,
      setMembers,
      loading,
      error,
      filters,
      fetchMembers,
      inviteMember,
      updateMember,
      removeMember,
      setFilters,
      getMemberById,
      getMembersByRole,
      activeMembers,
    ]
  );

  return (
    <MemberContext.Provider value={value}>
      {children}
    </MemberContext.Provider>
  );
}

export function useMember(): MemberContextType {
  const context = useContext(MemberContext);
  if (!context) {
    throw new Error(
      'useMember must be used within a MemberProvider'
    );
  }
  return context;
}





 