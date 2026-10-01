import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = defineConfig([
  ...nextVitals,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // plain <img> on purpose: the global img rule in globals.css handles
      // sizing/object-fit, and next/image's wrapper fights it.
      "@next/next/no-img-element": "off",
    },
  },
]);

export default eslintConfig;
