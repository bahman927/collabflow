import { Outlet } from "react-router-dom";

interface AuthLayoutProps {
  title?: string;       // optional
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ title }) => {
 return (
  <div className="flex min-h-screen min-w-0 items-center justify-center bg-gray-50 px-3 py-6 sm:px-5 sm:py-8">

    <div className="w-full min-w-0 max-w-md rounded-xl bg-white p-4 shadow sm:p-6">

      {title && (
        <h1 className="mb-5 text-center text-xl font-semibold sm:mb-6 sm:text-2xl wrap-break-word">
          {title}
        </h1>
      )}

      {/* Outlet renders the nested route element */}
      <Outlet />

    </div>

  </div>
);
};

export default AuthLayout;



 