
import React, {useState} from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import AssignProject from "../components/AssignProject";// Mock developers 
import { useAuth } from "../context/AuthProvider"
const developers = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
  { id: 3, name: "Carol" },
  { id: 4, name: "Bahman" },
];

// Mock projects (should come from Dashboard hook)
const projects = [
  { id: 101, name: "CollabFlow Web App" },
  { id: 102, name: "Billing System" },
];


const AppLayout: React.FC = () => {

  const { user } = useAuth(); // user object from context
  const userRole = user?.role; // "Owner" | "Member" | "Viewer"
  const [showAssignProject, setShowAssignProject] = useState(true);
  const role = userRole ?? "Viewer"; // fallback to Viewer if undefined
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="h-14 border-b bg-white">
        <div className="mx-auto max-w-350 h-full flex items-center px-0">
          <Header />
        </div>
      </header>

      {/* Main area */}
      <div className="flex-1 overflow-hidden">
        {/* CENTER THE WHOLE APP SHELL */}
        <div className="mx-auto flex h-full max-w-350 w-full">
          
          {/* Sidebar */}
          {/* <Sidebar onAssignProjectClick={() => setShowAssignProject(true)} /> */}
          

          
              <Sidebar
                 userRole={userRole}
                 onAssignProjectClick={() => setShowAssignProject(true)}
           />
          

          {/* Page content */}
          <main className="flex-1 overflow-y-auto p-6">
            <Outlet />
          </main>

        </div>
      </div>
        {/* Modal overlay */}
      {showAssignProject && userRole && (
         <AssignProject
            projects={projects} // array from API or mock
            developers={developers} // array from API or mock
            userRole={role}
            onAssign={(data) => console.log("Assigned:", data)}
            onClose={() => setShowAssignProject(false)}
        />
      )}
    </div>
  );
};


export default AppLayout;





// import { Outlet } from "react-router-dom";
// import Navbar from "../components/Navbar";
// import Sidebar from "../components/Sidebar";

// const AppLayout = () => {
//   return (
//     <div className="flex h-screen bg-gray-100">
//       {/* Sidebar */}
//       <Sidebar />

//       {/* Main content */}
//       <div className="flex flex-col flex-1">
//         <Navbar />

//         <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// };

// export default AppLayout;




// import { Outlet } from "react-router-dom";
// import Navbar from "../components/Navbar";
// import Sidebar from "../components/Sidebar";

// const MainLayout = () => {
//   return (
//     <div className="h-screen flex flex-col">
//       <Navbar />
//       <div className="flex flex-1">
//         <Sidebar />
//         <main className="flex-1 p-6 overflow-auto">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// };

// export default MainLayout;
