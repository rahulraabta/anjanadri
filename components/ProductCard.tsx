"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Star, ShoppingBag, Eye, Check, Flame, Sparkles } from "lucide-react";
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

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  // Dynamic computation based on Neon database stock and rating fields
  const stockCount = product.stock !== undefined ? product.stock : 15;
  const isSoldOut = !product.inStock || stockCount <= 0;
  const isLowStock = !isSoldOut && stockCount > 0 && stockCount <= 10;
  const isBestSeller = product.rating >= 4.8 && product.reviewCount >= 200;

  // Simulated active viewers based on review count
  const viewers = 8 + (product.reviewCount % 12);

  const handleAdd = () => {
    addToCart(product, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        type: "spring",
        stiffness: 110,
        damping: 18,
        delay: (index % 4) * 0.07,
      }}
      className="group flex flex-col overflow-hidden rounded-[2.25rem] border border-[#EDE5D8] bg-[#FDFBF7] shadow-[0_4px_24px_rgba(74,46,27,0.04)] transition-all duration-400 hover:-translate-y-1.5 hover:border-[#B85D3B]/30 hover:shadow-[0_20px_45px_-12px_rgba(74,46,27,0.12)]"
    >
      {/* Product Image Box */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[#F7F3EB]">
        <Link href={`/products/${product.id}`} className="relative block h-full w-full">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
        </Link>

        {/* Dynamic Badges Container */}
        <div className="absolute left-4 top-4 flex flex-col gap-1.5 pointer-events-none z-10">
          {discount && (
            <span className="rounded-full bg-[#B85D3B] px-3 py-1 text-[11px] font-bold tracking-wide text-white shadow-sm">
              Save {discount}%
            </span>
          )}
          {isSoldOut ? (
            <span className="rounded-full bg-[#4A2E1B]/95 px-3 py-1 text-[11px] font-semibold text-[#FDFBF7] backdrop-blur-sm shadow-sm">
              Sold Out
            </span>
          ) : isLowStock ? (
            <span className="rounded-full bg-[#D48060] px-3 py-1 text-[11px] font-bold text-white shadow-sm flex items-center gap-1">
              <Flame className="h-3 w-3" />
              Only {stockCount} Left!
            </span>
          ) : isBestSeller ? (
            <span className="rounded-full bg-[#6E7D60] px-3 py-1 text-[11px] font-bold text-white shadow-sm flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              Best Seller
            </span>
          ) : null}
        </div>

        {/* Live Viewer Tag */}
        {!isSoldOut && (
          <div className="absolute top-4 right-4 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur-md">
              👁️ {viewers} viewing
            </span>
          </div>
        )}

        {/* Quick View / Add to Cart Floating Buttons */}
        <div className="absolute bottom-4 right-4 flex items-center gap-2 z-10">
          <Link
            href={`/products/${product.id}`}
            aria-label={`View ${product.name} details`}
            className="flex h-11 w-11 translate-y-2 items-center justify-center rounded-full border border-[#EDE5D8] bg-[#FDFBF7] text-[#4A2E1B] opacity-0 shadow-md transition-all duration-300 hover:bg-[#4A2E1B] hover:text-[#FDFBF7] group-hover:translate-y-0 group-hover:opacity-100"
          >
            <Eye className="h-4.5 w-4.5" strokeWidth={1.8} />
          </Link>

          <button
            onClick={handleAdd}
            aria-label={`Add ${product.name} to cart`}
            disabled={isSoldOut}
            className={`flex h-11 w-11 translate-y-2 items-center justify-center rounded-full text-[#FDFBF7] shadow-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-0 ${
              justAdded
                ? "bg-[#6E7D60] opacity-100 translate-y-0"
                : "bg-[#4A2E1B] opacity-0 hover:bg-[#B85D3B]"
            }`}
          >
            {justAdded ? (
              <Check className="h-5 w-5 stroke-[2.5]" />
            ) : (
              <ShoppingBag className="h-4.5 w-4.5" strokeWidth={1.8} />
            )}
          </button>
        </div>
      </div>

      {/* Card Body */}
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6E7D60]">
            {product.category}
          </span>
          <span className="text-xs text-[#8C7A6B] font-medium">{product.weight}</span>
        </div>

        <h3 className="font-heading mt-2 text-xl font-bold leading-snug text-[#4A2E1B] transition-colors group-hover:text-[#B85D3B]">
          <Link href={`/products/${product.id}`}>
            {product.name}
          </Link>
        </h3>

        {/* Rating */}
        <div className="mt-2 flex items-center gap-1.5">
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-3.5 w-3.5 ${
                  i < Math.round(product.rating)
                    ? "fill-[#B85D3B] text-[#B85D3B]"
                    : "fill-[#EDE5D8] text-[#EDE5D8]"
                }`}
              />
            ))}
          </div>
          <span className="text-xs font-semibold text-[#4A2E1B]">
            {product.rating}
          </span>
          <span className="text-xs text-[#8C7A6B]">
            ({product.reviewCount})
          </span>
        </div>

        <p className="mt-3 flex-1 text-sm leading-relaxed text-[#6B584C] line-clamp-2">
          {product.shortDescription}
        </p>

        {/* Tags */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {product.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-[#EDE5D8] bg-[#F7F3EB] px-2.5 py-0.5 text-[11px] font-medium text-[#6E7D60]"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Bottom Price & Button */}
        <div className="mt-6 flex items-center justify-between border-t border-[#EDE5D8] pt-5">
          <div className="flex items-baseline gap-2">
            <span className="font-heading text-2xl font-bold text-[#4A2E1B]">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-[#8C7A6B] line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          <button
            onClick={handleAdd}
            disabled={isSoldOut}
            className={`rounded-full px-5 py-2.5 text-xs font-semibold transition-all duration-300 shadow-sm ${
              isSoldOut
                ? "cursor-not-allowed bg-[#EDE5D8] text-[#8C7A6B]"
                : justAdded
                ? "bg-[#6E7D60] text-white"
                : "bg-[#4A2E1B] text-[#FDFBF7] hover:bg-[#B85D3B]"
            }`}
          >
            {isSoldOut ? "Sold Out" : justAdded ? "Added!" : "Add to Cart"}
          </button>
        </div>
      </div>
    </motion.article>
  );
}

