"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Plus, Minus, ShieldCheck, Truck, Sparkles, ArrowLeft, Check, Leaf } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { urlFor, type SanityProduct } from "@/lib/sanity";
import NutritionalInsights from "@/components/NutritionalInsights";
import FrequentlyBoughtTogether from "@/components/FrequentlyBoughtTogether";

interface ProductDetailClientProps {
  product: SanityProduct;
  relatedProducts?: SanityProduct[];
  allProducts?: SanityProduct[];
}

export default function ProductDetailClient({
  product,
  allProducts = [],
}: ProductDetailClientProps) {

  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);
  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const past = window.scrollY > 400;
      const nearBottom =
        window.scrollY + window.innerHeight >
        document.documentElement.scrollHeight - 200;
      setShowSticky(past && !nearBottom);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2500);
  };

  const imageSrc =
    typeof product.image === "string"
      ? product.image
      : urlFor(product.image).width(1200).url();

  const thumbSrc =
    typeof product.image === "string"
      ? product.image
      : urlFor(product.image).width(96).url();

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <div className="min-h-screen bg-white pt-10 pb-24 lg:pb-0 lg:pt-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="mb-8 flex items-center gap-2 text-sm text-[#3E2723]/55">
          <Link href="/" className="hover:text-[#3E2723] transition-colors flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" /> Home
          </Link>
          <span>/</span>
          <Link href="/#shop" className="hover:text-[#3E2723] transition-colors">
            Pantry
          </Link>
          <span>/</span>
          <span className="font-medium text-[#3E2723] line-clamp-1">{product.name}</span>
        </nav>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Primary Main Image */}
            <div className="relative aspect-square sm:aspect-[4/3] w-full overflow-hidden rounded-[2.5rem] border border-[#F0E2C4] bg-[#FFF3D6] shadow-[0_15px_40px_rgba(62,39,35,0.06)]">
              <Image
                src={imageSrc}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover transition-all duration-700 hover:scale-105"
              />

              <div className="absolute left-6 top-6 flex flex-col gap-2">
                {discount && (
                  <span className="rounded-full bg-[#F57C00] px-3.5 py-1 text-xs font-bold text-white shadow-md">
                    Save {discount}%
                  </span>
                )}
                <span className="rounded-full border border-white/40 bg-[#3E2723]/80 px-3.5 py-1 text-xs font-medium text-[#FFF8E7] backdrop-blur-md">
                  100% Natural Harvest
                </span>
              </div>
            </div>

            {/* Intelligent Health Insights */}
            <NutritionalInsights product={product} />
          </div>

          {/* Right Column: Details, Purchasing & Benefits */}
          <div className="lg:col-span-5 flex flex-col justify-start">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#2E7D32]">
              {product.category}
            </span>

            <h1 className="font-heading mt-2.5 text-3xl font-bold leading-tight text-[#3E2723] sm:text-4xl">
              {product.name}
            </h1>

            {/* Product truth badge */}
            <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#2E7D32]/10 px-3.5 py-1.5 text-sm font-bold text-[#2E7D32]">
              <Leaf className="h-4 w-4" aria-hidden />
              {product.benefit}
            </p>

            {/* Price Row */}
            <div className="mt-6 flex items-baseline gap-3 border-y border-[#F0E2C4] py-4">
              <span className="font-heading text-3xl font-bold text-[#2E7D32]">
                ₹{product.price.toFixed(0)}
              </span>
              {product.originalPrice && (
                <span className="text-lg text-[#3E2723]/55 line-through">
                  ₹{product.originalPrice.toFixed(0)}
                </span>
              )}
              <span className="text-xs text-[#3E2723]/55">Net Wt: {product.weight}</span>
            </div>

            {/* Full Artisanal Description */}
            <div className="mt-6 space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#3E2723]/55">Description</h3>
              <p className="text-base leading-relaxed text-[#3E2723]/70">
                {product.description}
              </p>
            </div>

            {/* Dietary Tags */}
            <div className="mt-6">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#3E2723]/55 mb-2.5">
                Certified Integrity
              </h3>
              <div className="flex flex-wrap gap-2">
                {(product.tags ?? []).map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#F0E2C4] bg-[#FFF3D6] px-3.5 py-1 text-xs font-medium text-[#3E2723]"
                  >
                    <Leaf className="h-3 w-3 text-[#2E7D32]" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Quantity Selector & Add to Cart */}
            <div className="mt-8 space-y-4 rounded-3xl border border-[#F0E2C4] bg-[#FFF3D6] p-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[#3E2723]">Select Quantity</span>
                <div className="flex items-center rounded-full border border-[#F0E2C4] bg-white px-3 py-1 shadow-sm">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-1 text-[#3E2723]/55 hover:text-[#3E2723] transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center font-heading text-sm font-bold text-[#3E2723]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-1 text-[#3E2723]/55 hover:text-[#3E2723] transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <ul className="mb-4 space-y-1.5 text-sm text-[#3E2723]/80">
                <li className="flex items-center gap-2">
                  <svg className="h-4 w-4 text-[#2E7D32] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Dehydrated in Mysore, India</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="h-4 w-4 text-[#2E7D32] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>No Preservatives · No Added Sugar</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="h-4 w-4 text-[#2E7D32] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Secure food-grade packaging</span>
                </li>
              </ul>

              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex w-full items-center justify-center gap-2.5 rounded-full bg-[#3E2723] py-4 text-base font-semibold text-[#FFF8E7] shadow-[0_12px_28px_-8px_rgba(62,39,35,0.35)] transition-all duration-300 hover:bg-[#F57C00] disabled:cursor-not-allowed disabled:bg-[#F0E2C4] disabled:text-[#3E2723]/55"
              >
                {addedNotice ? (
                  <>
                    <Check className="h-5 w-5" /> Added to Basket!
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-5 w-5" />
                    {product.inStock ? `Add to Basket • ₹${(product.price * quantity).toFixed(0)}` : "Currently Unavailable"}
                  </>
                )}
              </button>

              <div className="pt-2 text-center">
                <p
                  className="text-xl text-[#C2410C]"
                  style={{ fontFamily: "var(--font-script, cursive)" }}
                >
                  Anjanadri — pure . natural . delicious
                </p>
              </div>
            </div>

            {/* Reassurances list */}
            <div className="mt-8 space-y-3.5 border-t border-[#F0E2C4] pt-6 text-xs text-[#3E2723]/55">
              <div className="flex items-center gap-3">
                <Truck className="h-4 w-4 text-[#2E7D32]" />
                <span>Free delivery on orders over ₹499 • Mysore</span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-4 w-4 text-[#2E7D32]" />
                <span>Handcrafted in small batches — naturally sweet, no added sugar</span>
              </div>
              <div className="flex items-center gap-3">
                <Sparkles className="h-4 w-4 text-[#2E7D32]" />
                <span>Slow, low-temperature dehydration preserves natural nutrients and flavor</span>
              </div>
            </div>
          </div>
        </div>

        {/* Frequently Bought Together Bundle Engine */}
        <FrequentlyBoughtTogether
          currentProduct={product}
          allProducts={allProducts}
        />
      </div>

      {/* Sticky Mobile Add-to-Cart Bar */}
      <AnimatePresence>
        {showSticky && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#F0E2C4] bg-white shadow-[0_-4px_20px_rgba(62,39,35,0.08)] lg:hidden"
          >
            <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
              <Image
                src={thumbSrc}
                alt={product.name}
                width={48}
                height={48}
                unoptimized
                className="h-12 w-12 shrink-0 rounded-xl bg-[#FFF3D6] object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-[#3E2723]">
                  {product.name}
                </p>
                <p className="flex items-baseline gap-1.5 text-sm font-bold text-[#F57C00]">
                  &#8377;{product.price.toFixed(0)}
                  {product.originalPrice && (
                    <span className="text-xs font-normal text-[#3E2723]/50 line-through">
                      &#8377;{product.originalPrice.toFixed(0)}
                    </span>
                  )}
                </p>
              </div>
              <button
                onClick={() => addToCart(product, 1)}
                disabled={!product.inStock}
                aria-label="Add to basket"
                className="flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#2E7D32] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#256428] disabled:cursor-not-allowed disabled:bg-[#F0E2C4] disabled:text-[#3E2723]/55"
              >
                <ShoppingBag className="h-5 w-5" />
                Add
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
