// src/pages/auth/InvitationSignupPage.tsx

import { useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { User, Mail, Lock, Users } from "lucide-react";
import {invitationService} from "../../services/invitationService";
import  {useAuth }         from  "../../hooks/useAuth"
import { ApiError } from "../../api/apiError";
import {useWorkspace}      from  "../../hooks/useWorkspace"
import type { Tokens } from "../../types/auth";
import { Workspace } from "@/types/workspace";

interface InvitationSignupPageProps {
  onSignupSuccess: (tokens: Tokens) => Promise<void>;
}


const InvitationSignupPage = ({onSignupSuccess,}: InvitationSignupPageProps) => {

  const { token } = useParams();
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const {setCurrentWorkspace} = useWorkspace()
  const { apiFetch, user, login, logout } = useAuth();
  const [email, setEmail] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const { signup, setTokens } = useAuth();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  interface AcceptInvitationResponse {
     message: string;
     workspace: Workspace
  }

    
 

const handleSignup = async () => {

  // -----------------------------------------
  // 1. Validate passwords locally
  // -----------------------------------------

  if (password !== confirmPassword) {
    setError("Passwords do not match.");
    return;
  }

  setError("");

  try {

    // -----------------------------------------
    // 2. Register the new user
    // -----------------------------------------

    const result = await signup({
      email,
      password,
      first_name,
      last_name,
    });
    
    console.log("SIGNUP SUCCESS:", result);

    console.log(
      "NEWLY LOGGED-IN USER:",
      result.user
    );

    console.log(
      "NEW ACCESS TOKEN:",
      result.tokens.access
    );


    // -----------------------------------------
    // 3. Accept invitation
    // -----------------------------------------

    setTokens(result.tokens);

    console.log("TOKENS updated by setTokens(result.tokens) : ", result.tokens);

    await onSignupSuccess(result.tokens);

    console.log("ACCEPT INVITATION FINISHED");

    // -----------------------------------------
    // 4. Invitation accepted
    // -----------------------------------------

    navigate("/members");

  } catch (err) {

    console.error(
      "Invitation signup failed:",
      err
    );


    // -----------------------------------------
    // 5. Django/API error
    // -----------------------------------------

    if (err instanceof ApiError) {

      setError(err.message);

      return;
    }


    // -----------------------------------------
    // 6. Unexpected JavaScript error
    // -----------------------------------------

    if (err instanceof Error) {

      setError(err.message);

      return;
    }


    // -----------------------------------------
    // 7. Unknown error
    // -----------------------------------------

    setError(
      "Signup failed. Please try again."
    );
  }
};
  return (
   <div className=" py-4 flex items-center justify-center bg-slate-100 px-4">

    <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl p-10">

    <h1 className="text-3xl font-bold text-center text-slate-800">
      Complete Your Registration
    </h1>

    <p className="mt-2 text-center text-slate-500">
      Create your account to join the workspace.
    </p>

    <form
      className="mt-8 space-y-6"
      onSubmit={(e) => {
       e.preventDefault();
       handleSignup();

      }} 
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div>
          <label className="block text-sm font-medium text-gray-700">
            First Name
          </label>
          <input
            type="text"
            value={first_name}
            onChange={(e) =>
              setFirstName(e.target.value)
            }
            className="
              mt-2 w-full rounded-lg border border-gray-300
              px-4 py-3
              focus:border-indigo-500 focus:ring-indigo-500
            "
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Last Name
          </label>

          <input
              type="text"
              value={last_name}
              onChange={(e) =>
                setLastName(e.target.value)
              }
              className="
              mt-2 w-full rounded-lg border border-gray-300
              px-4 py-3
              focus:border-indigo-500 focus:ring-indigo-500
              "
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="
              mt-2 w-full rounded-lg border border-gray-300
              px-4 py-3
              bg-gray-100
            "
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>

         <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="
              mt-2 w-full rounded-lg border border-gray-300
              px-4 py-3
            "
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Confirm Password
          </label>

          <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="
                mt-2 w-full rounded-lg border border-gray-300
                px-4 py-3
              "
            />
        </div>

      </div>
      
      {error && (
          <div
              className="
              rounded-lg
              bg-red-50
              border
              border-red-200
              p-4
              text-red-700
              "
          >
              {error}
          </div>
      )}

      <button
        type="submit"
        className="
          w-full rounded-lg bg-indigo-600
          px-4 py-3
          font-semibold text-white
          hover:bg-indigo-700
        "
      >
        Create Account
      </button>
      <button onClick={() => navigate("/login")}>
         Login
      </button>

    </form>

  </div>

</div>
  )}

  export default InvitationSignupPage;