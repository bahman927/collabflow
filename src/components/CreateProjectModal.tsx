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
      /* No workspace guard */
      <div className="space-y-3 py-5 text-center sm:py-6">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
          <svg
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            className="text-yellow-600"
          >
            <path d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
        </div>

        <h3 className="text-lg font-semibold text-gray-800">
          Workspace required
        </h3>

        <p className="mx-auto max-w-xs wrap-break-word text-sm text-gray-500">
          You need to create a workspace before adding projects.
          A workspace organizes your projects and team.
        </p>

        <button
          type="button"
          onClick={onClose}
          className="mt-2 w-full rounded-md bg-indigo-500 px-4 py-3 text-sm text-white transition hover:bg-indigo-600 sm:w-auto sm:py-2"
        >
          Got it
        </button>
      </div>
    ) : (
      /* Normal create form */
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Project Name */}
        <div className="min-w-0">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Project Name
          </label>

          <input
            autoFocus
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Website Redesign"
            className="w-full min-w-0 rounded-md border bg-indigo-50 px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:py-2 sm:text-sm"
          />
        </div>

        {/* Description */}
        <div className="min-w-0">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Description (optional)
          </label>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What's this project about?"
            rows={3}
            className="w-full min-w-0 resize-y rounded-md border bg-indigo-50 px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:py-2 sm:text-sm"
          />
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end sm:gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-md border px-4 py-3 text-sm transition hover:bg-gray-50 sm:w-auto sm:py-2"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={!name.trim() || loading}
            className="w-full rounded-md bg-indigo-500 px-4 py-3 text-sm text-white transition hover:bg-indigo-600 disabled:opacity-50 sm:w-auto sm:py-2"
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </form>
    )}
  </Modal>
);
}
