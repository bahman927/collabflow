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

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-semibold text-red-600">Delete Workspace</h2>

      <p className="text-sm text-gray-600">
        To confirm deletion, type the workspace name:
        <span className="font-semibold text-gray-900 ml-1">
          {currentWorkspace!.name}
        </span>
      </p>
      <p className="text-xs text-gray-500 mt-1">
              All projects and tasks in this workspace will also be deleted. This action cannot be undone.
      </p>

      <input
        type="text"
        value={confirmName}
        onChange={(e) => setConfirmName(e.target.value)}
        className="w-full border rounded px-3 py-2"
        placeholder="Enter workspace name"
      />

      {confirmName.length > 0 && (
        <div
          className={`text-sm font-medium px-2 py-1 rounded inline-block ${
            isMatch ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {isMatch ? "Matched" : "Not matched"}
        </div>
      )}

      <div className="flex justify-end gap-2">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded"
        >
          Cancel
        </button>

        <button
          onClick={handleDelete}
          disabled={!isMatch}
          className={`px-4 py-2 text-sm text-white rounded ${
            isMatch
              ? "bg-red-600 hover:bg-red-700"
              : "bg-red-300 cursor-not-allowed"
          }`}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
