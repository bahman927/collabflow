import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { useAuth }      from "../hooks/useAuth";

interface Invitation {
  id: number;
  email: string;
  status: string;
  workspace: number;
  created_at: string;
}

interface InvitationContextType {
  invitations: Invitation[];

  sendInvite: (email: string, workspaceId: number) => Promise<any>;
  fetchInvitations: (workspaceId: number) => Promise<void>;
  resendInvitation: (invitationId: number) => Promise<void>;
  cancelInvitation: (invitationId: number) => Promise<void>;

  acceptInvite: (token: string) => Promise<void>;
  denyInvite: (token: string) => Promise<void>;
}

const BASE_URL = "http://localhost:8000/api";

const InvitationContext = createContext<InvitationContextType | null>(null);

//_______________________ invitationProvider _______________________________

export const InvitationProvider = ({ children }: { children: ReactNode }) => {

    const [invitations, setInvitations] = useState<Invitation[]>([]);
    const { apiFetch } = useAuth();

  // --------------------------------------------------
  // SEND INVITATION
  // --------------------------------------------------

  const sendInvite = async (
    email: string,
    workspaceId: number
  ) => {

    const result = await apiFetch(
      `${BASE_URL}/workspaces/${workspaceId}/invite/`,
      {
        method: "POST",
        auth: true,
        body: JSON.stringify({
          email,
          workspace_id: workspaceId,
        }),
      }
    );

    // Refresh pending invitations
    await fetchInvitations(workspaceId);

    return result;
  };

    // --------------------------------------------------
  // GET INVITATIONS FOR WORKSPACE
  // --------------------------------------------------

 const fetchInvitations = useCallback(
  async (workspaceId: number) => {
    const data = await apiFetch<Invitation[]>(
      `${BASE_URL}/workspaces/${workspaceId}/invitations/`,
      {
        method: "GET",
        auth: true,
      }
    );
  //   console.log("INVITATIONS API:", data);
  //   console.log("INVITATION:", data[0]);
  //  console.log("STATUS:", data[0]?.status);
  //  console.log("KEYS:", Object.keys(data[0] ?? {}));

    setInvitations(data);
  },
  []
);
  // --------------------------------------------------
  // RESEND INVITATION
  // --------------------------------------------------

  const resendInvitation = async (
    invitationId: number
  ) => {

    await apiFetch(
      `${BASE_URL}/invitations/${invitationId}/resend/`,
      {
        method: "POST",
        auth: true,
      }
    );
  };


     // --------------------------------------------------
     // ACCEPT INVITATION
     // --------------------------------------------------

    async function acceptInvite(token: string) {
    await apiFetch(`${BASE_URL}/invitations/${token}/accept/`, {
      method: "POST",
      auth: true,
    });
  }

    const denyInvite = async (token: string) => {
      await apiFetch(`${BASE_URL}/invitations/${token}/deny/`, {
        method: "POST",
        auth:true,
      });
    };
    
    // --------------------------------------------------
    // CANCEL INVITATION
    // --------------------------------------------------

    const cancelInvitation = async (
      invitationId: number
    ) => {

      await apiFetch(
        `${BASE_URL}/invitations/${invitationId}/`,
        {
          method: "DELETE",
          auth: true,
        }
      );

      // Remove it immediately from the UI
      setInvitations((prev) =>
        prev.filter(
          invitation =>
            invitation.id !== invitationId
        )
      );
    };

    

return (
    <InvitationContext.Provider
        value={{
        invitations,
        sendInvite,
        fetchInvitations,
        resendInvitation,
        cancelInvitation,
        acceptInvite,
        denyInvite,
      }}
    >
      {children}
    </InvitationContext.Provider>
  );
};

export const useInvitations = () => {
  const ctx = useContext(InvitationContext);
  if (!ctx) {
    throw new Error("useInvitations must be used inside InvitationProvider");
  }
  return ctx;
};
