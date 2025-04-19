import path from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    dts({
      exclude: ["src/tests/**/*"],
      rollupTypes: true,
      entryRoot: "src",
      outputDir: "dist",
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    lib: {
      entry: {
        auth: path.resolve(__dirname, "src/auth/index.ts"),
        http: path.resolve(__dirname, "src/http/index.ts"),
        mutation: path.resolve(__dirname, "src/mutation/index.ts"),
        query: path.resolve(__dirname, "src/query/index.ts"),
      },
      formats: ["es"],
      fileName: (format, entryName) => `${entryName}.${format}.js`,
    },
    rollupOptions: {
      external: ["axios", "axios-retry", "cookies-next", "zod"],
      output: {
        format: "es",
        exports: "named",
        preserveModules: true,
        dir: "dist",
      },
    },
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: false,
  },
});
