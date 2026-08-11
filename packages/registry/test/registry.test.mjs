import assert from "node:assert/strict";
import test from "node:test";
import {
  getRegistryFamily,
  registryFamilies,
  stableRegistryFamilies
} from "../dist/index.js";

test("registry family ids and import paths are unique", () => {
  assert.equal(new Set(registryFamilies.map((family) => family.id)).size, registryFamilies.length);
  assert.equal(
    new Set(registryFamilies.map((family) => family.importPath)).size,
    registryFamilies.length
  );
});

test("support helpers preserve explicit maturity labels", () => {
  assert.equal(getRegistryFamily("maps")?.support, "experimental");
  assert.equal(getRegistryFamily("declarative")?.importPath, "@rwcourson/chart-elements/declarative");
  assert.equal(getRegistryFamily("theme"), undefined);
  assert.ok(stableRegistryFamilies().every((family) => family.support === "stable"));
});
