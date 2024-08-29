import { Outlet } from "react-router-dom";

import Navbar from "@/components/Navbar/Navbar";
import Sidebar from "@/components/Sidebar";

export default function Root() {
  return (
    <div className="page-wrapper flex flex-auto justify-center">
      <div id="navbar" className="border-r border-gray-700">
        <Navbar />
      </div>
      <div id="main-content" className="min-h-screen max-w-xl grow">
        <Outlet />
      </div>
      <div id="sidebar" className="border-l border-gray-700 p-10">
        <Sidebar />
      </div>
    </div>
  );
}
