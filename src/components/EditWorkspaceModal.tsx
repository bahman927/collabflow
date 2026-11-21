import { useState } from "react";
import { useWorkspace } from "../context/WorkspaceProvider";
import Modal from "./shared/Modal2";

interface EditWorkspaceModalProps {
  onClose: () => void;
}

export default function EditWorkspaceModal({ onClose }: EditWorkspaceModalProps ) {
  const { currentWorkspace, updateWorkspace } = useWorkspace();
  const [name, setName] = useState(currentWorkspace?.name || "");

  const handleSave = async () => {
    await updateWorkspace(currentWorkspace!.id, { name });
    onClose();
  };

  return (
  <div className="min-w-0 space-y-4 p-4 sm:p-5">

    {/* Title */}
    <h2 className="text-lg font-semibold text-gray-900">
      Edit Workspace
    </h2>

    {/* Workspace Name */}
    <div className="min-w-0">
      <label className="mb-1 block text-sm font-medium text-gray-700">
        Workspace Name
      </label>

      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full min-w-0 rounded-md border border-gray-300 px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:py-2 sm:text-sm"
        placeholder="Workspace name"
      />
    </div>

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
        onClick={handleSave}
        disabled={!name.trim()}
        className="w-full rounded bg-indigo-600 px-4 py-3 text-sm text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:py-2"
      >
        Save
      </button>

    </div>
  </div>
);
}
