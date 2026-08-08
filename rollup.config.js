import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";

const dev = !!process.env.ROLLUP_WATCH;

export default {
  input: "src/ambient-screensaver-card.ts",
  output: {
    file: "ambient-screensaver-card.js",
    format: "es",
    sourcemap: dev,
  },
  plugins: [
    nodeResolve(),
    typescript({ sourceMap: dev, inlineSources: dev }),
    !dev && terser(),
  ].filter(Boolean),
};
