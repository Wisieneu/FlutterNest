import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Root from "@/routes/root";
import Home from "@/routes/Home";
import PostDetailPage from "@/routes/PostDetailPage";
import UserDetailPage from "@/routes/UserDetailPage";
import ErrorPage from "@/routes/ErrorPage";
import AuthenticationPage from "@/routes/Authentication";
import Settings from "@/routes/Settings";
import NotFoundPage from "@/routes/NotFoundPage";

import AuthProvider from "@/components/Auth/AuthProvider";
import LoginProtectedRoute from "@/components/Auth/LoginProtectedRoute";

import { fetchPostById, fetchUserByUsername } from "./API";

import "react-toastify/dist/ReactToastify.css";
import "./App.scss";
import { AutomationProvider } from "./components/Wrappers/AutomationContext";

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
          if (params.username === "me") return "me";
          const user = await fetchUserByUsername(params.username!);
          return user ? user : params.username;
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
      {
        path: "/settings",
        element: (
          <LoginProtectedRoute>
            <Settings />
          </LoginProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/auth/*",
    element: <AuthenticationPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default function App() {
  return (
    <AuthProvider>
      <AutomationProvider>
        <RouterProvider router={router} />
        <ToastContainer />
      </AutomationProvider>
    </AuthProvider>
  );
}
