import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiGet, apiRequest } from "../utils/api";

export type User = {
  _id?: string;
  name: string;
  email: string;
  picture?: string | null;
  storeName?: string;
  ownerName?: string;
  storeType?: string;
  phone?: string;
};

// ---------------------------
// TYPES
// ---------------------------
type AuthContextType = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<any>;
  googleLogin: (idToken: string) => Promise<any>;
  signup: (name: string, email: string, password: string) => Promise<any>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
  setUserLocally: (data: Partial<User>) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ---------------------------
// PROVIDER
// ---------------------------
export const AuthProvider = ({ children }: any) => {
  // ⚠ ALL HOOKS MUST BE AT TOP
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // ---------------------------
  // LOAD TOKEN ONCE
  // ---------------------------
  useEffect(() => {
    const loadToken = async () => {
      try {
        const savedToken = await AsyncStorage.getItem("token");
        if (savedToken) {
          setToken(savedToken);
          await fetchProfile(savedToken);
        }
      } catch (e) {
        console.log("Error loading token:", e);
      }
      setLoading(false);
    };

    loadToken();
  }, []);

  // ---------------------------
  // FETCH PROFILE
  // ---------------------------
  const fetchProfile = async (authToken: string) => {
    try {
      const res = await apiGet("auth/profile", authToken);
      if (res?.success) {
        setUser(res.user); // full user saved
      }
    } catch (e) {
      console.log("Profile fetch error:", e);
    }
  };

  const refreshProfile = async () => {
    if (token) await fetchProfile(token);
  };

  const setUserLocally = (data: Partial<User>) => {
    setUser((prev) => ({ ...prev!, ...data }));
  };

  // ---------------------------
  // LOGIN (EMAIL)
  // ---------------------------
  const login = async (email: string, password: string) => {
    const res = await apiRequest("auth/login", "POST", { email, password });

    if (res.success && res.token) {
      await AsyncStorage.setItem("token", res.token);
      setToken(res.token);
      await fetchProfile(res.token);
    }

    return res;
  };

  // ---------------------------
  // GOOGLE LOGIN
  // ---------------------------
  const googleLogin = async (idToken: string) => {
    const res = await apiRequest("auth/google", "POST", { idToken });

    if (res.success && res.token) {
      await AsyncStorage.setItem("token", res.token);
      setToken(res.token);
      await fetchProfile(res.token);
    }

    return res;
  };

  // ---------------------------
  // SIGNUP
  // ---------------------------
  const signup = async (name: string, email: string, password: string) => {
    return await apiRequest("auth/signup", "POST", {
      name,
      email,
      password,
    });
  };

  // ---------------------------
  // LOGOUT
  // ---------------------------
  const logout = async () => {
    await AsyncStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        googleLogin,
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

// ---------------------------
// USE AUTH
// ---------------------------
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
