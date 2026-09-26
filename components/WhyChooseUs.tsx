"use client";

import { motion } from "framer-motion";
import {
  Leaf,
  ShieldCheck,
  Truck,
  Sparkles,
  Heart,
  Recycle,
} from "lucide-react";

const reasons = [
  {
    icon: Leaf,
    title: "100% Whole Botanicals",
    description:
      "Zero added cane sugar, zero sulfur dioxide, zero synthetic coloring. Just pure fruit and vegetable slices in their pristine natural form.",
  },
  {
    icon: ShieldCheck,
    title: "Artisanal Integrity",
    description:
      "Each small harvest is hand-inspected, taste-verified, and moisture-calibrated before sealing. If you're not delighted, we guarantee it.",
  },
  {
    icon: Truck,
    title: "Carbon-Neutral Delivery",
    description:
      "Complimentary eco-friendly shipping on orders above $35. Delivered in 100% biodegradable and recyclable kraft mailers.",
  },
  {
    icon: Sparkles,
    title: "Gentle Dehydration",
    description:
      "Our signature 48-hour slow dehydration technique retains up to 97% of live antioxidants, dietary fiber, and natural enzymes.",
  },
  {
    icon: Heart,
    title: "Sustainably Harvested",
    description:
      "Direct relationships with certified regenerative organic orchards and growers who nurture biological soil vitality.",
  },
  {
    icon: Recycle,
    title: "Zero-Waste Philosophy",
    description:
      "Every fruit core and peel byproduct is composted back into agricultural soil. We never generate single-use plastic waste.",
  },
];

export default function WhyChooseUs() {
  return (
    <section id="why" className="relative overflow-hidden bg-white py-24 lg:py-32">
      {/* Background Soft Glows */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-1/3 h-[500px] w-[500px] rounded-full bg-[#2E7D32]/6 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 bottom-10 h-[400px] w-[400px] rounded-full bg-[#F57C00]/6 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C2410C]">
            The Anjanadri Difference
          </span>
          <h2 className="font-heading mt-3 text-4xl font-semibold tracking-tight text-[#3E2723] sm:text-5xl">
            Pure. Healthy. Delicious.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[#3E2723]/70">
            We obsess over every harvest—from fertile orchard soil to sealed craft pouch—so you
            experience the unmistakable crunch of nature at its absolute finest.
          </p>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((reason, i) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.7,
                delay: (i % 3) * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="group rounded-[2rem] border border-[#F0E2C4] bg-[#FFF3D6]/60 p-8 transition-all duration-400 hover:-translate-y-1 hover:border-[#2E7D32]/40 hover:bg-white hover:shadow-[0_20px_40px_-15px_rgba(62,39,35,0.08)]"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#2E7D32]/12 text-[#2E7D32] transition-all duration-300 group-hover:bg-[#3E2723] group-hover:text-[#FFF8E7]">
                <reason.icon className="h-6 w-6" strokeWidth={1.8} />
              </div>
              <h3 className="font-heading mt-6 text-xl font-semibold text-[#3E2723]">
                {reason.title}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-[#3E2723]/70">
                {reason.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
