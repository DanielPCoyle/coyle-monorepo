import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
    exclude: ["**/.next/**", "node_modules", "dist", "**/public"],
    coverage: {
      exclude: ["**/.next/**", "node_modules", "dist", "public", "eslint.config.js", "next-env.d.ts","*.config.*","scripts/*", "./pages/edit-symbol.tsx",
        "./pages/_app.tsx",
        "./pages/_document.tsx",
      ],
    }
  },
});
