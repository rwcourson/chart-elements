import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "tsup";

const packageDirectory = path.dirname(fileURLToPath(import.meta.url));
const canonicalSource = path.resolve(packageDirectory, "../../src");

export default defineConfig({
  entry: {
    index: "src/index.ts",
    charts: "src/charts.ts",
    "charts/bar-column": "src/chart-bar-column.ts",
    "charts/line-area": "src/chart-line-area.ts",
    "charts/frame": "src/chart-frame.ts",
    cards: "src/cards.ts",
    tables: "src/tables.ts",
    slicers: "src/slicers.ts",
    maps: "src/maps.ts",
    reports: "src/reports.ts",
    analytics: "src/analytics.ts",
    navigation: "src/navigation.ts",
    shapes: "src/shapes.ts",
    overlays: "src/overlays.ts",
    declarative: "src/declarative.ts",
    content: "src/content.ts",
    integrations: "src/integrations.ts",
    ui: "src/ui.ts",
    "ui/button": "src/ui-button.ts",
    "sample-data": "src/sample-data.ts"
  },
  format: ["esm"],
  target: "es2020",
  platform: "browser",
  bundle: true,
  splitting: true,
  treeshake: true,
  minify: true,
  sourcemap: true,
  dts: true,
  clean: true,
  outDir: "dist",
  esbuildOptions(options) {
    options.alias = {
      ...(options.alias ?? {}),
      "@": canonicalSource
    };
  }
});
