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
      img: 44,
      title: "text-xl sm:text-2xl",
      descriptor: "text-[10px]",
      tagline: "text-[10px]",
    },
    md: {
      img: 56,
      title: "text-2xl sm:text-3xl",
      descriptor: "text-[11px] sm:text-xs",
      tagline: "text-xs",
    },
    lg: {
      img: 72,
      title: "text-3xl sm:text-4xl",
      descriptor: "text-xs sm:text-sm",
      tagline: "text-sm",
    },
    xl: {
      img: 96,
      title: "text-4xl sm:text-6xl",
      descriptor: "text-sm sm:text-base",
      tagline: "text-base",
    },
  };

  const { img, title, descriptor, tagline } = sizeMap[size];

  const content = (
    <div
      className={`group inline-flex items-center cursor-pointer transition-transform duration-300 hover:scale-[1.01] ${
        layout === "stacked" ? "flex-col text-center" : "flex-row gap-3.5 sm:gap-4 text-left"
      } ${className}`}
    >
      {/* Brand Icon Emblem */}
      <div className="relative flex-shrink-0 flex items-center justify-center">
        <div
          className={`relative rounded-2xl p-1.5 transition-all duration-300 ${
            light
              ? "bg-white/10 ring-1 ring-white/20 shadow-md"
              : "bg-[#F7F3EB] border border-[#EDE5D8] shadow-[0_4px_16px_rgba(74,46,27,0.06)] group-hover:border-[#B85D3B]/40 group-hover:shadow-[0_8px_20px_rgba(184,93,59,0.12)]"
          }`}
          style={{ width: img, height: img }}
        >
          <Image
            src="/logo.png"
            alt="Anjanadri Logo"
            width={img}
            height={img}
            className={`w-full h-full object-contain transition-transform duration-500 group-hover:scale-105 ${
              light ? "brightness-0 invert drop-shadow-[0_2px_8px_rgba(255,255,255,0.4)]" : ""
            }`}
            priority
          />
        </div>
      </div>

      {/* Typography Hierarchy */}
      <div className={`flex flex-col ${layout === "stacked" ? "items-center mt-2" : "items-start justify-center"}`}>
        {/* Primary Hero Brand Name */}
        <span
          className={`font-heading font-bold leading-tight select-none tracking-tight ${title} ${
            light ? "text-[#FDFBF7]" : "text-[#4A2E1B]"
          }`}
        >
          Anjanadri
        </span>

        {/* Secondary Category Descriptor */}
        <span
          className={`font-heading uppercase tracking-[0.22em] font-semibold select-none mt-0.5 ${descriptor} ${
            light ? "text-[#D48060]" : "text-[#B85D3B]"
          }`}
        >
          Dehydrated Fruits &amp; Vegetables
        </span>

        {/* Refined Tagline */}
        {showTagline && (
          <span
            className={`font-serif italic font-normal tracking-wide select-none mt-0.5 ${tagline} ${
              light ? "text-[#EDE5D8]/80" : "text-[#6E7D60]"
            }`}
          >
            Nature&apos;s Crunch, Preserved.
          </span>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} aria-label="Anjanadri - Nature's Crunch, Preserved" className="inline-block">
        {content}
      </Link>
    );
  }

  return content;
}

