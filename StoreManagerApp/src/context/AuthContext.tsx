import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiGet, apiRequest } from "../utils/api";

type AuthContextType = {
  isLoggedIn: boolean;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<any>;
  signup: (name: string, email: string, password: string) => Promise<any>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🔄 Auto-Login when app starts
  useEffect(() => {
    (async () => {
      const savedToken = await AsyncStorage.getItem("token");
      if (savedToken) {
        setToken(savedToken);
        setIsLoggedIn(true);
      }
      setLoading(false);
    })();
  }, []);

  // ✅ Login User
  const login = async (email: string, password: string) => {
    try {
      const res = await apiRequest("auth/login", "POST", { email, password });

      if (res.token) {
        await AsyncStorage.setItem("token", res.token);
        setToken(res.token);
        setIsLoggedIn(true);
      }

      return res;
    } catch (err) {
      return { message: "Login failed" };
    }
  };

  // ✅ Signup User
  const signup = async (name: string, email: string, password: string) => {
    try {
      const res = await apiRequest("auth/signup", "POST", {
        name,
        email,
        password,
      });

      return res;
    } catch (err) {
      return { message: "Signup failed" };
    }
  };

  // ✅ Logout User
  const logout = async () => {
    await AsyncStorage.removeItem("token");
    setToken(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        token,
        loading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
