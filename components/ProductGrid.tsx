"use client";

import { useState, useEffect, useMemo, useRef, type ReactNode } from "react";
import { m, AnimatePresence, useScroll, useTransform, useMotionTemplate, type MotionValue } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Leaf, Search, X, ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard";
import ScrollReveal from "./ScrollReveal";
import MotionProvider from "./MotionProvider";
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

function CarouselCard({ rotation, angle, children }: { rotation: MotionValue<number>; angle: number; children: ReactNode }) {
  const facing = useTransform(rotation, (value) => Math.max(0, Math.cos((value + angle) * Math.PI / 180)));
  const scale = useTransform(facing, [Math.SQRT1_2, 1], [0.8, 1]);
  const opacity = useTransform(facing, [Math.SQRT1_2, 1], [0.5, 1]);
  return <m.div data-carousel-facing data-product-card className="h-full" style={{ scale, opacity }}>{children}</m.div>;
}

export default function ProductGrid({ products }: ProductGridProps) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [desktop, setDesktop] = useState(false);
  const { scrollYProgress } = useScroll({ target: gridRef, offset: ["start start", "end end"] });

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px) and (prefers-reduced-motion: no-preference)");
    const update = () => setDesktop(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

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
    const category = activeCategory.trim().toLowerCase();
    console.log("ProductGrid filtering", {
      activeCategory,
      categories: [...new Set(products.map((product) => product.category))],
    });
    return products.filter((product) => {
      const inCategory =
        category === "all" ||
        (category === "best sellers"
          ? product.isBestSeller === true || product.badge?.trim().toLowerCase() === "best seller"
          : product.category?.trim().toLowerCase() === category);
      if (!inCategory) return false;
      if (!needle) return true;
      const haystack = `${product.name} ${product.shortDescription ?? ""} ${product.category ?? ""} ${product.benefit ?? ""}`;
      return haystack.toLowerCase().includes(needle);
    });
  }, [products, activeCategory, query]);

  const carousel = desktop && filteredProducts.length > 1;
  const angleStep = 360 / Math.max(6, filteredProducts.length);
  const radius = Math.max(300, 328 / (2 * Math.tan(angleStep * Math.PI / 360)));
  const rotation = useTransform(scrollYProgress, [0, 1], [0, -(filteredProducts.length - 1) * angleStep]);
  const cylinderTransform = useMotionTemplate`translateZ(${-radius}px) rotateY(${rotation}deg)`;

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
    <section id="shop" className="scroll-mt-24">
      <div className="min-w-0">
        <ScrollReveal className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:flex-wrap lg:items-end">
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
                            loading="lazy"
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
        </ScrollReveal>

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

        <MotionProvider extended>
          <div
            ref={gridRef}
            data-product-carousel={carousel ? "active" : "inactive"}
            className="relative mt-8"
            style={{ height: carousel ? Math.max(1200, (filteredProducts.length - 1) * 260 + 800) : undefined }}
          >
            <div
              className={carousel ? "sticky top-24 flex h-[min(calc(100svh-6rem),680px)] items-center justify-center overflow-clip lg:top-32 lg:h-[min(calc(100svh-8rem),680px)]" : undefined}
              style={{ perspective: carousel ? "1000px" : undefined, transformStyle: carousel ? "preserve-3d" : undefined }}
            >
              <m.div
                data-product-cylinder
                layout={!carousel}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className={carousel ? "relative h-[500px] w-full" : "relative grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"}
                style={{ transform: carousel ? cylinderTransform : "none", transformStyle: carousel ? "preserve-3d" : "flat" }}
              >
                <AnimatePresence mode="popLayout">
                  {filteredProducts.map((product, i) => (
                    <m.div
                      key={productKey(product)}
                      layout={!carousel}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      className={carousel ? "absolute left-1/2 top-0 -ml-[140px] h-full w-[280px]" : "grid"}
                      style={carousel ? { transform: `rotateY(${i * angleStep}deg) translateZ(${radius}px)`, transformStyle: "flat", backfaceVisibility: "hidden" } : { transform: "none", transformStyle: "flat", backfaceVisibility: "visible" }}
                      onFocusCapture={(event) => {
                        if (!carousel || !gridRef.current || !event.target.matches(":focus-visible")) return;
                        const grid = gridRef.current;
                        const start = grid.getBoundingClientRect().top + window.scrollY;
                        window.scrollTo({ top: start + (i / (filteredProducts.length - 1)) * (grid.offsetHeight - window.innerHeight), behavior: "smooth" });
                      }}
                    >
                      {carousel ? (
                        <CarouselCard rotation={rotation} angle={i * angleStep}>
                          <ProductCard product={product} index={i} reveal={false} loading="eager" tilt={false} sizes="280px" />
                        </CarouselCard>
                      ) : <ProductCard product={product} index={i} />}
                    </m.div>
                  ))}
                </AnimatePresence>
                {filteredProducts.length === 0 && (
                  <p className="col-span-full mt-4 rounded-3xl border border-[#F0E2C4] bg-white px-6 py-16 text-center text-base text-[#3E2723]/70">
                    No snacks match that search. Try &ldquo;banana&rdquo;, &ldquo;mango&rdquo; or clear the filters.
                  </p>
                )}
              </m.div>
              {carousel && <p className="pointer-events-none absolute bottom-4 text-xs font-bold uppercase tracking-[0.2em] text-[#2E7D32]/70">Scroll to discover your favourites</p>}
            </div>
          </div>
        </MotionProvider>
      </div>
    </section>
  );
}
