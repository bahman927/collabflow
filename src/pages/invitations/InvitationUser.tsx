import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
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
import { API_BASE_URL } from "../../api/config";

type InvitationData = {
  valid: boolean;
  email: string;
  existing_account: boolean;
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
};

interface InvitationUserProps {
  onSignupSuccess: (newTokens: Tokens) => Promise<void>;
  onAcceptInvitation: (
    token: string,
    tokens: Tokens
  ) => Promise<void>;
}

export const InvitationUser = ({
  onSignupSuccess,
  onAcceptInvitation,
}: InvitationUserProps) => {

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
  const location = useLocation();

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
          `${API_BASE_URL}/invitations/validate/${token}/`
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

  useEffect(() => {
  const invitationTokens = (
    location.state as { invitationTokens?: Tokens } | null
  )?.invitationTokens;

  if (
    !invitation ||
    !invitation.existing_account ||
    !invitationTokens ||
    !token
  ) {
    return;
  }

  const acceptInvitation = async () => {
    try {
      setSubmitting(true);
      setError("");

      await onAcceptInvitation(token, invitationTokens);

      setSuccess(true);

      // Clear the route state so the invitation isn't accepted twice.
      navigate(location.pathname, {
        replace: true,
        state: null,
      });

      setTimeout(() => {
        navigate("/", { replace: true });
      }, 3000);

    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to accept invitation."
      );
    } finally {
      setSubmitting(false);
    }
  };

  acceptInvitation();

}, [
  invitation,
  location.state,
  location.pathname,
  navigate,
  token,
  onAcceptInvitation,
]);

  const handleAvatarChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
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
      formData.append("token", token);
      formData.append("full_name", fullName.trim());
      formData.append("password", password);
      if (avatarFile) {formData.append("avatar", avatarFile); }
      const response = await fetch(`${API_BASE_URL}/auth/register/`, {
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

  return (
  <>
    {/* LOADING */}
    {loadingInvitation && (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="flex items-center gap-3 text-sm text-gray-600 sm:text-base">
          <Loader2 className="h-5 w-5 shrink-0 animate-spin" />
          <span>Checking invitation...</span>
        </div>
      </div>
    )}

    {/* INVALID INVITATION */}
    {!loadingInvitation && !invitation && (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-3 py-6 sm:px-4">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5 text-center shadow-sm sm:p-8">

          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
            <X className="h-7 w-7 text-red-500" />
          </div>

          <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">
            Invalid invitation
          </h1>

          <p className="mt-3 wrap-break-word text-sm text-gray-500">
            {error || "This invitation link is no longer valid."}
          </p>

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="mt-6 w-full rounded-lg bg-gray-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            Go to login
          </button>

        </div>
      </div>
    )}

    {/* VALID INVITATION */}
    {!loadingInvitation && invitation && (
      <div className="flex min-h-screen min-w-0 items-center justify-center bg-gray-50 px-3 py-6 sm:px-5 sm:py-10">

        <div className="w-full min-w-0 max-w-lg">

          {/* HEADER */}
          <div className="mb-6 text-center sm:mb-8">
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Join CollabFlow
            </h1>

            <p className="mt-2 text-sm text-gray-500 sm:text-base">
              Create your account to join the workspace.
            </p>
          </div>

          {/* REGISTRATION CARD */}
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6 md:p-7">

            {/* INVITATION DETAILS */}
            <div className="mb-6 rounded-xl border border-gray-200 bg-gray-50 p-3 sm:mb-7 sm:p-4">

              <div className="mb-4 flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100">
                  <User className="h-5 w-5 text-blue-600" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-500">
                    You've been invited to
                  </p>

                  <p className="wrap-break-word font-semibold text-gray-900">
                    {invitation.workspace.name}
                  </p>
                </div>
              </div>

              <div className="space-y-3">

                {/* EMAIL */}
                <div>
                  <p className="mb-1 text-xs text-gray-500">
                    Email
                  </p>

                  <div className="min-w-0 wrap-break-word rounded-lg border border-gray-200 bg-white px-3 py-3 text-sm text-gray-700 sm:py-2.5">
                    {invitation.email}
                  </div>
                </div>

                {/* ROLE */}
                <div>
                  <p className="mb-1 text-xs text-gray-500">
                    Workspace role
                  </p>

                  <div className="rounded-lg border border-gray-200 bg-white px-3 py-3 sm:py-2.5">
                    <span className="inline-flex items-center gap-2 text-sm font-medium text-gray-800">
                      <span className="h-2 w-2 shrink-0 rounded-full bg-blue-500" />

                      {invitation.role === "viewer" ? "Viewer" : "Member"}
                    </span>
                  </div>
                </div>

              </div>
            </div>

            {/* ERROR */}
            {error && (
              <div className="mb-5 wrap-break-word rounded-lg border border-red-200 bg-red-50 px-3 py-3 text-sm text-red-700 sm:px-4">
                {error}
              </div>
            )}

          {/* SUCCESS */}
            {success && (
              <div className="mb-5 flex items-start gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-3 text-sm text-green-700 sm:px-4">
                <Check className="mt-0.5 h-4 w-4 shrink-0" />

                <span>
                  {invitation.existing_account
                    ? "You have successfully joined the workspace!"
                    : "Your account has been created successfully."}
                </span>
              </div>
            )}

            {/* REGISTRATION FORM */}
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* FULL NAME */}
              <div className="min-w-0">
                <label
                  htmlFor="fullName"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Full name
                </label>

                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  autoComplete="name"
                  disabled={submitting}
                  className="w-full min-w-0 rounded-lg border border-gray-300 px-3.5 py-3 text-base outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100 sm:py-2.5 sm:text-sm"
                />
              </div>

              {/* PASSWORD */}
              <div className="min-w-0">
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    autoComplete="new-password"
                    disabled={submitting}
                    className="w-full min-w-0 rounded-lg border border-gray-300 px-3.5 py-3 pr-12 text-base outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100 sm:py-2.5 sm:text-sm"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center text-gray-400 transition hover:text-gray-600"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* PROFILE PHOTO */}
              <div className="min-w-0">

                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Profile photo
                  <span className="ml-1 font-normal text-gray-400">
                    (optional)
                  </span>
                </label>

                <div className="flex min-w-0 flex-wrap items-center gap-3 sm:gap-4">

                  {/* AVATAR PREVIEW */}
                  <div className="relative shrink-0">
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt="Profile preview"
                        className="h-20 w-20 rounded-full border border-gray-200 object-cover"
                      />
                    ) : (
                      <div className="flex h-20 w-20 items-center justify-center rounded-full border border-gray-200 bg-gray-100">
                        <User className="h-8 w-8 text-gray-400" />
                      </div>
                    )}

                    {avatarPreview && (
                      <button
                        type="button"
                        onClick={handleRemoveAvatar}
                        className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-gray-900 text-white transition hover:bg-gray-700"
                        aria-label="Remove profile photo"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>

                  {/* UPLOAD */}
                  <div className="min-w-0 flex-1">

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={submitting}
                      className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                    >
                      <ImagePlus className="h-4 w-4 shrink-0" />
                      Upload photo
                    </button>

                    <p className="mt-1.5 wrap-break-word text-xs leading-relaxed text-gray-400">
                      JPG, PNG or other image · Max 5 MB
                    </p>

                  </div>
                </div>
              </div>

              {/* SUBMIT */}
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

            {/* FOOTER */}
            <p className="mt-6 text-center text-xs leading-relaxed text-gray-400">
              By creating an account, you will join this workspace
              with the role shown above.
            </p>

          </div>
        </div>
      </div>
    )}
  </>
);

}