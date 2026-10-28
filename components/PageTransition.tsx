"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, m, useIsPresent, useReducedMotion } from "framer-motion";

function AnimatedPage({ children, reducedMotion }: { children: ReactNode; reducedMotion: boolean }) {
  const isPresent = useIsPresent();
  return (
      <m.div
        inert={!isPresent}
        aria-hidden={!isPresent || undefined}
        initial={{ opacity: 0, y: reducedMotion ? 0 : 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: reducedMotion ? 0 : 0.3, ease: "easeOut" }}
        className="flex min-h-full flex-1 flex-col"
      >
        {children}
      </m.div>
  );
}

export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <div className="flex min-h-full flex-1 flex-col">{children}</div>;
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <AnimatedPage key={pathname} reducedMotion={!!reducedMotion}>
        {children}
      </AnimatedPage>
    </AnimatePresence>
  );
}
