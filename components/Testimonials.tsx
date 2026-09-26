"use client";

import { motion, type Variants } from "framer-motion";
import { Quote } from "lucide-react";
import Image from "next/image";

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Nutritionist & Wellness Coach",
    avatar: "1494790108377-be9c29b29330",
    rating: 5,
    text: "I recommend Anjanadri to all my clients. The fact that they use zero added sugar and no sulfur dioxide is incredibly rare. You can taste the difference — it's just fruit.",
  },
  {
    name: "Rahul Menon",
    role: "Home Chef & Food Blogger",
    avatar: "1507003211169-0a1dd7228f2d",
    rating: 5,
    text: "These aren't chips — they're ingredients. I use the beetroot crisps in salads and the apple chips as a granola topper. The texture and flavor intensity is unmatched.",
  },
  {
    name: "Ananya Reddy",
    role: "Mother of Two",
    avatar: "1534528741775-53994a69daeb",
    rating: 5,
    text: "Finally a snack I feel good giving my kids. No hidden junk, just real fruit. My daughter calls the mango slices 'nature's candy' — and she's right.",
  },
  {
    name: "Dr. Karthik Iyer",
    role: "Sports Dietitian",
    avatar: "1472099645785-5658abf4ff4e",
    rating: 5,
    text: "Low-temperature dehydration at 48 hours is the gold standard. It preserves the enzymatic structure that frying or high-heat baking destroys. Anjanadri gets the science right.",
  },
  {
    name: "Meera Joshi",
    role: "Yoga Instructor",
    avatar: "1438761681033-6461ffad8d80",
    rating: 4,
    text: "I take a pouch of the Mixed Berry Medley to every retreat. It's light, nutrient-dense, and the flavors are so pure you'd think you picked the berries yourself.",
  },
  {
    name: "Vikram Das",
    role: "Organic Farm Advocate",
    avatar: "1500648767791-00dcc994a43e",
    rating: 5,
    text: "What I respect most about Anjanadri is their transparency. Direct from farm, no chemical processing, compostable packaging. This is how food should be done.",
  },
];

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 200,
      damping: 24,
    },
  },
};

export default function Testimonials() {
  return (
    <section id="reviews" className="relative overflow-hidden bg-[#FFF3D6] py-24 lg:py-32 border-t border-[#F0E2C4]">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 top-1/4 h-[500px] w-[500px] rounded-full bg-[#F57C00]/5 blur-3xl"
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
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#C2410C]">
            What People Say
          </span>
          <h2 className="font-heading mt-3 text-4xl font-semibold tracking-tight text-[#3E2723] sm:text-5xl">
            Trusted by Thousands
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[#3E2723]/70">
            From nutritionists to busy parents, people who care about what they eat choose Anjanadri.
          </p>
        </motion.div>

        {/* Testimonial Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {testimonials.map((t) => (
            <motion.div
              key={t.name}
              variants={cardVariants}
              className="group flex flex-col rounded-[2rem] border border-[#F0E2C4] bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(62,39,35,0.08)]"
            >
              {/* Quote icon */}
              <Quote className="h-7 w-7 text-[#F0E2C4] mb-3" strokeWidth={1.5} />

              <p className="flex-1 text-sm leading-relaxed text-[#3E2723]/70">
                &ldquo;{t.text}&rdquo;
              </p>

              {/* Author */}
              <div className="mt-5 flex items-center gap-3 border-t border-[#F0E2C4] pt-5">
                <div className="h-10 w-10 overflow-hidden rounded-full bg-[#F0E2C4]">
                  <Image
                    src={`https://images.unsplash.com/photo-${t.avatar}?w=80&h=80&fit=crop&q=80`}
                    alt={t.name}
                    width={40}
                    height={40}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#3E2723]">{t.name}</p>
                  <p className="text-xs text-[#3E2723]/55">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
