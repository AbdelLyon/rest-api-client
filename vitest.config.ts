import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
    setupFiles: ["./src/setup.ts"],
    include: ["**/?(*.)test.ts"],
    environment: "node",
    coverage: {
      provider: "v8",
      reporter: ["text", "json"],
      exclude: [
        "node_modules/",
        "tests/",
        "**/*.d.ts",
        "**/*.config.*",
        "**/types.*",
        "**/index.*",
      ],
    },
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
