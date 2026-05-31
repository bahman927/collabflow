import { Navigate, Outlet } from "react-router-dom";
export default function PublicRoute({ isAuthenticated }: { isAuthenticated: boolean }) {
   return !isAuthenticated ? <Outlet /> : <Navigate to="/dashboard" replace />;
}
