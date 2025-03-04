import path from "path";

import { defineConfig } from "vitest/config";

export default defineConfig({
  root: "src",

  test: {
    clearMocks: true,

    globalSetup: "./vitest/setup.ts",

    deps: {
      moduleDirectories: ["node_modules", path.resolve("../../packages")],
    },

    fileParallelism: false,
  },
});
