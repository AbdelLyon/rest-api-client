import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
    include: ["**/?(*.)test.ts"],
    environment: "node",
    coverage: {
      provider: "v8",
      reporter: ["text", "json"],
    },
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
