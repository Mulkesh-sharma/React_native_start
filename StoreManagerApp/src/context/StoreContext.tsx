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
  products: Product[];
  loadingProducts: boolean;
  fetchProducts: () => Promise<void>;
  addProduct: (name: string, price: number, quantity: number) => Promise<any>;
  updateProduct: (id: string, data: Partial<Product>) => Promise<any>;
  deleteProduct: (id: string) => Promise<any>;
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const { token, isLoggedIn } = useAuth();

  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // Auto-fetch when logged in
  useEffect(() => {
    if (isLoggedIn) fetchProducts();
    else setProducts([]);
  }, [isLoggedIn]);

  const fetchProducts = async () => {
    if (!token) return;

    setLoadingProducts(true);
    try {
      const res = await apiRequest("products", "GET");
      if (Array.isArray(res)) setProducts(res);
    } finally {
      setLoadingProducts(false);
    }
  };

  const addProduct = async (name: string, price: number, quantity: number) => {
    const res = await apiRequest("products", "POST", {
      name,
      price,
      quantity,
    });

    if (res.product) {
      setProducts((p) => [...p, res.product]);
    }

    return res;
  };

  const updateProduct = async (id: string, data: Partial<Product>) => {
    const res = await apiRequest(`/products/${id}`, "PUT", data);

    if (res.product) {
      setProducts((p) =>
        p.map((prod) => (prod._id === id ? res.product : prod))
      );
    }

    return res;
  };

  const deleteProduct = async (id: string) => {
    const res = await apiRequest(`/products/${id}`, "DELETE");

    if (res.deleted) {
      setProducts((p) => p.filter((prod) => prod._id !== id));
    }

    return res;
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        loadingProducts,
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
