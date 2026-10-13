"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { SanityProduct, urlFor, productSlug } from "@/lib/sanity";

interface ProductCardProps {
  product: SanityProduct;
  index: number;
}

export default function ProductCard({ product, index }: ProductCardProps) {
  const { addToCart } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const isBestSeller = product.badge === "Best Seller" || product.isBestSeller === true;
  const slug = productSlug(product);

  const imageSrc =
    typeof product.image === "string"
      ? product.image
      : urlFor(product.image).width(400).height(400).url();

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
      <div className="relative aspect-square w-full overflow-hidden bg-white">
        <Link href={`/products/${slug}`} className="block h-full w-full">
          <Image
            src={imageSrc}
            alt={product.name}
            width={400}
            height={400}
            quality={80}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            unoptimized
          />
        </Link>

        {isBestSeller && (
          <span className="absolute left-3 top-3 rounded-full bg-[#FFC107] px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide text-[#3E2723] shadow-sm">
            {product.badge ?? "Best Seller"}
          </span>
        )}

        <button
          type="button"
          onClick={handleAdd}
          aria-label={`Add ${product.name} to cart`}
          className="absolute bottom-3 right-3 flex h-12 w-12 items-center justify-center rounded-full text-white shadow-[0_8px_20px_-4px_rgba(62,39,35,0.35)] transition-all duration-300 lg:opacity-0 lg:group-hover:opacity-100 lg:focus-visible:opacity-100 bg-[#F57C00] hover:bg-[#E65100]"
        >
          {justAdded ? <Check className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
        </button>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-heading mt-2 line-clamp-2 min-h-[3.5rem] text-lg font-semibold leading-snug text-[#2E7D32]">
          <Link href={`/products/${slug}`}>{product.name}</Link>
        </h3>

        <div className="mt-1 flex items-baseline gap-2">
          <p className="text-xl font-bold text-[#F57C00]">₹{product.price}</p>
          {product.originalPrice && (
            <p className="text-sm text-[#3E2723]/45 line-through">₹{product.originalPrice}</p>
          )}
        </div>

        <p className="mt-1 flex-1 text-sm leading-relaxed text-[#3E2723]/60 line-clamp-2">
          {product.shortDescription || product.description}
        </p>
      </div>
    </motion.article>
  );
}