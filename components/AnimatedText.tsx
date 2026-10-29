"use client";

import { Fragment } from "react";
import { m as motion, useReducedMotion } from "framer-motion";

interface AnimatedTextProps {
  text: string;
  delay?: number;
}

const wordVariants = {
  hidden: { y: "100%" },
  visible: { y: 0 },
};

export default function AnimatedText({ text, delay = 0 }: AnimatedTextProps) {
  const reducedMotion = useReducedMotion();
  const words = text.trim().split(/\s+/).filter(Boolean);

  return (
    <span className="block">
      <span className="sr-only">{text}</span>
      <motion.span
        aria-hidden="true"
        className="block overflow-hidden"
        initial={reducedMotion ? false : "hidden"}
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: reducedMotion ? 0 : 0.05,
              delayChildren: reducedMotion ? 0 : delay,
            },
          },
        }}
      >
        {words.map((word, index) => (
          <Fragment key={`${word}-${index}`}>
            <span className="inline-block overflow-hidden align-top">
              <motion.span
                className="inline-block"
                variants={wordVariants}
                transition={{
                  duration: reducedMotion ? 0 : 0.7,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {word}
              </motion.span>
            </span>
            {index < words.length - 1 ? " " : null}
          </Fragment>
        ))}
      </motion.span>
    </span>
  );
}
