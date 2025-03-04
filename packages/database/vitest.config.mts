import path from "path";

// eslint-disable-next-line import/no-extraneous-dependencies
import { defineConfig } from "vitest/config";

// eslint-disable-next-line import/no-default-export
export default defineConfig({
  root: "src",

  test: {
    clearMocks: true,
    // globalSetup: './vitest/setup.ts',
    deps: {
      moduleDirectories: ["node_modules", path.resolve("../../packages")],
    },

    fileParallelism: false,
  },
});
