
import { BrowserRouter }    from "react-router-dom";
import { Toaster }          from "react-hot-toast";
import AppRoutes            from "./routes/AppRoutes";
import {AuthProvider}       from "./context/AuthProvider2";
import {WorkspaceProvider}  from "./context/WorkspaceProvider";
import {ProjectProvider}    from "./context/ProjectProvider";
import {TaskProvider}       from "./context/TaskProvider";
import {MemberProvider}     from "./context/MemberProvider";
import { ActivityProvider } from './context/ActivityProvider';
import "./App.css"

function App() {
  return (
      <BrowserRouter>
     <Toaster position="top-right" />   {/* ⭐ Toast system lives here */}
      <AuthProvider>              {/* 1. Auth — depends on nothing */}
        <WorkspaceProvider> 
           <ActivityProvider>     {/* 2. Workspace — depends on Auth */}
          <MemberProvider>        {/* 3. Members — depends on Workspace */}
            <ProjectProvider>     {/* 4. Projects — depends on Workspace */}
              <TaskProvider>      {/* 5. Tasks — depends on Project, Members */}
               
                  <AppRoutes />
               
              </TaskProvider>
            </ProjectProvider>
          </MemberProvider>
          </ActivityProvider>
        </WorkspaceProvider>
      </AuthProvider>
    </BrowserRouter>





    // <BrowserRouter>
    //  <Toaster position="top-right" />   {/* ⭐ Toast system lives here */}
    //   <AuthProvider>              {/* 1. Auth — depends on nothing */}
    //     <WorkspaceProvider>       {/* 2. Workspace — depends on Auth */}
    //       <MemberProvider>        {/* 3. Members — depends on Workspace */}
    //         <ProjectProvider>     {/* 4. Projects — depends on Workspace */}
    //           <TaskProvider>      {/* 5. Tasks — depends on Project, Members */}
    //             <ActivityProvider>
    //               <AppRoutes />
    //             </ActivityProvider>  
    //           </TaskProvider>
    //         </ProjectProvider>
    //       </MemberProvider>
    //     </WorkspaceProvider>
    //   </AuthProvider>
    // </BrowserRouter>
  );
}


export default App;

 