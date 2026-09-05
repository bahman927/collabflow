import { workspaceInfo } from "../pages/workspace/workspaceInfo";

export default function WorkspaceComment() {
  return (
    <div className="p-4 whitespace-pre-line text-white">
      {workspaceInfo}
    </div>
  );
}
