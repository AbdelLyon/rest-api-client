import js from "@eslint/js";
import tseslint from "typescript-eslint";
import { tanstackConfig } from "@tanstack/eslint-config";

export default tseslint.config(
   {
      ignores: ["dist", "node_modules", "build", "**/*.d.ts", "**/*.config.ts"],
   },
   {
      extends: [
         js.configs.recommended,
         ...tanstackConfig
      ],
      files: ["**/*.{ts}"],
      languageOptions: {
         ecmaVersion: 2020,
         parserOptions: {
            project: "./tsconfig.json",
         },
      },
   },


);
