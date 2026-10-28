"use client";

import { useState } from "react";
import { m, useReducedMotion } from "framer-motion";
import { ShoppingBag, Check, Leaf, Sun, ShieldCheck } from "lucide-react";
import ProductImage from "@/components/ProductImage";
import ScrollReveal from "@/components/ScrollReveal";
import MagneticButton from "@/components/MagneticButton";
import { getImageBlurDataURL } from "@/lib/image-placeholder";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { SanityProduct, urlFor } from "@/lib/sanity";
import styles from "./Hero.module.css";

const MotionLink = m.create(Link);
const meshLayers = [
  {
    className: "-left-1/4 -top-1/4 bg-[radial-gradient(ellipse_at_center,#DDECD5_0%,transparent_70%)]",
    x: [0, 35, -20, 0],
    y: [0, -20, 25, 0],
    scale: [1, 1.15, 0.95, 1],
  },
  {
    className: "-right-1/4 top-1/4 bg-[radial-gradient(ellipse_at_center,#FFE3CA_0%,transparent_70%)]",
    x: [0, -30, 20, 0],
    y: [0, 25, -20, 0],
    scale: [1, 0.95, 1.2, 1],
  },
  {
    className: "-bottom-1/4 left-1/4 bg-[radial-gradient(ellipse_at_center,#FFF3D6_0%,transparent_70%)]",
    x: [0, 25, -30, 0],
    y: [0, -30, 15, 0],
    scale: [1, 1.2, 1.05, 1],
  },
];

const imgUrl = (img: SanityProduct["image"], w = 1600) =>
  typeof img === "string" ? img : urlFor(img).width(w).url();

interface HeroProps {
  products: SanityProduct[];
}

export default function Hero({ products }: HeroProps) {
  const { addToCart } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const reducedMotion = useReducedMotion();

  const stickyBanana =
    products.find((p) => p.badge === "Best Seller") ??
    products.find((p) => p.slug === "sticky-banana") ??
    products[0];

  if (!stickyBanana) return null;

  const handleAdd = () => {
    addToCart(stickyBanana, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#fdfbf7] to-white">
      <div className="relative mx-auto w-full max-w-7xl px-5 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <ScrollReveal
            className="relative order-1 -mx-4 sm:mx-0 lg:order-2"
          >
            <div className="relative overflow-hidden bg-white lg:rounded-[2rem] lg:border lg:border-[#F0E2C4] lg:shadow-[0_24px_60px_-20px_rgba(62,39,35,0.25)]">
              <ProductImage
                src={imgUrl(stickyBanana.image, 1600)}
                blurDataURL={getImageBlurDataURL(stickyBanana)}
                alt={`Anjanadri ${stickyBanana.name} — dehydrated banana with nuts and seeds`}
                width={1600}
                height={873}
                quality={80}
                sizes="(max-width: 1023px) 100vw, (max-width: 1280px) 50vw, 584px"
                className="h-auto w-full object-cover"
                priority
              />

              <span className="absolute left-4 top-4 rounded-full bg-[#FFC107] px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider text-[#3E2723] shadow-md sm:left-6 sm:top-6">
                &#9733; Best Seller
              </span>

              <span className={`${styles.naturalBadge} pointer-events-none absolute right-4 top-4 inline-flex items-center gap-2 rounded-2xl border border-white/80 bg-[#F1F8E9]/95 px-3 py-2 text-xs font-semibold text-[#2E7D32] shadow-lg sm:right-6 sm:top-6`}>
                <Leaf className="h-4 w-4" aria-hidden="true" />
                100% Natural
              </span>

              <div className="absolute bottom-4 right-4 rounded-2xl bg-white/95 px-4 py-2.5 shadow-lg backdrop-blur-md sm:bottom-6 sm:right-6">
                <p className="text-[11px] font-medium text-[#3E2723]/70">
                  Dehydrated &bull; No added sugar
                </p>
                <p className="mt-1 flex items-center gap-1 text-xs font-bold text-[#2E7D32]">
                  <Leaf className="h-3.5 w-3.5" aria-hidden />
                  {stickyBanana.benefit}
                </p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal className="relative isolate order-2 flex w-full flex-col items-start lg:order-1">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-3xl bg-gradient-to-br from-[#FFF8E7] via-[#F1F8E9] to-[#FFF1E6]"
            >
              {meshLayers.map(({ className, x, y, scale }) => (
                <m.div
                  key={className}
                  className={`absolute h-3/4 w-3/4 blur-3xl ${className}`}
                  initial={{ x: 0, y: 0, scale: 1 }}
                  animate={reducedMotion ? { x: 0, y: 0, scale: 1 } : { x, y, scale }}
                  transition={{ duration: reducedMotion ? 0 : 20, repeat: reducedMotion ? 0 : Infinity, ease: "easeInOut" }}
                />
              ))}
              <div className="absolute inset-0 bg-[#FFF8E7]/60" />
            </div>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#2E7D32]/20 bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[#2E7D32]">
              <Leaf className="h-3.5 w-3.5" />
              Flagship Product
            </span>

            <h1 className={`${styles.headline} font-heading mt-4 text-3xl font-bold leading-[1.15] tracking-tight text-[#2E7D32] sm:text-5xl sm:leading-tight`}>
              Our Best-Selling Sticky Banana
            </h1>
            <p className={`${styles.subheadline} mt-3 text-lg font-semibold text-[#C2410C] sm:text-xl`}>
              100% Natural, No Preservatives, Dehydrated &amp; Natural
            </p>
            <p className="mt-3 max-w-lg text-base leading-relaxed text-[#3E2723]/80 line-clamp-2 sm:line-clamp-none">
              Naturally sweet Mysore bananas, slow dehydrated to a chewy golden bite and
              topped with nuts and seeds. No sugar, no chemicals — just farm-fresh
              goodness in every pack.
            </p>

            <div className="mb-8 mt-6 flex flex-wrap items-baseline gap-3">
              <span className="font-heading text-4xl font-bold text-[#3E2723]">
                &#8377;{stickyBanana.price}
              </span>
              {stickyBanana.originalPrice && (
                <span className="text-lg text-[#3E2723]/45 line-through">
                  &#8377;{stickyBanana.originalPrice}
                </span>
              )}
              {stickyBanana.weight && (
                <span className="rounded-full bg-[#2E7D32]/10 px-3 py-1 text-xs font-bold text-[#2E7D32]">
                  {stickyBanana.weight} pack
                </span>
              )}
            </div>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <MotionLink
                href={`/products/${stickyBanana.slug}`}
                whileTap={{ scale: 0.97 }}
                className="inline-flex h-14 w-full items-center justify-center rounded-full bg-[#F57C00] px-8 py-3.5 text-base font-bold text-white shadow-[0_10px_24px_-6px_rgba(245,124,0,0.5)] transition-all hover:-translate-y-0.5 hover:bg-[#E65100] active:translate-y-0 active:scale-[0.98] sm:w-auto"
              >
                Shop Now
              </MotionLink>
              <MagneticButton
                type="button"
                onClick={handleAdd}
                whileTap={{ scale: 0.97 }}
                className={`inline-flex h-14 w-full items-center justify-center gap-2 rounded-full border-2 px-7 py-3.5 text-base font-bold transition-colors active:scale-[0.98] sm:w-auto ${
                  justAdded
                    ? "border-[#2E7D32] bg-[#2E7D32] text-white"
                    : "border-[#2E7D32] text-[#2E7D32] hover:bg-[#2E7D32] hover:text-white"
                }`}
              >
                {justAdded ? <Check className="h-5 w-5" /> : <ShoppingBag className="h-5 w-5" />}
                {justAdded ? "Added to Cart" : "Add to Cart"}
              </MagneticButton>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 px-4 pt-6 text-xs font-semibold text-[#3E2723]/70 lg:justify-start lg:px-0">
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
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
