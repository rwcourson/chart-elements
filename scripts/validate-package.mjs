import { execFileSync } from "node:child_process";
import {
  lstatSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  rmdirSync,
  statSync,
  unlinkSync
} from "node:fs";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";
import { findBlockedBrandContent } from "./brand-policy.mjs";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const packageDirectories = ["chart-elements", "registry", "cli"].map((name) =>
  resolve(root, "packages", name)
);
const packageBudgets = {
  "@rwcourson/chart-elements": {
    // Raised 2026-08-10 after specialized chart craft + shared marks (see CHANGELOG).
    packedBytes: 700_000,
    unpackedBytes: 3_100_000,
    javascriptGzipBytes: 190_000,
    cssGzipBytes: 23_000
  },
  "@rwcourson/chart-elements-registry": {
    packedBytes: 12_000,
    unpackedBytes: 40_000,
    javascriptGzipBytes: 2_000,
    cssGzipBytes: 0
  },
  "@rwcourson/chart-elements-cli": {
    packedBytes: 15_000,
    unpackedBytes: 45_000,
    javascriptGzipBytes: 2_500,
    cssGzipBytes: 0
  }
};
const pnpm = process.platform === "win32" ? "pnpm.cmd" : "pnpm";
const packDirectory = mkdtempSync(resolve(tmpdir(), "chart-elements-package-validation-"));
const npmCacheDirectory = resolve(packDirectory, ".npm-cache");

process.on("exit", () => {
  for (const entry of readdirSync(packDirectory)) {
    const path = resolve(packDirectory, entry);
    const stats = lstatSync(path);
    if (stats.isFile()) {
      unlinkSync(path);
      continue;
    }
    if (entry === ".npm-cache" && stats.isDirectory() && !stats.isSymbolicLink()) {
      rmSync(path, { recursive: true, force: false });
      continue;
    }
    throw new Error(`Unexpected temporary pack entry: ${path}`);
  }
  rmdirSync(packDirectory);
});

const fail = (message) => {
  console.error(`package validation failed: ${message}`);
  process.exitCode = 1;
};

const walk = (directory) =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = resolve(directory, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });

const gzipSize = (files) =>
  files.reduce(
    (total, file) => total + gzipSync(readFileSync(file), { level: 9 }).length,
    0
  );

const enforceBudget = (packageName, label, actual, maximum, recommendation) => {
  if (actual <= maximum) return;
  fail(
    `${packageName} ${label} is ${actual} bytes (budget ${maximum}). ${recommendation} ` +
      "If the growth is intentional, update the explicit budget with a changelog rationale."
  );
};

const packageReports = [];
for (const packageDirectory of packageDirectories) {
  const manifest = JSON.parse(readFileSync(resolve(packageDirectory, "package.json"), "utf8"));
  if (manifest.private) fail(`${manifest.name} must not be private`);

  const exportedTargets = [];
  for (const value of Object.values(manifest.exports ?? {})) {
    if (typeof value === "string") exportedTargets.push(value);
    else exportedTargets.push(...Object.values(value));
  }
  let missingExportTarget = false;
  for (const target of exportedTargets.filter((value) => value.startsWith("./dist/"))) {
    try {
      statSync(resolve(packageDirectory, target));
    } catch {
      missingExportTarget = true;
      fail(`${manifest.name} is missing export target ${target}`);
    }
  }
  if (missingExportTarget) continue;

  const distFiles = walk(resolve(packageDirectory, "dist"));
  for (const file of distFiles.filter((path) => path.endsWith(".js"))) {
    const source = readFileSync(file, "utf8");
    if (/from\s+["']@\//.test(source)) fail(`${manifest.name} has unresolved @ alias in ${file}`);
  }
  for (const file of distFiles.filter((path) => path.endsWith(".map"))) {
    const map = JSON.parse(readFileSync(file, "utf8"));
    const sourcePaths = [map.sourceRoot, ...(map.sources ?? [])].filter(Boolean);
    const absoluteSource = sourcePaths.find(
      (source) => source.startsWith("/") || /^[a-z]:[\\/]/i.test(source) || source.startsWith("file:")
    );
    if (absoluteSource) {
      fail(`${manifest.name} source map ${file} leaks absolute source path ${absoluteSource}`);
    }
  }

  const pack = JSON.parse(
    execFileSync("npm", ["pack", "--dry-run", "--json", packageDirectory], {
      cwd: root,
      encoding: "utf8",
      env: { ...process.env, npm_config_cache: npmCacheDirectory }
    })
  )[0];
  const beforePack = new Set(readdirSync(packDirectory));
  execFileSync(pnpm, ["pack", "--pack-destination", packDirectory], {
    cwd: packageDirectory,
    encoding: "utf8",
    stdio: "pipe"
  });
  const archiveNames = readdirSync(packDirectory).filter((name) => !beforePack.has(name));
  if (archiveNames.length !== 1 || !archiveNames[0].endsWith(".tgz")) {
    fail(`${manifest.name} produced an unexpected pnpm pack result: ${archiveNames.join(", ")}`);
    continue;
  }
  const archivePath = resolve(packDirectory, archiveNames[0]);
  const packedPaths = execFileSync("tar", ["-tzf", archivePath], { encoding: "utf8" })
    .trim()
    .split("\n")
    .filter((path) => path && !path.endsWith("/"))
    .map((path) => path.replace(/^package\//, ""));
  if (packedPaths.length !== pack.entryCount) {
    fail(
      `${manifest.name} npm/pnpm pack manifests disagree (${pack.entryCount} vs ${packedPaths.length} files)`
    );
  }
  const allowedRootFiles = new Set([
    "package.json",
    ...(manifest.files ?? []).filter((value) => !value.includes("/") && value !== "dist")
  ]);
  const unexpected = packedPaths.filter(
    (path) => !path.startsWith("dist/") && !allowedRootFiles.has(path)
  );
  if (unexpected.length) {
    fail(`${manifest.name} tarball contains unexpected files: ${unexpected.join(", ")}`);
  }

  for (const packedPath of packedPaths) {
    const nameViolation = findBlockedBrandContent(packedPath);
    if (nameViolation) fail(`${manifest.name} tarball path ${packedPath} contains ${nameViolation}`);
    const content = execFileSync("tar", ["-xOf", archivePath, `package/${packedPath}`], {
      maxBuffer: 32 * 1024 * 1024
    });
    if (content.includes(0)) {
      fail(`${manifest.name} tarball contains unreviewed binary asset ${packedPath}`);
      continue;
    }
    const contentViolation = findBlockedBrandContent(content.toString("utf8"));
    if (contentViolation) {
      fail(`${manifest.name} tarball file ${packedPath} contains ${contentViolation}`);
    }
  }

  packageReports.push({
    manifest,
    pack,
    archiveSize: statSync(archivePath).size,
    javascriptGzipSize: gzipSize(distFiles.filter((path) => path.endsWith(".js"))),
    cssGzipSize: gzipSize(distFiles.filter((path) => path.endsWith(".css")))
  });
}

if (packageReports.length !== packageDirectories.length) process.exit(1);

for (const report of packageReports) {
  const budget = packageBudgets[report.manifest.name];
  if (!budget) {
    fail(`${report.manifest.name} has no package-size budget`);
    continue;
  }
  enforceBudget(
    report.manifest.name,
    "compressed tarball",
    report.archiveSize,
    budget.packedBytes,
    "Reduce packaged files or source-map weight."
  );
  enforceBudget(
    report.manifest.name,
    "unpacked tarball",
    report.pack.unpackedSize,
    budget.unpackedBytes,
    "Remove unintended files or split unusually large declarations/maps."
  );
  enforceBudget(
    report.manifest.name,
    "emitted JavaScript gzip sum",
    report.javascriptGzipSize,
    budget.javascriptGzipBytes,
    "Split entry points or remove duplicated emitted code."
  );
  enforceBudget(
    report.manifest.name,
    "emitted CSS gzip sum",
    report.cssGzipSize,
    budget.cssGzipBytes,
    "Split family styles or remove duplicated rules."
  );
}

const componentPackageDirectory = packageDirectories[0];
const componentManifest = packageReports[0].manifest;
if (componentManifest.name !== "@rwcourson/chart-elements") fail("unexpected component package name");
if (componentManifest.dependencies?.react || componentManifest.dependencies?.["react-dom"]) {
  fail("React must be declared as a peer, not a runtime dependency");
}

const componentsCss = readFileSync(resolve(componentPackageDirectory, "dist/components.css"), "utf8");
const stylesCss = readFileSync(resolve(componentPackageDirectory, "dist/styles.css"), "utf8");
const tokensCss = readFileSync(resolve(componentPackageDirectory, "dist/tokens.css"), "utf8");
const palettesCss = readFileSync(resolve(componentPackageDirectory, "dist/palettes.css"), "utf8");
const forbiddenComponentCss =
  /@layer\s+base|(?:^|})\s*(?:\*|body|html|:root|:host)\s*(?=[:,{])/im;
if (forbiddenComponentCss.test(componentsCss)) {
  fail("components.css contains preflight, reset, root tokens, or a global document selector");
}
if (!/@layer\s+chart-elements/.test(componentsCss) || /@layer\s+utilities/.test(componentsCss)) {
  fail("components.css utilities and overrides must use the isolated chart-elements layer");
}
if (/--tw-/.test(componentsCss) || !/--ce-tw-/.test(componentsCss)) {
  fail("components.css must namespace Tailwind internals as --ce-tw-* properties");
}
if (stylesCss !== componentsCss) fail("styles.css must remain an exact alias of components.css");
if (!/:root\s*\{/.test(tokensCss) || !/\.dark\s*\{/.test(tokensCss)) {
  fail("tokens.css must provide opt-in light and dark defaults");
}
if (/(?:^|})\s*(?:\*|body|html|:host)\s*(?=[:,{])/im.test(tokensCss)) {
  fail("tokens.css contains a reset or generic document selector");
}
if (!/\[data-palette=/.test(palettesCss)) fail("palettes.css has no opt-in palette selectors");
if (/(?:^|})\s*:root\s*\{/im.test(palettesCss)) {
  fail("palettes.css contains an unconditional root token block");
}

if (!process.exitCode) {
  for (const {
    manifest,
    pack,
    archiveSize,
    javascriptGzipSize,
    cssGzipSize
  } of packageReports) {
    const budget = packageBudgets[manifest.name];
    console.log(
      `Validated ${manifest.name}: ${pack.entryCount} files, ` +
        `${archiveSize}/${budget.packedBytes} bytes packed, ` +
        `${pack.unpackedSize}/${budget.unpackedBytes} bytes unpacked, ` +
        `${javascriptGzipSize}/${budget.javascriptGzipBytes} JS gzip, ` +
        `${cssGzipSize}/${budget.cssGzipBytes} CSS gzip`
    );
  }
}
