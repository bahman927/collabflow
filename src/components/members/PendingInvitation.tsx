import React from "react";

export interface PendingInvitationData {
  id: number;
  email: string;
  status: string;
  created_at?: string;
}

interface PendingInvitationProps {
  invitation: PendingInvitationData;
  onResend: (id: number) => Promise<void>;
  onCancel: (id: number) => Promise<void>;
  disabled?: boolean;
}

export function PendingInvitation({
  invitation,
  onResend,
  onCancel,
  disabled = false,
}: PendingInvitationProps) {
  const [resending, setResending] = React.useState(false);
  const [cancelling, setCancelling] = React.useState(false);

  const handleResend = async () => {
    try {
      setResending(true);
      await onResend(invitation.id);
    } finally {
      setResending(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm(`Cancel invitation for ${invitation.email}?`)) {
      return;
    }

    try {
      setCancelling(true);
      await onCancel(invitation.id);
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 border rounded-lg bg-gray-50">
      <div className="min-w-0">
        <p className="font-medium text-gray-800 truncate">
          {invitation.email}
        </p>

        <p className="text-sm text-yellow-600">
          Pending invitation
        </p>
      </div>

      <div className="flex items-center gap-2 ml-4">
        <button
          type="button"
          onClick={handleResend}
          disabled={disabled || resending || cancelling}
          className="px-3 py-1.5 text-sm font-medium text-blue-600 border border-blue-300 rounded-md hover:bg-blue-50 disabled:opacity-50"
        >
          {resending ? "Sending..." : "Resend"}
        </button>

        <button
          type="button"
          onClick={handleCancel}
          disabled={disabled || resending || cancelling}
          className="px-3 py-1.5 text-sm font-medium text-red-600 border border-red-300 rounded-md hover:bg-red-50 disabled:opacity-50"
        >
          {cancelling ? "Cancelling..." : "Cancel"}
        </button>
      </div>
    </div>
  );
}