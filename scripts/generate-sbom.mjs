import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const packageDirectories = ["chart-elements", "registry", "cli"].map((name) =>
  resolve(root, "packages", name)
);
const pnpm = process.platform === "win32" ? "pnpm.cmd" : "pnpm";
const checkOnly = process.argv.includes("--check");

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function packageIdentity(name) {
  if (!name.startsWith("@")) return { name };
  const [group, packageName] = name.split("/");
  return { group, name: packageName };
}

function packagePurl(name, version) {
  const identity = packageIdentity(name);
  const path = identity.group
    ? `${encodeURIComponent(identity.group)}/${encodeURIComponent(identity.name)}`
    : encodeURIComponent(identity.name);
  return `pkg:npm/${path}@${encodeURIComponent(version)}`;
}

function componentFromManifest(manifest) {
  const identity = packageIdentity(manifest.name);
  const purl = packagePurl(manifest.name, manifest.version);
  return {
    type: "library",
    "bom-ref": purl,
    ...(identity.group ? { group: identity.group } : {}),
    name: identity.name,
    version: manifest.version,
    licenses: [{ expression: manifest.license ?? "NOASSERTION" }],
    purl
  };
}

function buildBom(packageDirectory) {
  const packageManifest = readJson(resolve(packageDirectory, "package.json"));
  const listed = JSON.parse(
    execFileSync(pnpm, ["list", "--prod", "--json", "--depth", "Infinity"], {
      cwd: packageDirectory,
      encoding: "utf8",
      maxBuffer: 64 * 1024 * 1024
    })
  )[0];
  if (listed.name !== packageManifest.name) {
    throw new Error(`pnpm listed ${listed.name}, expected ${packageManifest.name}`);
  }

  const rootComponent = componentFromManifest(packageManifest);
  const components = new Map();
  const edges = new Map([[rootComponent["bom-ref"], new Set()]]);
  const activeReferences = new Set();
  const expandedShapes = new Set();

  function visit(name, node) {
    if (!node?.path) throw new Error(`Missing installed path for ${name} in ${packageManifest.name}`);
    const manifest = readJson(resolve(node.path, "package.json"));
    const component = componentFromManifest(manifest);
    const reference = component["bom-ref"];
    components.set(reference, component);
    if (!edges.has(reference)) edges.set(reference, new Set());

    const runtimeNames = new Set([
      ...Object.keys(manifest.dependencies ?? {}),
      ...Object.keys(manifest.optionalDependencies ?? {})
    ]);
    const runtimeChildren = Object.entries(node.dependencies ?? {}).filter(([childName]) =>
      runtimeNames.has(childName)
    );
    const shape = `${reference}\0${runtimeChildren.map(([childName]) => childName).sort().join("\0")}`;
    if (activeReferences.has(reference) || expandedShapes.has(shape)) return reference;

    activeReferences.add(reference);
    expandedShapes.add(shape);
    try {
      for (const [childName, childNode] of runtimeChildren) {
        const childReference = visit(childName, childNode);
        edges.get(reference).add(childReference);
      }
    } finally {
      activeReferences.delete(reference);
    }
    return reference;
  }

  for (const [dependencyName, dependencyNode] of Object.entries(listed.dependencies ?? {})) {
    if (!(dependencyName in (packageManifest.dependencies ?? {}))) continue;
    edges.get(rootComponent["bom-ref"]).add(visit(dependencyName, dependencyNode));
  }

  const componentList = [...components.values()].sort((a, b) =>
    a["bom-ref"].localeCompare(b["bom-ref"])
  );
  const dependencyList = [...edges.entries()]
    .map(([reference, dependsOn]) => ({ ref: reference, dependsOn: [...dependsOn].sort() }))
    .sort((a, b) => a.ref.localeCompare(b.ref));
  const knownReferences = new Set([
    rootComponent["bom-ref"],
    ...componentList.map((component) => component["bom-ref"])
  ]);
  for (const dependency of dependencyList) {
    if (!knownReferences.has(dependency.ref)) {
      throw new Error(`${packageManifest.name} SBOM has unknown dependency ref ${dependency.ref}`);
    }
    for (const reference of dependency.dependsOn) {
      if (!knownReferences.has(reference)) {
        throw new Error(`${packageManifest.name} SBOM depends on unknown ref ${reference}`);
      }
    }
  }

  return {
    bomFormat: "CycloneDX",
    specVersion: "1.5",
    version: 1,
    metadata: { component: rootComponent },
    components: componentList,
    dependencies: dependencyList
  };
}

let failed = false;
for (const packageDirectory of packageDirectories) {
  const manifest = readJson(resolve(packageDirectory, "package.json"));
  const target = resolve(packageDirectory, "SBOM.cdx.json");
  const output = `${JSON.stringify(buildBom(packageDirectory), null, 2)}\n`;
  if (output.includes(root)) {
    throw new Error(`${manifest.name} SBOM leaks an absolute workspace path`);
  }

  if (checkOnly) {
    let existing = "";
    try {
      existing = readFileSync(target, "utf8");
    } catch {
      // Report the same actionable stale-output error for missing files.
    }
    if (existing !== output) {
      failed = true;
      console.error(`${manifest.name} SBOM is missing or stale; run pnpm sbom`);
    } else {
      console.log(`Validated ${manifest.name} CycloneDX SBOM.`);
    }
  } else {
    writeFileSync(target, output);
    console.log(`Generated ${manifest.name} CycloneDX SBOM.`);
  }
}

if (failed) process.exitCode = 1;
