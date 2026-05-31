
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
import { getTokens }            from '../services/authService';

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

export function MemberProvider({ children }: { children: React.ReactNode }) {
  const { tokens, setTokens, logout } = useAuth();
  const { currentWorkspace } = useWorkspace();

  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFiltersState] =
    useState<MemberFilters>({
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
     console.log('fetchMembers called with workspaceId:', currentWorkspace?.id);
    if (!workspaceId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await memberService.getAll( workspaceId);
      console.log('fetchMembers returned:', data);
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
  }, [workspaceId, filters, memberService]);


 const inviteMember = useCallback(
  async (invite: MemberInvite): Promise<Member> => {
    if (!workspaceId) throw new Error('No workspace selected');

     return await memberService.invite(workspaceId, invite);
  },
  [workspaceId]
);

  const updateMember = useCallback(
    async (
      memberId: number,
      update: MemberUpdate
    ): Promise<Member> => {
      if (!workspaceId)
        throw new Error('No workspace selected');
      const updated =
        await memberService.update(
          workspaceId,
          memberId,
          update
        );
      setMembers((prev) =>
        prev.map((m) =>
          m.id === memberId ? updated : m
        )
      );
      return updated;
    },
    [workspaceId]
  );

 const removeMember = useCallback(
  async (memberId: number): Promise<void> => {
    if (!workspaceId) throw new Error('No workspace selected');

    // Ghost member (no valid id) — just remove from state
    if (!memberId) {
      setMembers((prev) => prev.filter((m) => m.id !== memberId));
      return;
    }

    await memberService.remove(workspaceId, memberId);
    setMembers((prev) => prev.filter((m) => m.id !== memberId));
  },
  [workspaceId]
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

  useEffect(() => {
    fetchMembers();
  }, [currentWorkspace]);

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





 