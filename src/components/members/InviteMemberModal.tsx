import { useState } from "react";
import { useInvitations } from "../../context/InvitationProvider";
import { useWorkspace } from "../../context/WorkspaceProvider";
  

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InviteMemberModal({ isOpen, onClose }: InviteMemberModalProps) {
  const { sendInvite } = useInvitations();
  const { currentWorkspace } = useWorkspace();
  const [loading, setLoading] = useState(false);
  // const workspaceId = currentWorkspace?.id!;
  const workspaceId = currentWorkspace?.id;

if (!workspaceId) {
  return <div>Workspace not loaded</div>;
}

  const [email, setEmail] = useState("");

  if (!isOpen) return null;



const handleSubmit = async () => {
  try {
    setLoading(true);
    if (!email.trim()) return alert("Email is required");

    if (!email.includes("@")) return alert("Invalid email");

    await sendInvite(email.trim(), workspaceId);
    onClose();
  } catch (err) {
    alert("Failed to send invitation");
  } finally {
    setLoading(false);
  }
};


  // const handleSubmit = async () => {
  //   await sendInvite(email, workspaceId);
  //   onClose();
  // };

  return (
    <div className="modal">
      <h2>Invite Member</h2>

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter email"
        className="border p-2 rounded w-full"
      />

      <div className="flex gap-3 mt-4">
        <button
          disabled={loading}
          onClick={handleSubmit}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Send Invitation
        </button>

        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-300 rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
