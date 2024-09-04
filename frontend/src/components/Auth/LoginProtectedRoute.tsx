import { PropsWithChildren, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "./AuthProvider";

import { User } from "@/types";

export default function LoginProtectedRoute({ children }: PropsWithChildren) {
  const navigate = useNavigate();
  const user: User | null | "unauthorized" = useContext(AuthContext);

  useEffect(() => {
    if (user === "unauthorized") {
      navigate("/auth/signin");
    }
  }, []);

  // Block rendering of children until the application has figured out whether the user is authenticated or not
  return <>{user ? children : null}</>;
}
