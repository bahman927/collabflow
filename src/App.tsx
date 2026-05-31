
import { BrowserRouter }    from "react-router-dom";
import AppRoutes            from "./routes/AppRoutes";
import {AuthProvider}       from "./context/AuthProvider2";
import {WorkspaceProvider}  from "./context/WorkspaceProvider";
import {ProjectProvider}    from "./context/ProjectProvider";
import {TaskProvider}       from "./context/TaskProvider";
import {MemberProvider}       from "./context/MemberProvider";
import "./App.css"
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>              {/* 1. Auth — depends on nothing */}
        <WorkspaceProvider>       {/* 2. Workspace — depends on Auth */}
          <MemberProvider>        {/* 3. Members — depends on Workspace */}
            <ProjectProvider>     {/* 4. Projects — depends on Workspace */}
              <TaskProvider>      {/* 5. Tasks — depends on Project, Members */}
                <AppRoutes />
              </TaskProvider>
            </ProjectProvider>
          </MemberProvider>
        </WorkspaceProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}


export default App;

 