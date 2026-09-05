
// src/pages/invitations/AcceptInvitationPage.tsx

import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { invitationService } from "../../services/invitationService";
import { useAuth } from "../../hooks/useAuth";
import { useWorkspace } from "../../hooks/useWorkspace";

import type { Workspace } from "../../types/workspace";
import type { Tokens}     from "../../types/auth.ts"
import InvitationSignupPage from "./InvitationSignupPage";
import { ApiError } from "../../api/apiError";


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
  workspace: Workspace;
  role: string;
  invited_by: string;
}


// --------------------------------------------------
// Component
// --------------------------------------------------

const AcceptInvitationPage = () => {

  // Invitation token comes from:
  // /invite/:token
  const { token } = useParams<{ token: string }>();

  const navigate = useNavigate();

  const { apiFetch, user } = useAuth();

  const {
    setCurrentWorkspace,
  } = useWorkspace();


  // ------------------------------------------------
  // State
  // ------------------------------------------------

  const [showSignup, setShowSignup] = useState(false);

  const [invitationData, setInvitationData] =
    useState<InvitationValidationResponse | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");


  console.log(
    "AcceptInvitationPage mounted. Token:",
    token
  );

  // ------------------------------------------------
  // Validate invitation
  // ------------------------------------------------

  const validateInvitation = useCallback(async () => {

    console.log("validateInvitation called");

    if (!token) {
      setError("Invalid invitation token.");;
      setLoading(false);
      return;
    }


    try {   

      setLoading(true);
      setError("");

      const {
        url,
        options,
      } = invitationService.validate(token);


      const result =
        await apiFetch<InvitationValidationResponse>(
          url,
          options
        );


      console.log(
        "validated invitation:",
        result
      );


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


  // ------------------------------------------------
  // Run validation when page loads
  // ------------------------------------------------

  useEffect(() => {

    validateInvitation();

  }, [validateInvitation]);


  // ------------------------------------------------
  // Accept invitation
  //
  // IMPORTANT:
  //
  // This function is called AFTER signup().
  //
  // signup() already registers and logs the user in.
  //
  // Therefore request.user exists when this endpoint
  // is called.
  // ------------------------------------------------
  
  const acceptInvitation = useCallback(
    async (newTokens: Tokens) => {

    if (!token) {
        // console.log("NO INVITATION TOKEN");
      setError("Invalid invitation token.");
      return;
    }

    try {

      setError("");
      setMessage("");

      const {
        url,
        options,
      } = invitationService.accept(token);


      const result =
        await apiFetch<AcceptInvitationResponse>(
          url,
          {
            ...options,
            auth: true,
          },
          newTokens
         
        );


      console.log(
        "Invitation accepted:",
        result
      );

      console.log(
      "NEW ACCESS TOKEN:",
      newTokens.access
    );


      setMessage(
        result.message ||
        "Invitation accepted successfully."
      );


      setCurrentWorkspace(
        result.workspace
      );


      navigate("/members");

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
    
  ]
);


  // ------------------------------------------------
  // Show signup page
  // ------------------------------------------------

  const handleContinueSignup = () => {

    setError("");

    setShowSignup(true);

  };


  // ------------------------------------------------
  // If signup page is being displayed
  // ------------------------------------------------

  if (showSignup) {

    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">

        <InvitationSignupPage
          onSignupSuccess={acceptInvitation}
        />

      </div>
    );

  }


  // ------------------------------------------------
  // Main invitation page
  // ------------------------------------------------

  return (

    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

        <div className="text-center">

          <h1 className="text-3xl font-bold text-slate-800">
            Workspace Invitation
          </h1>


          <p className="mt-3 text-slate-500">
            You've been invited to join a workspace.
          </p>

        </div>


        {/* ------------------------------------------
            Loading
        ------------------------------------------ */}

        {loading && (

          <div className="mt-6 rounded-lg bg-slate-50 p-4 text-center text-slate-600">

            Checking invitation...

          </div>

        )}


        {/* ------------------------------------------
            Validation error
        ------------------------------------------ */}

        {error && (

          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">

            {error}

          </div>

        )}


        {/* ------------------------------------------
            Invitation information
        ------------------------------------------ */}

        {!loading &&
          !error &&
          invitationData && (

          <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4">

            <p className="text-sm text-slate-500">
              Workspace
            </p>

            <p className="mt-1 font-semibold text-slate-800">
              {invitationData.workspace.name}
            </p>


            <p className="mt-4 text-sm text-slate-500">
              Invited email
            </p>

            <p className="mt-1 font-medium text-slate-800">
              {invitationData.email}
            </p>


            <p className="mt-4 text-sm text-slate-500">
              Role
            </p>

            <p className="mt-1 font-medium text-slate-800">
              {invitationData.role}
            </p>

          </div>

        )}


        {/* ------------------------------------------
            Success message
        ------------------------------------------ */}

        {message && (

          <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4 text-green-700">

            {message}

          </div>

        )}


        {/* ------------------------------------------
            Continue to signup
        ------------------------------------------ */}

        {!loading &&
          !error &&
          invitationData && (

          <button
            type="button"
            onClick={handleContinueSignup}
            className="
              mt-8
              w-full
              rounded-lg
              bg-indigo-600
              px-4
              py-3
              text-white
              font-semibold
              transition
              hover:bg-indigo-700
            "
          >

            Continue to Sign Up

          </button>

        )}


        {/* ------------------------------------------
            Cancel
        ------------------------------------------ */}

        <button
          type="button"
          onClick={() => navigate("/")}
          className="
            mt-3
            w-full
            rounded-lg
            border
            border-gray-300
            bg-white
            px-4
            py-3
            font-medium
            text-gray-700
            transition
            hover:bg-gray-100
          "
        >

          Cancel

        </button>

      </div>

    </div>

  );

};
 export default AcceptInvitationPage

 
 


// // src/pages/invitations/AcceptInvitationPage.tsx

// import { useEffect, useState, useCallback } from "react";
// import { useNavigate, useParams } from "react-router-dom";

// import {invitationService} from "../../services/invitationService";
// import {useAuth}           from "../../hooks/useAuth"
// import {useWorkspace}      from  "../../hooks/useWorkspace"
// import { Workspace } from "@/types/workspace";
// // import InvitationSignupPage from "./InvitationSignupPage"
// export interface AcceptInvitationResponse {
//   message: string;
//   workspace: Workspace
// }

// interface InvitationSignupPageProps {
//   onSignupSuccess: () => Promise<void>;
// }

// // const InvitationSignupPage = () => {
// const InvitationSignupPage = ({
//     onSignupSuccess,
// }: InvitationSignupPageProps) => {

//   const { token } = useParams();
//   const navigate = useNavigate();
//   const [showSignup, setShowSignup] = useState(false);
//   const { apiFetch, user } = useAuth();
//   const {setCurrentWorkspace} = useWorkspace()
//   const [invitationData, setInvitationData] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [message, setMessage] = useState("");

//   console.log("AcceptInvitationPage mounted");

//   useEffect(() => {
//     if (!token) return;

//     if (!user) {
//       return
//     }
//   }, [user, token]);

//  const validateInvitation = useCallback(async () => {
//     console.log("validateInvitation called");

//     if (!token)
//         return;
//     try {
//         const { url, options } =
//             invitationService.validate(token);
//         const result =
//             await apiFetch(
//                 url,
//                 options
//             );
//         console.log(
//             "validated invitation:",
//             result
//         );
//         setInvitationData(result);
//     } catch(err:any) {
//         console.error(err);
//         setError(
//             err.message || "Invalid invitation"
//         );
//     }
//     finally {
//         setLoading(false);
//     }
//   }, [token, apiFetch]);

//   useEffect(() => {
//      validateInvitation();
//   }, [validateInvitation]);

//   const acceptInvitation = useCallback(async () => {

//     if (!token)
//         return;

//     try {
//         const { url, options } =
//         invitationService.accept(token);
//         const result =
//             await apiFetch<AcceptInvitationResponse>(
//                 url,
//                 options
//             );

//         console.log("result in AcceptInvitationPage : ", result)
//         setMessage(result.message);
//         setCurrentWorkspace(result.workspace);
//         navigate("/members")

//     } catch (err) {
//         console.error(err);
//     }

// }, [token, apiFetch, navigate, setCurrentWorkspace]);

//   return (
//     <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">

//       <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

//         <div className="text-center">

//           <h1 className="text-3xl font-bold text-slate-800">
//             Workspace Invitation
//           </h1>

//           <p className="mt-3 text-slate-500">
//             You've been invited to join a workspace.
//           </p>

//         </div>

//         {message && (
//           <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4 text-green-700">
//             {message}
//           </div>
//         )}

//         {error && (
//           <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
//             {error}
//           </div>
//         )}
          
//         <button
//           onClick={() => setShowSignup(true)}
//           disabled={loading}
//           className="mt-8 w-full rounded-lg bg-indigo-600 px-4 py-3 text-white font-semibold transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-400"
//         >
//           {loading
//             ? "Checking Invitation..."
//             : "Continue to Sign Up"}
//         </button>
        
//          {/* {showSignup && (
//            <InvitationSignupPage />
//          )} */}

//          {showSignup && (
//             <InvitationSignupPage
//               onSignupSuccess={acceptInvitation}
//             />
//           )}

        

//         <button
//           onClick={() => navigate("/")}
//           className="mt-3 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 font-medium text-gray-700 transition hover:bg-gray-100"
//         >
//           Cancel
//         </button>

//       </div>

//     </div>
//   );
// };

// export default InvitationSignupPage;