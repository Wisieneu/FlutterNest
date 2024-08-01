import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

import 'react-toastify/dist/ReactToastify.css';
import './root.scss';

export default function Root() {
  return (
    <>
      <div className="page-wrapper flex flex-auto justify-center">
        <div className="border-gray-700 border-r">
          <Navbar />
        </div>
        <div className="grow max-w-md md:max-w-xl">
          <Outlet />
        </div>
        <div className="p-10 border-gray-700 border-l">
          <Sidebar />
        </div>
      </div>
      <ToastContainer />
    </>
  );
}
