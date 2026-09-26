"use client";

import { motion, type Variants } from "framer-motion";
import { Thermometer, Timer, Zap, Droplets, Flame, Apple } from "lucide-react";

const comparisons = [
  {
    label: "Nutrient Retention",
    dehydrated: "Up to 97%",
    fried: "40–55%",
    dehydratedPct: 97,
    friedPct: 47,
  },
  {
    label: "Fat Content",
    dehydrated: "< 1 g",
    fried: "12–18 g",
    dehydratedPct: 5,
    friedPct: 80,
  },
  {
    label: "Fiber Preserved",
    dehydrated: "95%+",
    fried: "30–50%",
    dehydratedPct: 95,
    friedPct: 40,
  },
  {
    label: "Enzyme Activity",
    dehydrated: "Intact",
    fried: "Destroyed",
    dehydratedPct: 92,
    friedPct: 8,
  },
];

const insights = [
  {
    icon: Thermometer,
    title: "Below 65°C",
    text: "Our dehydrators never exceed 65°C. This keeps heat-sensitive vitamins C, B-complex, and folate intact — unlike frying at 180°C+ which breaks them down irreversibly.",
  },
  {
    icon: Timer,
    title: "48 Hours, Not 4 Minutes",
    text: "Patience is the secret ingredient. Frying takes minutes but adds oil and destroys cellular structure. Our 48-hour slow-dry removes only water, concentrating flavor naturally.",
  },
  {
    icon: Zap,
    title: "Living Enzymes Preserved",
    text: "Enzymes like bromelain (pineapple) and papain (papaya) aid digestion. They denature above 70°C. Our low-temperature method keeps them bioactive and functional.",
  },
  {
    icon: Droplets,
    title: "No Oil, No Acrylamide",
    text: "Fried snacks produce acrylamide — a suspected carcinogen formed at high temperatures. Dehydration produces zero acrylamide because there's no oil and no extreme heat.",
  },
];

const barVariants: Variants = {
  hidden: { width: 0 },
  visible: (pct: number) => ({
    width: `${pct}%`,
    transition: {
      duration: 1.2,
      ease: [0.16, 1, 0.3, 1] as const,
      delay: 0.2,
    },
  }),
};

export default function DehydrationScience() {
  return (
    <section id="process" className="relative overflow-hidden bg-white py-24 lg:py-32 border-t border-[#F0E2C4]">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 bottom-0 h-[450px] w-[450px] rounded-full bg-[#2E7D32]/5 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#2E7D32]">
            The Science of Flavor
          </span>
          <h2 className="font-heading mt-3 text-4xl font-semibold tracking-tight text-[#3E2723] sm:text-5xl">
            Why Dehydrated &gt; Fried
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[#3E2723]/70">
            Not all dried snacks are equal. Here's the nutritional science behind why low-temperature
            dehydration is the gold standard — and why frying destroys what matters most.
          </p>
        </motion.div>

        {/* Comparison bars */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mx-auto mt-14 max-w-3xl space-y-6 rounded-[2rem] border border-[#F0E2C4] bg-[#FFF3D6]/50 p-8"
        >
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#3E2723]/55 pb-2 border-b border-[#F0E2C4]">
            <span className="flex items-center gap-2">
              <Apple className="h-4 w-4 text-[#2E7D32]" /> Slow Dehydration
            </span>
            <span className="flex items-center gap-2">
              <Flame className="h-4 w-4 text-[#C2410C]" /> Deep Frying
            </span>
          </div>

          {comparisons.map((c, i) => (
            <div key={c.label}>
              <p className="text-sm font-medium text-[#3E2723] mb-2">{c.label}</p>
              <div className="space-y-1.5">
                {/* Dehydrated bar */}
                <div className="flex items-center gap-3">
                  <div className="h-3 flex-1 overflow-hidden rounded-full bg-[#F0E2C4]">
                    <motion.div
                      custom={c.dehydratedPct}
                      variants={barVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      className="h-full rounded-full bg-gradient-to-r from-[#2E7D32] to-[#66BB6A]"
                    />
                  </div>
                  <span className="w-16 text-right text-xs font-semibold text-[#2E7D32]">
                    {c.dehydrated}
                  </span>
                </div>
                {/* Fried bar */}
                <div className="flex items-center gap-3">
                  <div className="h-3 flex-1 overflow-hidden rounded-full bg-[#F0E2C4]">
                    <motion.div
                      custom={c.friedPct}
                      variants={barVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      className="h-full rounded-full bg-gradient-to-r from-[#F57C00] to-[#FFB74D]"
                    />
                  </div>
                  <span className="w-16 text-right text-xs font-semibold text-[#C2410C]">
                    {c.fried}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Educational insight cards */}
        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {insights.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{
                duration: 0.6,
                delay: i * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="group flex gap-5 rounded-[1.5rem] border border-[#F0E2C4] bg-[#FFF3D6]/40 p-6 transition-all duration-300 hover:bg-white hover:shadow-[0_16px_32px_-12px_rgba(62,39,35,0.06)]"
            >
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-[#2E7D32]/12 text-[#2E7D32] transition-all duration-300 group-hover:bg-[#2E7D32] group-hover:text-white">
                <item.icon className="h-5 w-5" strokeWidth={1.8} />
              </div>
              <div>
                <h3 className="font-heading text-lg font-semibold text-[#3E2723]">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-[#3E2723]/70">
                  {item.text}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
