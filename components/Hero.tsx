"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Check, Star, Leaf, Sun, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
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
          {/* Image: first on mobile and full-bleed, right column on desktop */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="relative order-1 -mx-4 sm:mx-0 lg:order-2"
          >
            <div className="relative overflow-hidden bg-white lg:rounded-[2rem] lg:border lg:border-[#F0E2C4] lg:shadow-[0_24px_60px_-20px_rgba(62,39,35,0.25)]">
              <Image
                src={stickyBanana.image}
                alt={`Anjanadri ${stickyBanana.name} — dehydrated banana with nuts and seeds`}
                width={1600}
                height={873}
                quality={80}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="h-auto w-full object-cover"
                priority
              />

              <span className="absolute left-4 top-4 rounded-full bg-[#FFC107] px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider text-[#3E2723] shadow-md sm:left-6 sm:top-6">
                &#9733; Best Seller
              </span>

              <div className="absolute bottom-4 right-4 rounded-2xl bg-white/95 px-4 py-2.5 shadow-lg backdrop-blur-md sm:bottom-6 sm:right-6">
                <p className="text-[11px] font-medium text-[#3E2723]/70">
                  Dehydrated &bull; No added sugar
                </p>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-[#FFC107] text-[#FFC107]" />
                  ))}
                  <span className="ml-1 text-xs font-bold text-[#3E2723]">
                    {stickyBanana.rating}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Copy */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 110, damping: 18, delay: 0.1 }}
            className="order-2 flex w-full flex-col items-start lg:order-1"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-[#2E7D32]/20 bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[#2E7D32]">
              <Leaf className="h-3.5 w-3.5" />
              Flagship Product
            </span>

            <h1 className="font-heading mt-4 text-4xl font-bold leading-tight tracking-tight text-[#2E7D32] sm:text-5xl">
              Our Best-Selling Sticky Banana
            </h1>
            <p className="mt-3 text-lg font-semibold text-[#C2410C] sm:text-xl">
              100% Natural, No Preservatives, Dehydrated &amp; Healthy
            </p>
            <p className="mt-3 max-w-lg text-base leading-relaxed text-[#3E2723]/80">
              Naturally sweet Mysore bananas, slow dehydrated to a chewy golden bite and
              topped with nuts and seeds. No sugar, no chemicals — just farm-fresh
              goodness in every pack.
            </p>

            <div className="mt-5 flex flex-wrap items-baseline gap-3">
              <span className="font-heading text-4xl font-bold text-[#3E2723]">
                &#8377;{stickyBanana.price}
              </span>
              {stickyBanana.originalPrice && (
                <span className="text-lg text-[#3E2723]/45 line-through">
                  &#8377;{stickyBanana.originalPrice}
                </span>
              )}
              <span className="rounded-full bg-[#2E7D32]/10 px-3 py-1 text-xs font-bold text-[#2E7D32]">
                {stickyBanana.weight} pack
              </span>
            </div>

            <div className="mt-6 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Link
                href={`/products/${stickyBanana.id}`}
                className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[#F57C00] px-8 py-3.5 text-base font-bold text-white shadow-[0_10px_24px_-6px_rgba(245,124,0,0.5)] transition-all hover:-translate-y-0.5 hover:bg-[#E65100] active:translate-y-0 sm:w-auto"
              >
                Shop Now
              </Link>
              <button
                type="button"
                onClick={handleAdd}
                className={`inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border-2 px-7 py-3.5 text-base font-bold transition-all sm:w-auto ${
                  justAdded
                    ? "border-[#2E7D32] bg-[#2E7D32] text-white"
                    : "border-[#2E7D32] text-[#2E7D32] hover:bg-[#2E7D32] hover:text-white"
                }`}
              >
                {justAdded ? <Check className="h-5 w-5" /> : <ShoppingBag className="h-5 w-5" />}
                {justAdded ? "Added to Cart" : "Add to Cart"}
              </button>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-semibold text-[#3E2723]/70">
              <span className="flex items-center gap-1.5">
                <Sun className="h-4 w-4 text-[#F57C00]" /> Dehydrated
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
