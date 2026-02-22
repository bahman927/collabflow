// src/context/WorkspaceProvider.tsx
import { useState } from "react";
import { WorkspaceContext } from "./WorkspaceContext";
import type  { Workspace } from "../types/Workspace";

export const WorkspaceProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [workspaces] = useState<Workspace[]>([
    { id: 1, name: "Default Workspace" },
  ]);

  const [activeWorkspace, setActive] = useState<Workspace | null>(
    workspaces[0]
  );

  const setActiveWorkspace = (id: number) => {
    setActive(workspaces.find((w) => w.id === id) || null);
  };

  return (
    <WorkspaceContext.Provider
      value={{ workspaces, activeWorkspace, setActiveWorkspace }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};
