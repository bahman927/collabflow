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
  const [showCancelConfirm, setShowCancelConfirm] = React.useState(false);

  const handleResend = async () => {
    try {
      setResending(true);
      await onResend(invitation.id);
    } finally {
      setResending(false);
    }
  };

  const handleCancel = async () => {
    
    try {
      setCancelling(true);
      await onCancel(invitation.id);
    } finally {
      setCancelling(false);
    }
  };


 return (
  <div className="flex flex-col gap-3 rounded-lg border bg-gray-50 px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4">

    {/* Invitation information */}
    <div className="min-w-0 flex-1">
      <p className="font-medium text-gray-800 wrap-break-word">
        {invitation.email}
      </p>

      <p className="mt-1 text-sm text-yellow-600">
        Pending invitation
      </p>
    </div>

    {/* Invitation actions */}
    <div className="flex w-full items-center gap-2 sm:ml-4 sm:w-auto sm:shrink-0">

      <button
        type="button"
        onClick={handleResend}
        disabled={disabled || resending || cancelling}
        className="flex-1 rounded-md border border-blue-300 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 disabled:opacity-50 sm:flex-none sm:py-1.5"
      >
        {resending ? "Sending..." : "Resend"}
      </button>

      <button
        type="button"
        // onClick={handleCancel}
        onClick={() => setShowCancelConfirm(true)}
        disabled={disabled || resending || cancelling}
        className="flex-1 rounded-md border border-red-300 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50 sm:flex-none sm:py-1.5"
      >
        {cancelling ? "Cancelling..." : "Cancel"}
      </button>

      {showCancelConfirm && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
        <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
          <h2 className="text-lg font-semibold text-gray-900">
            Cancel invitation?
          </h2>

          <p className="mt-2 text-sm text-gray-600">
            Are you sure you want to cancel the invitation for {invitation.email}?
          </p>

          <div className="mt-5 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowCancelConfirm(false)}
              className="rounded-md border px-4 py-2 text-sm"
            >
              Keep invitation
            </button>

            <button
              type="button"
              onClick={async () => {
                setShowCancelConfirm(false);
                await handleCancel();
              }}
              className="rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
            >
              Cancel invitation
            </button>
          </div>
        </div>
      </div>
    )}

    </div>
  </div>
); 

}