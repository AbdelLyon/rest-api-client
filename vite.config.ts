import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import dts from "vite-plugin-dts";

const modules = ["services", "types"];

const entries = {
  ...modules.reduce<Record<string, string>>((acc, module) => {
    acc[module] = path.resolve(__dirname, `src/${module}/index.ts`);
    return acc;
  }, {}),
};

export default defineConfig({
  plugins: [
    react(),
    dts({
      exclude: ["src/tests/**/*", "src/models/**/*"],
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
      external: ["react", "react-dom", "axios", "axios-retry", "cookies-next"],

      output: {
        preserveModulesRoot: "src",
        preserveModules: true,
        exports: "named",
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
        tryCatchDeoptimization: false,
      },
    },
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: [
          "console.log",
          "console.info",
          "console.debug",
          "console.warn",
        ],
        passes: 2,
      },
      mangle: {
        safari10: true,
      },
      format: {
        comments: false,
      },
    },
  },

  esbuild: {
    target: "es2020",
    include: /\.(tsx?|jsx?)$/,
  },
});
