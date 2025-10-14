import { createContext, useState, useEffect, useContext } from "react";
import type { ReactNode } from "react";
import axiosClient from "../api/axiosClient.ts";
import { useToast } from "../components/ui/use-toast.ts";

interface User {
  id: number;
  username: string;
  email: string;
  role: "admin" | "student";
  first_name?: string;
  last_name?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string,
    password2: string,
    role?: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  /**
   * Fetch current authenticated user
   */
  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await axiosClient.get("/users/me/");
      setUser(response.data);
    } catch (error) {
      console.error("Failed to fetch user:", error);
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  /**
   * Login and store JWT tokens
   */
  const login = async (username: string, password: string) => {
    try {
      const response = await axiosClient.post("/users/auth/login/", {
        username,
        password,
      });

      const { access, refresh } = response.data;
      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);

      await fetchUser();

      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
    } catch (error: any) {
      const message =
        error.response?.data?.detail ||
        "Login failed. Please check your credentials.";
      toast({
        title: "Login failed",
        description: message,
        variant: "destructive",
      });
      throw error;
    }
  };

  /**
   * Register new user (with password confirmation)
   */
  const register = async (
    username: string,
    email: string,
    password: string,
    password2: string,
    role: string = "student"
  ) => {
    try {
      await axiosClient.post("/users/auth/register/", {
        username,
        email,
        password,
        password2,
        role,
      });

      toast({
        title: "Registration successful!",
        description: "You can now log in with your credentials.",
      });
    } catch (error: any) {
      console.error("Registration error:", error);

      const errors = error.response?.data || {};
      let message = "Registration failed. Please try again.";

      if (errors.username?.[0]) message = errors.username[0];
      else if (errors.email?.[0]) message = errors.email[0];
      else if (errors.password?.[0]) message = errors.password[0];
      else if (errors.password2?.[0]) message = errors.password2[0];
      else if (errors.detail) message = errors.detail;

      toast({
        title: "Registration failed",
        description: message,
        variant: "destructive",
      });

      throw error;
    }
  };

  /**
   * Logout and clear tokens
   */
  const logout = async () => {
    try {
      await axiosClient.post("/users/auth/logout/");
    } catch (error) {
      console.warn("Logout request failed (ignored):", error);
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      setUser(null);

      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    }
  };

  // ✅ Added basic rendering logic to suppress TS6133 (these are now “used”)
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-muted-foreground">
        Loading...
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, fetchUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Helper hook for consuming AuthContext
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
