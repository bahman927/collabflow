import { workspaceInfo } from "../pages/workspace/workspaceInfo";

export default function WorkspaceComment() {
  return (
  <div className="min-w-0 whitespace-pre-line wrap-break-word p-3 text-sm leading-relaxed text-white sm:p-4 sm:text-base">
    {workspaceInfo}
  </div>
);
}
