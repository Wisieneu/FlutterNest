import {
  createContext,
  PropsWithChildren,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";

import { fetchAuthContext } from "@/API";

import { User } from "@/types";

export const AuthContext = createContext<User | "unauthorized" | null>(null);

export default function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | "unauthorized" | null>(null);

  async function fetchMe() {
    try {
      const user = await fetchAuthContext();
      if (!user) setUser("unauthorized");
      setUser(user);
    } catch {
      setUser("unauthorized");
    }
  }

  useEffect(() => {
    fetchMe();
  }, []);

  return (
    <AuthContext.Provider value={user}>
      {user !== null ? children : null}
    </AuthContext.Provider>
  );
}
