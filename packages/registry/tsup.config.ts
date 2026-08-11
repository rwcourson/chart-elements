import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  target: "es2020",
  platform: "neutral",
  bundle: true,
  dts: true,
  sourcemap: true,
  clean: true,
  outDir: "dist"
});
