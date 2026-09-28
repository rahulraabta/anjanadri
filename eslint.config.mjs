import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next, plus build output and tooling:
    ".next/**",
    "out/**",
    "build/**",
    ".vercel/**",
    ".open-next/**",
    "next-env.d.ts",
    "node_modules/**",
    "scripts/**",
  ]),
]);

export default eslintConfig;
