"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function Toast() {
  const { toastMessage } = useCart();

  return (
    <AnimatePresence>
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          role="status"
          aria-live="polite"
          className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 md:left-auto md:right-6 md:bottom-6 md:translate-x-0 bg-[#2E7D32] text-white px-4 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2 pointer-events-none max-w-[calc(100vw-2rem)]"
        >
          <Check className="h-4 w-4 shrink-0" aria-hidden />
          <span className="line-clamp-2">{toastMessage}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
