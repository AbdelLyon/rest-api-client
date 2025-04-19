import { tanstackViteConfig } from "@tanstack/vite-config";

export default tanstackViteConfig({
  entry: "./src/index.ts",
  srcDir: "./src",
  exclude: ["src/tests/**/*", "src/error/**/*"],
  cjs: false,
  externalDeps: [
    "axios",
    "axios-retry",
    "cookies-next",
    "zod",
    "@tanstack/.*",
    "eslint",
    "jiti",
  ],
  outDir: "dist",
  tsconfigPath: "./tsconfig.json",
});
