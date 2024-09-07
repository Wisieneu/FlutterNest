import {
  createContext,
  PropsWithChildren,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";

import { fetchAuthContext } from "@/API";

import { User } from "@/types";

export const AuthContext = createContext<User | null>(null);

export default function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function fetchMe() {
    try {
      const user = await fetchAuthContext();
      if (!user) setUser(null);
      setUser(user);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchMe();
  }, []);

  return (
    <AuthContext.Provider value={user}>
      {isLoading ? null : children}
    </AuthContext.Provider>
  );
}
