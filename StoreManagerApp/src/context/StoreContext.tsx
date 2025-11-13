import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
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

  fetchProducts: (force?: boolean) => Promise<void>;
  addProduct: (name: string, price: number, quantity: number) => Promise<any>;
  updateProduct: (id: string, data: Partial<Product>) => Promise<any>;
  deleteProduct: (id: string) => Promise<any>;
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn } = useAuth();

  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // --------------------------
  // SAFE fetchProducts
  // --------------------------
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);

      const res = await apiGet("products");

      let finalProducts: Product[] = [];

      if (Array.isArray(res)) {
        finalProducts = res;
      } else if (Array.isArray(res?.products)) {
        finalProducts = res.products;
      } else if (Array.isArray(res?.data)) {
        finalProducts = res.data;
      } else if (Array.isArray(res?.data?.products)) {
        finalProducts = res.data.products;
      } else {
        console.log("❗ Unexpected /products response:", res);
        setLoading(false);
        return;
      }

      if (finalProducts.length > 0) {
        setProducts(finalProducts);
      } else {
        setProducts([]);
      }

    } catch (err) {
      console.log("❗ fetchProducts error:", err);
    }

    setLoading(false);
  }, []);

  // --------------------------
  // ADD PRODUCT (MERGE LOGIC)
  // --------------------------
  const addProduct = useCallback(
    async (name: string, price: number, quantity: number) => {
      try {
        await fetchProducts(); // ensure latest list

        const normalize = (s: string) => s.trim().toLowerCase();

        const existing = products.find(
          (p) => normalize(p.name) === normalize(name)
        );

        // If product exists → merge
        if (existing) {
          const mergedQty = existing.quantity + quantity;

          return await updateProduct(existing._id, {
            name: existing.name,
            price,
            quantity: mergedQty,
          });
        }

        // Create new product
        const res = await apiRequest("products", "POST", {
          name,
          price,
          quantity,
        });

        const created = res?.product || res;

        if (created) {
          setProducts((prev) => [...prev, created]);
        }

        return res;
      } catch (err) {
        console.log("❗ addProduct error:", err);
        return null;
      }
    },
    [products, fetchProducts]
  );

  // --------------------------
  // UPDATE PRODUCT
  // --------------------------
  const updateProduct = useCallback(async (id, data) => {
    try {
      const res = await apiRequest(`products/${id}`, "PUT", data);
      const updated = res?.product || res?.updatedProduct || res;

      if (updated) {
        setProducts((prev) =>
          prev.map((p) => (p._id === id ? updated : p))
        );
      }

      return res;
    } catch (err) {
      console.log("❗ updateProduct error:", err);
      return null;
    }
  }, []);

  // --------------------------
  // DELETE PRODUCT
  // --------------------------
  const deleteProduct = useCallback(async (id) => {
    try {
      const res = await apiRequest(`products/${id}`, "DELETE");

      const ok =
        res?.deleted === true ||
        res?.success === true ||
        res?.ok === true ||
        res?.deletedId === id;

      if (ok) {
        setProducts((prev) => prev.filter((p) => p._id !== id));
      }

      return { deleted: ok };
    } catch (err) {
      console.log("❗ deleteProduct error:", err);
      return { deleted: false };
    }
  }, []);

  // --------------------------
  // Load once when logged in
  // --------------------------
  useEffect(() => {
    if (isLoggedIn) fetchProducts();
    else {
      setUser(null);
      setProducts([]);
    }
  }, [isLoggedIn]);

  const value = useMemo(
    () => ({
      user,
      products,
      loading,
      fetchProducts,
      addProduct,
      updateProduct,
      deleteProduct,
    }),
    [user, products, loading]
  );

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
};

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be inside StoreProvider");
  return ctx;
};
