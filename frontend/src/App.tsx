import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Root from "@/routes/root.tsx";
import Home from "@/routes/Home";
import PostDetailPage from "./routes/PostDetailPage";
import UserDetailPage from "@/routes/UserDetailPage";
import ErrorPage from "@/routes/ErrorPage";
import AuthenticationPage from "@/routes/Authentication";
import AuthProvider from "@/components/Wrappers/AuthProvider";

import { fetchPostById, fetchUserByUsername } from "./API";

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
        path: "/u/:username",
        element: <UserDetailPage />,
        loader: async ({ params }) => {
          const user = await fetchUserByUsername(params.username!);
          return user || null;
        },
      },
      {
        path: "/post/:postId",
        element: <PostDetailPage />,
        loader: async ({ params }) => {
          const post = await fetchPostById(params.postId!);
          return post || null;
        },
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
