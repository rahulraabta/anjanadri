"use client";

import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showTagline?: boolean;
  href?: string;
  light?: boolean;
}

export default function Logo({
  className = "",
  size = "md",
  showTagline = true,
  href = "/",
  light = false,
}: LogoProps) {
  const sizeMap = {
    sm: { img: 36, primary: "text-lg", secondary: "text-[9px]" },
    md: { img: 48, primary: "text-2xl", secondary: "text-[10px]" },
    lg: { img: 72, primary: "text-4xl", secondary: "text-xs" },
    xl: { img: 120, primary: "text-6xl", secondary: "text-sm" },
  };

  const { img, primary, secondary } = sizeMap[size];
  const isCompact = size === "sm";

  const content = (
    <div className={`inline-flex flex-col items-center group cursor-pointer transition-transform duration-300 hover:scale-[1.02] ${className}`}>
      <div className="relative flex items-center justify-center mb-1.5">
        <div
          className={`relative rounded-full p-1 transition-all duration-300 ${
            light ? "bg-white/10" : "bg-transparent"
          }`}
          style={{ width: img, height: img }}
        >
          <Image
            src="/logo.png"
            alt="Anjanadri"
            width={img}
            height={img}
            className={`w-full h-full object-contain ${light ? "brightness-0 invert drop-shadow-[0_2px_8px_rgba(255,255,255,0.3)]" : ""}`}
            priority
          />
        </div>
      </div>
      <div className="flex flex-col items-center text-center">
        <span
          className={`font-heading font-semibold leading-none select-none tracking-tight ${primary} ${
            light ? "text-[#FDFBF7]" : "text-[#4A2E1B]"
          }`}
        >
          Anjanadri
        </span>
        {!isCompact && showTagline && (
          <span
            className={`mt-1 uppercase tracking-[0.25em] font-medium leading-none select-none hidden sm:block ${secondary} ${
              light ? "text-[#D48060]/80" : "text-[#8C7A6B]/70"
            }`}
          >
            Dehydrated Fruits &amp; Vegetables
          </span>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} aria-label="Anjanadri Homepage" className="inline-block">
        {content}
      </Link>
    );
  }

  return content;
}
