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
  <div className="flex min-h-screen min-w-0 flex-col">

    {/* TOP HEADER */}
    {isAuthenticated ? <AppHeader /> : <MarketingHeader />}

    <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-visible lg:flex-row lg:overflow-hidden">

      {/* GLOBAL APP SIDEBAR */}
      {isAuthenticated && (
        <Sidebar onAssignProjectClick={handleAssignProjectClick} />
      )}

      {/* CONTEXTUAL SIDEBAR */}
      {isAuthenticated && contextualSidebar}

      {/* MAIN CONTENT AREA */}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">

        {/* MAIN CONTENT */}
        <main className="min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-4 lg:p-6">
          <Outlet />
        </main>

      </div>

    </div>
  </div>
);
}



 
 