// src/components/CreateWorkspaceModal.tsx
import { useState } from "react";
import Modal from "./shared/Modal2";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: { name: string; description: string }) => Promise<void>;
}

export default function CreateWorkspaceModal({ isOpen, onClose, onCreate }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    await onCreate({ name: name.trim(), description: description.trim() });
    setLoading(false);
    setName("");
    setDescription("");
    onClose();
  };

 return (
  <Modal isOpen={isOpen} onClose={onClose} title="Create Workspace">
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* Workspace Name */}
      <div className="min-w-0">
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Workspace Name
        </label>

        <input
          autoFocus
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Marketing Team"
          className="w-full min-w-0 rounded-md border bg-green-50 px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:py-2 sm:text-sm"
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
          placeholder="What's this workspace for?"
          rows={3}
          className="w-full min-w-0 resize-y rounded-md border bg-green-50 px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:py-2 sm:text-sm"
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
          className="w-full rounded-md bg-indigo-500 px-4 py-3 text-sm text-white transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:py-2"
        >
          {loading ? "Creating..." : "Create"}
        </button>
      </div>
    </form>
  </Modal>
);
}
