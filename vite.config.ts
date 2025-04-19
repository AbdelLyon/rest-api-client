import { defineConfig, mergeConfig } from "vite";
import { tanstackViteConfig } from "@tanstack/vite-config";

const config = {};

export default mergeConfig(
  defineConfig(config),
  tanstackViteConfig({
    entry: "./src/index.ts",
    srcDir: "./src",
    exclude: ["src/tests/**/*"],
    cjs: false

  }),
);
