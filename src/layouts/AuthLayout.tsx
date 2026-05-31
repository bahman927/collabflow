import { Outlet } from "react-router-dom";

interface AuthLayoutProps {
  title?: string;       // optional
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ title }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow">
        {title && (
          <h1 className="text-2xl font-semibold mb-6 text-center">{title}</h1>
        )}
        {/* Outlet renders the nested route element */}
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;



 