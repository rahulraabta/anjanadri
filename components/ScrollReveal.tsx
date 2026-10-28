"use client";

import type { ReactNode } from "react";
import { m, useReducedMotion } from "framer-motion";

export default function ScrollReveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reducedMotion = useReducedMotion();

  return (
    <m.div
      className={className}
      initial={{ opacity: 0, y: 50 }}
      animate={reducedMotion ? { opacity: 1, y: 0 } : undefined}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: reducedMotion ? 0 : 0.8, ease: "easeOut" }}
    >
      {children}
    </m.div>
  );
}
