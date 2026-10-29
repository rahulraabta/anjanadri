"use client";

import { m as motion, useReducedMotion } from "framer-motion";

interface InfiniteMarqueeProps {
  text?: string;
}

export default function InfiniteMarquee({
  text = "100% NATURAL  NO PRESERVATIVES  DEHYDRATED IN MYSORE",
}: InfiniteMarqueeProps) {
  const reducedMotion = useReducedMotion();

  return (
    <div className="overflow-hidden border-y border-[#F0E2C4] bg-[#F1F8E9] py-6 md:py-8">
      <p className="sr-only">{text}</p>
      <div
        aria-hidden="true"
        className="font-heading text-4xl font-bold uppercase leading-tight text-transparent md:text-6xl"
        style={{ WebkitTextStroke: "1px #2E7D32" }}
      >
        {reducedMotion ? (
          <p className="px-6 text-center">{text}</p>
        ) : (
          <div className="flex">
            {[0, 1].map((copy) => (
              <motion.div
                key={copy}
                className="flex min-w-full shrink-0 items-center justify-around whitespace-pre"
                animate={{ x: ["0%", "-100%"] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                {[0, 1].map((repetition) => (
                  <span key={repetition} className="px-6">{text}</span>
                ))}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
