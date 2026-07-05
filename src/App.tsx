
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
  <AuthProvider>
    <WorkspaceProvider>
      <ActivityProvider>         
        <ProjectProvider>       
          <TaskProvider>        
            <MemberProvider>    
              <AppRoutes />
            </MemberProvider>
          </TaskProvider>
        </ProjectProvider>
      </ActivityProvider>
    </WorkspaceProvider>
  </AuthProvider>
</BrowserRouter>
  
  );
}


export default App;

 