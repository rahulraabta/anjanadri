"use client";

import { createContext, useCallback, useContext, useEffect, useEffectEvent, useRef, useState, type ReactNode } from "react";
import { Command } from "cmdk";
import { ArrowDown, ArrowRight, ArrowUp, Clock, CornerDownLeft, Search, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import type { SearchProduct } from "@/lib/product-search";

const RECENT_SEARCHES_KEY = "anjanadri_recent_searches";
const itemClassName = "group flex min-h-14 cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-[#3E2723] outline-none transition-colors duration-150 hover:bg-[#F1F8E9] data-[selected=true]:bg-[#F1F8E9] data-[selected=true]:text-[#2E7D32]";
const groupClassName = "[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pb-2 [&_[cmdk-group-heading]]:pt-4 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-bold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:text-[#3E2723]/50";

const CommandMenuContext = createContext<{ isSearchOpen: boolean; openSearch: () => void } | null>(null);

export function useCommandMenu() {
  const context = useContext(CommandMenuContext);
  if (!context) throw new Error("useCommandMenu must be used within CommandMenu");
  return context;
}

export default function CommandMenu({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { closeCart } = useCart();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<SearchProduct[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [requestKey, setRequestKey] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  const openSearch = useCallback(() => {
    previousFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeCart();
    setQuery("");
    setOpen(true);
  }, [closeCart]);

  const toggleSearch = useEffectEvent(() => {
    if (open) setOpen(false);
    else openSearch();
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey) && !event.altKey && !event.repeat) {
        event.preventDefault();
        event.stopPropagation();
        toggleSearch();
      }
    };
    document.addEventListener("keydown", handleKeyDown, true);
    return () => document.removeEventListener("keydown", handleKeyDown, true);
  }, []);

  useEffect(() => {
    if (!open && previousFocus.current) {
      previousFocus.current.focus({ preventScroll: true });
      previousFocus.current = null;
    }
  }, [open]);

  useEffect(() => {
    try {
      const stored: unknown = JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY) ?? "[]");
      if (Array.isArray(stored)) {
        const recent = stored.filter((term): term is string => typeof term === "string" && term.trim().length > 0).slice(0, 5);
        queueMicrotask(() => setRecentSearches(recent));
      }
    } catch { /* Search remains available when browser storage is unavailable. */ }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/search-products.json", { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Unable to load products");
        const catalog: SearchProduct[] = await response.json();
        if (!controller.signal.aborted) setProducts(catalog);
      })
      .catch(() => {
        if (!controller.signal.aborted) setHasError(true);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [requestKey]);

  const selectProduct = (product: SearchProduct) => {
    const term = query.trim() || product.name;
    const recent = [term, ...recentSearches.filter((previous) => previous.toLowerCase() !== term.toLowerCase())].slice(0, 5);
    setRecentSearches(recent);
    try {
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(recent));
    } catch { /* Product navigation does not depend on browser storage. */ }
    setOpen(false);
    router.push(`/products/${product.slug}`);
  };

  const suggestedProducts = query.trim()
    ? products
    : [...products].sort((a, b) => Number(b.isBestSeller) - Number(a.isBestSeller)).slice(0, 6);

  return (
    <CommandMenuContext.Provider value={{ isSearchOpen: open, openSearch }}>
      {children}
      <Command.Dialog
        open={open}
        onOpenChange={setOpen}
        label="Search Anjanadri products"
        loop
        vimBindings={false}
        overlayClassName="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm"
        contentClassName="fixed left-1/2 top-1/2 z-[80] w-[calc(100%_-_2rem)] max-w-xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-[#F0E2C4] bg-white shadow-2xl outline-none"
        className="w-full"
      >
        <div className="flex items-center gap-3 border-b border-[#F0E2C4] px-4 sm:px-5">
          <Search aria-hidden="true" className="h-5 w-5 shrink-0 text-[#2E7D32]" />
          <Command.Input
            ref={inputRef}
            value={query}
            onValueChange={setQuery}
            placeholder="Search fruits, vegetables, spices..."
            aria-label="Search products"
            className="h-16 min-w-0 flex-1 bg-transparent text-base text-[#3E2723] outline-none placeholder:text-[#3E2723]/45"
          />
          <button type="button" onClick={() => setOpen(false)} aria-label="Close search" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#3E2723]/50 transition-colors hover:bg-[#FFF3D6] hover:text-[#3E2723] focus-visible:outline-2 focus-visible:outline-[#2E7D32]">
            <X aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>

        <Command.List className="max-h-[min(24rem,55dvh)] overflow-y-auto overscroll-contain p-2 scroll-py-2">
          {!query.trim() && (
            <Command.Group heading="Recent Searches" forceMount className={groupClassName}>
              {recentSearches.length === 0 && <p className="px-3 pb-2 text-sm text-[#3E2723]/50">Your recent searches will appear here.</p>}
              {recentSearches.map((term) => (
                <Command.Item key={term} value={`recent:${term}`} onSelect={() => { setQuery(term); inputRef.current?.focus(); }} className={itemClassName}>
                  <Clock aria-hidden="true" className="h-4 w-4 shrink-0 text-[#3E2723]/40" />
                  <span className="min-w-0 flex-1 truncate text-sm font-medium">{term}</span>
                  <ArrowRight aria-hidden="true" className="h-4 w-4 text-[#3E2723]/35" />
                </Command.Item>
              ))}
            </Command.Group>
          )}

          {loading ? (
            <Command.Loading className="px-3 py-8 text-center text-sm text-[#3E2723]/55">Loading products...</Command.Loading>
          ) : hasError ? (
            <div role="status" className="px-3 py-8 text-center text-sm text-[#3E2723]/65">
              <p>Products couldn&apos;t load. Please try again.</p>
              <button type="button" onClick={() => { setHasError(false); setLoading(true); setRequestKey((key) => key + 1); }} className="mt-3 rounded-full bg-[#2E7D32] px-5 py-2 font-semibold text-white hover:bg-[#1B5E20]">Retry</button>
            </div>
          ) : (
            <>
              <Command.Empty className="px-3 py-10 text-center text-sm text-[#3E2723]/55">No products found. Try another search.</Command.Empty>
              <Command.Group heading="Suggested Products" className={groupClassName}>
                {suggestedProducts.map((product) => (
                  <Command.Item key={product.id} value={`product:${product.slug}`} keywords={[product.name, product.category, product.description, ...product.tags]} onSelect={() => selectProduct(product)} className={itemClassName}>
                    <Image src={product.imageUrl} alt="" width={48} height={48} loading="lazy" unoptimized className="h-12 w-12 shrink-0 rounded-xl bg-gray-100 object-cover" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">{product.name}</span>
                      <span className="block text-xs text-[#3E2723]/50">{product.category}</span>
                    </span>
                    <span className="shrink-0 text-sm font-bold text-[#2E7D32]">&#8377;{product.price.toFixed(0)}</span>
                    <ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0 text-[#3E2723]/35 transition-transform group-data-[selected=true]:translate-x-1" />
                  </Command.Item>
                ))}
              </Command.Group>
            </>
          )}
        </Command.List>

        <div className="flex items-center justify-between gap-3 border-t border-[#F0E2C4] bg-[#fdfbf7] px-5 py-3 text-[11px] text-[#3E2723]/55">
          <span className="flex items-center gap-1"><ArrowUp aria-hidden="true" className="h-3 w-3" /><ArrowDown aria-hidden="true" className="h-3 w-3" />Navigate</span>
          <span className="flex items-center gap-1"><CornerDownLeft aria-hidden="true" className="h-3 w-3" />Open product</span>
          <span><kbd className="rounded border border-[#F0E2C4] bg-white px-1.5 py-0.5">Esc</kbd> to close</span>
        </div>
      </Command.Dialog>
    </CommandMenuContext.Provider>
  );
}
