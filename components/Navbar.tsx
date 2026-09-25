"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Menu, X, User, Sparkles, Compass } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Logo from "./Logo";
import { useCart } from "@/context/CartContext";

const navLinks = [
  { label: "Shop", href: "/#shop" },
  { label: "Best Seller", href: "/#shop", badge: "₹190" },
  { label: "Contact", href: "#contact" },
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
          ? "bg-[#FFF8E7]/95 shadow-[0_8px_32px_rgba(62,39,35,0.08)] backdrop-blur-xl border-b border-[#F0E2C4]"
          : "bg-[#FFF8E7] backdrop-blur-md border-b border-[#F0E2C4] shadow-[0_4px_20px_rgba(62,39,35,0.04)]"
      }`}
    >
      {/* Top micro-bar for brand promise banner */}
      <div className="hidden border-b border-[#F0E2C4]/60 bg-[#2E7D32] px-6 py-1.5 text-center text-[11px] font-medium text-white sm:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <span className="flex items-center gap-1.5 text-white/90">
            <Sparkles className="h-3 w-3 text-[#FFC107]" />
            100% Natural • No Preservatives • Sun-Dried & Healthy
          </span>
          <div className="flex items-center gap-4">
            <span className="text-white/80">Free shipping on orders over ₹499</span>
            <span className="text-white/30">&bull;</span>
            <Link href="/#quiz" className="font-semibold text-[#FFC107] hover:underline flex items-center gap-1">
              <Compass className="h-3 w-3" /> Take Flavor Quiz
            </Link>
          </div>
        </div>
      </div>

        <nav className="mx-auto flex flex-col lg:flex-row min-h-[64px] max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:min-h-[112px] lg:px-8 lg:py-0 gap-4 lg:gap-0">
          
          {/* Mobile Top Actions (Hamburger & Cart) */}
          <div className="flex w-full items-center justify-between lg:hidden">
            <button
              aria-label="Toggle navigation menu"
              onClick={() => setIsOpen(!isOpen)}
              className="flex min-h-12 min-w-12 items-center justify-center rounded-full border border-[#EDE5D8] bg-[#F7F3EB] text-[#4A2E1B] transition-colors hover:bg-[#EDE5D8]"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <button
              onClick={openCart}
              aria-label="Open cart"
              className="relative flex min-h-12 min-w-12 items-center justify-center rounded-full border border-[#EDE5D8] bg-[#F7F3EB] text-[#4A2E1B] shadow-xs transition-all duration-300 hover:border-[#4A2E1B] hover:bg-[#4A2E1B] hover:text-[#FDFBF7]"
            >
              <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.8} />
              {totalItems > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#B85D3B] text-[11px] font-bold text-white shadow-sm ring-2 ring-[#FDFBF7]">
                  {totalItems}
                </span>
              )}
            </button>
          </div>

          {/* Brand Logo - Billboard Presentation */}
          <div className="flex flex-col items-center lg:py-2 lg:flex-row lg:items-center">
            {/* Mobile Single Stacked Logo */}
            <Link href="/" className="flex flex-col items-center gap-2 lg:hidden text-center group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white shadow-[0_4px_16px_rgba(46,125,50,0.12)] p-1 flex items-center justify-center transition-transform duration-300 group-hover:scale-105 group-hover:border-[#F57C00]/50 group-hover:shadow-[0_8px_20px_rgba(245,124,0,0.18)]">
                <Image src="/logo.png" alt="Anjanadri Logo" width={80} height={80} className="w-full h-full object-contain rounded-full" priority />
              </div>
              <div className="flex flex-col items-center">
                <span className="font-[family-name:var(--font-playfair)] text-2xl sm:text-3xl font-extrabold tracking-tight text-[#2E7D32]">
                  Anjanadri
                </span>
                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-[#F57C00] mt-0.5">
                  Dehydrated Fruits &amp; Vegetables
                </span>
              </div>
            </Link>

            {/* Desktop Logo */}
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
        <div className="hidden lg:flex items-center gap-3">
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

