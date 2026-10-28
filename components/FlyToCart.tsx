"use client";

import { useEffect, useEffectEvent } from "react";
import { m, useAnimationControls, useReducedMotion } from "framer-motion";
import { useCart } from "@/context/CartContext";

export const CART_FLIGHT_DURATION = 0.8;
export const CART_LANDING_DURATION = 0.35;

export default function FlyToCart() {
  const { flyingImage, flyingImageId, setFlyingImage, openCart } = useCart();
  const animation = useAnimationControls();
  const reducedMotion = useReducedMotion();
  const finishFlight = useEffectEvent(() => {
    setFlyingImage("");
    openCart();
  });

  useEffect(() => {
    if (!flyingImage) return;
    if (reducedMotion) {
      finishFlight();
      return;
    }

    const cart = document.getElementById("cart-icon")?.getBoundingClientRect();
    const targetX = cart ? cart.left + cart.width / 2 : window.innerWidth - 32;
    const targetY = cart ? cart.top + cart.height / 2 : 32;
    let cancelled = false;
    let landingTimer: ReturnType<typeof setTimeout> | undefined;

    animation.set({ x: 0, y: 0, scale: 1, opacity: 1 });
    void animation.start({
      x: targetX - window.innerWidth / 2,
      y: targetY - window.innerHeight / 2,
      scale: 0.15,
      opacity: 0,
      transition: { duration: CART_FLIGHT_DURATION, ease: [0.22, 1, 0.36, 1] },
    }).then(() => {
      if (cancelled) return;
      landingTimer = setTimeout(() => finishFlight(), CART_LANDING_DURATION * 1000);
    });

    return () => {
      cancelled = true;
      clearTimeout(landingTimer);
      animation.stop();
    };
  }, [flyingImage, flyingImageId, animation, reducedMotion]);

  if (!flyingImage || reducedMotion) return null;

  return (
    <m.img
      key={flyingImageId}
      src={flyingImage}
      alt=""
      aria-hidden="true"
      initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
      animate={animation}
      className="pointer-events-none fixed left-1/2 top-1/2 z-[100] -ml-12 -mt-12 h-24 w-24 rounded-2xl object-cover shadow-lg"
    />
  );
}
