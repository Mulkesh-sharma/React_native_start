import React, { createContext, useState, ReactNode, useContext } from 'react';

export type Product = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

type ProductContextType = {
  products: Product[];
  addProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
};

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([
    { id: '1', name: 'Rice 5kg', price: 350, quantity: 10 },
    { id: '2', name: 'Wheat Flour 10kg', price: 420, quantity: 8 },
    { id: '3', name: 'Cooking Oil 1L', price: 150, quantity: 15 },
  ]);

  const addProduct = (product: Product) => {
    setProducts((prev) => [...prev, product]);
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, deleteProduct }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) throw new Error('useProducts must be used inside ProductProvider');
  return context;
};
