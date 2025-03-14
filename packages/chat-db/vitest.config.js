import { defineConfig } from "vitest/config";

export default defineConfig({
  root: "src",
  test: {
    globals: true,
    environment: "node",
    // setupFiles: './test/setup.js',
    coverage: {
      reporter: ["text", "json", "html"],
      exclude: ["node_modules/", "test/"],
    },
  },
});
