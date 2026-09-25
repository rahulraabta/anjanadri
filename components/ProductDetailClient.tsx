"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, ShoppingBag, Plus, Minus, ShieldCheck, Truck, Sparkles, ArrowLeft, Check, Leaf } from "lucide-react";
import type { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import ProductCard from "@/components/ProductCard";
import NutritionalInsights from "@/components/NutritionalInsights";
import FrequentlyBoughtTogether from "@/components/FrequentlyBoughtTogether";

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
  allProducts?: Product[];
}

export default function ProductDetailClient({
  product,
  relatedProducts,
  allProducts = [],
}: ProductDetailClientProps) {

  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [addedNotice, setAddedNotice] = useState(false);

  // Curate gallery image angles for rich shopping experience
  const galleryImages = [
    product.image,
    "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&q=80",
    "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=800&q=80",
  ];

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2500);
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-10 lg:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="mb-8 flex items-center gap-2 text-sm text-[#8C7A6B]">
          <Link href="/" className="hover:text-[#4A2E1B] transition-colors flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" /> Home
          </Link>
          <span>/</span>
          <Link href="/#shop" className="hover:text-[#4A2E1B] transition-colors">
            Pantry
          </Link>
          <span>/</span>
          <span className="font-medium text-[#4A2E1B] line-clamp-1">{product.name}</span>
        </nav>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Primary Main Image */}
            <div className="relative aspect-square sm:aspect-[4/3] w-full overflow-hidden rounded-[2.5rem] border border-[#EDE5D8] bg-[#F7F3EB] shadow-[0_15px_40px_rgba(74,46,27,0.06)]">
              <Image
                src={galleryImages[selectedImage] || product.image}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover transition-all duration-700 hover:scale-105"
              />

              <div className="absolute left-6 top-6 flex flex-col gap-2">
                {discount && (
                  <span className="rounded-full bg-[#B85D3B] px-3.5 py-1 text-xs font-bold text-white shadow-md">
                    Save {discount}%
                  </span>
                )}
                <span className="rounded-full border border-white/40 bg-[#4A2E1B]/80 px-3.5 py-1 text-xs font-medium text-[#FDFBF7] backdrop-blur-md">
                  100% Natural Harvest
                </span>
              </div>
            </div>

            {/* Thumbnail Navigation */}
            <div className="flex gap-4">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl border-2 transition-all ${
                    selectedImage === idx
                      ? "border-[#4A2E1B] shadow-md scale-102"
                      : "border-[#EDE5D8] opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} view ${idx + 1}`}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Intelligent Health Insights */}
            <NutritionalInsights product={product} />
          </div>

          {/* Right Column: Details, Purchasing & Benefits */}
          <div className="lg:col-span-5 flex flex-col justify-start">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6E7D60]">
              {product.category}
            </span>

            <h1 className="font-heading mt-2.5 text-3xl font-bold leading-tight text-[#4A2E1B] sm:text-4xl">
              {product.name}
            </h1>

            {/* Ratings & Reviews */}
            <div className="mt-3 flex items-center gap-3">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.round(product.rating)
                        ? "fill-[#B85D3B] text-[#B85D3B]"
                        : "fill-[#EDE5D8] text-[#EDE5D8]"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-[#4A2E1B]">{product.rating}</span>
              <span className="text-sm text-[#8C7A6B]">({product.reviewCount} verified reviews)</span>
            </div>

            {/* Price Row */}
            <div className="mt-6 flex items-baseline gap-3 border-y border-[#EDE5D8] py-4">
              <span className="font-heading text-3xl font-bold text-[#2E7D32]">
                ₹{product.price.toFixed(0)}
              </span>
              {product.originalPrice && (
                <span className="text-lg text-[#8C7A6B] line-through">
                  ₹{product.originalPrice.toFixed(0)}
                </span>
              )}
              <span className="text-xs text-[#8C7A6B]">Net Wt: {product.weight}</span>
            </div>

            {/* Full Artisanal Description */}
            <div className="mt-6 space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#8C7A6B]">Description</h3>
              <p className="text-base leading-relaxed text-[#6B584C]">
                {product.description}
              </p>
            </div>

            {/* Dietary Tags */}
            <div className="mt-6">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#8C7A6B] mb-2.5">
                Certified Integrity
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#EDE5D8] bg-[#F7F3EB] px-3.5 py-1 text-xs font-medium text-[#4A2E1B]"
                  >
                    <Leaf className="h-3 w-3 text-[#6E7D60]" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Quantity Selector & Add to Cart */}
            <div className="mt-8 space-y-4 rounded-3xl border border-[#EDE5D8] bg-[#F7F3EB] p-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[#4A2E1B]">Select Quantity</span>
                <div className="flex items-center rounded-full border border-[#EDE5D8] bg-[#FDFBF7] px-3 py-1 shadow-sm">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-1 text-[#8C7A6B] hover:text-[#4A2E1B] transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center font-heading text-sm font-bold text-[#4A2E1B]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-1 text-[#8C7A6B] hover:text-[#4A2E1B] transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex w-full items-center justify-center gap-2.5 rounded-full bg-[#4A2E1B] py-4 text-base font-semibold text-[#FDFBF7] shadow-[0_12px_28px_-8px_rgba(74,46,27,0.35)] transition-all duration-300 hover:bg-[#B85D3B] disabled:cursor-not-allowed disabled:bg-[#EDE5D8] disabled:text-[#8C7A6B]"
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
                  className="text-xl text-[#B85D3B]"
                  style={{ fontFamily: "var(--font-script, cursive)" }}
                >
                  Anjanadri — pure . healthy . delicious
                </p>
              </div>
            </div>

            {/* Reassurances list */}
            <div className="mt-8 space-y-3.5 border-t border-[#EDE5D8] pt-6 text-xs text-[#8C7A6B]">
              <div className="flex items-center gap-3">
                <Truck className="h-4 w-4 text-[#6E7D60]" />
                <span>Free delivery on orders over ₹499 • Mysore</span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-4 w-4 text-[#6E7D60]" />
                <span>Handcrafted in small batches — 100% taste guarantee</span>
              </div>
              <div className="flex items-center gap-3">
                <Sparkles className="h-4 w-4 text-[#6E7D60]" />
                <span>48-hour low-temperature dehydration preserves 97% of nutrients</span>
              </div>
            </div>
          </div>
        </div>

        {/* Frequently Bought Together Bundle Engine */}
        <FrequentlyBoughtTogether
          currentProduct={product}
          allProducts={allProducts.length > 0 ? allProducts : relatedProducts}
        />

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 border-t border-[#EDE5D8] pt-16">

            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#B85D3B]">
                  Pantry Complements
                </span>
                <h2 className="font-heading mt-2 text-3xl font-bold text-[#4A2E1B]">
                  You May Also Enjoy
                </h2>
              </div>
              <Link
                href="/#shop"
                className="text-sm font-semibold text-[#4A2E1B] hover:text-[#B85D3B] transition-colors"
              >
                View Complete Pantry &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProducts.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
