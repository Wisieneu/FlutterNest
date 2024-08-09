import { Outlet } from "react-router-dom";

import Navbar from "@/components/Navbar/Navbar";
import Sidebar from "@/components/Sidebar";

export default function Root() {
  return (
    <div className="page-wrapper flex flex-auto justify-center">
      <div className="border-r border-gray-700">
        <Navbar />
      </div>
      <div className="max-w-md grow md:max-w-xl">
        <Outlet />
      </div>
      <div className="border-l border-gray-700 p-10">
        <Sidebar />
      </div>
    </div>
  );
}
