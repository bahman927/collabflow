
import { useState } from "react";
import { useInvitations } from "../../context/InvitationProvider";
import { useWorkspace } from "../../context/WorkspaceProvider";
import { useActivity }          from '../../context/ActivityProvider';

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type MemberRole = "member" | "viewer";

export default function InviteMemberModal({
  isOpen,
  onClose,
}: InviteMemberModalProps) {
  const { sendInvite } = useInvitations();
  const { currentWorkspace } = useWorkspace();
  const { fetchActivity } = useActivity();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<MemberRole>("member");
  const [error, setError] = useState<string | null>(null);

  const workspaceId = currentWorkspace?.id;

  if (!isOpen) return null;

  if (!workspaceId) {
    return <div>Workspace not loaded</div>;
  }

  const handleSubmit = async () => {
    setError(null);

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError("Email is required.");
      return;
    }

    if (!trimmedEmail.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);

      await sendInvite(
        trimmedEmail,
        workspaceId,
        role
      );
      await fetchActivity()

      setEmail("");
      setRole("member");
      setError(null);

      onClose();

    } catch (err) {
      console.error("Failed to send invitation:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to send invitation."
      );

    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;

    setEmail("");
    setRole("member");
    setError(null);

    onClose();
  };

 return (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 sm:p-5">

    <div className="w-full max-w-md max-h-[90dvh] overflow-y-auto rounded-lg bg-white p-4 shadow-lg sm:p-6">

      <h2 className="mb-5 text-xl font-semibold text-gray-900">
        Invite User
      </h2>

      {/* Error message */}
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-3 sm:px-4">
          <p className="text-sm text-red-700 wrap-break-word">
            {error}
          </p>
        </div>
      )}

      {/* Email */}
      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Email
        </label>

        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError(null);
          }}
          placeholder="Enter email"
          className="w-full rounded-lg border border-gray-300 px-3 py-3 text-base focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 sm:py-2"
        />
      </div>

      {/* Role */}
      <div className="mb-6">
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Role
        </label>

        <select
          value={role}
          onChange={(e) => {
            setRole(e.target.value as MemberRole);
            setError(null);
          }}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-3 text-base focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 sm:py-2"
        >
          <option value="member">Member</option>
          <option value="viewer">Viewer</option>
        </select>
      </div>

      {/* Buttons */}
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">

        <button
          type="button"
          onClick={handleClose}
          disabled={loading}
          className="w-full rounded-lg bg-gray-300 px-4 py-3 hover:bg-gray-400 disabled:opacity-50 sm:w-auto sm:py-2"
        >
          Cancel
        </button>

        <button
          type="button"
          disabled={loading}
          onClick={handleSubmit}
          className="w-full rounded-lg bg-green-600 px-4 py-3 text-white hover:bg-green-700 disabled:opacity-50 sm:w-auto sm:py-2"
        >
          {loading ? "Sending..." : "Send Invitation"}
        </button>

      </div>

    </div>
  </div>
);
}

