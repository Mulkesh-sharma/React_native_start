import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiGet, apiRequest } from "../utils/api";

type User = {
  name: string;
  email: string;
  storeName?: string;
  ownerName?: string;
  storeType?: string;
  phone?: string;
};

type AuthContextType = {
  isLoggedIn: boolean;
  token: string | null;
  loading: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<any>;
  signup: (name: string, email: string, password: string) => Promise<any>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
  setUserLocally: (data: Partial<User>) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  // ----------------------------
  // LOAD TOKEN & PROFILE ON START
  // ----------------------------
  useEffect(() => {
    (async () => {
      const savedToken = await AsyncStorage.getItem("token");

      if (savedToken) {
        setToken(savedToken);
        setIsLoggedIn(true);
        await fetchProfile(savedToken);
      }

      setLoading(false);
    })();
  }, []);

  // ----------------------------
  // FETCH PROFILE
  // ----------------------------
  const fetchProfile = async (authToken?: string) => {
    try {
      const res = await apiGet("auth/profile", authToken);
      if (res?.success) setUser(res.user);
    } catch (e) {
      console.log("Profile fetch error:", e);
    }
  };

  const refreshProfile = async () => {
    if (!token) return;
    await fetchProfile(token);
  };

  // ----------------------------
  // LOCAL USER UPDATE
  // ----------------------------
  const setUserLocally = (data: Partial<User>) => {
    setUser((prev) => ({ ...prev!, ...data }));
  };

  // ----------------------------
  // LOGIN
  // ----------------------------
  const login = async (email: string, password: string) => {
    const res = await apiRequest("auth/login", "POST", { email, password });

    if (res.success && res.token) {
      await AsyncStorage.setItem("token", res.token);
      setToken(res.token);
      setIsLoggedIn(true);
      setUser(res.user);
    }

    return res;
  };

  // ----------------------------
  // SIGNUP
  // ----------------------------
  const signup = async (name: string, email: string, password: string) => {
    return await apiRequest("auth/signup", "POST", { name, email, password });
  };

  // ----------------------------
  // LOGOUT
  // ----------------------------
  const logout = async () => {
    await AsyncStorage.removeItem("token");
    setToken(null);
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        token,
        loading,
        user,
        login,
        signup,
        logout,
        refreshProfile,
        setUserLocally,
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
