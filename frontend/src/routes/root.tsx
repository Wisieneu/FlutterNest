import React from 'react';

import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

import './root.scss';

import { Outlet } from 'react-router-dom';

export default function Root() {
  return (
    <div className="page-wrapper flex flex-auto">
      <Navbar />
      <div className="p-10 m-5 grow border-slate-400 border rounded-xl">
        <Outlet />
      </div>
      <div className="p-10 m-5 border-slate-400 border rounded-xl">
        <Sidebar />
      </div>
    </div>
  );
}
76;
