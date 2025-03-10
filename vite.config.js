// vite.config.js
import path from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
export default defineConfig({
    plugins: [
        dts({
            exclude: ["src/tests/**/*"],
            rollupTypes: true,
        }),
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    build: {
        lib: {
            entry: path.resolve(__dirname, "src/index.ts"),
            formats: ["es"],
            fileName: function (format) { return "index.".concat(format, ".js"); },
        },
        rollupOptions: {
            external: ["axios", "axios-retry", "cookies-next", "zod"],
            output: {
                format: "es",
                exports: "named",
            },
        },
        outDir: "dist",
        emptyOutDir: true,
        sourcemap: true,
    },
});
