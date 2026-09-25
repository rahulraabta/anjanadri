"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Check, Star, Leaf, Sun, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { products } from "@/data/products";

export default function Hero() {
  const { addToCart } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const stickyBanana =
    products.find((p) => p.isBestSeller === true) ??
    products.find((p) => p.id === "sticky-banana") ??
    products[0];

  const handleAdd = () => {
    if (!stickyBanana) return;
    addToCart(stickyBanana, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
  };

  return (
    <section className="relative overflow-hidden bg-[#FFF8E7]">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-[420px] w-[420px] rounded-full bg-[#FFC107]/15 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-28 -left-24 h-[380px] w-[380px] rounded-full bg-[#2E7D32]/10 blur-3xl"
      />

      <div className="relative mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Product Image — first on mobile, right on desktop */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="relative order-1 lg:order-2"
          >
            <div className="relative aspect-square overflow-hidden rounded-[2rem] border border-[#F0E2C4] bg-white p-3 shadow-[0_24px_60px_-20px_rgba(62,39,35,0.25)]">
              <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[1.5rem] bg-white">
                <Image
                  src={stickyBanana.image}
                  alt={`Anjanadri ${stickyBanana.name} — sun-dried banana`}
                  width={800}
                  height={800}
                  quality={100}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-contain"
                  priority
                />
              </div>

              <span className="absolute left-6 top-6 rounded-full bg-[#FFC107] px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider text-[#3E2723] shadow-md">
                ★ Best Seller
              </span>

              <div className="absolute bottom-6 right-6 rounded-2xl bg-white/95 px-4 py-2.5 shadow-lg backdrop-blur-md">
                <p className="text-[11px] font-medium text-[#3E2723]/70">Sun-dried • No added sugar</p>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-[#FFC107] text-[#FFC107]" />
                  ))}
                  <span className="ml-1 text-xs font-bold text-[#3E2723]">4.9</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Text — second on mobile, left on desktop */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 110, damping: 18, delay: 0.1 }}
            className="order-2 flex flex-col items-start lg:order-1"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-[#2E7D32]/20 bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[#2E7D32]">
              <Leaf className="h-3.5 w-3.5" />
              Flagship Product
            </span>

            <h1 className="mt-4 font-sans text-4xl font-extrabold leading-tight tracking-tight text-[#2E7D32] sm:text-5xl">
              Our Best-Selling Sticky Banana
            </h1>
            <p className="mt-3 font-sans text-lg font-semibold text-[#F57C00] sm:text-xl">
              100% Natural, No Preservatives, Sun-Dried &amp; Healthy
            </p>
            <p className="mt-3 max-w-lg text-base leading-relaxed text-[#3E2723]/80">
              Naturally sweet Mysore bananas, slow sun-dried to a chewy golden bite.
              No sugar, no chemicals — just farm-fresh goodness in every pack.
            </p>

            <div className="mt-5 flex items-center gap-3">
              <span className="font-sans text-4xl font-extrabold text-[#3E2723]">₹{stickyBanana.price}</span>
              <span className="rounded-full bg-[#2E7D32]/10 px-3 py-1 text-xs font-bold text-[#2E7D32]">
                200g pack
              </span>
            </div>

            <div className="mt-6 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <button
                onClick={handleAdd}
                className={`inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full px-8 py-3.5 text-base font-bold text-white shadow-[0_10px_24px_-6px_rgba(245,124,0,0.5)] transition-all hover:-translate-y-0.5 active:translate-y-0 ${
                  justAdded ? "bg-[#2E7D32]" : "bg-[#F57C00] hover:bg-[#E65100]"
                }`}
              >
                {justAdded ? <Check className="h-5 w-5" /> : <ShoppingBag className="h-5 w-5" />}
                {justAdded ? "Added to Cart!" : "Add to Cart"}
              </button>
              <a
                href="#shop"
                className="inline-flex min-h-[48px] items-center justify-center rounded-full border-2 border-[#2E7D32] px-7 py-3.5 text-base font-bold text-[#2E7D32] transition-all hover:bg-[#2E7D32] hover:text-white"
              >
                Shop All 7 Items
              </a>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-semibold text-[#3E2723]/70">
              <span className="flex items-center gap-1.5">
                <Sun className="h-4 w-4 text-[#F57C00]" /> Sun-Dried
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-[#2E7D32]" /> No Preservatives
              </span>
              <span className="flex items-center gap-1.5">
                <Leaf className="h-4 w-4 text-[#2E7D32]" /> 100% Vegan
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
