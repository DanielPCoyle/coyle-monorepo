import pluginJs from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  {
    overrides: [
      {
        files: ["*.test.ts"],
        rules: {
          "no-undef": "off",
          "no-unused-vars": "off",
          "no-console": "off",
        },
      },
    ],
  },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];
