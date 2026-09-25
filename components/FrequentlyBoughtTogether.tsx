"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Check, ShoppingBag, Sparkles } from "lucide-react";
import type { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";

interface FrequentlyBoughtTogetherProps {
  currentProduct: Product;
  allProducts: Product[];
}

export default function FrequentlyBoughtTogether({
  currentProduct,
  allProducts,
}: FrequentlyBoughtTogetherProps) {
  const { addToCart } = useCart();
  const [addedAll, setAddedAll] = useState(false);

  // Find 2 best complementary products
  const complementary = allProducts.filter((p) => {
    if (p.id === currentProduct.id) return false;
    if (currentProduct.complementaryIds && currentProduct.complementaryIds.includes(p.id)) {
      return true;
    }
    // Fallback complementary pairing: pairing fruits with veggies or berries
    return p.category !== currentProduct.category && p.inStock;
  }).slice(0, 2);

  const bundleItems = [currentProduct, ...complementary];
  const [selectedIds, setSelectedIds] = useState<string[]>(bundleItems.map((b) => b.id));

  const toggleItem = (id: string) => {
    if (id === currentProduct.id) return; // Keep primary product selected
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectedProducts = bundleItems.filter((b) => selectedIds.includes(b.id));
  const rawTotal = selectedProducts.reduce((sum, item) => sum + item.price, 0);
  // 10% bundle incentive discount if 2 or more products are bundled
  const hasBundleDiscount = selectedProducts.length >= 2;
  const bundleDiscountRate = hasBundleDiscount ? 0.10 : 0;
  const finalTotal = rawTotal * (1 - bundleDiscountRate);
  const totalSaved = rawTotal - finalTotal;

  const handleAddBundle = () => {
    selectedProducts.forEach((p) => {
      addToCart(p, 1);
    });
    setAddedAll(true);
    setTimeout(() => setAddedAll(false), 2200);
  };

  if (complementary.length === 0) return null;

  return (
    <div className="mt-16 rounded-[2.5rem] border border-[#EDE5D8] bg-[#F7F3EB]/80 p-6 sm:p-10 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-[#EDE5D8] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#B85D3B]/15 text-[#B85D3B]">
              <Sparkles className="h-3.5 w-3.5" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B85D3B]">
              Artisanal Flavor Pairing
            </span>
          </div>
          <h3 className="font-heading mt-1 text-2xl sm:text-3xl font-bold text-[#4A2E1B]">
            Frequently Enjoyed Together
          </h3>
        </div>

        {hasBundleDiscount && (
          <span className="self-start sm:self-auto rounded-full bg-[#6E7D60] px-3.5 py-1 text-xs font-bold text-white shadow-xs">
            Save 10% on This Bundle
          </span>
        )}
      </div>

      <div className="mt-8 flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* Products Visual Bundle Row */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          {bundleItems.map((item, idx) => {
            const isSelected = selectedIds.includes(item.id);
            const isMain = item.id === currentProduct.id;

            return (
              <div key={item.id} className="flex items-center gap-4 sm:gap-6">
                <div
                  onClick={() => toggleItem(item.id)}
                  className={`group relative flex flex-col items-center p-3 rounded-2xl border transition-all duration-300 ${
                    isSelected
                      ? "border-[#4A2E1B] bg-[#FDFBF7] shadow-sm"
                      : "border-[#EDE5D8] bg-[#FDFBF7]/60 opacity-60 hover:opacity-100"
                  } ${!isMain ? "cursor-pointer" : ""}`}
                >
                  <div className="relative h-24 w-24 sm:h-28 sm:w-28 overflow-hidden rounded-xl bg-[#F7F3EB]">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="112px"
                      className="object-cover"
                    />
                    {isMain && (
                      <span className="absolute left-1.5 top-1.5 rounded-md bg-[#4A2E1B] px-1.5 py-0.5 text-[9px] font-bold text-white">
                        This Item
                      </span>
                    )}
                  </div>

                  <p className="mt-2 text-xs font-bold text-[#4A2E1B] max-w-[110px] text-center truncate">
                    {item.name}
                  </p>
                  <p className="text-xs font-semibold text-[#F57C00] mt-0.5">
                    ₹{item.price.toFixed(0)}
                  </p>

                  <div className="mt-2 flex items-center gap-1.5 text-[11px] text-[#6B584C]">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      disabled={isMain}
                      onChange={() => toggleItem(item.id)}
                      className="h-3.5 w-3.5 rounded text-[#B85D3B] focus:ring-[#B85D3B]"
                    />
                    <span className="text-[10px] font-medium">
                      {isMain ? "Required" : isSelected ? "Included" : "Add item"}
                    </span>
                  </div>
                </div>

                {idx < bundleItems.length - 1 && (
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EDE5D8] text-[#4A2E1B] font-bold text-sm">
                    +
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Pricing & Add Bundle Action */}
        <div className="flex flex-col items-center lg:items-end rounded-2xl border border-[#EDE5D8] bg-[#FDFBF7] p-6 text-center lg:text-right min-w-[240px] shadow-sm">
          <span className="text-xs text-[#8C7A6B]">
            Bundle Total ({selectedProducts.length} items):
          </span>

          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-heading text-3xl font-extrabold text-[#4A2E1B]">
              ₹{finalTotal.toFixed(0)}
            </span>
            {hasBundleDiscount && (
              <span className="text-sm text-[#8C7A6B] line-through">
                ₹{rawTotal.toFixed(0)}
              </span>
            )}
          </div>

          {hasBundleDiscount && (
            <p className="mt-1 text-xs font-semibold text-[#6E7D60]">
              You save ₹{totalSaved.toFixed(0)} (10% off)
            </p>
          )}

          <button
            onClick={handleAddBundle}
            className={`mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full py-3.5 px-6 text-xs font-bold text-[#FDFBF7] shadow-sm transition-all duration-300 ${
              addedAll
                ? "bg-[#6E7D60]"
                : "bg-[#4A2E1B] hover:bg-[#B85D3B]"
            }`}
          >
            {addedAll ? (
              <>
                <Check className="h-4 w-4" /> Bundle Added to Basket!
              </>
            ) : (
              <>
                <ShoppingBag className="h-4 w-4" /> Add Bundle to Basket
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
