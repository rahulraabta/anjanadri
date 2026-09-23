"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Info, ShieldCheck, Heart, Zap, Award, Check } from "lucide-react";
import type { Product, NutrientInsight } from "@/data/products";

interface NutritionalInsightsProps {
  product: Product;
}

const fallbackNutrients: NutrientInsight[] = [
  {
    name: "Active Vitamin C",
    amount: "35% DV",
    benefit: "Boosts Immunity & Skin Collagen",
    description: "Bioactive ascorbic acid preserved without thermal degradation, supporting white blood cell activity and youthful cellular elasticity.",
  },
  {
    name: "Dietary Plant Fiber",
    amount: "4.5 g",
    benefit: "Prebiotic Gut Harmony",
    description: "Intact cellulose and soluble pectin slow glucose release, supporting steady all-day vitality and nourishing healthy gut flora.",
  },
  {
    name: "Added Sugars",
    amount: "0.0 g",
    benefit: "Zero Blood Sugar Crashes",
    description: "Only whole-harvest fructose stabilized inside the intact fruit cellular wall. Never candied, never sweetened.",
  },
  {
    name: "Antioxidant Polyphenols",
    amount: "Rich Matrix",
    benefit: "Neutralizes Cellular Stress",
    description: "Plant flavonoids and phytochemicals that defend cells against oxidation and post-workout physical stress.",
  },
];

export default function NutritionalInsights({ product }: NutritionalInsightsProps) {
  const [activeNutrient, setActiveNutrient] = useState<NutrientInsight | null>(null);
  const [showComparison, setShowComparison] = useState(false);

  const nutrients = product.nutrients && product.nutrients.length > 0
    ? product.nutrients
    : fallbackNutrients;

  return (
    <div className="mt-8 rounded-[2.25rem] border border-[#EDE5D8] bg-[#F7F3EB] p-6 sm:p-8 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#EDE5D8] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#B85D3B]/15 text-[#B85D3B]">
              <Sparkles className="h-3.5 w-3.5" />
            </span>
            <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#4A2E1B]">
              Intelligent Health Insights
            </h3>
          </div>
          <p className="text-xs text-[#8C7A6B] mt-1">
            Tap or hover any nutrient tile to explore how 48h slow dehydration benefits your body
          </p>
        </div>

        <button
          onClick={() => setShowComparison(!showComparison)}
          className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-full border border-[#EDE5D8] bg-[#FDFBF7] px-3.5 py-1.5 text-xs font-semibold text-[#4A2E1B] transition-colors hover:border-[#4A2E1B] hover:bg-[#4A2E1B] hover:text-[#FDFBF7]"
        >
          <Award className="h-3.5 w-3.5 text-[#B85D3B]" />
          <span>{showComparison ? "View Nutrients" : "Compare vs Standard Snacks"}</span>
        </button>
      </div>

      {!showComparison ? (
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
                      ? "border-[#B85D3B] bg-[#FDFBF7] shadow-md ring-2 ring-[#B85D3B]/20 -translate-y-0.5"
                      : "border-[#EDE5D8] bg-[#FDFBF7]/90 hover:border-[#6E7D60] hover:bg-[#FDFBF7] hover:shadow-xs"
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] text-[#8C7A6B] mb-1">
                    <span className="font-medium truncate">{item.name}</span>
                    <Info className={`h-3 w-3 flex-shrink-0 transition-colors ${
                      isSelected ? "text-[#B85D3B]" : "text-[#8C7A6B] group-hover:text-[#4A2E1B]"
                    }`} />
                  </div>
                  <p className="font-heading text-xl sm:text-2xl font-bold text-[#4A2E1B]">
                    {item.amount}
                  </p>
                  <span className="mt-1 block text-[10px] font-semibold text-[#6E7D60] truncate">
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
                  className="rounded-2xl border border-[#B85D3B]/30 bg-[#FDFBF7] p-4 shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-[#B85D3B]/10 text-[#B85D3B]">
                      <Heart className="h-4 w-4" />
                    </span>
                    <div>
                      <div className="flex items-baseline gap-2">
                        <h4 className="font-heading font-bold text-sm text-[#4A2E1B]">
                          {activeNutrient.name} ({activeNutrient.amount}):
                        </h4>
                        <span className="text-xs font-semibold text-[#B85D3B]">
                          {activeNutrient.benefit}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-[#6B584C] leading-relaxed">
                        {activeNutrient.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="flex items-center gap-2 rounded-2xl border border-dashed border-[#EDE5D8] p-4 text-xs text-[#8C7A6B] bg-[#FDFBF7]/60">
                  <Info className="h-4 w-4 text-[#B85D3B] flex-shrink-0" />
                  <span>
                    Hover or click any metric above to see clinically grounded explanations of why this whole food ingredient supports long-term vitality.
                  </span>
                </div>
              )}
            </AnimatePresence>
          </div>
        </>
      ) : (
        /* Comparison Table */
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 rounded-2xl border border-[#EDE5D8] bg-[#FDFBF7] p-5"
        >
          <div className="grid grid-cols-3 gap-2 text-xs font-bold text-[#4A2E1B] border-b border-[#EDE5D8] pb-3">
            <span>Metric</span>
            <span className="text-[#B85D3B]">Anjanadri Crisps</span>
            <span className="text-[#8C7A6B]">Commercial Chips</span>
          </div>

          <div className="divide-y divide-[#EDE5D8] text-xs">
            <div className="grid grid-cols-3 gap-2 py-3 items-center">
              <span className="font-medium text-[#4A2E1B]">Added Sugars / Syrups</span>
              <span className="font-bold text-[#6E7D60] flex items-center gap-1">
                <Check className="h-3.5 w-3.5 text-[#6E7D60]" /> 0.0 g (None)
              </span>
              <span className="text-[#8C7A6B]">12g - 18g Added Cane/Corn</span>
            </div>

            <div className="grid grid-cols-3 gap-2 py-3 items-center">
              <span className="font-medium text-[#4A2E1B]">Nutrient Retention</span>
              <span className="font-bold text-[#B85D3B]">97% (42°C slow-dry)</span>
              <span className="text-[#8C7A6B]">&lt; 30% (high-temp fry)</span>
            </div>

            <div className="grid grid-cols-3 gap-2 py-3 items-center">
              <span className="font-medium text-[#4A2E1B]">Industrial Seed Oils</span>
              <span className="font-bold text-[#6E7D60] flex items-center gap-1">
                <Check className="h-3.5 w-3.5 text-[#6E7D60]" /> Zero (Oil-Free or Avocado)
              </span>
              <span className="text-[#8C7A6B]">Palm / Canola High-Heat Blend</span>
            </div>

            <div className="grid grid-cols-3 gap-2 py-3 items-center">
              <span className="font-medium text-[#4A2E1B]">Preservatives / Sulfites</span>
              <span className="font-bold text-[#6E7D60] flex items-center gap-1">
                <Check className="h-3.5 w-3.5 text-[#6E7D60]" /> 100% Free
              </span>
              <span className="text-[#8C7A6B]">Sulfur Dioxide &amp; BHT</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Footer Promise Note */}
      <div className="mt-4 flex items-center gap-2 text-[11px] text-[#8C7A6B]">
        <ShieldCheck className="h-3.5 w-3.5 text-[#6E7D60] flex-shrink-0" />
        <span>
          Cold-crafted at low temperatures below 42°C to prevent thermal destruction of enzymes and antioxidants.
        </span>
      </div>
    </div>
  );
}
