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
var modules = ["hooks", "services", "models", "interfaces"];
var entries = __assign(__assign({}, modules.reduce(function (acc, module) {
    acc["rest-api/".concat(module)] = path.resolve(__dirname, "src/rest-api/".concat(module, "/index.ts"));
    return acc;
}, {})), { "react-query": path.resolve(__dirname, "src/react-query/index.ts") });
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
            fileName: function (format, entryName) { return "".concat(entryName, "/index.").concat(format, ".js"); },
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
