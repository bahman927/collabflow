// services/memberService.ts
import { Member, MemberInvite } from "../types/member";
import apiFetch, { ApiRequestInit } from "../api/ApiFetch2";
import { Tokens } from "../types/auth";


const BASE_URL = "http://localhost:8000";
 
export function createMemberService(
  getTokens: () => Tokens | null,
  setTokens: (t: Tokens | null) => void,
  logout: () => void
) {
  async function getAll(workspaceId: number): Promise<Member[]> {
    return apiFetch<Member[]>(
      `${BASE_URL}/api/workspaces/${workspaceId}/members/`,
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
        `${BASE_URL}/api/tasks/${taskId}/assignees/${memberId}/`,
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
        `${BASE_URL}/api/tasks/${taskId}/assign/`,
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
      `${BASE_URL}/api/workspaces/${workspaceId}/members/${memberId}/`,
      { method: "GET", auth: true },
      getTokens,
      setTokens,
      logout
    );
  }

  async function invite(workspaceId: number, data: MemberInvite): Promise<Member> {
    return apiFetch<Member>(
      `${BASE_URL}/api/workspaces/${workspaceId}/invite/`,
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
      `${BASE_URL}/api/workspaces/${workspaceId}/${memberId}/`,
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
      `${BASE_URL}/api/workspaces/${workspaceId}/members/${memberId}/`,
      { method: "DELETE", auth: true },
      getTokens,
      setTokens,
      logout
    );
  }

  return { getAll, getById, invite, update, remove };
}


 