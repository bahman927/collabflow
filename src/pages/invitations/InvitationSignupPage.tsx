// src/pages/auth/InvitationSignupPage.tsx

import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  // const {setCurrentWorkspace} = useWorkspace()
  // const { apiFetch, user, login, logout } = useAuth();
  const [email, setEmail] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const { signup, setTokens, user } = useAuth();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  interface AcceptInvitationResponse {
     message: string;
     workspace: Workspace
  }

  const handleSignup = async () => {
 
  if (password !== confirmPassword) {
    setError("Passwords do not match.");
    return;
  }
  setError("");

  try {

    // -----------------------------------------
    // 2. Register the new user
    // -----------------------------------------

    const full_name = `${first_name} ${last_name}`.trim();

      const result = await signup({
        email,
        password,
        full_name,
      });
    
    // -----------------------------------------
    // 3. Accept invitation
    // -----------------------------------------

    setTokens(result.tokens);
    console.log("TOKENS updated by setTokens(result.tokens) : ", result.tokens);
    await onSignupSuccess(result.tokens);
    console.log("ACCEPT INVITATION FINISHED");
 
  } catch (err) {
    console.error(
      "Invitation signup failed:",
      err
    );
    if (err instanceof ApiError) {
      setError(err.message);
      return;
    }
    if (err instanceof Error) {
      setError(err.message);
      return;
    }
    setError(
      "Signup failed. Please try again."
    );
  }
};

  return (
  <div className="flex min-h-screen min-w-0 items-center justify-center bg-slate-100 px-3 py-6 sm:px-5 sm:py-8">

    <div className="w-full min-w-0 max-w-2xl rounded-2xl bg-white p-4 shadow-xl sm:p-6 md:p-10">

      {/* HEADER */}
      <h1 className="text-center text-2xl font-bold text-slate-800 sm:text-3xl">
        Complete Your Registration
      </h1>

      <p className="mt-2 text-center text-sm text-slate-500 sm:text-base">
        Create your account to join the workspace.
      </p>

      {/* REGISTRATION FORM */}
      <form
        className="mt-6 space-y-5 sm:mt-8 sm:space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          handleSignup();
        }}
      >
        <div className="grid min-w-0 grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">

          {/* FIRST NAME */}
          <div className="min-w-0">
            <label className="block text-sm font-medium text-gray-700">
              First Name
            </label>

            <input
              type="text"
              value={first_name}
              onChange={(e) => setFirstName(e.target.value)}
              className="mt-2 w-full min-w-0 rounded-lg border border-gray-300 px-3 py-3 text-base focus:border-indigo-500 focus:ring-indigo-500 sm:px-4"
            />
          </div>

          {/* LAST NAME */}
          <div className="min-w-0">
            <label className="block text-sm font-medium text-gray-700">
              Last Name
            </label>

            <input
              type="text"
              value={last_name}
              onChange={(e) => setLastName(e.target.value)}
              className="mt-2 w-full min-w-0 rounded-lg border border-gray-300 px-3 py-3 text-base focus:border-indigo-500 focus:ring-indigo-500 sm:px-4"
            />
          </div>

          {/* EMAIL */}
          <div className="min-w-0 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full min-w-0 rounded-lg border border-gray-300 bg-gray-100 px-3 py-3 text-base sm:px-4"
            />
          </div>

          {/* PASSWORD */}
          <div className="min-w-0">
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full min-w-0 rounded-lg border border-gray-300 px-3 py-3 text-base sm:px-4"
            />
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="min-w-0">
            <label className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>

            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-2 w-full min-w-0 rounded-lg border border-gray-300 px-3 py-3 text-base sm:px-4"
            />
          </div>

        </div>

        {/* ERROR */}
        {error && (
          <div className="wrap-break-word rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 sm:p-4">
            {error}
          </div>
        )}

        {/* ACTIONS */}
        <div className="flex flex-col gap-3">

          <button
            type="submit"
            className="w-full rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-700"
          >
            Create Account
          </button>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 font-medium text-gray-700 transition hover:bg-gray-100"
          >
            Login
          </button>

        </div>

      </form>

    </div>
  </div>
);
}

  export default InvitationSignupPage;