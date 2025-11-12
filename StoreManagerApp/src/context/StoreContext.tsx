import React, { createContext, useState, useEffect, useContext } from "react";
import { apiGet, apiRequest } from "../utils/api";
import { useAuth } from "./AuthContext";

export type Product = {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  owner?: string;
};

type StoreContextType = {
  user: any;
  products: Product[];
  loading: boolean;

  refreshAll: () => Promise<void>;

  fetchProducts: () => Promise<void>;
  addProduct: (name: string, price: number, quantity: number) => Promise<any>;
  updateProduct: (id: string, data: Partial<Product>) => Promise<any>;
  deleteProduct: (id: string) => Promise<any>;
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const { token, isLoggedIn } = useAuth();

  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // ============================
  // 🔥 Fetch profile + products
  // ============================
  const refreshAll = async () => {
    if (!token) return;

    setLoading(true);

    try {
      const u = await apiRequest("/auth/me", "GET");
      if (u?.user) setUser(u.user);

      const p = await apiRequest("/products", "GET");
      if (Array.isArray(p)) setProducts(p);
    } catch (err) {
      console.log("Refresh Error:", err);
    }

    setLoading(false);
  };

  // Auto run when logged in state changes
  useEffect(() => {
    if (isLoggedIn) refreshAll();
    else {
      setUser(null);
      setProducts([]);
    }
  }, [isLoggedIn]);

  // ============================
  // CRUD Product Functions
  // ============================

  const fetchProducts = async () => {
    const p = await apiRequest("/products", "GET");
    if (Array.isArray(p)) setProducts(p);
  };

  const addProduct = async (name: string, price: number, quantity: number) => {
    const res = await apiRequest("/products", "POST", { name, price, quantity });

    if (res.product) {
      setProducts((prev) => [...prev, res.product]);
    }

    return res;
  };

  const updateProduct = async (id: string, data: Partial<Product>) => {
    const res = await apiRequest(`/products/${id}`, "PUT", data);

    if (res.product) {
      setProducts((prev) =>
        prev.map((p) => (p._id === id ? res.product : p))
      );
    }

    return res;
  };

  const deleteProduct = async (id: string) => {
    const res = await apiRequest(`/products/${id}`, "DELETE");

    if (res.deleted) {
      setProducts((prev) => prev.filter((p) => p._id !== id));
    }

    return res;
  };

  return (
    <StoreContext.Provider
      value={{
        user,
        products,
        loading,

        refreshAll,
        fetchProducts,
        addProduct,
        updateProduct,
        deleteProduct,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
};
