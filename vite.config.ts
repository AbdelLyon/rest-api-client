import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import dts from "vite-plugin-dts";

const modules = ["hooks", "services", "models", "interfaces"];

const entries = {
  ...modules.reduce<Record<string, string>>((acc, module) => {
    acc[`rest-api/${module}`] = path.resolve(
      __dirname,
      `src/rest-api/${module}/index.ts`,
    );
    return acc;
  }, {}),
  "react-query": path.resolve(__dirname, "src/react-query/index.ts"),
};

export default defineConfig({
  plugins: [
    react(),
    dts({
      exclude: ["src/tests/**/*"],
      include: ["src/rest-api/**/*", "src/react-query/**/*"],
    }),
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  build: {
    lib: {
      entry: entries,
      formats: ["es"],
      fileName: (format, entryName) => `${entryName}/index.${format}.js`,
    },

    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "@tanstack/react-query",
        "axios",
        "axios-retry",
        /^@tanstack\/.*/,
      ],

      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "@tanstack/react-query": "ReactQuery",
        },
      },
    },
  },

  esbuild: {
    target: "es2020",
    include: /\.(tsx?|jsx?)$/,
  },
});
