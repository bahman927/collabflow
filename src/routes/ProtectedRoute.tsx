
import { Navigate, Outlet } from "react-router-dom"; 
import { useAuth }          from "../hooks/useAuth";

export function ProtectedRoute({ isAuthenticated }: { isAuthenticated: boolean }) {
  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
}

export default ProtectedRoute;



 







