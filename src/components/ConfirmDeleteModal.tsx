import { useState}  from "react"
import { useProject} from "../context/ProjectProvider"

interface DeleteProjectModalProps {
  onClose: () => void;
  onConfirm: () => Promise<void>;
  projectName: string;
}

export default function DeleteProjectModal({ onClose }: DeleteProjectModalProps) {
  const { currentProject, deleteProject } = useProject();
  const [confirmName, setConfirmName] = useState("");

  const isMatch = confirmName.trim() === currentProject!.name.trim();

  const handleDelete = async () => {
    if (!isMatch) return;
    await deleteProject(currentProject!.id);
    onClose();
  };

 return (
  <div className="space-y-4 p-4 sm:p-5">

    {/* Title */}
    <h2 className="text-lg font-semibold text-red-600">
      Delete project
    </h2>

    {/* Warning */}
    <div className="flex items-start gap-2">
      <svg
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        className="mt-0.5 shrink-0 text-red-600"
      >
        <path d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      </svg>

      <p className="wrap-break-word text-xs leading-relaxed text-gray-500">
        All tasks in this project will also be deleted. This action cannot be undone.
      </p>
    </div>

    {/* Project Name Confirmation */}
    <p className="text-sm text-gray-600">
      To confirm deletion, type the project name:
      <span className="ml-1 font-semibold text-gray-900 wrap-break-word">
        {currentProject!.name}
      </span>
    </p>

    {/* Input */}
    <input
      type="text"
      value={confirmName}
      onChange={(e) => setConfirmName(e.target.value)}
      className="w-full min-w-0 rounded border px-3 py-3 text-base sm:py-2 sm:text-sm"
      placeholder="Enter project name"
    />

    {/* Match Feedback */}
    {confirmName.length > 0 && (
      <div
        className={`inline-block max-w-full rounded px-2 py-1 text-sm font-medium wrap-break-word ${
          isMatch
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {isMatch ? "Matched" : "Not matched"}
      </div>
    )}

    {/* Actions */}
    <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
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


 