"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Info, ShieldCheck, Heart, Zap, Check } from "lucide-react";
import type { Product, NutrientInsight } from "@/data/products";

interface NutritionalInsightsProps {
  product: Product;
}

const fallbackNutrients: NutrientInsight[] = [
  {
    name: "Active Vitamin C",
    amount: "35% DV",
    benefit: "Vitamin C for Skin Vitality",
    description: "Bioactive ascorbic acid preserved without thermal degradation. Vitamin C contributes to normal collagen formation.",
  },
  {
    name: "Dietary Plant Fiber",
    amount: "4.5 g",
    benefit: "Natural Plant Fiber",
    description: "Intact cellulose and soluble pectin from whole fruit, with no added sugars.",
  },
  {
    name: "Added Sugars",
    amount: "0.0 g",
    benefit: "No Added Sugars",
    description: "Only naturally occurring fruit sugars in the intact cellular wall. Never candied, never sweetened.",
  },
  {
    name: "Antioxidant Polyphenols",
    amount: "Rich Matrix",
    benefit: "Natural Antioxidants",
    description: "Plant flavonoids and phytochemicals preserved by low-temperature dehydration.",
  },
];

export default function NutritionalInsights({ product }: NutritionalInsightsProps) {
  const [activeNutrient, setActiveNutrient] = useState<NutrientInsight | null>(null);

  const nutrients = product.nutrients && product.nutrients.length > 0
    ? product.nutrients
    : fallbackNutrients;

  return (
    <div className="mt-8 rounded-[2.25rem] border border-[#F0E2C4] bg-[#FFF3D6] p-6 sm:p-8 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#F0E2C4] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#F57C00]/15 text-[#C2410C]">
              <Sparkles className="h-3.5 w-3.5" />
            </span>
            <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#3E2723]">
              Intelligent Health Insights
            </h3>
          </div>
          <p className="text-xs text-[#3E2723]/55 mt-1">
            Tap or hover any nutrient tile to explore how slow dehydration preserves the goodness of whole fruit
          </p>
        </div>

        <button
          onClick={() => setActiveNutrient(null)}
          className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-full border border-[#F0E2C4] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#3E2723] transition-colors hover:border-[#3E7D32] hover:bg-[#3E7D32] hover:text-[#FFF8E7]"
        >
          <Check className="h-3.5 w-3.5 text-[#C2410C]" />
          <span>Reset Selection</span>
        </button>
      </div>

      {(
        <>
          {/* Interactive Tiles */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {nutrients.map((item) => {
              const isSelected = activeNutrient?.name === item.name;
              return (
                <div
                  key={item.name}
                  onClick={() => setActiveNutrient(isSelected ? null : item)}
                  onMouseEnter={() => setActiveNutrient(item)}
                  className={`group relative cursor-pointer rounded-2xl border p-4 text-center transition-all duration-300 ${
                    isSelected
                      ? "border-[#F57C00] bg-white shadow-md ring-2 ring-[#F57C00]/20 -translate-y-0.5"
                      : "border-[#F0E2C4] bg-white/90 hover:border-[#2E7D32] hover:bg-white hover:shadow-xs"
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] text-[#3E2723]/55 mb-1">
                    <span className="font-medium truncate">{item.name}</span>
                    <Info className={`h-3 w-3 flex-shrink-0 transition-colors ${
                      isSelected ? "text-[#C2410C]" : "text-[#3E2723]/55 group-hover:text-[#3E2723]"
                    }`} />
                  </div>
                  <p className="font-heading text-xl sm:text-2xl font-bold text-[#3E2723]">
                    {item.amount}
                  </p>
                  <span className="mt-1 block text-[10px] font-semibold text-[#2E7D32] truncate">
                    {item.benefit}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Active Tooltip Details Box */}
          <div className="mt-5 min-h-[76px]">
            <AnimatePresence mode="wait">
              {activeNutrient ? (
                <motion.div
                  key={activeNutrient.name}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-2xl border border-[#F57C00]/30 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-[#F57C00]/10 text-[#C2410C]">
                      <Heart className="h-4 w-4" />
                    </span>
                    <div>
                      <div className="flex items-baseline gap-2">
                        <h4 className="font-heading font-bold text-sm text-[#3E2723]">
                          {activeNutrient.name} ({activeNutrient.amount}):
                        </h4>
                        <span className="text-xs font-semibold text-[#C2410C]">
                          {activeNutrient.benefit}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-[#3E2723]/70 leading-relaxed">
                        {activeNutrient.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="flex items-center gap-2 rounded-2xl border border-dashed border-[#F0E2C4] p-4 text-xs text-[#3E2723]/55 bg-white/60">
                  <Info className="h-4 w-4 text-[#C2410C] flex-shrink-0" />
                  <span>
                    Hover or click any metric above to see clear explanations of why this whole food ingredient supports everyday vitality.
                  </span>
                </div>
              )}
            </AnimatePresence>
          </div>
        </>
      )}

      {/* Footer Promise Note */}
      <div className="mt-4 flex items-center gap-2 text-[11px] text-[#3E2723]/55">
        <ShieldCheck className="h-3.5 w-3.5 text-[#2E7D32] flex-shrink-0" />
        <span>
          Cold-crafted at low temperatures to protect enzymes and antioxidants from heat damage.
        </span>
      </div>
    </div>
  );
}
