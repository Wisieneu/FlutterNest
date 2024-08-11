import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Root from "@/routes/root.tsx";
import Profile from "@/components/Profile";
import ErrorPage from "@/routes/ErrorPage";
import Home from "@/routes/Home";
import AuthenticationPage from "@/routes/Authentication";
import TestView from "@/routes/TestView";
import AuthProvider from "@/components/Auth/AuthProvider";

import "react-toastify/dist/ReactToastify.css";
import "./App.scss";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/profile/:username",
        element: <Profile />,
      },
      {
        path: "/post/:postId",
      },
      {
        path: "/test", // TODO: remove
        element: <TestView />,
      },
    ],
  },
  {
    path: "/auth/*",
    element: <AuthenticationPage />,
    errorElement: <ErrorPage />,
  },
]);

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <ToastContainer />
    </AuthProvider>
  );
}
