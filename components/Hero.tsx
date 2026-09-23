"use client";

import { motion } from "framer-motion";
import { ArrowRight, Star, ShieldCheck, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Logo from "./Logo";

// Buttery spring animations
const calmFadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 120,
      damping: 20,
      delay: i * 0.14,
    },
  }),
};

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#FDFBF7] py-12 lg:py-20">
      {/* Subtle organic warm ambiance orbs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-28 -top-28 h-[540px] w-[540px] rounded-full bg-[#6E7D60]/8 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -left-20 h-[460px] w-[460px] rounded-full bg-[#B85D3B]/8 blur-3xl"
      />

      <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-12 lg:gap-12 lg:px-8">
        {/* Left Column: Text & Editorial Branding */}
        <div className="relative z-10 lg:col-span-7">
          <motion.div
            custom={0}
            variants={calmFadeUp}
            initial="hidden"
            animate="visible"
            className="inline-flex items-center gap-2.5 rounded-full border border-[#6E7D60]/25 bg-[#F7F3EB] px-4 py-1.5 shadow-sm"
          >
            <Sparkles className="h-3.5 w-3.5 text-[#6E7D60]" />
<span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#6E7D60]">
              <span className="font-heading normal-case tracking-tight text-sm text-[#4A2E1B]">Anjanadri</span>
              <span className="mx-2 text-[#6E7D60]/40">·</span>
              Small-Batch Crafted
            </span>
          </motion.div>

          <motion.h1
            custom={1}
            variants={calmFadeUp}
            initial="hidden"
            animate="visible"
            className="font-heading mt-6 text-5xl font-semibold leading-[1.08] tracking-tight text-[#4A2E1B] sm:text-6xl lg:text-[4.5rem]"
          >
            Nature&apos;s Crunch,
            <br />
            <span className="italic font-normal text-[#B85D3B]">Preserved.</span>
          </motion.h1>

          <motion.p
            custom={2}
            variants={calmFadeUp}
            initial="hidden"
            animate="visible"
            className="mt-6 max-w-xl text-lg leading-relaxed text-[#6B584C]"
          >
            Hand-selected ripe fruits and crisp garden vegetables, gently slow-dried at low
            temperatures to lock in vitality, natural sweetness, and an irresistible snap.
            No additives, no sulfites, no compromises.
          </motion.p>

          <motion.div
            custom={3}
            variants={calmFadeUp}
            initial="hidden"
            animate="visible"
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <a
              href="#shop"
              className="group inline-flex items-center gap-3 rounded-full bg-[#4A2E1B] px-8 py-4 text-sm font-semibold text-[#FDFBF7] shadow-[0_12px_30px_-10px_rgba(74,46,27,0.35)] transition-all duration-400 hover:-translate-y-0.5 hover:bg-[#B85D3B] hover:shadow-[0_18px_36px_-10px_rgba(184,93,59,0.45)]"
            >
              Discover The Pantry
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <a
              href="#why"
              className="inline-flex items-center gap-2 rounded-full border border-[#EDE5D8] bg-[#F7F3EB] px-8 py-4 text-sm font-semibold text-[#4A2E1B] transition-all duration-300 hover:border-[#4A2E1B]/30 hover:bg-[#EDE5D8]/50"
            >
              Our Philosophy
            </a>
          </motion.div>

          {/* Social Proof */}
          <motion.div
            custom={4}
            variants={calmFadeUp}
            initial="hidden"
            animate="visible"
            className="mt-12 flex items-center gap-5 border-t border-[#EDE5D8] pt-8"
          >
            <div className="flex -space-x-2.5">
              {[
                "1534528741775-53994a69daeb",
                "1507003211169-0a1dd7228f2d",
                "1494790108377-be9c29b29330",
              ].map((imgId, i) => (
                <div
                  key={i}
                  className="h-10 w-10 overflow-hidden rounded-full border-2 border-[#FDFBF7] bg-[#EDE5D8]"
                >
                  <Image
                    src={`https://images.unsplash.com/photo-${imgId}?w=80&h=80&fit=crop&q=80`}
                    alt="Customer"
                    width={40}
                    height={40}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
            <div>
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-3.5 w-3.5 fill-[#B85D3B] text-[#B85D3B]"
                  />
                ))}
              </div>
              <p className="mt-1 text-xs text-[#8C7A6B]">
                Loved by <strong className="font-semibold text-[#4A2E1B]">12,000+</strong> conscious food lovers
              </p>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Premium Artisanal Flat-Lay & Brand Composition */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative lg:col-span-5"
        >
          {/* Main Visual Container */}
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] border border-[#EDE5D8] bg-[#F7F3EB] p-3 shadow-[0_30px_70px_-25px_rgba(74,46,27,0.12)]">
            <div className="relative h-full w-full overflow-hidden rounded-[2rem]">
              <Image
                src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=900&q=80"
                alt="Artisanal dried fruits flat-lay on warm neutral background"
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover transition-transform duration-1000 hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#4A2E1B]/40 via-transparent to-transparent" />
            </div>

            {/* Embedded Logo Seal Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="absolute left-8 top-8 rounded-full border border-white/60 bg-[#FDFBF7]/95 p-3 shadow-[0_15px_35px_rgba(74,46,27,0.18)] backdrop-blur-md"
            >
              <Logo size="sm" showTagline={false} />
            </motion.div>

            {/* Bottom Floating Stats Tag */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="absolute -bottom-2 -left-2 sm:-left-6 rounded-3xl border border-[#EDE5D8] bg-[#FDFBF7]/95 p-5 shadow-[0_20px_45px_-12px_rgba(74,46,27,0.18)] backdrop-blur-md"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#6E7D60]/15 text-[#6E7D60]">
                  <ShieldCheck className="h-6 w-6" strokeWidth={1.8} />
                </span>
                <div>
                  <p className="font-heading text-2xl font-bold text-[#4A2E1B]">
                    48h
                  </p>
                  <p className="text-xs text-[#8C7A6B]">
                    Low-temperature slow dehydration
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Floating Top Right Tag */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="absolute -right-2 top-10 sm:-right-4 rounded-2xl bg-[#4A2E1B] px-5 py-3.5 text-[#FDFBF7] shadow-[0_18px_40px_-10px_rgba(74,46,27,0.4)]"
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-[#EDE5D8]">Zero Added Sugars</p>
              <p className="text-sm mt-0.5 text-[#FDFBF7]/70">Anjanadri Promise</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
