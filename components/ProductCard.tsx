"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Star, Plus, Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: Product;
  index: number;
}

export default function ProductCard({ product, index }: ProductCardProps) {
  const { addToCart } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const isBestSeller = product.isBestSeller === true || product.tags.includes("Best Seller");

  const handleAdd = () => {
    addToCart(product, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1600);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ type: "spring", stiffness: 120, damping: 18, delay: (index % 4) * 0.06 }}
      className="group flex flex-col overflow-hidden rounded-3xl border border-[#F0E2C4] bg-white shadow-[0_6px_24px_rgba(62,39,35,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_-12px_rgba(62,39,35,0.18)]"
    >
      <div className="relative w-full aspect-square bg-white rounded-lg overflow-hidden">
        <Link href={`/products/${product.id}`} className="relative block h-full w-full">
          <Image
            src={product.image}
            alt={product.name}
            width={400}
            height={400}
            quality={100}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </Link>
        {isBestSeller && (
          <span className="absolute left-3 top-3 rounded-full bg-[#FFC107] px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide text-[#3E2723] shadow-sm">
            Best Seller
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-3.5 w-3.5 ${
                i < Math.round(product.rating)
                  ? "fill-[#FFC107] text-[#FFC107]"
                  : "fill-[#F0E2C4] text-[#F0E2C4]"
              }`}
            />
          ))}
          <span className="ml-1 text-xs font-semibold text-[#3E2723]">{product.rating}</span>
        </div>

        <h3 className="mt-2 font-sans text-lg font-bold leading-snug text-[#2E7D32]">
          <Link href={`/products/${product.id}`}>{product.name}</Link>
        </h3>
        <p className="font-sans text-xl font-bold text-[#F57C00]">₹{product.price}</p>
        <p className="mt-1 flex-1 text-sm leading-relaxed text-[#3E2723]/70 line-clamp-2">
          {product.description}
        </p>

        <div className="mt-4 flex min-h-[48px] items-center justify-between gap-2">
          <button
            onClick={handleAdd}
            aria-label={`Add ${product.name} to cart`}
            className={`inline-flex min-h-[48px] min-w-[48px] items-center justify-center gap-1.5 rounded-full px-5 text-sm font-bold text-white transition-all ${
              justAdded ? "bg-[#2E7D32]" : "bg-[#F57C00] hover:bg-[#E65100]"
            }`}
          >
            {justAdded ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {justAdded ? "Added" : "Add"}
          </button>
        </div>
      </div>
    </motion.article>
  );
}
