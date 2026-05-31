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
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-semibold text-red-600">Delete project</h2>
      
     
      <div className="flex items-start gap-2">
          <svg
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            className="text-red-600 shrink-0"
          >
            <path d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>

          <p className="text-xs text-gray-500">
            All tasks in this project will also be deleted. This action cannot be undone.
          </p>
      </div>
       <p className="text-sm text-gray-600">
        To confirm deletion, type the project name:
        <span className="font-semibold text-gray-900 ml-1">
          {currentProject!.name}
        </span>
      </p>

      <input
        type="text"
        value={confirmName}
        onChange={(e) => setConfirmName(e.target.value)}
        className="w-full border rounded px-3 py-2"
        placeholder="Enter project name"
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



// // src/components/ConfirmDeleteModal.tsx
// import Modal from "./shared/Modal2";

// interface Props {
//   isOpen: boolean;
//   onClose: () => void;
//   onConfirm: () => void;
//   projectName: string;
// }

// export default function ConfirmDeleteModal({ isOpen, onClose, onConfirm, projectName }: Props) {
//   return (
//     <Modal isOpen={isOpen} onClose={onClose} title="Delete Project">
//       <div className="space-y-4">
//         <div className="flex items-center gap-3">
//           <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
 //           <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-red-600">
//               <path d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
//             </svg>
//           </div>
//           <div>
//             <p className="text-sm text-gray-700">
//               Are you sure you want to delete <strong>{projectName}</strong>?
//             </p>
//             <p className="text-xs text-gray-500 mt-1">
//               All tasks in this project will also be deleted. This action cannot be undone.
//             </p>
//           </div>
//         </div>
//         <div className="flex justify-end gap-2 pt-2">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 text-sm rounded-md border hover:bg-gray-50"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={() => { onConfirm(); onClose(); }}
//             className="px-4 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-700"
//           >
//             Delete
//           </button>
//         </div>
//       </div>
//     </Modal>
//   );
// }
