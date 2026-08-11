import { execFileSync } from "node:child_process";
import {
  cpSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  realpathSync,
  rmSync,
  writeFileSync
} from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const packageDirectory = resolve(root, "packages/chart-elements");
const pnpm = process.platform === "win32" ? "pnpm.cmd" : "pnpm";
const temporaryRoot = mkdtempSync(resolve(tmpdir(), "chart-elements-packed-consumers-"));
const expectedTemporaryPrefix = `${realpathSync(tmpdir())}${sep}`;

function removeTemporaryRoot() {
  const resolvedTemporaryRoot = realpathSync(temporaryRoot);
  if (
    !resolvedTemporaryRoot.startsWith(expectedTemporaryPrefix) ||
    !basename(resolvedTemporaryRoot).startsWith("chart-elements-packed-consumers-") ||
    lstatSync(resolvedTemporaryRoot).isSymbolicLink()
  ) {
    throw new Error(`Refusing to remove unexpected temporary path: ${resolvedTemporaryRoot}`);
  }
  rmSync(resolvedTemporaryRoot, { recursive: true, force: false });
}

function copyFixture(source, destination) {
  cpSync(source, destination, {
    recursive: true,
    filter(path) {
      const relativePath = relative(source, path);
      const segments = relativePath.split(sep);
      return (
        !segments.some((segment) =>
          [".next", ".vercel", "dist", "node_modules", "pnpm-lock.yaml"].includes(segment)
        ) &&
        !relativePath.endsWith(".tsbuildinfo") &&
        !relativePath.endsWith("next-env.d.ts") &&
        !segments.some((segment) => segment.startsWith(".env"))
      );
    }
  });
}

function run(command, arguments_, directory, stdio = "inherit") {
  return execFileSync(command, arguments_, {
    cwd: directory,
    env: { ...process.env, CI: "true", NEXT_TELEMETRY_DISABLED: "1" },
    stdio
  });
}

try {
  const archiveDirectory = resolve(temporaryRoot, "archives");
  mkdirSync(archiveDirectory);
  run(pnpm, ["pack", "--pack-destination", archiveDirectory], packageDirectory, "pipe");

  const archives = readdirSync(archiveDirectory).filter((file) => file.endsWith(".tgz"));
  if (archives.length !== 1) {
    throw new Error(`Expected one chart package archive, received: ${archives.join(", ")}`);
  }
  const archivePath = resolve(archiveDirectory, archives[0]);
  const sourceManifest = JSON.parse(readFileSync(resolve(packageDirectory, "package.json"), "utf8"));

  for (const fixtureName of ["next-consumer", "vite-consumer"]) {
    const source = resolve(root, "examples", fixtureName);
    const destination = resolve(temporaryRoot, fixtureName);
    copyFixture(source, destination);

    const manifestPath = resolve(destination, "package.json");
    const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
    manifest.name = `${manifest.name}-packed`;
    const archiveSpecifier = relative(destination, archivePath).split(sep).join("/");
    manifest.dependencies["@rwcourson/chart-elements"] = `file:${archiveSpecifier}`;
    writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

    run(pnpm, ["install", "--no-frozen-lockfile", "--prefer-offline"], destination);

    const installedDirectory = dirname(
      realpathSync(resolve(destination, "node_modules/@rwcourson/chart-elements/package.json"))
    );
    const installedManifest = JSON.parse(
      readFileSync(resolve(installedDirectory, "package.json"), "utf8")
    );
    if (
      installedManifest.name !== sourceManifest.name ||
      installedManifest.version !== sourceManifest.version
    ) {
      throw new Error(
        `${fixtureName} installed ${installedManifest.name}@${installedManifest.version}, expected ${sourceManifest.name}@${sourceManifest.version}`
      );
    }
    const canonicalPackageDirectory = realpathSync(packageDirectory);
    if (
      installedDirectory === canonicalPackageDirectory ||
      installedDirectory.startsWith(`${canonicalPackageDirectory}${sep}`)
    ) {
      throw new Error(`${fixtureName} resolved the workspace package instead of the packed archive`);
    }
    if (!installedDirectory.startsWith(`${realpathSync(temporaryRoot)}${sep}`)) {
      throw new Error(`${fixtureName} installed the package outside its clean temporary project`);
    }

    const lockfile = readFileSync(resolve(destination, "pnpm-lock.yaml"), "utf8");
    if (!lockfile.includes(archives[0]) || lockfile.includes("link:../../packages/chart-elements")) {
      throw new Error(`${fixtureName} lockfile does not prove installation from ${archives[0]}`);
    }

    run(pnpm, ["run", "build"], destination);
    console.log(
      `Verified ${fixtureName} from exact ${archives[0]} using React ${manifest.dependencies.react}.`
    );
  }
} finally {
  removeTemporaryRoot();
}
