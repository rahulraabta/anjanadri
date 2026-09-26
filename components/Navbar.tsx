"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Menu, X, User, Search, Sparkles } from "lucide-react";
import Link from "next/link";
import Logo from "./Logo";
import { useCart } from "@/context/CartContext";

// Category anchors. The matching ids live on the filter chips inside
// ProductGrid, so a nav click scrolls to the grid AND the grid reads the
// hash on mount / hashchange to switch its filter. Native anchor behaviour,
// no cross-component state, and the home route stays statically rendered.
const categories = [
  { label: "Shop All", hash: "shop" },
  { label: "Fruits", hash: "shop-fruits" },
  { label: "Vegetables", hash: "shop-vegetables" },
  { label: "Spices", hash: "shop-spices" },
  { label: "Best Sellers", hash: "shop-bestsellers" },
];

const iconButton =
  "relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#F0E2C4] bg-[#FFF3D6] text-[#3E2723] transition-colors hover:border-[#2E7D32] hover:bg-[#2E7D32] hover:text-[#FFF8E7]";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { totalItems, openCart } = useCart();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 120, damping: 20 }}
      className={`sticky top-0 z-40 w-full transition-all duration-500 ${
        scrolled
          ? "border-b border-[#F0E2C4] bg-[#FFF8E7]/95 shadow-[0_8px_32px_rgba(62,39,35,0.08)] backdrop-blur-xl"
          : "border-b border-[#F0E2C4] bg-[#FFF8E7] shadow-[0_4px_20px_rgba(62,39,35,0.04)]"
      }`}
    >
      {/* Brand promise bar */}
      <div className="hidden border-b border-white/15 bg-[#2E7D32] px-6 py-1.5 text-[11px] font-medium text-white sm:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <span className="flex items-center gap-1.5 text-white/90">
            <Sparkles className="h-3 w-3 text-[#FFC107]" />
            100% Natural &bull; No Preservatives &bull; Dehydrated &amp; Healthy
          </span>
          <div className="flex items-center gap-4">
            <span className="text-white/80">Free shipping on orders over &#8377;499</span>
            <span className="text-white/40">&bull;</span>
            <Link href="/quiz" className="font-semibold text-[#FFC107] hover:underline">
              Take the Crunch Quiz
            </Link>
          </div>
        </div>
      </div>

      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-3 sm:px-6 lg:h-24 lg:px-8">
        <button
          type="button"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((open) => !open)}
          className={`${iconButton} lg:hidden`}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        {/* Exactly one logo is visible per breakpoint */}
        <Logo size="sm" showTagline={false} className="lg:hidden" />
        <Logo size="md" showTagline className="hidden lg:flex" />

        <ul className="hidden items-center gap-1 lg:flex">
          {categories.map((category) => (
            <li key={category.label}>
              <a
                href={`/#${category.hash}`}
                className="group relative flex min-h-12 items-center rounded-full px-3.5 text-sm font-semibold text-[#3E2723]/80 transition-colors hover:bg-[#FFF3D6] hover:text-[#2E7D32] xl:px-4"
              >
                {category.label}
                <span className="absolute inset-x-3.5 bottom-2 h-0.5 scale-x-0 rounded-full bg-[#F57C00] transition-transform duration-300 group-hover:scale-x-100" />
              </a>
            </li>
          ))}
          <li className="ml-1 border-l border-[#F0E2C4] pl-2">
            <a
              href="/#contact"
              className="flex min-h-12 items-center rounded-full px-3 text-sm font-semibold text-[#3E2723]/60 transition-colors hover:bg-[#FFF3D6] hover:text-[#2E7D32]"
            >
              Contact
            </a>
          </li>
        </ul>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <a href="/#shop-search" aria-label="Search products" className={`${iconButton} hidden sm:flex`}>
            <Search className="h-[18px] w-[18px]" strokeWidth={1.8} />
          </a>
          <Link href="/account" aria-label="Your account" className={`${iconButton} hidden sm:flex`}>
            <User className="h-[18px] w-[18px]" strokeWidth={1.8} />
          </Link>
          <button
            type="button"
            onClick={openCart}
            aria-label={`Open cart, ${totalItems} items`}
            className={iconButton}
          >
            <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.8} />
            {totalItems > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#F57C00] text-[11px] font-bold text-white ring-2 ring-[#FFF8E7]">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile category sheet */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-[#F0E2C4] bg-white shadow-xl lg:hidden"
          >
            <ul className="flex flex-col gap-1 px-4 py-4">
              {categories.map((category, i) => (
                <motion.li
                  key={category.label}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.25 }}
                >
                  <a
                    href={`/#${category.hash}`}
                    onClick={() => setIsOpen(false)}
                    className="flex min-h-12 items-center rounded-2xl px-4 text-base font-semibold text-[#3E2723] transition-colors hover:bg-[#FFF3D6]"
                  >
                    {category.label}
                  </a>
                </motion.li>
              ))}
              <li className="mt-1 flex flex-col gap-1 border-t border-[#F0E2C4] pt-2">
                <a
                  href="/#shop-search"
                  onClick={() => setIsOpen(false)}
                  className="flex min-h-12 items-center gap-2.5 rounded-2xl px-4 text-base font-semibold text-[#3E2723] hover:bg-[#FFF3D6]"
                >
                  <Search className="h-5 w-5 text-[#2E7D32]" />
                  Search Products
                </a>
                <Link
                  href="/account"
                  onClick={() => setIsOpen(false)}
                  className="flex min-h-12 items-center gap-2.5 rounded-2xl px-4 text-base font-semibold text-[#3E2723] hover:bg-[#FFF3D6]"
                >
                  <User className="h-5 w-5 text-[#2E7D32]" />
                  My Account
                </Link>
                <a
                  href="/#contact"
                  onClick={() => setIsOpen(false)}
                  className="flex min-h-12 items-center rounded-2xl px-4 text-base font-semibold text-[#3E2723] hover:bg-[#FFF3D6]"
                >
                  Contact
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
