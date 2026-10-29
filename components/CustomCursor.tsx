"use client";

import { useEffect, useState } from "react";
import { m, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const x = useSpring(mouseX, { stiffness: 400, damping: 35, mass: 0.5 });
  const y = useSpring(mouseY, { stiffness: 400, damping: 35, mass: 0.5 });

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    const update = () => setEnabled(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const hide = () => {
      setVisible(false);
      setHovered(false);
      delete document.documentElement.dataset.customCursor;
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      if (document.documentElement.dataset.customCursor !== "active") {
        x.jump(event.clientX);
        y.jump(event.clientY);
        setVisible(true);
        hover(event);
        document.documentElement.dataset.customCursor = "active";
      }
      mouseX.set(event.clientX);
      mouseY.set(event.clientY);
    };
    const hover = (event: PointerEvent) => {
      setHovered(event.target instanceof Element && Boolean(event.target.closest("[data-product-card], button, [role='button'], a")));
    };
    document.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", hover, { passive: true });
    document.addEventListener("pointerleave", hide);
    document.addEventListener("keydown", hide);
    window.addEventListener("blur", hide);
    return () => {
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", hover);
      document.removeEventListener("pointerleave", hide);
      document.removeEventListener("keydown", hide);
      window.removeEventListener("blur", hide);
      hide();
    };
  }, [enabled, mouseX, mouseY, x, y]);

  if (!enabled) return null;

  return (
    <m.div
      aria-hidden="true"
      data-custom-cursor
      className="pointer-events-none fixed left-0 top-0 z-[100] mix-blend-difference"
      style={{ x, y }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.15 }}
    >
      <m.div
        className="size-6 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-[0_0_24px_rgba(16,185,129,0.35)]"
        animate={{ scale: hovered ? 2.5 : 1, backgroundColor: hovered ? "#A7F3D0" : "#FFFFFF" }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      />
    </m.div>
  );
}
