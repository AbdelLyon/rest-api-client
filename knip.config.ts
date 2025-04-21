import type { KnipConfig } from "knip";

const config: KnipConfig = {
  entry: ["src/index.ts"],
  project: ["src/**/*.ts"],
  eslint: true,
  ignore: ["src/**/index.ts", "src/**/*.d.ts", "dist"],

  ignoreExportsUsedInFile: {
    type: true,
    interface: true,
  },
};

export default config;
