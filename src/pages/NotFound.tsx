// src/pages/NotFound.tsx
import { Link } from "react-router-dom";

const NotFound = () => {
 return (
  <div className="flex min-h-screen min-w-0 flex-col items-center justify-center bg-gray-50 px-4 py-8 text-center sm:px-6">
    <h1 className="mb-3 text-6xl font-bold text-gray-900 sm:text-7xl">
      404
    </h1>

    <p className="mb-6 max-w-md wrap-break-word text-base leading-relaxed text-gray-600 sm:text-lg">
      Oops! The page you are looking for does not exist.
    </p>

    <Link
      to="/"
      className="inline-flex min-h-11 items-center justify-center rounded-lg bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-800 sm:text-base"
    >
      Go Back Home
    </Link>
  </div>
);
};

export default NotFound;
