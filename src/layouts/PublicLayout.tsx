
import { Outlet } from "react-router-dom";
import Header from "../components/Header";

const PublicLayout = () => {
  return (
  <div className="flex min-h-screen min-w-0 flex-col">
    <Header />

    <main className="min-w-0 flex-1">
      <Outlet />
    </main>
  </div>
);
};

export default PublicLayout;




 
