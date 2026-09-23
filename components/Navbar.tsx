"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Menu, X, User, Box } from "lucide-react";
import Link from "next/link";
import Logo from "./Logo";
import { useCart } from "@/context/CartContext";

const navLinks = [
  { label: "Shop", href: "/#shop" },
  { label: "Our Story", href: "/#our-story" },
  { label: "Build a Box", href: "/build-a-box" },
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
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`sticky top-0 z-40 w-full transition-all duration-500 ${
        scrolled
          ? "bg-[#FDFBF7]/95 shadow-[0_4px_25px_rgba(74,46,27,0.06)] backdrop-blur-md border-b border-[#EDE5D8]"
          : "bg-[#FDFBF7] shadow-none"
      }`}
    >
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:h-24 lg:px-8">
        {/* Brand Logo */}
<div className="flex items-center">
          <Logo size="sm" showTagline={true} />
        </div>

        {/* Desktop Navigation Links */}
        <ul className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="group relative rounded-full px-4 py-2.5 text-sm font-medium text-[#6B584C] transition-colors duration-300 hover:text-[#4A2E1B]"
              >
                {link.label}
                <span className="absolute inset-x-4 -bottom-0.5 h-0.5 scale-x-0 rounded-full bg-[#B85D3B] transition-transform duration-300 group-hover:scale-x-100" />
              </a>
            </li>
          ))}
        </ul>

        {/* Right Actions: Cart & Mobile Menu */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/account"
            aria-label="Your account"
            className="hidden sm:flex h-11 w-11 items-center justify-center rounded-full border border-[#EDE5D8] bg-[#F7F3EB] text-[#4A2E1B] shadow-sm transition-all duration-300 hover:border-[#4A2E1B] hover:bg-[#4A2E1B] hover:text-[#FDFBF7]"
          >
            <User className="h-[18px] w-[18px]" strokeWidth={1.8} />
          </Link>

          <button
            onClick={openCart}
            aria-label="Open cart"
            className="group relative flex h-11 w-11 items-center justify-center rounded-full border border-[#EDE5D8] bg-[#F7F3EB] text-[#4A2E1B] shadow-sm transition-all duration-300 hover:border-[#4A2E1B] hover:bg-[#4A2E1B] hover:text-[#FDFBF7]"
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
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[#EDE5D8] bg-[#F7F3EB] text-[#4A2E1B] transition-colors hover:bg-[#EDE5D8] lg:hidden"
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
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-[#EDE5D8] bg-[#FDFBF7] lg:hidden shadow-lg"
          >
            <ul className="flex flex-col gap-1 px-6 py-5">
              {navLinks.map((link, i) => (
                <motion.li
                  key={link.label}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                >
                  <a
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="block rounded-2xl px-4 py-3 text-base font-medium text-[#6B584C] transition-colors hover:bg-[#F7F3EB] hover:text-[#4A2E1B]"
                  >
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
