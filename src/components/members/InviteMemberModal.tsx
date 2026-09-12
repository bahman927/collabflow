
import { useState } from "react";
import { useInvitations } from "../../context/InvitationProvider";
import { useWorkspace } from "../../context/WorkspaceProvider";

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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">

        <h2 className="text-xl font-semibold text-gray-900 mb-5">
          Invite User
        </h2>

        {/* Error message */}
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-sm text-red-700">
              {error}
            </p>
          </div>
        )}

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
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
            className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
          />
        </div>

        {/* Role */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Role
          </label>

          <select
            value={role}
            onChange={(e) => {
              setRole(e.target.value as MemberRole);
              setError(null);
            }}
            className="border border-gray-300 p-2 rounded-lg w-full bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
          >
            <option value="member">Member</option>
            <option value="viewer">Viewer</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3">

          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Invitation"}
          </button>

        </div>

      </div>
    </div>
  );
}

