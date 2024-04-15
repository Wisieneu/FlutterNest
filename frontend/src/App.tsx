import React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import Root from './routes/root.tsx';
import Profile from './components/Profile';
import ErrorPage from './routes/errorPage';
import Main from './components/Home';
import AuthenticationPage from './routes/AuthenticationPage';

import './App.scss';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <Main />,
      },
      {
        path: 'profile/:username',
        element: <Profile />,
      },
      {
        path: 'post/:postId',
      },
    ],
  },
  {
    path: '/auth/*',
    element: <AuthenticationPage />,
    errorElement: <ErrorPage />,
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
