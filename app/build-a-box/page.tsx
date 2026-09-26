"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Box, Plus, Minus, ShoppingBag, Sparkles } from "lucide-react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { products } from "@/data/products";
import { useCart } from "@/context/CartContext";

const BOX_PRICE_PER_ITEM = 7.99;

export default function BuildABoxPage() {
  const { addToCart, openCart } = useCart();
  const [selections, setSelections] = useState<Record<string, number>>({});

  const totalItems = Object.values(selections).reduce((a, b) => a + b, 0);
  const totalPrice = totalItems * BOX_PRICE_PER_ITEM;

  function updateQty(id: string, delta: number) {
    setSelections((prev) => {
      const current = (prev[id] || 0) + delta;
      if (current <= 0) {
        const next = { ...prev };
        delete next[id];
        return next;
      }
      if (Object.values(prev).reduce((a, b) => a + b, 0) + delta > 12 && delta > 0) return prev;
      return { ...prev, [id]: current };
    });
  }

  function handleAddToCart() {
    if (totalItems === 0) return;
    const selectedProducts = products.filter((p) => selections[p.id]);
    const customProduct = {
      id: `custom-box-${Date.now()}`,
      name: `Custom Box (${totalItems} items)`,
      price: totalPrice,
      description: `Your curated selection: ${selectedProducts.map((p) => p.name).join(", ")}`,
      shortDescription: `${totalItems} handpicked dehydrated fruits & vegetables`,
      image: selectedProducts[0]?.image || products[0].image,
      category: "Gift Boxes",
      rating: 5.0,
      reviewCount: 0,
      inStock: true,
      weight: `${totalItems * 2} oz`,
      tags: ["Custom Box", "Build Your Own"],
      benefit: "Custom curated mix",
    };
    addToCart(customProduct);
    openCart();
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-white py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-14"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-[#F57C00]/25 bg-[#FFF3D6] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#C2410C]">
              <Sparkles className="h-3.5 w-3.5" /> Curate Your Harvest
            </span>
            <h1 className="font-heading mt-5 text-4xl font-bold tracking-tight text-[#3E2723] sm:text-5xl">
              Build Your Own Box
            </h1>
            <p className="mt-4 mx-auto max-w-xl text-base text-[#3E2723]/70">
              Select up to 12 items from our pantry. Each slot is ${BOX_PRICE_PER_ITEM.toFixed(2)} — mix fruits, vegetables, and crisps freely.
            </p>
          </motion.div>

          <div className="sticky top-24 z-30 mx-auto mb-10 max-w-2xl rounded-2xl border border-[#F0E2C4] bg-white/95 p-5 shadow-lg backdrop-blur-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#3E2723] text-[#FFF8E7]">
                  <Box className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-heading text-lg font-bold text-[#3E2723]">{totalItems} / 12 slots</p>
                  <p className="text-xs text-[#3E2723]/55">${BOX_PRICE_PER_ITEM.toFixed(2)} per item</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-heading text-2xl font-bold text-[#C2410C]">${totalPrice.toFixed(2)}</p>
                <button
                  onClick={handleAddToCart}
                  disabled={totalItems === 0}
                  className="mt-1 inline-flex items-center gap-2 rounded-full bg-[#3E2723] px-5 py-2 text-xs font-semibold text-[#FFF8E7] transition-all hover:bg-[#F57C00] disabled:opacity-40"
                >
                  <ShoppingBag className="h-3.5 w-3.5" /> Add Custom Box
                </button>
              </div>
            </div>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[#F0E2C4]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#2E7D32] to-[#F57C00] transition-all duration-500"
                style={{ width: `${Math.min(100, (totalItems / 12) * 100)}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {products.filter((p) => p.inStock).map((product, i) => {
              const qty = selections[product.id] || 0;
              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.5 }}
                  className={`relative flex flex-col overflow-hidden rounded-[1.5rem] border transition-all duration-300 ${
                    qty > 0 ? "border-[#F57C00] shadow-md" : "border-[#F0E2C4]"
                  } bg-white`}
                >
                  <div className="relative aspect-square overflow-hidden bg-[#FFF3D6]">
                    <Image src={product.image} alt={product.name} fill sizes="25vw" className="object-cover" loading="lazy" />
                    {qty > 0 && (
                      <span className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#F57C00] text-xs font-bold text-white shadow">
                        {qty}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#2E7D32]">{product.category}</span>
                    <h3 className="font-heading mt-1 text-sm font-semibold text-[#3E2723] line-clamp-1">{product.name}</h3>
                    <p className="mt-1 text-xs text-[#3E2723]/55">{product.weight}</p>
                    <div className="mt-auto pt-3 flex items-center justify-between">
                      <span className="font-heading text-sm font-bold text-[#3E2723]">${BOX_PRICE_PER_ITEM.toFixed(2)}</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => updateQty(product.id, -1)}
                          disabled={qty === 0}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-[#F0E2C4] text-[#3E2723] transition-colors hover:bg-[#FFF3D6] disabled:opacity-30"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => updateQty(product.id, 1)}
                          disabled={totalItems >= 12}
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-[#3E2723] text-[#FFF8E7] transition-colors hover:bg-[#F57C00] disabled:opacity-30"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
