"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { products as fallbackProducts, type Product } from "@/data/products";
import ProductCard from "./ProductCard";
import { Sparkles } from "lucide-react";

const categories = [
  "All",
  "Fruit Chips",
  "Vegetable Chips",
  "Dried Fruit",
  "Freeze-Dried Fruit",
];

export default function ProductGrid() {
  const [active, setActive] = useState("All");
  const [productList, setProductList] = useState<Product[]>(fallbackProducts);
  const [dataSource, setDataSource] = useState<string>("local");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch("/api/products");
        if (res.ok) {
          const data = await res.json();
          if (data.products && Array.isArray(data.products) && data.products.length > 0) {
            setProductList(data.products);
            setDataSource(data.source || "neon");
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

  const filtered =
    active === "All" ? productList : productList.filter((p) => p.category === active);

  return (
    <section id="shop" className="relative bg-[#F7F3EB] py-24 lg:py-32 border-t border-[#EDE5D8]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end"
        >
          <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B85D3B]">
                The Anjanadri Pantry
              </span>

            <h2 className="font-heading mt-3 text-4xl font-semibold tracking-tight text-[#4A2E1B] sm:text-5xl">
              Real Food. Nothing Else.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-[#6B584C]">
              Every single batch contains only fruit or vegetables harvested at peak ripeness,
              slow-dried without refined sugar, preservatives, or artificial enhancers.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`rounded-full px-5 py-2.5 text-xs font-medium transition-all duration-300 ${
                  active === cat
                    ? "bg-[#4A2E1B] text-[#FDFBF7] shadow-sm"
                    : "border border-[#EDE5D8] bg-[#FDFBF7] text-[#6B584C] hover:border-[#6E7D60] hover:text-[#4A2E1B]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Product Cards Grid */}
        <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
