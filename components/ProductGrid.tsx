"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Leaf, Search, X, ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard";
import { SanityProduct, productKey, productSlug, urlFor } from "@/lib/sanity";

const imgUrl = (img: SanityProduct["image"], w = 96) =>
  typeof img === "string" ? img : urlFor(img).width(w).url();

const categories = [
  { label: "All", hash: "shop" },
  { label: "Fruits", hash: "shop-fruits" },
  { label: "Vegetables", hash: "shop-vegetables" },
  { label: "Spices", hash: "shop-spices" },
  { label: "Best Sellers", hash: "shop-bestsellers" },
];

const SEARCH_ANCHOR = "shop-search";

interface ProductGridProps {
  products: SanityProduct[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const syncFromHash = () => {
      const hash = window.location.hash.replace(/^#/, "");
      if (!hash) return;
      if (hash === SEARCH_ANCHOR) {
        document.getElementById(SEARCH_ANCHOR)?.focus({ preventScroll: true });
        return;
      }
      const match = categories.find((category) => category.hash === hash);
      if (match) setActiveCategory(match.label);
    };
    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, []);

  const filteredProducts = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return products.filter((product) => {
      const inCategory =
        activeCategory === "All" ||
        (activeCategory === "Best Sellers"
          ? product.badge === "Best Seller"
          : product.category === activeCategory);
      if (!inCategory) return false;
      if (!needle) return true;
      const haystack = `${product.name} ${product.shortDescription ?? ""} ${product.category ?? ""} ${product.benefit ?? ""}`;
      return haystack.toLowerCase().includes(needle);
    });
  }, [products, activeCategory, query]);

  const searchResults = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return [];
    return products
      .filter((product) => {
        const haystack = `${product.name} ${product.shortDescription ?? ""} ${product.category ?? ""} ${product.benefit ?? ""}`;
        return haystack.toLowerCase().includes(needle);
      })
      .slice(0, 5);
  }, [products, query]);

  const dropdownVisible = showDropdown && searchResults.length > 0;

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  return (
    <section id="shop" className="scroll-mt-24 border-t border-[#F0E2C4] bg-[#FFF8E7] py-12 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[#C2410C]">
              <Leaf className="h-3.5 w-3.5" />
              <span>100% Natural &bull; No Preservatives &bull; Dehydrated</span>
            </div>
            <h2 className="font-heading mt-2 text-3xl font-bold tracking-tight text-[#2E7D32] sm:text-4xl">
              Our Dehydrated Collection
            </h2>
            <p className="mt-2 max-w-2xl text-base text-[#3E2723]/70">
              Farm-fresh favourites, dehydrated in Mysore. Clean, crunchy and natural.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center lg:w-auto">
            <div ref={searchContainerRef} className="relative w-full sm:w-64">
              <Search aria-hidden className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#3E2723]/45" />
              <input
                id={SEARCH_ANCHOR}
                type="search"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                onKeyDown={(event) => {
                  if (event.key === "Escape") setShowDropdown(false);
                }}
                placeholder="Search snacks"
                aria-label="Search snacks"
                role="combobox"
                aria-autocomplete="list"
                aria-expanded={dropdownVisible}
                aria-controls="shop-search-results"
                className="h-12 w-full scroll-mt-28 rounded-full border border-[#F0E2C4] bg-white pl-11 pr-10 text-base text-[#3E2723] outline-none transition-colors placeholder:text-[#3E2723]/40 focus:border-[#2E7D32]"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setShowDropdown(false);
                  }}
                  aria-label="Clear search"
                  className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-[#3E2723]/50 hover:bg-[#FFF3D6] hover:text-[#3E2723]"
                >
                  <X className="h-4 w-4" />
                </button>
              )}

              {dropdownVisible && (
                <div
                  id="shop-search-results"
                  className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-2xl border border-[#F0E2C4] bg-white shadow-[0_12px_32px_rgba(62,39,35,0.14)]"
                >
                  <ul className="divide-y divide-[#F0E2C4]">
                    {searchResults.map((product) => (
                      <li key={productKey(product)}>
                        <button
                          type="button"
                          onClick={() => {
                            setShowDropdown(false);
                            setQuery("");
                            router.push(`/products/${productSlug(product)}`);
                          }}
                          className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-[#FFF8E7]"
                        >
                          <Image
                            src={imgUrl(product.image)}
                            alt={product.name}
                            width={48}
                            height={48}
                            unoptimized
                            className="h-12 w-12 shrink-0 rounded-xl bg-[#FFF3D6] object-cover"
                          />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-semibold text-[#3E2723]">
                              {product.name}
                            </span>
                            <span className="block text-sm font-bold text-[#F57C00]">
                              &#8377;{product.price.toFixed(0)}
                            </span>
                          </span>
                          <ChevronRight
                            aria-hidden
                            className="h-4 w-4 shrink-0 text-[#3E2723]/40"
                          />
                        </button>
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    onClick={() => {
                      document
                        .getElementById("shop")
                        ?.scrollIntoView({ behavior: "smooth" });
                      setShowDropdown(false);
                    }}
                    className="flex w-full items-center justify-between gap-2 border-t border-[#F0E2C4] bg-[#FFF8E7] px-3 py-2.5 text-sm font-semibold text-[#2E7D32] transition-colors hover:bg-[#FFF3D6]"
                  >
                    <span>See all results</span>
                    <ChevronRight aria-hidden className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
            <span className="shrink-0 rounded-full border border-[#F0E2C4] bg-white px-4 py-2 text-center text-xs font-bold text-[#3E2723]">
              Showing {filteredProducts.length} varieties
            </span>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.label}
              id={category.hash === "shop" ? undefined : category.hash}
              type="button"
              onClick={() => {
                setActiveCategory(category.label);
                window.location.hash = category.hash;
              }}
              aria-pressed={activeCategory === category.label}
              className={`min-h-12 scroll-mt-28 rounded-full px-5 text-sm font-bold transition-all ${
                activeCategory === category.label
                  ? "bg-[#2E7D32] text-white shadow-md"
                  : "border border-[#F0E2C4] bg-white text-[#3E2723]/70 hover:border-[#2E7D32] hover:text-[#2E7D32]"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {filteredProducts.length === 0 ? (
          <p className="mt-12 rounded-3xl border border-[#F0E2C4] bg-white px-6 py-16 text-center text-base text-[#3E2723]/70">
            No snacks match that search. Try &ldquo;banana&rdquo;, &ldquo;mango&rdquo; or clear the filters.
          </p>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product, i) => (
              <ProductCard key={product._id} product={product} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}