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
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-semibold">Edit Workspace</h2>

      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full border rounded px-3 py-2"
        placeholder="Workspace name"
      />

      <div className="flex justify-end gap-2">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded"
        >
          Cancel
        </button>

        <button
          onClick={handleSave}
          className="px-4 py-2 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Save
        </button>
      </div>
    </div>
  );
}
