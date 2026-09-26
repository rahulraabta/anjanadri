"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, X, ShoppingBag, MapPin } from "lucide-react";
import Image from "next/image";

interface PurchaseEvent {
  id: string;
  name: string;
  city: string;
  productName: string;
  productImage: string;
  timeAgo: string;
  quantity?: number;
}

const purchaseEvents: PurchaseEvent[] = [
  {
    id: "evt-1",
    name: "Rahul S.",
    city: "Mumbai",
    productName: "Organic Mango Slices",
    productImage: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=120&q=80",
    timeAgo: "2 minutes ago",
    quantity: 2,
  },
  {
    id: "evt-2",
    name: "Sneha P.",
    city: "Bengaluru",
    productName: "Crispy Apple Chips",
    productImage: "https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?w=120&q=80",
    timeAgo: "Just now",
  },
  {
    id: "evt-3",
    name: "Ananya K.",
    city: "Delhi",
    productName: "Mixed Berry Medley",
    productImage: "https://images.unsplash.com/photo-1519996529931-28324d5a630e?w=120&q=80",
    timeAgo: "4 minutes ago",
    quantity: 3,
  },
  {
    id: "evt-4",
    name: "Vikram R.",
    city: "Hyderabad",
    productName: "Freeze-Dried Strawberry Chips",
    productImage: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=120&q=80",
    timeAgo: "7 minutes ago",
  },
  {
    id: "evt-5",
    name: "Pooja M.",
    city: "Pune",
    productName: "Beetroot Crisps",
    productImage: "https://images.unsplash.com/photo-1590165482129-1b8b27698780?w=120&q=80",
    timeAgo: "11 minutes ago",
  },
];

export default function SocialProofToast() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isDismissed) return;

    // Initial delay before showing first notification
    const initialTimer = setTimeout(() => {
      setIsVisible(true);
    }, 3500);

    return () => clearTimeout(initialTimer);
  }, [isDismissed]);

  useEffect(() => {
    if (isDismissed || isHovered) return;

    let hideTimer: NodeJS.Timeout;
    let nextTimer: NodeJS.Timeout;

    if (isVisible) {
      // Stay visible for 6 seconds
      hideTimer = setTimeout(() => {
        setIsVisible(false);
      }, 6000);
    } else {
      // Stay hidden for 5 seconds then show next
      nextTimer = setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % purchaseEvents.length);
        setIsVisible(true);
      }, 5000);
    }

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(nextTimer);
    };
  }, [isVisible, isDismissed, isHovered]);

  if (isDismissed) return null;

  const current = purchaseEvents[currentIndex];

  return (
    <div className="fixed bottom-6 left-6 z-50 pointer-events-none max-w-sm">
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.92 }}
            transition={{ type: "spring", stiffness: 140, damping: 20 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="pointer-events-auto relative flex items-center gap-3.5 rounded-2xl border border-[#F0E2C4] bg-white/95 p-3.5 pr-8 shadow-[0_12px_32px_rgba(62,39,35,0.14)] backdrop-blur-md"
          >
            {/* Thumbnail */}
            <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl border border-[#F0E2C4] bg-[#FFF3D6]">
              <Image
                src={current.productImage}
                alt={current.productName}
                fill
                sizes="48px"
                className="object-cover"
              />
            </div>

            {/* Content */}
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#3E2723]">
                <span>{current.name}</span>
                <span className="text-[#3E2723]/55">&bull;</span>
                <span className="flex items-center gap-0.5 text-[#2E7D32]">
                  <MapPin className="h-2.5 w-2.5" />
                  {current.city}
                </span>
              </div>

              <p className="text-xs text-[#3E2723]/70 font-medium leading-tight mt-0.5">
                Purchased{" "}
                <span className="font-semibold text-[#C2410C]">
                  {current.quantity ? `${current.quantity}x ` : ""}
                  {current.productName}
                </span>
              </p>

              <div className="mt-1 flex items-center gap-2 text-[10px] text-[#3E2723]/55">
                <span>{current.timeAgo}</span>
                <span className="inline-flex items-center gap-0.5 text-[#2E7D32] font-medium">
                  <CheckCircle2 className="h-2.5 w-2.5" /> Verified Order
                </span>
              </div>
            </div>

            {/* Dismiss button */}
            <button
              onClick={() => setIsDismissed(true)}
              aria-label="Dismiss notification"
              className="absolute right-2 top-2 p-1 text-[#3E2723]/55 hover:text-[#3E2723] transition-colors rounded-full"
            >
              <X className="h-3 w-3" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
