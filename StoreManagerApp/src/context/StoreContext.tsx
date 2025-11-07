import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { products as dummyProducts } from '../data/dummyProducts';

export type Product = { id: string; name: string; price: number; quantity?: number };
export type CartItem = Product & { quantity: number };

interface StoreContextType {
    products: Product[];
    cart: CartItem[];
    addProduct: (name: string, price: number) => void;
    updateProduct: (id: string, updatedProduct: Product) => void;
    deleteProduct: (id: string) => void;
    addToCart: (product: Product) => void;
    removeFromCart: (id: string) => void;
    clearCart: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);

    // Load products & cart from storage
    useEffect(() => {
        const loadData = async () => {
            try {
                const savedProducts = await AsyncStorage.getItem('products');
                const savedCart = await AsyncStorage.getItem('cart');

                if (savedProducts) setProducts(JSON.parse(savedProducts));
                else setProducts(dummyProducts);

                if (savedCart) setCart(JSON.parse(savedCart));
            } catch (e) {
                console.log('Error loading data:', e);
            }
        };
        loadData();
    }, []);

    // Save to storage
    useEffect(() => {
        AsyncStorage.setItem('products', JSON.stringify(products)).catch(console.log);
    }, [products]);

    useEffect(() => {
        AsyncStorage.setItem('cart', JSON.stringify(cart)).catch(console.log);
    }, [cart]);

    const addProduct = (name: string, price: number) => {
        const newProduct: Product = { id: Date.now().toString(), name, price, quantity: 10 };
        setProducts(prev => [...prev, newProduct]);
    };

    const updateProduct = (id: string, updated: Product) => {
        setProducts(prev => prev.map(p => (p.id === id ? updated : p)));
    };

    const deleteProduct = (id: string) => {
        setProducts(prev => prev.filter(p => p.id !== id));
    };

    const addToCart = (product: Product) => {
        setCart(prev => {
            const existing = prev.find(p => p.id === product.id);
            if (existing) {
                return prev.map(p =>
                    p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (id: string) => setCart(prev => prev.filter(i => i.id !== id));
    const clearCart = () => setCart([]);

    return (
        <StoreContext.Provider
            value={{
                products,
                cart,
                addProduct,
                updateProduct,
                deleteProduct,
                addToCart,
                removeFromCart,
                clearCart,
            }}
        >
            {children}
        </StoreContext.Provider>
    );
};

export const useStore = () => {
    const ctx = useContext(StoreContext);
    if (!ctx) throw new Error('useStore must be used within StoreProvider');
    return ctx;
};
