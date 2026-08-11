import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import test from "node:test";
import { fileURLToPath } from "node:url";

const cli = fileURLToPath(new URL("../dist/index.js", import.meta.url));

test("version is read from the package manifest", () => {
  const manifest = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
  const version = execFileSync(process.execPath, [cli, "--version"], { encoding: "utf8" }).trim();
  assert.equal(version, manifest.version);
});

test("list exposes typed support levels", () => {
  const output = execFileSync(process.execPath, [cli, "list", "--json"], { encoding: "utf8" });
  const families = JSON.parse(output);
  assert.ok(families.some((family) => family.id === "charts" && family.support === "stable"));
  assert.ok(families.some((family) => family.id === "maps" && family.support === "experimental"));
});

test("doctor accepts the Vite consumer fixture", () => {
  const fixture = fileURLToPath(new URL("../../../examples/vite-consumer", import.meta.url));
  const output = execFileSync(process.execPath, [cli, "doctor", fixture, "--json"], {
    encoding: "utf8"
  });
  assert.equal(JSON.parse(output).ok, true);
});
