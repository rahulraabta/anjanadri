"use client";

import { motion } from "framer-motion";
import { Thermometer, Timer, Zap, Droplets } from "lucide-react";

const insights = [
  {
    icon: Thermometer,
    title: "Low & Slow Heat",
    text: "Our dehydrators run at low temperatures. This keeps heat-sensitive vitamins C, B-complex, and folate intact — unlike frying, which breaks them down.",
  },
  {
    icon: Timer,
    title: "Slow, Not Rushed",
    text: "Patience is the secret ingredient. Frying is fast but adds oil and destroys cellular structure. Our slow-dry removes only water, concentrating flavor naturally.",
  },
  {
    icon: Zap,
    title: "Living Enzymes Preserved",
    text: "Enzymes like bromelain (pineapple) and papain (papaya) break down under high heat. Our low-temperature method keeps them intact.",
  },
  {
    icon: Droplets,
    title: "No Oil, No Acrylamide",
    text: "Fried snacks can form acrylamide at high temperatures. Dehydration uses no oil and no extreme heat, so none is formed.",
  },
];

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
