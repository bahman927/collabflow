// services/memberService.ts
import { Member, MemberInvite } from "../types/member";
import apiFetch, { ApiRequestInit } from "../api/apiFetch2";
import { Tokens } from "../types/auth";


import { API_BASE_URL } from "../api/config";
 
export function createMemberService(
  getTokens: () => Tokens | null,
  setTokens: (t: Tokens | null) => void,
  logout: () => void
) {
  async function getAll(workspaceId: number): Promise<Member[]> {
    return apiFetch<Member[]>(
      `${API_BASE_URL}/workspaces/${workspaceId}/members/`,
      { method: "GET", auth: true },
      getTokens,
      setTokens,
      logout
    );
  }

  async function assign(
    taskId: number,
    memberId: number
) {
    return apiFetch(
        `${API_BASE_URL}/tasks/${taskId}/assignees/${memberId}/`,
        {
            method: "POST",
            auth: true
        },
        getTokens,
        setTokens,
        logout
    );
}

  async function assignTask(
    taskId: number,
    memberId: number
) {
    return apiFetch(
        `${API_BASE_URL}/tasks/${taskId}/assign/`,
        {
            method: "POST",
            auth: true,
            body: JSON.stringify({
                member_id: memberId
            }),
        },
        getTokens,
        setTokens,
        logout
    );
}



  // ✅ NEW — get a single member by ID
  async function getById(workspaceId: number, memberId: number): Promise<Member> {
    return apiFetch<Member>(
      `${API_BASE_URL}/workspaces/${workspaceId}/members/${memberId}/`,
      { method: "GET", auth: true },
      getTokens,
      setTokens,
      logout
    );
  }

  async function invite(workspaceId: number, data: MemberInvite): Promise<Member> {
    return apiFetch<Member>(
      `${API_BASE_URL}/workspaces/${workspaceId}/invite/`,
      {
        method: "POST",
        auth: true,
        body: JSON.stringify(data),
      },
      getTokens,
      setTokens,
      logout
    );
  }



  async function update(
  workspaceId: number,
  memberId: number,
  data: Partial<Member>
): Promise<Member> {
  return apiFetch<Member>(
    `${API_BASE_URL}/workspaces/${workspaceId}/members/${memberId}/`,
    {
      method: "PATCH",
      auth: true,
      body: JSON.stringify(data),
    },
    getTokens,
    setTokens,
    logout
  );
}
 

  async function remove(workspaceId: number, memberId: number): Promise<void> {
    await apiFetch(
      `${API_BASE_URL}/workspaces/${workspaceId}/members/${memberId}/`,
      { method: "DELETE", auth: true },
      getTokens,
      setTokens,
      logout
    );
  }

  return { getAll, getById, invite, update, remove };
}


 