import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const packageDirectory = resolve(fileURLToPath(new URL("..", import.meta.url)));
const clientEntries = [
  "index",
  "charts",
  "charts/bar-column",
  "charts/line-area",
  "charts/frame",
  "cards",
  "tables",
  "slicers",
  "maps",
  "reports",
  "analytics",
  "navigation",
  "shapes",
  "overlays",
  "declarative",
  "content",
  "integrations",
  "ui",
  "ui/button",
];

for (const entry of clientEntries) {
  const path = resolve(packageDirectory, `dist/${entry}.js`);
  const source = await readFile(path, "utf8");
  if (!/^\s*["']use client["'];/.test(source)) {
    await writeFile(path, `"use client";\n${source}`);
  }
}
