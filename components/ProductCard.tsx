"use client";

import { useState } from "react";
import { m, useMotionValue, useTransform, useSpring } from "framer-motion";
import { Plus, Check } from "lucide-react";
import ProductImage from "@/components/ProductImage";
import MagneticButton from "@/components/MagneticButton";
import { getImageBlurDataURL } from "@/lib/image-placeholder";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { SanityProduct, urlFor, productSlug } from "@/lib/sanity";

interface ProductCardProps {
  product: SanityProduct;
  index: number;
  reveal?: boolean;
  loading?: "eager" | "lazy";
  tilt?: boolean;
  sizes?: string;
}

export default function ProductCard({ product, index, reveal = true, loading = "lazy", tilt = true, sizes = "(max-width: 639px) 100vw, (max-width: 1279px) 50vw, 25vw" }: ProductCardProps) {
  const { addToCart, setFlyingImage } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), {
    stiffness: 300,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), {
    stiffness: 300,
    damping: 30,
  });

  const isBestSeller = product.badge === "Best Seller" || product.isBestSeller === true;
  const slug = productSlug(product);

  const imageSrc =
    typeof product.image === "string"
      ? product.image
      : urlFor(product.image).width(400).height(400).url();

  const handleAdd = () => {
    addToCart(product, 1, false);
    setFlyingImage(imageSrc);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1600);
  };

  return (
    <m.div
      data-product-card
      style={{
        rotateX: tilt ? rotateX : 0,
        rotateY: tilt ? rotateY : 0,
        transformPerspective: tilt ? 1000 : 0,
        boxShadow: "0 6px 24px rgba(62,39,35,0.08)",
      }}
      onMouseMove={(event) => {
        if (!tilt) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        mouseX.set((event.clientX - bounds.left) / bounds.width - 0.5);
        mouseY.set((event.clientY - bounds.top) / bounds.height - 0.5);
      }}
      onMouseLeave={() => {
        mouseX.set(0);
        mouseY.set(0);
      }}
      whileHover={{ scale: 1.02, boxShadow: "0 12px 32px rgba(46,125,50,0.18)" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="h-full rounded-2xl"
    >
      <m.article
        initial={reveal ? { opacity: 0, y: 24 } : false}
        animate={reveal ? undefined : { opacity: 1, y: 0 }}
        whileInView={reveal ? { opacity: 1, y: 0 } : undefined}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ type: "spring", stiffness: 120, damping: 18, delay: (index % 4) * 0.06 }}
        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#F0E2C4] bg-white"
      >
        <div className="relative aspect-square w-full overflow-hidden bg-white">
          <Link href={`/products/${slug}`} className="block h-full w-full">
            <ProductImage
              src={imageSrc}
              blurDataURL={getImageBlurDataURL(product)}
              alt={product.name}
              width={400}
              height={400}
              quality={80}
              sizes={sizes}
              className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
              loading={loading}
            />
          </Link>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#2E7D32]/25 via-transparent to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100"
          />

          {isBestSeller && (
            <span className="absolute left-3 top-3 rounded-full bg-[#FFC107] px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide text-[#3E2723] shadow-sm">
              {product.badge ?? "Best Seller"}
            </span>
          )}

          <MagneticButton
            type="button"
            onClick={handleAdd}
            aria-label={`Quick add ${product.name} to cart`}
            className="absolute inset-x-0 bottom-0 flex h-12 w-full translate-y-full items-center justify-center gap-2 bg-[#2E7D32] text-sm font-semibold text-white transition-[translate] duration-300 group-hover:translate-y-0 group-focus-within:translate-y-0 [@media(hover:none)]:translate-y-0 hover:bg-[#256329] focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-white"
          >
            {justAdded ? <Check aria-hidden="true" className="h-5 w-5" /> : <Plus aria-hidden="true" className="h-5 w-5" />}
            <span aria-live="polite">{justAdded ? "Added" : "Quick Add"}</span>
          </MagneticButton>
        </div>

        <div className="flex flex-1 flex-col p-5">
          <h3 className="font-heading mt-2 line-clamp-2 min-h-[3.5rem] text-lg font-semibold leading-snug text-[#2E7D32]">
            <Link href={`/products/${slug}`}>{product.name}</Link>
          </h3>

          <div className="mt-1 flex items-baseline gap-2">
            <p className="text-xl font-bold text-[#C2410C]">₹{product.price}</p>
            {product.originalPrice && (
              <p className="text-sm text-[#3E2723]/75 line-through">₹{product.originalPrice}</p>
            )}
          </div>

          <p className="mt-1 flex-1 text-sm leading-relaxed text-[#3E2723]/75 line-clamp-2">
            {product.shortDescription || product.description}
          </p>
        </div>
      </m.article>
    </m.div>
  );
}
