
// src/pages/workspace/WorkspacePage.tsx
import {useEffect, useState}         from "react"
import { useParams, Link } from "react-router-dom";
import { useWorkspace }    from "../../context/WorkspaceProvider";
import { useProject }      from "../../context/ProjectProvider";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import Modal                 from "../../components/shared/Modal2";
import EditWorkspaceModal    from "../../components/EditWorkspaceModal";
import DeleteWorkspaceModal  from "../../components/DeleteWorkspaceModal";
import ConfirmDeleteModal    from "../../components/ConfirmDeleteModal";
import AutoScrollModal from "@/components/AutoScrollModal";
import WorkspaceComment   from  "@/components/WorkspaceComment"

export default function WorkspacePage() {
  const { workspaceId } = useParams();
  const { workspaces, currentWorkspace, setCurrentWorkspace } = useWorkspace();
  const { projects, fetchProjects } = useProject();
  const [showModal, setShowModal]   = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [workspaceName, setWorkspaceName] = useState(currentWorkspace?.name ?? "");
  const { role } = useWorkspace();
  const userRole = role?.toLowerCase();
 

  // Ensure correct workspace is selected when route changes
  useEffect(() => {
    if (!workspaceId) return;
    const ws = workspaces.find(w => String(w.id) === workspaceId);
    if (ws && (!currentWorkspace || currentWorkspace.id !== ws.id)) {
      setCurrentWorkspace(ws);
      fetchProjects();
    }
  }, [workspaceId, workspaces, currentWorkspace, setCurrentWorkspace, fetchProjects]);

    if (!currentWorkspace ) {
        return (
          <div className="flex flex-col items-center justify-center h-[calc(100vh-80px)] text-center px-6">
            <img
              src={!currentWorkspace ? "No-workspace.png" : "/empty-state.png"}
              className=" object-contain mb-6 opacity-90"
            />
                         
          </div>
        );
      }

  return (
    <div className="p-2 space-y-6">
      <header className="flex items-center justify-between">
        <div>
              <h1 className="text-xl font-semibold">{currentWorkspace.name}</h1>
              {currentWorkspace.description && (
                <p className="text-sm text-gray-500 mt-1">
                  {currentWorkspace.description}
                </p>
              )}
        </div>

      {userRole === "owner" && (
       <>
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 rounded-md border border-blue-600 text-blue-600 hover:bg-blue-50 ml-2"
          >
            <MoreHorizontal size={18} className="text-gray-500" />
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-1 w-44 bg-white rounded-lg shadow-lg border z-50 py-1">
              <button
                onClick={() => { setShowMenu(false); setShowEditModal(true); }}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <Pencil size={14} /> Edit Workspace
              </button>

              <button
                onClick={() => { setShowMenu(false); setShowDeleteModal(true); }}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <Trash2 size={14} /> Delete Workspace
              </button>
            </div>
          )}
        </div>

        {showEditModal && (
          <Modal
            isOpen={showEditModal}
            onClose={() => setShowEditModal(false)}
            title="Edit Workspace"
          >
            <EditWorkspaceModal onClose={() => setShowEditModal(false)} />
          </Modal>
        )}

        {showDeleteModal && (
          <Modal
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            title="Delete Workspace"
          >
            <DeleteWorkspaceModal onClose={() => setShowDeleteModal(false)} />
          </Modal>
        )}
      </>
)}

 </header>

      <section>
        <h2 className="text-sm font-medium text-gray-500 mb-2">
          Projects in this workspace
        </h2>

        {projects.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">
            No projects yet. Create your first project to get started.
          </div>
        ) : (
          <div className="flex  gap-4 flex-col md:flex-row  justify-center">
            
             {projects.map(project => (
               
                <h3
                 key={project.id}
                 className="font-medium block rounded-lg border border-gray-200 bg-green-50 p-4 mb-4  hover:shadow-sm transition"
                >
                  {project.name}
                </h3>
              
              ))} 
              
          </div>
          
        )}
        
        <div className="relative w-full ml-12 h-137.5">
          <AutoScrollModal photo="Collab Dashboard.png">
            <div className="mt-6">
             <WorkspaceComment />
            </div>

          </AutoScrollModal>
        </div>    
                            
      </section>
    </div>
  );
}



 

             