import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import { router } from "./app/Router";
import { AuthProvider } from "./context/AuthProvider";
import { WorkspaceProvider } from "./context/WorkspaceProvider";

import "./index.css";

ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
).render(
  <React.StrictMode>
     <AuthProvider>
      <WorkspaceProvider>
        <RouterProvider router={router} />
      </WorkspaceProvider>
     </AuthProvider>
  </React.StrictMode>
);


   