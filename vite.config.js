import path from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

const modules = ["auth", "http", "mutation", "query"];

export default defineConfig({
  plugins: [
    dts({
      exclude: ["src/tests/**/*"],
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: "es2015",
    minify: "terser",
    lib: {
      entry: {
        ...Object.fromEntries(
          modules.map((module) => [
            module,
            path.resolve(__dirname, `src/${module}/index.ts`),
          ]),
        ),
      },
      name: "rest-api-client",
      formats: ["es"],
    },
    rollupOptions: {
      external: [
        "axios",
        "axios-retry",
        "cookies-next",
        "zod",
        /^node_modules\/.*/,
      ],
      output: {
        exports: "named",
        entryFileNames: (chunkInfo) => {
          return `${chunkInfo.name}/index.es.js`;
        },
        assetFileNames: (chunkInfo) => {
          if (chunkInfo.type?.endsWith(".d.ts")) {
            return `${chunkInfo.type.replace(".d.ts", "")}/index.d.ts`;
          }
          return "[name][extname]";
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
});
