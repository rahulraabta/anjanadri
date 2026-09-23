"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { products as fallbackProducts, type Product } from "@/data/products";
import ProductCard from "./ProductCard";
import { Sparkles, Search, X, SlidersHorizontal, ArrowUpDown, Filter, RotateCcw } from "lucide-react";

const categories = [
  "All",
  "Fruit Chips",
  "Vegetable Chips",
  "Dried Fruit",
  "Freeze-Dried Fruit",
];

const dietaryTags = [
  "All Diets",
  "No Added Sugar",
  "Vegan",
  "Gluten-Free",
  "Keto-Friendly",
  "Paleo",
];

// Smart intent dictionary mapping user search terminology to database filters
const INTENT_MAPPINGS: Record<string, { tag?: string; category?: string; label: string }> = {
  "sugar-free": { tag: "No Added Sugar", label: "No Added Sugar" },
  "sugarfree": { tag: "No Added Sugar", label: "No Added Sugar" },
  "sugar free": { tag: "No Added Sugar", label: "No Added Sugar" },
  "zero sugar": { tag: "No Added Sugar", label: "No Added Sugar" },
  "no sugar": { tag: "No Added Sugar", label: "No Added Sugar" },
  "unsweetened": { tag: "No Added Sugar", label: "No Added Sugar" },
  "vegan": { tag: "Vegan", label: "100% Vegan" },
  "plant-based": { tag: "Vegan", label: "Plant-Based" },
  "plant based": { tag: "Vegan", label: "Plant-Based" },
  "gluten-free": { tag: "Gluten-Free", label: "Gluten-Free" },
  "gluten free": { tag: "Gluten-Free", label: "Gluten-Free" },
  "celiac": { tag: "Gluten-Free", label: "Gluten-Free" },
  "keto": { tag: "Keto-Friendly", label: "Keto-Friendly" },
  "low carb": { tag: "Keto-Friendly", label: "Keto-Friendly" },
  "paleo": { tag: "Paleo", label: "Paleo-Friendly" },
  "raw": { tag: "Raw", label: "Raw Harvest" },
  "chips": { category: "Fruit Chips", label: "Artisanal Chips" },
  "crisps": { category: "Vegetable Chips", label: "Crisps" },
  "berries": { category: "Freeze-Dried Fruit", label: "Berry Harvest" },
};

export default function ProductGrid() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeDiet, setActiveDiet] = useState("All Diets");
  const [searchQuery, setSearchQuery] = useState("");
  const [detectedIntent, setDetectedIntent] = useState<{ tag?: string; category?: string; label: string } | null>(null);
  const [sortBy, setSortBy] = useState<"featured" | "rating" | "price-asc" | "price-desc">("featured");
  const [productList, setProductList] = useState<Product[]>(fallbackProducts);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch("/api/products");
        if (res.ok) {
          const data = await res.json();
          if (data.products && Array.isArray(data.products) && data.products.length > 0) {
            setProductList(data.products);
          }
        }
      } catch (err) {
        console.error("Failed to load products from API, staying on fallback data:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadProducts();
  }, []);

  // Intent parsing effect: analyzes query as user types
  useEffect(() => {
    const trimmed = searchQuery.trim().toLowerCase();
    if (!trimmed) {
      setDetectedIntent(null);
      return;
    }

    let match: { tag?: string; category?: string; label: string } | null = null;
    for (const [key, mapping] of Object.entries(INTENT_MAPPINGS)) {
      if (trimmed.includes(key)) {
        match = mapping;
        break;
      }
    }
    setDetectedIntent(match);
  }, [searchQuery]);

  // Combined smart filtering & sorting
  const filteredProducts = useMemo(() => {
    return productList.filter((product) => {
      // Category filter
      if (activeCategory !== "All" && product.category !== activeCategory) {
        return false;
      }

      // Dietary filter
      if (activeDiet !== "All Diets") {
        if (!product.tags || !product.tags.some((t) => t.toLowerCase() === activeDiet.toLowerCase())) {
          return false;
        }
      }

      // Applied intent filter
      if (detectedIntent?.tag) {
        const hasTag = product.tags && product.tags.some((t) =>
          t.toLowerCase().includes(detectedIntent.tag!.toLowerCase())
        );
        if (!hasTag) return false;
      }

      // Text search matching (name, description, tags, category, flavor)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        // If the entire query is purely the intent term, let the intent filter handle it
        const isPureIntent = detectedIntent && searchQuery.trim().toLowerCase() === Object.keys(INTENT_MAPPINGS).find(k => k === searchQuery.trim().toLowerCase());
        
        if (!isPureIntent) {
          const nameMatch = product.name.toLowerCase().includes(q);
          const descMatch = product.description.toLowerCase().includes(q);
          const tagMatch = product.tags && product.tags.some((t) => t.toLowerCase().includes(q));
          const catMatch = product.category.toLowerCase().includes(q);
          const flavorMatch = product.flavorProfile?.toLowerCase().includes(q);

          if (!nameMatch && !descMatch && !tagMatch && !catMatch && !flavorMatch) {
            return false;
          }
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      return 0; // featured default
    });
  }, [productList, activeCategory, activeDiet, detectedIntent, searchQuery, sortBy]);

  const handleResetFilters = () => {
    setActiveCategory("All");
    setActiveDiet("All Diets");
    setSearchQuery("");
    setDetectedIntent(null);
    setSortBy("featured");
  };

  return (
    <section id="shop" className="relative bg-[#F7F3EB] py-20 lg:py-28 border-t border-[#EDE5D8]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#B85D3B]">
              <Sparkles className="h-3.5 w-3.5" />
              <span>The Anjanadri Artisanal Pantry</span>
            </div>
            <h2 className="font-heading mt-2.5 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#4A2E1B]">
              Real Whole Food. Nothing Else.
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-[#6B584C]">
              Slow-dried for 48 hours below 42&deg;C with zero refined sugars, sulfites, or artificial additives.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-2 rounded-full border border-[#EDE5D8] bg-[#FDFBF7] px-4 py-2 text-xs font-semibold text-[#4A2E1B] shadow-xs">
            <span className="h-2 w-2 rounded-full bg-[#6E7D60] animate-pulse" />
            <span>Showing {filteredProducts.length} Artisanal Varieties</span>
          </div>
        </div>

        {/* Intelligent Search & Filter Toolbar */}
        <div className="mt-10 rounded-[2rem] border border-[#EDE5D8] bg-[#FDFBF7] p-5 sm:p-6 shadow-[0_8px_30px_rgba(74,46,27,0.04)]">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-center">
            {/* Intelligent Search Input */}
            <div className="relative lg:col-span-6">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8C7A6B]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder='Search "sugar-free", "mango", "kale", or "vegan"...'
                className="w-full rounded-full border border-[#EDE5D8] bg-[#F7F3EB]/60 py-3.5 pl-11 pr-10 text-sm text-[#4A2E1B] placeholder:text-[#8C7A6B] focus:border-[#B85D3B] focus:bg-[#FDFBF7] focus:outline-none transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8C7A6B] hover:text-[#4A2E1B] p-1"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Dietary Tags Dropdown / Filter */}
            <div className="flex items-center gap-2 lg:col-span-3">
              <Filter className="h-4 w-4 text-[#8C7A6B] flex-shrink-0" />
              <select
                value={activeDiet}
                onChange={(e) => setActiveDiet(e.target.value)}
                aria-label="Filter by dietary preference"
                className="w-full rounded-full border border-[#EDE5D8] bg-[#F7F3EB]/60 py-3.5 px-4 text-xs font-semibold text-[#4A2E1B] focus:border-[#B85D3B] focus:outline-none transition-colors"
              >
                {dietaryTags.map((diet) => (
                  <option key={diet} value={diet}>
                    {diet}
                  </option>
                ))}
              </select>
            </div>

            {/* Sorting Dropdown */}
            <div className="flex items-center gap-2 lg:col-span-3">
              <ArrowUpDown className="h-4 w-4 text-[#8C7A6B] flex-shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Sort products"
                className="w-full rounded-full border border-[#EDE5D8] bg-[#F7F3EB]/60 py-3.5 px-4 text-xs font-semibold text-[#4A2E1B] focus:border-[#B85D3B] focus:outline-none transition-colors"
              >
                <option value="featured">Sort: Featured Pantry</option>
                <option value="rating">Sort: Highest Rated</option>
                <option value="price-asc">Sort: Price Low to High</option>
                <option value="price-desc">Sort: Price High to Low</option>
              </select>
            </div>
          </div>

          {/* Intelligent Intent Feedback Banner */}
          <AnimatePresence>
            {detectedIntent && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 flex items-center justify-between overflow-hidden rounded-xl border border-[#B85D3B]/30 bg-[#B85D3B]/10 px-4 py-2.5 text-xs text-[#B85D3B]"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  <span>
                    Intelligent Intent Detected: Automatically filtering for{" "}
                    <strong>&ldquo;{detectedIntent.label}&rdquo;</strong> whole foods.
                  </span>
                </div>
                <button
                  onClick={() => setSearchQuery("")}
                  className="font-bold underline hover:text-[#4A2E1B] transition-colors text-[11px]"
                >
                  Clear
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Category Filter Pills */}
          <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-[#EDE5D8] pt-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#8C7A6B] mr-2">
              Categories:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition-all duration-300 ${
                  activeCategory === cat
                    ? "bg-[#4A2E1B] text-[#FDFBF7] shadow-xs"
                    : "border border-[#EDE5D8] bg-[#FDFBF7] text-[#6B584C] hover:border-[#6E7D60] hover:text-[#4A2E1B]"
                }`}
              >
                {cat}
              </button>
            ))}

            {(activeCategory !== "All" || activeDiet !== "All Diets" || searchQuery) && (
              <button
                onClick={handleResetFilters}
                className="ml-auto inline-flex items-center gap-1.5 text-xs font-semibold text-[#B85D3B] hover:underline"
              >
                <RotateCcw className="h-3 w-3" /> Reset All
              </button>
            )}
          </div>
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length > 0 ? (
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        ) : (
          /* Empty Search State */
          <div className="mt-12 rounded-[2.5rem] border border-[#EDE5D8] bg-[#FDFBF7] p-12 text-center max-w-lg mx-auto shadow-xs">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EDE5D8] text-[#8C7A6B]">
              <Search className="h-6 w-6" />
            </div>
            <h3 className="font-heading mt-4 text-2xl font-bold text-[#4A2E1B]">
              No exact match found
            </h3>
            <p className="mt-2 text-sm text-[#6B584C] leading-relaxed">
              We couldn&apos;t find any dried fruits or vegetable crisps matching &ldquo;{searchQuery}&rdquo;.
              Try searching for &ldquo;sugar-free&rdquo;, &ldquo;apple&rdquo;, or &ldquo;vegan&rdquo;.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#4A2E1B] px-6 py-3 text-xs font-bold text-[#FDFBF7] transition-all hover:bg-[#B85D3B]"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset All Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

