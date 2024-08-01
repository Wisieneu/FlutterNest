import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import Root from './routes/root.tsx';
import Profile from './components/Profile';
import ErrorPage from './routes/ErrorPage/index.tsx';
import Main from './routes/Home/index.tsx';
import AuthenticationPage from './routes/AuthenticationPage';
import TestView from './routes/TestView/index.tsx';

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
        path: '/profile/:username',
        element: <Profile />,
      },
      {
        path: '/post/:postId',
      },
      {
        path: '/test',
        element: <TestView />,
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
