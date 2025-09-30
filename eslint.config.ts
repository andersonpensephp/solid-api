import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
import prettierPlugin from "eslint-plugin-prettier";

export default defineConfig([
  {
    files: ["src/**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: { js, prettier: prettierPlugin },
    extends: [
      "js/recommended",
    ],
    languageOptions: { globals: globals.node },
    rules: {
      "prettier/prettier": "error"
    },
    ignores: ["node_modules", "build"],
  },
  ...tseslint.configs.recommended,
]);
