import { createBrowserRouter } from "react-router-dom";

import PublicLayout from "../layouts/PublicLayout";
import AppLayout from "../layouts/AppLayout";

import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Dashboard from "../components/Dashboard";
import Projects from "../pages/Projects";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
    ],
  },
]);

// export const router = createBrowserRouter([
//   {
//     element: <PublicLayout />,
//     children: [
//       { index: true, element: <Landing /> },
//       { path: "login", element: <Login /> },
//       { path: "signup", element: <Signup /> },
//     ],
//   },
//   {
//     element: <AppLayout />,
//     children: [
//       { path: "app", element: <Dashboard /> },
//       { path: "projects", element: <Projects /> },
//     ],
//   },
// ]);
