var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import dts from "vite-plugin-dts";
var modules = ["services"];
var entries = __assign({}, modules.reduce(function (acc, module) {
    acc[module] = path.resolve(__dirname, "src/".concat(module, "/index.ts"));
    return acc;
}, {}));
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
            fileName: function (format, entryName) { return "".concat(entryName, "/index.").concat(format, ".js"); },
        },
        rollupOptions: {
            external: ["axios", "axios-retry", "cookies-next"],
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
