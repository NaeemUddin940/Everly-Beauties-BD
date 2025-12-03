"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import toast from "react-hot-toast";

type User = {
  id: number;
  name: string;
  email: string;
  [key: string]: any;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loading: false,
  login: async () => false,
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Auto-fetch current user if token exists on initial load
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
        setLoading(true);
        try {
          const userRes = await fetch(
            "https://everlybeautiesbd.com/wp-json/wp/v2/users/me",
            {
              headers: {
                Authorization: `Bearer ${storedToken}`,
              },
            }
          );

          if (!userRes.ok) throw new Error("Failed to fetch user");

          const userData = await userRes.json();
          setUser(userData);
        } catch (err) {
          console.error("Error auto-fetching user:", err);
          logout();
        } finally {
          setLoading(false);
        }
      }
    };

    initializeAuth();
  }, []);

  const login = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await fetch(
        "https://everlybeautiesbd.com/wp-json/jwt-auth/v1/token",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        }
      );

      const data = await res.json();

      if (res.ok && data?.token) {
        localStorage.setItem("token", data.token);
        setToken(data.token);

        const userRes = await fetch(
          "https://everlybeautiesbd.com/wp-json/wp/v2/users/me",
          {
            headers: { Authorization: `Bearer ${data.token}` },
          }
        );

        const userData = await userRes.json();
        setUser(userData);
        toast.success("Login Successfully.");
        return true;
      } else {
        toast.error("Login failed. Please check credentials.");
        return false;
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("An error occurred during login.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  //   const logout = () => {
  //   localStorage.removeItem("token");
  //   setUser(null);
  //   setToken(null);
  //   toast.success("Logout Successfully!");
  // };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
