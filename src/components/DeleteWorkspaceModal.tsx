import { useState } from "react";
import { useWorkspace } from "../context/WorkspaceProvider";
interface DeleteWorkspaceModalProps {
  onClose: () => void;
}

export default function DeleteWorkspaceModal({ onClose }: DeleteWorkspaceModalProps) {
  const { currentWorkspace, deleteWorkspace } = useWorkspace();
  const [confirmName, setConfirmName] = useState("");

  const isMatch = confirmName.trim() === currentWorkspace!.name.trim();

  const handleDelete = async () => {
    if (!isMatch) return;
    await deleteWorkspace(currentWorkspace!.id);
    onClose();
  };
  if (!currentWorkspace) return null;

 return (
  <div className="min-w-0 space-y-4 p-4 sm:p-5">

    {/* Title */}
    <h2 className="text-lg font-semibold text-red-600">
      Delete Workspace
    </h2>

    {/* Confirmation Message */}
    <p className="wrap-break-word text-sm text-gray-600">
      To confirm deletion, type the workspace name:
      <span className="ml-1 font-semibold text-gray-900">
        {currentWorkspace!.name}
      </span>
    </p>

    {/* Warning */}
    <p className="wrap-break-word text-xs leading-relaxed text-gray-500">
      All projects and tasks in this workspace will also be deleted.
      This action cannot be undone.
    </p>

    {/* Workspace Name Input */}
    <input
      type="text"
      value={confirmName}
      onChange={(e) => setConfirmName(e.target.value)}
      className="w-full min-w-0 rounded-md border border-gray-300 px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-red-500 sm:py-2 sm:text-sm"
      placeholder="Enter workspace name"
    />

    {/* Match Status */}
    {confirmName.length > 0 && (
      <div>
        <span
          className={`inline-block max-w-full wrap-break-word rounded px-2 py-1 text-sm font-medium ${
            isMatch
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {isMatch ? "Matched" : "Not matched"}
        </span>
      </div>
    )}

    {/* Actions */}
    <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end sm:gap-3">

      <button
        type="button"
        onClick={onClose}
        className="w-full rounded px-4 py-3 text-sm text-gray-600 transition hover:bg-gray-100 sm:w-auto sm:py-2"
      >
        Cancel
      </button>

      <button
        type="button"
        onClick={handleDelete}
        disabled={!isMatch}
        className={`w-full rounded px-4 py-3 text-sm text-white transition sm:w-auto sm:py-2 ${
          isMatch
            ? "bg-red-600 hover:bg-red-700"
            : "cursor-not-allowed bg-red-300"
        }`}
      >
        Delete
      </button>

    </div>
  </div>
);
}
