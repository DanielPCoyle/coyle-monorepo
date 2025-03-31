import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    // setupFiles: './test/setup.js',
    coverage: {
      reporter: ["text", "json", "html"],
      exclude: ["node_modules/", "test/", "vitest.config.*", "eslint.config.*"],
    },
  },
});
