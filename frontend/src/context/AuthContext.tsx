import { createContext, useEffect, useState } from "react";
import api from "../api/axiosClient";
import type { UserMe } from "../types/models";

type AuthCtx = {
  user: UserMe | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (form: {
    username: string; password: string; password2: string;
    email?: string; first_name?: string; last_name?: string; role?: "student" | "admin";
  }) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthCtx | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserMe | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchMe() {
    try {
      const { data } = await api.get<UserMe>("users/me/");
      setUser(data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (localStorage.getItem("access")) fetchMe();
    else setLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    const { data } = await api.post("users/auth/login/", { username, password });
    localStorage.setItem("access", data.access);
    localStorage.setItem("refresh", data.refresh);
    await fetchMe();
  };

  const register = async (form: any) => {
    await api.post("users/auth/register/", form);
  };

  const logout = async () => {
    const refresh = localStorage.getItem("refresh");
    if (refresh) {
      try { await api.post("users/auth/logout/", { refresh }); } catch {}
    }
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
