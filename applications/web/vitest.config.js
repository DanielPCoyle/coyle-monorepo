import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    exclude: ["**/.next/**", "node_modules", "dist", "**/public"],
    coverage: {
      exclude: ["**/.next/**", "node_modules", "dist", "public", "eslint.config.js", "next-env.d.ts","*.config.*","scripts/*"],
    }
  },
});
