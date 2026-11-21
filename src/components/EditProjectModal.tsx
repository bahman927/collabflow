// src/components/EditProjectModal.tsx
import { useState, useEffect } from "react";
import Modal from "./shared/Modal2";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { name: string; description: string }) => Promise<void>;
  initialName: string;
  initialDescription: string;
}

export default function EditProjectModal({
  isOpen, onClose, onSave, initialName, initialDescription,
}: Props) {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [loading, setLoading] = useState(false);

  // Sync when modal opens with new values
  useEffect(() => {
    if (isOpen) {
      setName(initialName);
      setDescription(initialDescription);
    }
  }, [isOpen, initialName, initialDescription]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    await onSave({ name: name.trim(), description: description.trim() });
    setLoading(false);
    onClose();
  };

  return (
  <Modal isOpen={isOpen} onClose={onClose} title="Edit Project">
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
          className="w-full min-w-0 rounded-md border bg-indigo-50 px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:py-2 sm:text-sm"
        />
      </div>

      {/* Description */}
      <div className="min-w-0">
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Description
        </label>

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
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
          className="w-full rounded-md bg-indigo-500 px-4 py-3 text-sm text-white transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:py-2"
        >
          {loading ? "Saving..." : "Save"}
        </button>

      </div>
    </form>
  </Modal>
);
}
