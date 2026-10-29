"use client";

import { Children, createRef, isValidElement, useEffect, useMemo, useState, type ReactNode, type RefObject } from "react";
import { m, useReducedMotion, useScroll, useTransform } from "framer-motion";

interface StackCardProps {
  children: ReactNode;
  cardRef: RefObject<HTMLDivElement | null>;
  nextRef?: RefObject<HTMLDivElement | null>;
  enabled: boolean;
  index: number;
}

function StackCard({ children, cardRef, nextRef, enabled, index }: StackCardProps) {
  const [pinTop, setPinTop] = useState(0);
  const { scrollYProgress } = useScroll({ target: nextRef ?? cardRef, offset: ["start end", "start start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.5]);

  useEffect(() => {
    const card = cardRef.current;
    if (!enabled || !card) return;
    const update = () => setPinTop(Math.min(0, window.innerHeight - card.offsetHeight));
    const observer = new ResizeObserver(update);
    observer.observe(card);
    window.addEventListener("resize", update);
    update();
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [cardRef, enabled]);

  return (
    <div
      ref={cardRef}
      data-stack-card
      className="relative md:sticky md:top-0"
      style={{ position: enabled ? undefined : "relative", top: enabled ? pinTop : undefined, zIndex: enabled ? index + 1 : undefined }}
    >
      <m.div
        className="origin-top bg-[#FFF8E7] md:overflow-clip md:rounded-t-[2rem] md:shadow-[0_-12px_40px_rgba(62,39,35,0.08)]"
        style={{ scale: enabled && nextRef ? scale : 1, opacity: enabled && nextRef ? opacity : 1 }}
      >
        {children}
      </m.div>
    </div>
  );
}

export default function StickyStack({ children }: { children: ReactNode }) {
  const cards = Children.toArray(children);
  const refs = useMemo(() => Children.toArray(children).map(() => createRef<HTMLDivElement>()), [children]);
  const [desktop, setDesktop] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const update = () => setDesktop(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return (
    <div className="relative md:isolate" data-sticky-stack>
      {cards.map((card, index) => (
        <StackCard key={isValidElement(card) ? card.key ?? index : index} cardRef={refs[index]} nextRef={refs[index + 1]} enabled={desktop && !reducedMotion} index={index}>
          {card}
        </StackCard>
      ))}
    </div>
  );
}
