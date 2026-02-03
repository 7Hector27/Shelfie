import { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiGet } from "../lib/api";

type User = {
  user_id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  profile_image?: string;
  bio?: string;
  birthdate?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: user, isLoading: loading } = useQuery<User>({
    queryKey: ["me"],
    queryFn: () => apiGet<User>("/auth/me"),
    retry: false,
  });

  return (
    <AuthContext.Provider value={{ user: user ?? null, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};
