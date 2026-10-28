"use client";

import Image from "next/image";
import { Check, ShoppingBag } from "lucide-react";
import { urlFor, type SanityProduct } from "@/lib/sanity";

interface MobileStickyCartProps {
  product: SanityProduct;
  quantity: number;
  onAddToCart: () => void;
  added?: boolean;
}

export default function MobileStickyCart({ product, quantity, onAddToCart, added = false }: MobileStickyCartProps) {
  const imageSrc = typeof product.image === "string"
    ? product.image
    : urlFor(product.image).width(96).height(96).fit("crop").auto("format").url();
  const unavailable = product.inStock === false;

  return (
    <aside aria-label="Quick add to cart" className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#F0E2C4] bg-white pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_20px_rgba(62,39,35,0.08)] md:hidden">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
        <Image src={imageSrc} alt="" width={48} height={48} loading="lazy" unoptimized className="h-12 w-12 shrink-0 rounded-xl bg-gray-100 object-cover" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-[#3E2723]">{product.name}</p>
          <p className="text-sm font-bold text-[#2E7D32]">
            &#8377;{(product.price * quantity).toFixed(0)}
            {quantity > 1 && <span className="ml-1.5 text-xs font-normal text-[#3E2723]/55">{quantity} items</span>}
          </p>
        </div>
        <button
          type="button"
          onClick={onAddToCart}
          disabled={unavailable}
          aria-label={unavailable ? `Sold Out: ${product.name}` : `${added ? "Added" : "Add to Cart"}: ${quantity} ${product.name}`}
          className="flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-[#2E7D32] px-4 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#1B5E20] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2E7D32] disabled:cursor-not-allowed disabled:bg-[#F0E2C4] disabled:text-[#3E2723]/55 disabled:active:scale-100"
        >
          {added ? <Check aria-hidden="true" className="h-4 w-4" /> : <ShoppingBag aria-hidden="true" className="h-4 w-4" />}
          <span aria-live="polite">{unavailable ? "Sold Out" : added ? "Added" : "Add to Cart"}</span>
        </button>
      </div>
    </aside>
  );
}
