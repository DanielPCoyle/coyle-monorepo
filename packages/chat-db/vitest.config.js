import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    exclude: ["dist", "drizzle.config.ts", "coverage"],
  },
});
