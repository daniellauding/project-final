import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authApi } from "../api/auth";

interface User {
  userId: string;
  username: string;
  accessToken: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (username: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const login = async (email: string, password: string) => {
    const data = await authApi.login(email, password);
    if (data.success) {
      setUser({ userId: data.userId, username: data.username, accessToken: data.accessToken });
      return { success: true };
    }
    return { success: false, error: data.error };
  };

  const register = async (username: string, email: string, password: string) => {
    const data = await authApi.register(username, email, password);
    if (data.success) {
      setUser({ userId: data.userId, username: data.username, accessToken: data.accessToken });
      return { success: true };
    }
    return { success: false, error: data.error };
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
