
import { Navigate, Outlet } from "react-router-dom"; 
import { useAuth } from "../hooks/useAuth";
import Spinner from "../components/Spinner";

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <Spinner />;

  // Must use Outlet and Navigate here
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;




// import React from "react";
// import { Navigate, Outlet } from "react-router-dom";
// import { useAuth } from "../hooks/useAuth";
// import Spinner from "../components/Spinner";

// // 1. Define the shape of your Auth context
// interface AuthContextType {
//   isAuthenticated: boolean;
//   loading: boolean;
// }

// const ProtectedRoute: React.FC = () => {
//   // 2. Destructure with types (TypeScript now knows these are booleans)
//   const { isAuthenticated, loading } = useAuth() as AuthContextType;

//   if (loading) {
//     return <Spinner />;
//   }

//   return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
// };

// export default ProtectedRoute;









