"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { SanityProduct } from "@/lib/sanity";
import { notifyAddedToCart, showToast } from "@/lib/toast";

export interface CartItem {
  product: SanityProduct;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: SanityProduct, quantity?: number, openDrawer?: boolean) => void;
  flyingImage: string;
  flyingImageId: number;
  setFlyingImage: (image: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  openCart: () => void;
  closeCart: () => void;
  isLoaded: boolean;
  showToast: (message: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [flyingImage, updateFlyingImage] = useState("");
  const [flyingImageId, setFlyingImageId] = useState(0);
  const setFlyingImage = useCallback((image: string) => {
    updateFlyingImage(image);
    if (image) setFlyingImageId((id) => id + 1);
  }, []);
  useEffect(() => {
    try {
      const stored = localStorage.getItem("bnatural_cart");
      if (stored) {
        const parsed = JSON.parse(stored);
        queueMicrotask(() => {
          setCart(parsed);
          setIsLoaded(true);
        });
        return;
      }
    } catch (e) {
      console.error("Failed to read cart from localStorage", e);
    }
    queueMicrotask(() => setIsLoaded(true));
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem("bnatural_cart", JSON.stringify(cart));
      } catch (e) {
        console.error("Failed to save cart to localStorage", e);
      }
    }
  }, [cart, isLoaded]);

  const addToCart = (product: SanityProduct, quantity = 1, openDrawer = true) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product._id === product._id);
      if (existing) {
        return prev.map((item) =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    notifyAddedToCart(product.name);
    if (openDrawer) setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product._id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product._id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCart([]);
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart, addToCart, removeFromCart, updateQuantity, clearCart,
        totalItems, subtotal, isCartOpen, setIsCartOpen, openCart, closeCart,
        isLoaded, showToast, flyingImage, flyingImageId, setFlyingImage,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}
