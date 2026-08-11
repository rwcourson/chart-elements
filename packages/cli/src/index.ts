import { readFileSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { registryFamilies } from "@rwcourson/chart-elements-registry";

const VERSION = (JSON.parse(
  readFileSync(new URL("../package.json", import.meta.url), "utf8")
) as { version: string }).version;
const PACKAGE_NAME = "@rwcourson/chart-elements";

type DependencyMap = Record<string, string> | undefined;

type ProjectManifest = {
  dependencies?: DependencyMap;
  devDependencies?: DependencyMap;
  peerDependencies?: DependencyMap;
};

const hasDependency = (manifest: ProjectManifest, name: string) =>
  Boolean(
    manifest.dependencies?.[name] ??
      manifest.devDependencies?.[name] ??
      manifest.peerDependencies?.[name]
  );

export async function inspectProject(directory: string) {
  const manifestPath = path.resolve(directory, "package.json");
  let manifest: ProjectManifest;
  try {
    manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  } catch (error) {
    return {
      ok: false,
      directory: path.resolve(directory),
      checks: [],
      error: `Unable to read ${manifestPath}: ${error instanceof Error ? error.message : String(error)}`
    };
  }

  const checks = [
    {
      id: "package",
      ok: hasDependency(manifest, PACKAGE_NAME),
      message: `${PACKAGE_NAME} is declared`
    },
    {
      id: "react",
      ok: hasDependency(manifest, "react") && hasDependency(manifest, "react-dom"),
      message: "React and React DOM are declared"
    }
  ];

  return {
    ok: checks.every((check) => check.ok),
    directory: path.resolve(directory),
    checks
  };
}

function printHelp() {
  console.log(`chart-elements ${VERSION}

Usage:
  chart-elements list [--json]       List package families and support levels
  chart-elements doctor [path]       Check a consumer project's dependencies
  chart-elements --version           Print the CLI version
  chart-elements --help              Show this help

The source-copy add command is intentionally not exposed until the registry has
content hashes, conflict handling, and update semantics.`);
}

async function main(argv: string[]) {
  const [command = "help", ...rest] = argv;
  const json = rest.includes("--json");

  if (command === "--version" || command === "-v") {
    console.log(VERSION);
    return;
  }

  if (command === "list") {
    if (json) {
      console.log(JSON.stringify(registryFamilies, null, 2));
      return;
    }
    for (const family of registryFamilies) {
      console.log(`${family.id.padEnd(12)} ${family.support.padEnd(12)} ${family.importPath}`);
    }
    return;
  }

  if (command === "doctor") {
    const directory = rest.find((argument) => !argument.startsWith("-")) ?? process.cwd();
    const result = await inspectProject(directory);
    if (json) console.log(JSON.stringify(result, null, 2));
    else if ("error" in result) console.error(result.error);
    else {
      console.log(`Chart Elements project check: ${result.directory}`);
      for (const check of result.checks) {
        console.log(`${check.ok ? "PASS" : "FAIL"} ${check.message}`);
      }
    }
    if (!result.ok) process.exitCode = 1;
    return;
  }

  if (command !== "help" && command !== "--help" && command !== "-h") {
    console.error(`Unknown command: ${command}\n`);
    process.exitCode = 1;
  }
  printHelp();
}

const isEntrypoint =
  process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));
if (isEntrypoint) {
  await main(process.argv.slice(2));
}
