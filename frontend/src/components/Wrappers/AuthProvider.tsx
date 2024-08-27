import {
  createContext,
  PropsWithChildren,
  useLayoutEffect,
  useState,
} from "react";

import { fetchCurrentUser } from "@/API";

import { User } from "@/types";

export const AuthContext = createContext<User | null>(null);

export default function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);

  useLayoutEffect(() => {
    async function fetchMe() {
      try {
        const user = await fetchCurrentUser();
        setUser(user);
      } catch {
        setUser(null);
      }
    }

    fetchMe();
  }, []);

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
}
