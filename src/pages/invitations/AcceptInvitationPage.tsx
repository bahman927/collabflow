
// src/pages/invitations/AcceptInvitationPage.tsx
import { useCallback, useEffect, useState, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { invitationService } from "../../services/invitationService";
import { useAuth } from "../../hooks/useAuth";
import { useWorkspace } from "../../hooks/useWorkspace";
import type { Workspace } from "../../types/workspace";
import type { Tokens}     from "../../types/auth.ts"
import { ApiError } from "../../api/apiError";
import {InvitationUser} from "./InvitationUser";
import { API_BASE_URL } from "../../api/config";
 
// --------------------------------------------------
// Response returned by POST /api/invitations/accept/
// --------------------------------------------------

export interface AcceptInvitationResponse {
  message: string;
  workspace: Workspace;
}

// --------------------------------------------------
// Response returned by invitation validation
// --------------------------------------------------

interface InvitationValidationResponse {
  valid: boolean;
  email: string;
  workspace: {
    id: number;
    name: string;
  };
  role: string;
  invited_by: string;
  existing_account: boolean;
}

// --------------------------------------------------
// Component
// --------------------------------------------------

const AcceptInvitationPage = () => {

  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { apiFetch, user } = useAuth();
  const {setCurrentWorkspace, } = useWorkspace();
  const [showSignup, setShowSignup] = useState(false);
  const { setTokens } = useAuth();
  const [invitationData, setInvitationData] =
    useState<InvitationValidationResponse | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  
  const validateInvitation = useCallback(async () => {
      if (!token) {
        setError("Invalid invitation token.");;
        setLoading(false);
        return;
      }
      try {   

        setLoading(true);
        setError("");

        const {url, options } = invitationService.validate(token);
        const result = await apiFetch<InvitationValidationResponse>(url, options);
  
        if (!result.valid) {
          setError("This invitation is no longer valid.");
          return;
        }

        setInvitationData(result);

      } catch (err: any) {
        console.error(
          "Invitation validation failed:",
          err
        );

        setError(
          err.message ||
          "Invalid invitation."
        );

      } finally {
        setLoading(false);
      }

  }, [token, apiFetch]);

  useEffect(() => {
        validateInvitation();
    }, [validateInvitation]);


  const acceptInvitation = useCallback(
    async (newTokens?: Tokens) => {
      
          if (!token) {
            setError("Invalid invitation token.");
            return;
          }

          try {
            setError("");
            setMessage("");    
            if (newTokens) {
               setTokens(newTokens);
            }

          const {url, options} = invitationService.accept(token);
          const result = await apiFetch<AcceptInvitationResponse>(url,
                {
                  ...options,
                  auth: true,
                },                      
              );

            setMessage(
              result.message ||
              "Invitation accepted successfully."
            );

          console.log("Invitation accepted:", result);

            setTimeout(() => {
              navigate("/members");
            }, 4000);

          } catch (err) {

            console.error(
              "Accept invitation failed:",
              err
            );

            if (err instanceof ApiError) {
              setError(err.message);
            } else if (err instanceof Error) {
              setError(err.message);
            } else {
              setError(
                "Unable to accept invitation."
              );
            }
          }

        },
        [
          token,
          apiFetch,
          navigate,
          setCurrentWorkspace,
          setTokens,      
        ]
  );

  const processedLoginTokens = useRef(false);

  useEffect(() => {
    const state = location.state as {
      invitationTokens?: Tokens;
    } | null;

    const newTokens = state?.invitationTokens;

    if (!newTokens || processedLoginTokens.current) {
      return;
    }
    processedLoginTokens.current = true;
    acceptInvitation(newTokens);

  }, [
    location.state,
    location.pathname,
    navigate,
    acceptInvitation,
  ]);

  const handleSignupSuccess = async (newTokens: Tokens) => {
    setTokens(newTokens);
  };
  
  const handleAcceptInvitation = useCallback(
    async (token: string, newTokens: Tokens) => {
      await apiFetch(
        `${API_BASE_URL}/invitations/accept/`,
        {
          method: "POST",
          body: JSON.stringify({ token }),
          auth: true,
        },
        newTokens
      );
    },
    [apiFetch]
  );

  const handleAcceptExistingUser = () => {
        acceptInvitation();
    };

  // ------------------------------------------------
  // If signup page is being displayed
  // ------------------------------------------------

  if (showSignup) {

    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">

        {/* <InvitationSignupPage */}
       <InvitationUser
          onSignupSuccess={handleSignupSuccess}
          onAcceptInvitation={handleAcceptInvitation}
       />
      </div>
    );

  }

  // ------------------------------------------------
  // Main invitation page
  // ------------------------------------------------

 return (
  <div className="flex min-h-screen min-w-0 items-center justify-center bg-slate-100 px-3 py-6 sm:px-5 sm:py-8">

    <div className="w-full min-w-0 max-w-md rounded-2xl bg-white p-4 shadow-xl sm:p-8">

      {/* HEADER */}
      <div className="text-center">
        <h1 className="wrap-break-word text-2xl font-bold text-slate-800 sm:text-3xl">
          Workspace Invitation
        </h1>

        <p className="mt-3 text-sm text-slate-500 sm:text-base">
          You've been invited to join a workspace.
        </p>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="mt-6 rounded-lg bg-slate-50 p-4 text-center text-sm text-slate-600 sm:text-base">
          Checking invitation...
        </div>
      )}

      {/* ERROR */}
      {error && (
        <div className="mt-6 wrap-break-word rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 sm:p-4 sm:text-base">
          {error}
        </div>
      )}

      {/* INVITATION INFORMATION */}
      {!loading && !error && invitationData && (
        <div className="mt-6 min-w-0 rounded-lg border border-slate-200 bg-slate-50 p-3 sm:p-4">

          <p className="text-sm text-slate-500">
            Workspace
          </p>

          <p className="mt-1 wrap-break-word font-semibold text-slate-800">
            {invitationData.workspace.name}
          </p>

          <p className="mt-4 text-sm text-slate-500">
            Invited email
          </p>

          <p className="mt-1 wrap-break-word font-medium text-slate-800">
            {invitationData.email}
          </p>

          <p className="mt-4 text-sm text-slate-500">
            Role
          </p>

          <p className="mt-1 font-medium capitalize text-slate-800">
            {invitationData.role}
          </p>

        </div>
      )}

      {/* SUCCESS MESSAGE */}
      {message && (
        <div className="mt-6 wrap-break-word rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700 sm:p-4 sm:text-base">
          {message}
        </div>
      )}

      {/* INVITATION ACTIONS */}
      {invitationData?.existing_account ? (
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4">

          <button
            type="button"
            onClick={handleAcceptExistingUser}
            className="w-full rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-blue-700 sm:w-auto sm:text-base"
          >
            Accept Invitation
          </button>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="w-full rounded-lg border border-gray-300 px-6 py-3 text-sm transition hover:bg-gray-100 sm:w-auto sm:text-base"
          >
            Exit
          </button>

        </div>
      ) : (
        <div className="mt-6 min-w-0">
         <InvitationUser
          onSignupSuccess={handleSignupSuccess}
          onAcceptInvitation={handleAcceptInvitation}
        />
        </div>
      )}

    </div>
  </div>
);

};
 export default AcceptInvitationPage

 
 


 