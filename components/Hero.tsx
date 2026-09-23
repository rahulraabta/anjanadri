"use client";

import { motion } from "framer-motion";
import { ArrowRight, Star, ShieldCheck, Sparkles, Compass, CheckCircle2, Flame } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Logo from "./Logo";

// Buttery spring animations as per agent rules
const springFadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 110,
      damping: 18,
      delay: i * 0.12,
    },
  }),
};

export default function Hero() {
  return (
    <section className="relative min-h-[75vh] lg:min-h-[82vh] overflow-hidden bg-[#FDFBF7] flex items-center border-b border-[#EDE5D8]">
      {/* Background warm atmospheric radial glow & organic shapes */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 -top-24 h-[650px] w-[650px] rounded-full bg-[#B85D3B]/8 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-36 -left-28 h-[600px] w-[600px] rounded-full bg-[#6E7D60]/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(184,93,59,0.06),rgba(253,251,247,0))]"
      />

      <div className="relative mx-auto w-full max-w-7xl px-6 py-12 sm:py-16 lg:py-20 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-14">
          {/* Left Column: Brand Billboard Statement */}
          <div className="relative z-10 lg:col-span-7 flex flex-col items-start">
            {/* Category / Heritage Pill */}
            <motion.div
              custom={0}
              variants={springFadeUp}
              initial="hidden"
              animate="visible"
              className="inline-flex items-center gap-2.5 rounded-full border border-[#B85D3B]/25 bg-[#F7F3EB] px-4 py-1.5 shadow-xs"
            >
              <Sparkles className="h-3.5 w-3.5 text-[#B85D3B]" />
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#B85D3B]">
                Small-Batch Artisanal Pantry
              </span>
              <span className="hidden sm:inline text-xs text-[#8C7A6B]">&bull;</span>
              <span className="hidden sm:inline text-xs font-medium text-[#6E7D60]">
                100% Pure Harvest
              </span>
            </motion.div>

            {/* Massive Brand Billboard Headline */}
            <motion.div
              custom={1}
              variants={springFadeUp}
              initial="hidden"
              animate="visible"
              className="mt-6"
            >
              <h1 className="font-heading font-extrabold tracking-tight text-[#4A2E1B] leading-[0.98] text-5xl sm:text-7xl lg:text-[5.5rem] xl:text-[6rem]">
                Anjanadri
              </h1>
              <p className="font-heading italic font-semibold text-[#B85D3B] text-2xl sm:text-3xl lg:text-4xl mt-2 tracking-tight">
                Dehydrated Fruits &amp; Vegetables
              </p>
            </motion.div>

            {/* Value Proposition & Editorial Hook */}
            <motion.div
              custom={2}
              variants={springFadeUp}
              initial="hidden"
              animate="visible"
              className="mt-5"
            >
              <p className="font-heading text-xl sm:text-2xl font-medium text-[#4A2E1B] tracking-tight">
                Nature&apos;s Crunch, Preserved.
              </p>
              <p className="mt-3 max-w-xl text-base sm:text-lg leading-relaxed text-[#6B584C]">
                Hand-selected whole fruits and crisp garden vegetables, gently slow-dried at
                42&deg;C for 48 hours. Zero additives, zero sulfites, zero added sugars—capturing
                97% of natural vitamins and an unforgettable artisanal snap.
              </p>
            </motion.div>

            {/* Action Buttons: High-Contrast Shop Now & Intelligent Quiz */}
            <motion.div
              custom={3}
              variants={springFadeUp}
              initial="hidden"
              animate="visible"
              className="mt-8 flex flex-wrap items-center gap-4 w-full sm:w-auto"
            >
              {/* High-contrast Shop Now Button */}
              <a
                href="#shop"
                className="group relative inline-flex items-center justify-center gap-3 rounded-full bg-[#B85D3B] px-8 py-4 text-base font-bold text-white shadow-[0_12px_28px_-6px_rgba(184,93,59,0.45)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#A34E2F] hover:shadow-[0_18px_36px_-6px_rgba(184,93,59,0.55)] focus:ring-4 focus:ring-[#B85D3B]/25 active:translate-y-0"
              >
                <span>Shop The Pantry</span>
                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1.5" />
              </a>

              {/* Intelligent Flavor Quiz Shortcut */}
              <a
                href="#quiz"
                className="group inline-flex items-center justify-center gap-2.5 rounded-full border-2 border-[#4A2E1B] bg-transparent px-7 py-4 text-base font-bold text-[#4A2E1B] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#4A2E1B] hover:text-[#FDFBF7] shadow-xs"
              >
                <Compass className="h-5 w-5 text-[#B85D3B] group-hover:text-[#FDFBF7] transition-colors" />
                <span>Find Your Crunch Quiz</span>
              </a>
            </motion.div>

            {/* Key Trust Signals */}
            <motion.div
              custom={4}
              variants={springFadeUp}
              initial="hidden"
              animate="visible"
              className="mt-8 flex flex-wrap items-center gap-y-2 gap-x-5 text-xs font-semibold text-[#6E7D60]"
            >
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-[#6E7D60]" />
                Zero Added Sugars
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-[#6E7D60]" />
                Non-GMO &amp; 100% Vegan
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-[#6E7D60]" />
                Free Shipping over $35
              </span>
            </motion.div>

            {/* Social Proof Bar */}
            <motion.div
              custom={5}
              variants={springFadeUp}
              initial="hidden"
              animate="visible"
              className="mt-8 flex items-center gap-4 border-t border-[#EDE5D8] pt-6 w-full"
            >
              <div className="flex -space-x-2.5">
                {[
                  "1534528741775-53994a69daeb",
                  "1507003211169-0a1dd7228f2d",
                  "1494790108377-be9c29b29330",
                  "1544005313-94ddf0286df2",
                ].map((imgId, i) => (
                  <div
                    key={i}
                    className="h-10 w-10 overflow-hidden rounded-full border-2 border-[#FDFBF7] bg-[#EDE5D8] shadow-xs"
                  >
                    <Image
                      src={`https://images.unsplash.com/photo-${imgId}?w=80&h=80&fit=crop&q=80`}
                      alt="Verified Customer"
                      width={40}
                      height={40}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-[#B85D3B] text-[#B85D3B]"
                    />
                  ))}
                  <span className="ml-1 text-xs font-bold text-[#4A2E1B]">4.9 / 5</span>
                </div>
                <p className="mt-0.5 text-xs text-[#8C7A6B]">
                  Loved by <strong className="font-semibold text-[#4A2E1B]">12,000+</strong> healthy snackers worldwide
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Immersive Full-Bleed Artisanal Composition */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              type: "spring",
              stiffness: 90,
              damping: 20,
              delay: 0.25,
            }}
            className="relative lg:col-span-5"
          >
            {/* Visual Frame */}
            <div className="relative aspect-[4/5] sm:aspect-[1/1] lg:aspect-[4/5] overflow-hidden rounded-[2.75rem] border border-[#EDE5D8] bg-[#F7F3EB] p-3 shadow-[0_30px_70px_-20px_rgba(74,46,27,0.18)]">
              <div className="relative h-full w-full overflow-hidden rounded-[2.25rem]">
                <Image
                  src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=1000&q=85"
                  alt="Artisanal dehydrated fruit & vegetable harvest"
                  fill
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover transition-transform duration-1000 ease-out hover:scale-105"
                  priority
                />
                {/* Semi-transparent warm editorial gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#4A2E1B]/75 via-[#4A2E1B]/20 to-transparent" />

                {/* Inner caption over image */}
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="inline-block rounded-full bg-[#B85D3B] px-3 py-1 text-[11px] font-bold uppercase tracking-wider">
                    Peak Ripeness Harvest
                  </span>
                  <p className="font-heading mt-2 text-2xl font-bold leading-tight">
                    Every slice tells a farm-fresh story.
                  </p>
                  <p className="mt-1 text-xs text-white/80">
                    Naturally sweet &bull; No added sugars or preservatives
                  </p>
                </div>
              </div>

              {/* Floating Badge: 48h Low Temp */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, type: "spring", stiffness: 120 }}
                className="absolute left-6 top-8 rounded-2xl border border-white/60 bg-[#FDFBF7]/95 p-4 shadow-[0_15px_35px_rgba(74,46,27,0.15)] backdrop-blur-md"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#6E7D60]/15 text-[#6E7D60]">
                    <ShieldCheck className="h-5 w-5" strokeWidth={2} />
                  </span>
                  <div>
                    <p className="font-heading text-lg font-bold text-[#4A2E1B] leading-none">
                      48-Hour
                    </p>
                    <p className="text-[11px] text-[#8C7A6B] mt-0.5">
                      42°C slow dehydration
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Floating Badge: 97% Nutrient Retention */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, type: "spring", stiffness: 120 }}
                className="absolute right-6 top-24 rounded-2xl bg-[#4A2E1B] px-4 py-3 text-[#FDFBF7] shadow-[0_18px_40px_-10px_rgba(74,46,27,0.45)]"
              >
                <div className="flex items-center gap-2">
                  <Flame className="h-4 w-4 text-[#D48060]" />
                  <span className="text-xs font-bold tracking-wide uppercase text-[#EDE5D8]">
                    97% Nutrients Locked
                  </span>
                </div>
                <p className="text-[11px] text-white/70 mt-0.5">Vitamins, enzymes &amp; fiber</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

