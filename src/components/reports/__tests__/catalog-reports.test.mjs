import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function readManifest() {
  const source = await readFile(
    new URL("../../../registry/catalog-manifest.ts", import.meta.url),
    "utf8",
  );
  const start = source.indexOf("export const catalogManifest = [");
  const end = source.indexOf("] as const satisfies", start);
  assert.ok(start >= 0 && end > start, "generated manifest array is present");
  const body = source.slice(start + "export const catalogManifest = [".length, end);
  return JSON.parse(`[${body}]`);
}

test("generated catalog retains 336 total entries and exactly 32 paginated reports", async () => {
  const manifest = await readManifest();
  const reports = manifest.filter((entry) => entry.category === "Paginated Report Visualizations");
  assert.equal(manifest.length, 336);
  assert.equal(reports.length, 32);
  assert.equal(new Set(reports.map((entry) => entry.id)).size, 32);
  assert.equal(new Set(reports.map((entry) => entry.variant)).size, 32);
});

test("every paginated entry is truthful, distinct, fixture-backed, and no higher than review", async () => {
  const manifest = await readManifest();
  const reports = manifest.filter((entry) => entry.category === "Paginated Report Visualizations");
  for (const entry of reports) {
    assert.equal(entry.component, "PaginatedReport");
    assert.equal(entry.source.module, "@/components/reports");
    assert.equal(entry.status, "review");
    assert.ok(entry.semantic.distinction.length > 24);
    assert.equal(entry.fixture.kind, "component-default");
    assert.equal(entry.docs.state, "draft");
    assert.equal(entry.reference.state, "catalog-label");
  }
  assert.equal(reports.some((entry) => entry.component === "BingMapsAdapter"), false);
  assert.equal(reports.some((entry) => /Bing|tile-backed/i.test(entry.title)), false);
  const pdfPreview = reports.find((entry) => entry.variant === "pdf-export-layout-preview");
  assert.ok(pdfPreview);
  assert.match(pdfPreview.semantic.distinction, /without claiming a PDF-render baseline/i);
});
