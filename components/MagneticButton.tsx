"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import { m, useMotionValue, useSpring, useReducedMotion, type HTMLMotionProps } from "framer-motion";

type MagneticButtonProps = Omit<HTMLMotionProps<"button">, "ref">;

export default function MagneticButton({
  children,
  type = "button",
  disabled,
  style,
  onPointerMove,
  onPointerLeave,
  ...props
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [hasPointer, setHasPointer] = useState(false);
  const reducedMotion = useReducedMotion();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const x = useSpring(mouseX, { stiffness: 300, damping: 30 });
  const y = useSpring(mouseY, { stiffness: 300, damping: 30 });
  const enabled = hasPointer && !reducedMotion && !disabled;

  useEffect(() => {
    const media = window.matchMedia("(hover: hover) and (pointer: fine)");
    let active = true;
    const update = () => {
      if (!active) return;
      setHasPointer(media.matches);
      if (!media.matches) {
        mouseX.set(0);
        mouseY.set(0);
      }
    };
    queueMicrotask(update);
    media.addEventListener("change", update);
    return () => {
      active = false;
      media.removeEventListener("change", update);
    };
  }, [mouseX, mouseY]);

  useEffect(() => {
    if (!enabled) {
      mouseX.set(0);
      mouseY.set(0);
    }
  }, [enabled, mouseX, mouseY]);

  const handlePointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    onPointerMove?.(event);
    if (event.pointerType !== "mouse" || !buttonRef.current) return;
    const bounds = buttonRef.current.getBoundingClientRect();
    const offsetX = (event.clientX - (bounds.left + bounds.width / 2 - x.get())) * 0.2;
    const offsetY = (event.clientY - (bounds.top + bounds.height / 2 - y.get())) * 0.2;
    const distance = Math.hypot(offsetX, offsetY);
    const strength = distance > 15 ? 15 / distance : 1;
    mouseX.set(offsetX * strength);
    mouseY.set(offsetY * strength);
  };

  const handlePointerLeave = (event: PointerEvent<HTMLButtonElement>) => {
    mouseX.set(0);
    mouseY.set(0);
    onPointerLeave?.(event);
  };

  return (
    <m.button
      {...props}
      ref={buttonRef}
      type={type}
      disabled={disabled}
      style={{ ...style, x: enabled ? x : 0, y: enabled ? y : 0 }}
      onPointerMove={enabled ? handlePointerMove : onPointerMove}
      onPointerLeave={enabled ? handlePointerLeave : onPointerLeave}
    >
      {children}
    </m.button>
  );
}
