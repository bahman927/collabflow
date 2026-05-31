// src/components/CreateProjectModal.tsx
import { useState } from "react";
import Modal from "./shared/Modal2";
import { useWorkspace } from "../context/WorkspaceProvider";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: { name: string;
              workspace_id: number; 
             description: string }) => Promise<void>;
            
}

export default function CreateProjectModal({ isOpen, onClose, onCreate }: Props) {
  const { currentWorkspace, role } = useWorkspace();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  if (role?.toLowerCase() !== "owner") {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Access Denied">
      <div className="p-4 text-center text-red-600">
        Only workspace owners can create projects.
      </div>
    </Modal>
  );
}


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !currentWorkspace) return;

    setLoading(true);

    await onCreate({
       name: name.trim(),
       description: description.trim() ?? "",
       workspace_id: currentWorkspace.id, 
      });
    setLoading(false);
    setName("");
    setDescription("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Project">
      {!currentWorkspace ? (
        // ── No workspace guard ──
        <div className="text-center py-6 space-y-3">
          <div className="w-12 h-12 mx-auto bg-yellow-100 rounded-full flex items-center justify-center">
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-yellow-600">
              <path d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800">
            Workspace required
          </h3>
          <p className="text-sm text-gray-500 max-w-xs mx-auto">
            You need to create a workspace before adding projects.
            A workspace organizes your projects and team.
          </p>
          <button
            onClick={onClose}
            className="mt-2 px-4 py-2 text-sm rounded-md bg-indigo-500 text-white hover:bg-indigo-600"
          >
            Got it
          </button>
        </div>
      ) : (
        // ── Normal create form ──
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project Name
            </label>
            <input
              autoFocus
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Website Redesign"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-indigo-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's this project about?"
              rows={3}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-indigo-50"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-md border hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim() || loading}
              className="px-4 py-2 text-sm rounded-md bg-indigo-500 text-white hover:bg-indigo-600 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
