"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { Leaf, Sun, Droplets, Heart } from "lucide-react";

const milestones = [
  {
    icon: Leaf,
    title: "Rooted in the Hills",
    text: "Anjanadri began in the lush orchards of South India, where generations of farming families have cultivated fruit with reverence for the land. We work directly with these growers — no middlemen, no compromise.",
  },
  {
    icon: Sun,
    title: "The 48-Hour Promise",
    text: "Every slice is dehydrated over 48 hours at temperatures below 65°C. This slow, patient process removes moisture while preserving up to 97% of the original vitamins, fiber, and natural enzymes that heat-based methods destroy.",
  },
  {
    icon: Droplets,
    title: "Nothing Added, Nothing Lost",
    text: "We never add sugar, sulfur dioxide, artificial color, or preservatives. What you taste is the fruit itself — concentrated, intensified, honest. The ingredient list is always one word long.",
  },
  {
    icon: Heart,
    title: "Crafted, Not Manufactured",
    text: "Each batch is hand-inspected and taste-tested before sealing. We believe snacking should nourish — not just fill. That's why families, fitness enthusiasts, and chefs trust Anjanadri for nature's purest crunch.",
  },
];

export default function OurStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section
      ref={sectionRef}
      id="our-story"
      className="relative overflow-hidden bg-[#FDFBF7] py-24 lg:py-32"
    >
      {/* Background wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-0 h-[600px] w-[600px] rounded-full bg-[#6E7D60]/5 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#B85D3B]">
            Our Heritage
          </span>
          <h2 className="font-heading mt-3 text-4xl font-semibold tracking-tight text-[#4A2E1B] sm:text-5xl">
            From Orchard to{" "}
            <span className="italic font-normal text-[#B85D3B]">Your Pantry</span>
          </h2>
          <p className="mt-5 text-base leading-relaxed text-[#6B584C]">
            Anjanadri isn't a factory — it's a philosophy. We believe the best snack is the simplest one:
            real fruit, nothing else. Here's how we got here and why it matters.
          </p>
        </motion.div>

        {/* Two-column layout: image + milestones */}
        <div className="mt-16 grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left: parallax image panel */}
          <motion.div
            style={{ y: imageY }}
            className="relative hidden lg:block"
          >
            <div className="relative aspect-[3/4] overflow-hidden rounded-[2.5rem] border border-[#EDE5D8] shadow-[0_30px_60px_-20px_rgba(74,46,27,0.12)]">
              <Image
                src="https://images.unsplash.com/photo-1464454709131-ffd692591ee5?w=800&q=80"
                alt="Lush fruit orchard at golden hour"
                fill
                sizes="45vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#4A2E1B]/40 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8 right-8">
                <p
                  className="text-2xl text-white/90"
                  style={{ fontFamily: "var(--font-script, cursive)" }}
                >
                  "We don't make snacks — we preserve nature."
                </p>
                <p className="mt-2 text-sm font-medium text-white/70">
                  — Anjanadri Founding Team
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right: milestone cards */}
          <div className="space-y-6">
            {milestones.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{
                  duration: 0.7,
                  delay: i * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="group flex gap-5 rounded-[1.5rem] border border-[#EDE5D8] bg-[#F7F3EB]/50 p-6 transition-all duration-400 hover:border-[#6E7D60]/40 hover:bg-[#FDFBF7] hover:shadow-[0_16px_32px_-12px_rgba(74,46,27,0.08)]"
              >
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-[#6E7D60]/12 text-[#6E7D60] transition-all duration-300 group-hover:bg-[#4A2E1B] group-hover:text-[#FDFBF7]">
                  <item.icon className="h-5 w-5" strokeWidth={1.8} />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-semibold text-[#4A2E1B]">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-[#6B584C]">
                    {item.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
