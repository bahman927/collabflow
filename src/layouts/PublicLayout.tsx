
import { Outlet } from "react-router-dom";
import Header from "../components/Header";

const PublicLayout = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

export default PublicLayout;






// import { Outlet, Link } from "react-router-dom";

// const PublicLayout = () => {
//   return (
//     <div className="min-h-screen flex flex-col">
//       {/* Simple public navbar */}
//       <header className="h-14 px-6 flex items-center justify-between border-b">
//         <h1 className="font-semibold text-lg">CollabFlow</h1>

//         <nav className="space-x-4">
//           <Link to="/login" className="text-blue-600">
//             Login
//           </Link>
//         </nav>
//       </header>

//       {/* Public page content */}
//       <main className="flex-1 flex items-center justify-center">
//         <Outlet />
//       </main>
//     </div>
//   );
// };

// export default PublicLayout;
