 // src/layouts/AppLayout.
 import { Outlet, useLocation } from "react-router-dom";
import Sidebar                  from "../components/Sidebar";
import Navbar                   from "../components/Navbar";
import MarketingHeader          from "../components/MarketingHeader";
import AppHeader                from "../components/AppHeader";
import WorkspaceSidebar         from "../components/WorkspaceSidebar";
import ProjectSidebar           from "../components/ProjectSidebar";
import TaskSidebar              from "../components/TaskSidebar";
import { useAuth }              from "../hooks/useAuth";

export default function AppLayout() {
  const { user } = useAuth();
  const isAuthenticated = !!user;

  const { pathname } = useLocation();

  // Decide which contextual sidebar to show
  let contextualSidebar = null;

  if (pathname.startsWith("/workspaces")) {
    contextualSidebar = <WorkspaceSidebar />;
  } else if (pathname.startsWith("/projects")) {
    contextualSidebar = <ProjectSidebar />;
  } else if (pathname.startsWith("/tasks")) {
    contextualSidebar = <TaskSidebar />;
  }

  const handleAssignProjectClick = () => {
  };

  return (
    <div className="flex flex-col min-h-screen">

      {/* Top Header */}
      {isAuthenticated ? <AppHeader /> : <MarketingHeader />}

      <div className="flex flex-1 overflow-hidden">

        {/* Global App Sidebar */}
        {isAuthenticated && (
          <Sidebar onAssignProjectClick={handleAssignProjectClick} />
        )}

        {/* Contextual Sidebar (Workspace / Project / Task) */}
        {isAuthenticated && contextualSidebar}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* {isAuthenticated && <Navbar />} */}

          <main className="flex-1 p-6 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}



 
 