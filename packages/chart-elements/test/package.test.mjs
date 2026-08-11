import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

test("compiled entry points and declarations exist", async () => {
  for (const entry of ["index", "charts", "cards", "tables", "reports", "declarative", "content", "integrations", "ui", "sample-data"]) {
    await access(new URL(`../dist/${entry}.js`, import.meta.url));
    await access(new URL(`../dist/${entry}.d.ts`, import.meta.url));
  }
  for (const stylesheet of ["styles", "components", "tokens", "palettes"]) {
    await access(new URL(`../dist/${stylesheet}.css`, import.meta.url));
  }
  await access(new URL("../dist/charts/bar-column.js", import.meta.url));
  await access(new URL("../dist/charts/bar-column.d.ts", import.meta.url));
});

test("React-facing entries preserve the client boundary", async () => {
  const entries = [
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
    "ui",
    "ui/button"
  ];
  for (const entry of entries) {
    const source = await readFile(new URL(`../dist/${entry}.js`, import.meta.url), "utf8");
    assert.match(source, /^\s*["']use client["'];/, `${entry} is missing its client boundary`);
    assert.doesNotMatch(source, /["']@\//, `${entry} contains an unresolved source alias`);
  }
});

test("component styles do not mutate the host document", async () => {
  const components = await readFile(new URL("../dist/components.css", import.meta.url), "utf8");
  const legacyAlias = await readFile(new URL("../dist/styles.css", import.meta.url), "utf8");
  const tokens = await readFile(new URL("../dist/tokens.css", import.meta.url), "utf8");
  const palettes = await readFile(new URL("../dist/palettes.css", import.meta.url), "utf8");

  assert.equal(legacyAlias, components);
  assert.doesNotMatch(
    components,
    /@layer\s+base|(?:^|})\s*(?:\*|body|html|:root|:host)\s*(?=[:,{])/im
  );
  assert.match(components, /@layer\s+chart-elements/);
  assert.doesNotMatch(components, /@layer\s+utilities/);
  assert.doesNotMatch(components, /--tw-/);
  assert.match(components, /--ce-tw-/);
  assert.match(tokens, /:root\s*\{/);
  assert.match(tokens, /\.dark\s*\{/);
  assert.match(palettes, /\[data-palette=/);
});
