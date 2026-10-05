import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Tokens } from "../../types/auth";
import {
  Camera,
  Check,
  Eye,
  EyeOff,
  ImagePlus,
  Loader2,
  User,
  X,
} from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api";

type InvitationData = {
  valid: boolean;
  email: string;
  workspace: {
    id: number;
    name: string;
  };
  role: "member" | "viewer";
  invited_by: string;
};

type AcceptResponse = {
  message: string;
  user: {
    id: number;
    email: string;
    full_name: string;
    avatar: string | null;
  };
  workspace: {
    id: number;
    name: string;
    created_at: string;
    currentUserRole: string;
  };
  membership: {
    id: number;
    role: string;
  };
};

type SignupResponse = {
  user: {
    id: number;
    email: string;
    full_name: string;
    avatar: string | null;
  };
  tokens: Tokens;
  // error?: string;
};

interface InvitationUserProps {
  onSignupSuccess: (newTokens: Tokens) => Promise<void>
}

export  const InvitationUser = ({onSignupSuccess}: InvitationUserProps) => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [invitation, setInvitation] =
    useState<InvitationData | null>(null);

  const [loadingInvitation, setLoadingInvitation] =
    useState(true);

  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [avatarFile, setAvatarFile] =
    useState<File | null>(null);

  const [avatarPreview, setAvatarPreview] =
    useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // ---------------------------------------
  // Validate invitation
  // ---------------------------------------

  useEffect(() => {
    if (!token) {
      setError("Invalid invitation link.");
      setLoadingInvitation(false);
      return;
    }

    const validateInvitation = async () => {
      try {
        setLoadingInvitation(true);
        setError("");

        const response = await fetch(
          `${API_URL}/invitations/validate/${token}/`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "This invitation is no longer valid."
          );
        }

        setInvitation(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to validate invitation."
        );
      } finally {
        setLoadingInvitation(false);
      }
    };

    validateInvitation();
  }, [token]);

  // ---------------------------------------
  // Select avatar
  // ---------------------------------------

  const handleAvatarChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    // Basic client-side validation
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Profile photo must be smaller than 5 MB.");
      return;
    }

    setError("");

    setAvatarFile(file);

    const previewUrl = URL.createObjectURL(file);

    setAvatarPreview(previewUrl);
  };

  // ---------------------------------------
  // Remove avatar
  // ---------------------------------------

  const handleRemoveAvatar = () => {
    if (avatarPreview) {
      URL.revokeObjectURL(avatarPreview);
    }

    setAvatarFile(null);
    setAvatarPreview(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // ---------------------------------------
  // Submit invitation signup
  // ---------------------------------------

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!token) {
      setError("Invalid invitation link.");
      return;
    }

    if (!invitation) {
      setError("Invitation information is unavailable.");
      return;
    }

    if (!fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!password) {
      setError("Please enter a password.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setSuccess(false);

      const formData = new FormData();

      // Token identifies the invitation.
      formData.append("token", token);

      // Email is intentionally NOT submitted.
      // Backend gets it from invitation.email.

      formData.append("full_name", fullName.trim());

      formData.append("password", password);

      // Role is intentionally NOT submitted.
      // Backend gets it from invitation.role.

      if (avatarFile) {formData.append("avatar", avatarFile); }

      const response = await fetch(`${API_URL}/auth/register/`, {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        const errorMessage =
          data?.error ||
          data?.detail ||
          Object.values(data || {})
            .flat()
            .join(" ") ||
          "Unable to create your account.";

        throw new Error(errorMessage);
      }

      const signupData = data as SignupResponse;

      await onSignupSuccess(signupData.tokens);

    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ---------------------------------------
  // Loading state
  // ---------------------------------------

  if (loadingInvitation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="flex items-center gap-3 text-gray-600">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Checking invitation...</span>
        </div>
      </div>
    );
  }

  // ---------------------------------------
  // Invalid invitation
  // ---------------------------------------

  if (!invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md rounded-2xl bg-white border border-gray-200 shadow-sm p-8 text-center">

          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
            <X className="h-7 w-7 text-red-500" />
          </div>

          <h1 className="text-2xl font-semibold text-gray-900">
            Invalid invitation
          </h1>

          <p className="mt-3 text-sm text-gray-500">
            {error || "This invitation link is no longer valid."}
          </p>

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="mt-6 w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
          >
            Go to login
          </button>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-lg">

        {/* -------------------------------- */}
        {/* Header */}
        {/* -------------------------------- */}

        <div className="text-center mb-8">

          <h1 className="text-3xl font-bold text-gray-900">
            Join CollabFlow
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Create your account to join the workspace.
          </p>

        </div>

        {/* -------------------------------- */}
        {/* Card */}
        {/* -------------------------------- */}

        <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-7">

          {/* -------------------------------- */}
          {/* Invitation information */}
          {/* -------------------------------- */}

          <div className="rounded-xl bg-gray-50 border border-gray-200 p-4 mb-7">

            <div className="flex items-center gap-3 mb-4">

              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <User className="h-5 w-5 text-blue-600" />
              </div>

              <div>
                <p className="text-xs text-gray-500">
                  You've been invited to
                </p>

                <p className="font-semibold text-gray-900">
                  {invitation.workspace.name}
                </p>
              </div>

            </div>

            <div className="space-y-3">

              {/* Email */}

              <div>
                <p className="text-xs text-gray-500 mb-1">
                  Email
                </p>

                <div className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700">
                  {invitation.email}
                </div>
              </div>

              {/* Role */}

              <div>
                <p className="text-xs text-gray-500 mb-1">
                  Workspace role
                </p>

                <div className="rounded-lg border border-gray-200 bg-white px-3 py-2.5">

                  <span className="inline-flex items-center gap-2 text-sm font-medium text-gray-800">

                    <span className="h-2 w-2 rounded-full bg-blue-500" />

                    {invitation.role === "viewer"
                      ? "Viewer"
                      : "Member"}

                  </span>

                </div>
              </div>

            </div>
          </div>

          {/* -------------------------------- */}
          {/* Errors */}
          {/* -------------------------------- */}

          {error && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* -------------------------------- */}
          {/* Success */}
          {/* -------------------------------- */}

          {success && (
            <div className="mb-5 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              <Check className="h-4 w-4 shrink-0" />
              Your account has been created successfully.
            </div>
          )}

          {/* -------------------------------- */}
          {/* Form */}
          {/* -------------------------------- */}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* Full name */}

            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Full name
              </label>

              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) =>
                  setFullName(e.target.value)
                }
                placeholder="Enter your full name"
                autoComplete="name"
                disabled={submitting}
                className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
              />
            </div>

            {/* Password */}

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Password
              </label>

              <div className="relative">

                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="Create a password"
                  autoComplete="new-password"
                  disabled={submitting}
                  className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 pr-11 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((value) => !value)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>

              </div>
            </div>

            {/* -------------------------------- */}
            {/* Profile photo */}
            {/* -------------------------------- */}

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile photo
                <span className="ml-1 font-normal text-gray-400">
                  (optional)
                </span>
              </label>

              <div className="flex items-center gap-4">

                {/* Avatar preview */}

                <div className="relative shrink-0">

                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Profile preview"
                      className="h-20 w-20 rounded-full object-cover border border-gray-200"
                    />
                  ) : (
                    <div className="h-20 w-20 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center">
                      <User className="h-8 w-8 text-gray-400" />
                    </div>
                  )}

                  {avatarPreview && (
                    <button
                      type="button"
                      onClick={handleRemoveAvatar}
                      className="absolute -right-1 -top-1 h-6 w-6 rounded-full bg-gray-900 text-white flex items-center justify-center hover:bg-gray-700"
                      aria-label="Remove profile photo"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}

                </div>

                {/* Upload controls */}

                <div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
                    disabled={submitting}
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    {avatarPreview ? (
                      <Camera className="h-4 w-4" />
                    ) : (
                      <ImagePlus className="h-4 w-4" />
                    )}

                    {avatarPreview
                      ? "Change photo"
                      : "Upload photo"}
                  </button>

                  <p className="mt-1.5 text-xs text-gray-400">
                    JPG, PNG or other image · Max 5 MB
                  </p>

                </div>

              </div>

            </div>

            {/* -------------------------------- */}
            {/* Submit */}
            {/* -------------------------------- */}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
            >

              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating account...
                </span>
              ) : (
                "Create account"
              )}

            </button>

          </form>

          {/* -------------------------------- */}
          {/* Footer */}
          {/* -------------------------------- */}

          <p className="mt-6 text-center text-xs text-gray-400">
            By creating an account, you will join this workspace
            with the role shown above.
          </p>

        </div>
      </div>
    </div>
  );
}