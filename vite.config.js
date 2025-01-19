import path from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
export default defineConfig({
    plugins: [
        dts({
            exclude: ["src/tests/**/*", "src/models/**/*"],
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
            fileName: function () { return "index.js"; },
        },
        rollupOptions: {
            external: ["axios", "axios-retry", "cookies-next"],
            output: {
                format: "es",
                entryFileNames: "index.js",
                chunkFileNames: "[name].js",
                assetFileNames: "[name].[ext]",
                exports: "named",
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
