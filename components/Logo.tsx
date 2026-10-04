"use client";

import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showTagline?: boolean;
  href?: string;
  light?: boolean;
  layout?: "horizontal" | "stacked";
}

export default function Logo({
  className = "",
  size = "md",
  showTagline = true,
  href = "/",
  light = false,
  layout = "horizontal",
}: LogoProps) {
  const sizeMap = {
    sm: {
      img: 56,
      wrap: "h-12 w-12 md:h-14 md:w-14",
      title: "text-xl sm:text-2xl",
      descriptor: "text-[10px]",
      tagline: "text-[10px]",
    },
    md: {
      // Single responsive instance: compact below md,
      // full md presence on desktop. No display-toggle classes needed.
      img: 64,
      wrap: "h-14 w-14 md:h-16 md:w-16",
      title: "text-xl sm:text-2xl lg:text-3xl",
      descriptor: "text-[11px] sm:text-xs",
      tagline: "text-xs",
    },
    lg: {
      img: 80,
      wrap: "h-20 w-20",
      title: "text-3xl sm:text-4xl",
      descriptor: "text-xs sm:text-sm",
      tagline: "text-sm",
    },
    xl: {
      img: 112,
      wrap: "h-28 w-28",
      title: "text-4xl sm:text-6xl",
      descriptor: "text-sm sm:text-base",
      tagline: "text-base",
    },
  };

  const { img, wrap, title, tagline } = sizeMap[size];

  // Footer (light) emblem needs premium scale + a subtle white disc so the
  // brown badge stays legible on the dark green footer background.
  const emblemWrap = light ? "h-16 w-16 md:h-20 md:w-20" : wrap;

  const content = (
    <div
      className={`group inline-flex items-center cursor-pointer transition-transform duration-300 hover:scale-[1.01] ${
        layout === "stacked" ? "flex-col text-center" : "flex-row gap-2.5 md:gap-3 text-left"
      } ${className}`}
    >
      {/* Brand emblem — transparent badge, no container ring/background needed */}
      <div className="relative flex-shrink-0 flex items-center justify-center">
        <div
          className={`relative flex items-center justify-center transition-all duration-300 ${emblemWrap} ${
            light ? "bg-white/90 rounded-full p-1.5" : ""
          }`}
        >
          <Image
            src="/logo2.png"
            alt="Anjanadri Logo"
            width={img}
            height={img}
            className="w-full h-full object-contain drop-shadow-[0_2px_6px_rgba(62,39,35,0.15)] transition-transform duration-500 group-hover:scale-105"
            priority
          />
        </div>
      </div>

      {/* Typography Hierarchy */}
      <div className={`flex flex-col ${layout === "stacked" ? "items-center mt-2" : "items-start justify-center"}`}>
        {/* Primary Hero Brand Name */}
        <span
          className={`font-sans font-extrabold leading-tight select-none tracking-tight ${title} ${
            light ? "text-[#FFF8E7]" : "text-[#2E7D32]"
          }`}
        >
          Anjanadri
        </span>

        {/* Secondary Category Descriptor — brand-critical, visible on all breakpoints.
            8px/0.12em on mobile keeps the ~30-char line ≤199px so the 393px
            header row (48px hamburger + 44px emblem + 48px cart) never scrolls. */}
        <span
          className={`block font-sans uppercase tracking-[0.12em] sm:tracking-[0.18em] font-bold select-none mt-0.5 whitespace-nowrap text-[8px] sm:text-[10px] lg:text-xs ${
            light ? "text-[#FFC107]" : "text-[#F57C00]"
          }`}
        >
          Dehydrated Fruits &amp; Vegetables
        </span>

        {/* Refined Tagline — desktop only so a single instance stays compact on mobile */}
        {showTagline && (
          <span
            className={`hidden lg:block font-sans font-medium tracking-wide select-none mt-0.5 ${tagline} ${
              light ? "text-[#FFF8E7]/80" : "text-[#3E2723]/70"
            }`}
          >
            100% Natural • No Preservatives
          </span>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        aria-label="Anjanadri - Nature's Crunch, Preserved"
        className={`inline-block ${className}`}
      >
        {content}
      </Link>
    );
  }

  return content;
}
