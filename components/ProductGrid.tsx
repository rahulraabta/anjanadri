"use client";

import { useState, useMemo } from "react";
import { Leaf } from "lucide-react";
import { products as localProducts } from "@/data/products";
import ProductCard from "./ProductCard";

const categories = ["All", "Fruits", "Vegetables", "Spices"];

export default function ProductGrid() {
  const [activeCategory, setActiveCategory] = useState("All");

  // Use local Anjanadri catalogue (7 items + flagship) so the rebrand
  // shows immediately without requiring a Neon DB reseed.
  const filteredProducts = useMemo(() => {
    if (activeCategory === "All") return localProducts;
    return localProducts.filter((p) => p.category === activeCategory);
  }, [activeCategory]);

  return (
    <section id="shop" className="relative border-t border-[#F0E2C4] bg-[#FFF8E7] py-14 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[#F57C00]">
              <Leaf className="h-3.5 w-3.5" />
              <span>100% Natural • No Preservatives • Sun-Dried</span>
            </div>
            <h2 className="mt-2 font-sans text-3xl font-extrabold tracking-tight text-[#2E7D32] sm:text-4xl">
              Our Dehydrated Collection
            </h2>
            <p className="mt-2 max-w-2xl text-base text-[#3E2723]/70">
              7 farm-fresh favourites, sun-dried in Mysore. Clean, crunchy and healthy.
            </p>
          </div>
          <span className="rounded-full border border-[#F0E2C4] bg-white px-4 py-2 text-xs font-bold text-[#3E2723]">
            Showing {filteredProducts.length} varieties
          </span>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`min-h-[48px] rounded-full px-5 text-sm font-bold transition-all ${
                activeCategory === cat
                  ? "bg-[#2E7D32] text-white shadow-md"
                  : "border border-[#F0E2C4] bg-white text-[#3E2723]/70 hover:border-[#2E7D32] hover:text-[#2E7D32]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 p-0 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
