
import { Routes, Route } from "react-router-dom";

import AppLayout      from "../layouts/AppLayout";
import AuthLayout     from "../layouts/AuthLayout";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute    from   "./PublicRoute";
import Landing        from "../pages/Landing";
import Login          from "../pages/Login";
import Signup         from "../pages/Signup";
import TaskBoard      from "../pages/task/TaskBoard";
import TaskPanel      from "../components/TaskPanel";
import ProjectPage    from "../pages/project/ProjectPage";
import Dashboard      from "../components/Dashboard";
import Home           from "../pages/Home";
import {useAuth}      from "../hooks/useAuth"
import WorkspacePage  from "../pages/workspace/WorkspacePage";
import { MembersPage } from "../components/members/MemberPage";
import ActivityPage   from    "../pages/ActivityPage"
import AcceptInvitationPage   from    "../pages/invitations/AcceptInvitationPage"

 export default function AppRoutes() {
  const {user} = useAuth()
  const isAuthenticated = !!user;
  return (
  <Routes>

    <Route element={<AppLayout />}>
      <Route path="/invite/:token"       element={<AcceptInvitationPage />}/>


       {/* Public routes */}
      <Route element={<PublicRoute isAuthenticated={isAuthenticated} />}>
        <Route path="/" element={<Landing />} />
      </Route>

      {/* Protected routes */}
      <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
        <Route path="/home"                element={<Home />} />
        <Route path="/dashboard"           element={<Dashboard />} />

        <Route path="/workspaces"          element={<WorkspacePage />} />
        {/* <Route path="/workspaces/:workspaceId" element={<WorkspacePage />} /> */}

        <Route path="/projects"            element={<ProjectPage />} />
        <Route path="/workspace/:workspaceId/project/:projectId/board" element={<TaskBoard />} />

        <Route path="/tasks"               element={<TaskPanel />} /> 
        <Route path="/members"             element={<MembersPage />} /> 
        <Route path="/activity"            element={<ActivityPage />} />
        

      </Route>

    </Route>
 
      {/* Auth routes            */}
    <Route element={<AuthLayout  />}>
        <Route path="/login"  element={<Login />} />
        <Route path="/signup" element={<Signup />} />
    </Route>

      
      {/* ---------------------- */}
      {/* 404 fallback           */}
      {/* ---------------------- */}
      <Route
        path="*"
        element={<div className="p-6 text-center">Page not found</div>}
      />

    </Routes>
  );
}






 