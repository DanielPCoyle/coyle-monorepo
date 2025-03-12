import pluginJs from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { 
    files: ["**/*.{js,mjs,cjs,ts}"], 
    ignores: ["**/__tests__/*"] // Ignores test files
  },
  { languageOptions: { globals: globals.browser } },
  {
    rules: {
      "react/react-in-jsx-scope": "off",
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];
