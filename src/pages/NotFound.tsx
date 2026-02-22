// src/pages/NotFound.tsx
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-5xl font-bold mb-4">404</h1>
      <p className="text-lg mb-4">Oops! The page you are looking for does not exist.</p>
      <Link
        to="/"
        className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
