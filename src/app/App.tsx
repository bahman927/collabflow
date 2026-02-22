
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import PublicLayout from "../layouts/PublicLayout";
import AppLayout from "../layouts/AppLayout";

// Pages
import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Dashboard from "../components/Dashboard";
import Projects from "../pages/Projects";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        {/* Protected routes */}
        <Route element={<AppLayout />}>
          <Route path="/app" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;



// // src/App.tsx
// // import React from "react";
// import { BrowserRouter, Routes, Route } from "react-router-dom";

// // Layouts
// import PublicLayout from "../layouts/PublicLayout";
// import AppLayout from "../layouts/AppLayout";

// // Pages
// import Landing from "../pages/Landing";
// // import Home      from "../pages/Home";
// import Login     from "../pages/Login";
// import Signup    from "../pages/Signup";
// import Dashboard from "../components/Dashboard";
// import Projects  from "../pages/Projects";

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>

//         {/* Public routes */}
//         <Route element={<PublicLayout />}>
//           <Route path="/" element={<Landing />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/signup" element={<Signup />} />
//         </Route>

//         {/* Protected ..  Authenticated routes */}
//         <Route element={<AppLayout />}>
//           <Route path="/app" element={<Dashboard />} />
//           <Route path="/projects" element={<Projects />} />
//         </Route>

//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;




// // src/app/App.tsx
// import { RouterProvider } from "react-router-dom";
// import { router } from "./Router";
// import { AuthProvider, WorkspaceProvider } from "../context";

// const App = () => (
//   <AuthProvider>
//     <WorkspaceProvider>
//       <RouterProvider router={router} />
//     </WorkspaceProvider>
//   </AuthProvider>
// );

// export default App;
