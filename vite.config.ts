// https://vite.dev/config/
import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import dts from "vite-plugin-dts";
var modules = ["interfaces", "providers", "services", "hooks"];
export default defineConfig({
  plugins: [
    react(),
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
    lib: {
      entry: Object.fromEntries(
        modules.map(function (module) {
          return [module, path.resolve(__dirname, "src/".concat(module))];
        }),
      ),
      name: "react-sdk",
      formats: ["es"],
      fileName: function (format, entryName) {
        return ""
          .concat(entryName ? entryName + "/" : "", "react-sdk.")
          .concat(format, ".js");
      },
    },
    rollupOptions: {
      external: [
        // Peer Dependencies
        "react",
        "react-dom",
        // Dependencies
        "axios",
        "axios-retry",
        "cookies-next",
        "@tanstack/react-query",
      ],
      output: {
        globals: {
          react: "React",
        },
      },
    },
  },
});
