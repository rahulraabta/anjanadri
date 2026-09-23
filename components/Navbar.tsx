"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Menu, X, User, Sparkles, Compass } from "lucide-react";
import Link from "next/link";
import Logo from "./Logo";
import { useCart } from "@/context/CartContext";

const navLinks = [
  { label: "Pantry Shop", href: "/#shop" },
  { label: "Find Your Crunch", href: "/#quiz", badge: "Quiz" },
  { label: "Build a Box", href: "/build-a-box" },
  { label: "Our Story", href: "/#our-story" },
  { label: "Why Dehydrated?", href: "/#why" },
  { label: "Reviews", href: "/#reviews" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { totalItems, openCart } = useCart();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
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
          ? "bg-[#FDFBF7]/95 shadow-[0_8px_32px_rgba(74,46,27,0.08)] backdrop-blur-xl border-b border-[#EDE5D8]"
          : "bg-[#FDFBF7]/90 backdrop-blur-md border-b border-[#EDE5D8]/70 shadow-[0_4px_20px_rgba(74,46,27,0.03)]"
      }`}
    >
      {/* Top micro-bar for brand promise banner */}
      <div className="hidden border-b border-[#EDE5D8]/60 bg-[#F7F3EB]/80 px-6 py-1.5 text-center text-[11px] font-medium text-[#6B584C] sm:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <span className="flex items-center gap-1.5 text-[#6E7D60]">
            <Sparkles className="h-3 w-3 text-[#B85D3B]" />
            Small-batch slow dehydration at 42°C &bull; 97% nutrient retention
          </span>
          <div className="flex items-center gap-4">
            <span className="text-[#8C7A6B]">Complimentary shipping on orders over $35</span>
            <span className="text-[#EDE5D8]">&bull;</span>
            <Link href="/#quiz" className="font-semibold text-[#B85D3B] hover:underline flex items-center gap-1">
              <Compass className="h-3 w-3" /> Take Flavor Quiz
            </Link>
          </div>
        </div>
      </div>

<nav className="mx-auto flex min-h-[64px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:min-h-[112px] lg:px-8">
        {/* Brand Logo - Billboard Presentation */}
        <div className="flex items-center py-2">
          <Logo size="sm" showTagline={false} className="lg:hidden" />
          <Logo size="md" showTagline={true} className="hidden lg:block" />
        </div>

        {/* Desktop Navigation Links */}
        <ul className="hidden items-center gap-1.5 xl:gap-2 lg:flex">
          {navLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="group relative flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-[#6B584C] transition-all duration-300 hover:bg-[#F7F3EB] hover:text-[#4A2E1B]"
              >
                {link.label}
                {link.badge && (
                  <span className="rounded-full bg-[#B85D3B] px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
                    {link.badge}
                  </span>
                )}
                <span className="absolute inset-x-4 -bottom-1 h-0.5 scale-x-0 rounded-full bg-[#B85D3B] transition-transform duration-300 group-hover:scale-x-100" />
              </a>
            </li>
          ))}
        </ul>

        {/* Right Actions: Quiz CTA, Cart & Mobile Menu */}
        <div className="flex items-center gap-3">
          <Link
            href="/#quiz"
            className="hidden sm:inline-flex items-center gap-2 rounded-full border border-[#B85D3B]/30 bg-[#B85D3B]/10 px-4 py-2.5 text-xs font-semibold text-[#B85D3B] transition-all duration-300 hover:bg-[#B85D3B] hover:text-white"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Taste Quiz</span>
          </Link>

<Link
            href="/account"
            aria-label="Your account"
            className="hidden sm:flex min-h-12 min-w-12 items-center justify-center rounded-full border border-[#EDE5D8] bg-[#F7F3EB] text-[#4A2E1B] shadow-xs transition-all duration-300 hover:border-[#4A2E1B] hover:bg-[#4A2E1B] hover:text-[#FDFBF7]"
          >
            <User className="h-[18px] w-[18px]" strokeWidth={1.8} />
          </Link>

          <button
            onClick={openCart}
            aria-label="Open cart"
            className="group relative flex min-h-12 min-w-12 items-center justify-center rounded-full border border-[#EDE5D8] bg-[#F7F3EB] text-[#4A2E1B] shadow-xs transition-all duration-300 hover:border-[#4A2E1B] hover:bg-[#4A2E1B] hover:text-[#FDFBF7]"
          >
            <ShoppingBag className="h-[18px] w-[18px] transition-transform duration-300 group-hover:scale-110" strokeWidth={1.8} />
            {totalItems > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#B85D3B] text-[11px] font-bold text-white shadow-sm ring-2 ring-[#FDFBF7]">
                {totalItems}
              </span>
            )}
          </button>

          <button
            aria-label="Toggle navigation menu"
            onClick={() => setIsOpen(!isOpen)}
            className="flex min-h-12 min-w-12 items-center justify-center rounded-full border border-[#EDE5D8] bg-[#F7F3EB] text-[#4A2E1B] transition-colors hover:bg-[#EDE5D8] lg:hidden"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-[#EDE5D8] bg-[#FDFBF7] lg:hidden shadow-xl"
          >
            <ul className="flex flex-col gap-1.5 px-6 py-6">
              {navLinks.map((link, i) => (
                <motion.li
                  key={link.label}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.25 }}
                >
                  <a
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between rounded-2xl px-4 py-3 text-base font-medium text-[#6B584C] transition-colors hover:bg-[#F7F3EB] hover:text-[#4A2E1B]"
                  >
                    <span>{link.label}</span>
                    {link.badge && (
                      <span className="rounded-full bg-[#B85D3B] px-2.5 py-0.5 text-xs font-semibold text-white">
                        {link.badge}
                      </span>
                    )}
                  </a>
                </motion.li>
              ))}
              <li className="pt-2 border-t border-[#EDE5D8] mt-2">
                <Link
                  href="/account"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 rounded-2xl px-4 py-3 text-base font-medium text-[#4A2E1B] hover:bg-[#F7F3EB]"
                >
                  <User className="h-5 w-5 text-[#B85D3B]" />
                  <span>My Account</span>
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

