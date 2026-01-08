"use client";

import { useAction } from "next-safe-action/hooks";
import {
  createContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { logoutAction } from "../actions/auth.action";
import type { User } from "../types/auth";

interface AuthContextType {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  children,
  initialUser,
}: {
  children: ReactNode;
  initialUser: User | null;
}) {
  const [user, setUser] = useState<User | null>(initialUser);
  const { execute: logout } = useAction(logoutAction);

  useEffect(() => {
    setUser(initialUser);

    // If initialUser is null (meaning server auth check failed/returned 401),
    // but the app is still mounted (potentially due to stale cookie passing middleware),
    // we assume the session is invalid and attempt to clear the cookie via logoutAction.
    // This ensures that subsequent navigations (or middleware checks) correctly see us as unauthenticated.
    if (initialUser === null) {
      logout();
    }
  }, [initialUser, logout]);

  return (
    <AuthContext.Provider value={{ user, setUser, isLoading: false }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useUser() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useUser must be used within an AuthProvider");
  }
  return context;
}
