"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import type { Product } from "@/data/products";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("bnatural_cart");
      if (stored) {
        setCart(JSON.parse(stored));
      } else {
        // Initial sample items to make the store feel warm & active
        setCart([
          {
            product: {
              id: "crispy-apple-chips",
              name: "Crispy Apple Chips",
              price: 8.99,
              originalPrice: 10.99,
              description: "Thinly sliced Honeycrisp apples, slow-dried at low temperatures.",
              shortDescription: "Naturally sweet Honeycrisp apples, slow-dried for the perfect crunch.",
              image: "https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?w=800&q=80",
              category: "Fruit Chips",
              rating: 4.9,
              reviewCount: 234,
              inStock: true,
              weight: "2.5 oz (70g)",
              tags: ["Vegan", "Gluten-Free", "No Added Sugar"],
            },
            quantity: 2,
          },
          {
            product: {
              id: "mango-slices",
              name: "Organic Mango Slices",
              price: 11.99,
              description: "Sun-ripened Ataulfo mangoes from organic farms in Mexico.",
              shortDescription: "Chewy, tropical Ataulfo mangoes—nature's candy.",
              image: "https://images.unsplash.com/photo-1601133330287-214694d47aff?w=800&q=80",
              category: "Dried Fruit",
              rating: 4.8,
              reviewCount: 312,
              inStock: true,
              weight: "3 oz (85g)",
              tags: ["Organic", "Vegan"],
            },
            quantity: 1,
          },
        ]);
      }
    } catch (e) {
      console.error("Failed to read cart from localStorage", e);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem("bnatural_cart", JSON.stringify(cart));
      } catch (e) {
        console.error("Failed to save cart to localStorage", e);
      }
    }
  }, [cart, isLoaded]);

  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCart([]);
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        isCartOpen,
        setIsCartOpen,
        openCart,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
