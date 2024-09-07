import { PropsWithChildren, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "./AuthProvider";

export default function LoginProtectedRoute({ children }: PropsWithChildren) {
  const navigate = useNavigate();
  const user = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/auth/signin");
    }
    setIsLoading(false);
  }, []);

  // Block rendering of children until the application has figured out whether the user is authenticated or not
  return <>{isLoading ? null : children}</>;
}
