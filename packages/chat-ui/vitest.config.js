import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,  // ✅ Enables global `expect`
    environment: 'jsdom',  // ✅ Ensures the correct test environment for React
  },
});
