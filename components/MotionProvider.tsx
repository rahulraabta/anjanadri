"use client";

import type { ReactNode } from "react";
import { LazyMotion, domAnimation } from "framer-motion";

const loadExtendedFeatures = () =>
  import("@/lib/motion-dom-max").then((module) => module.default);

export default function MotionProvider({
  children,
  extended = false,
}: {
  children: ReactNode;
  extended?: boolean;
}) {
  return (
    <LazyMotion features={extended ? loadExtendedFeatures : domAnimation} strict>
      {children}
    </LazyMotion>
  );
}
