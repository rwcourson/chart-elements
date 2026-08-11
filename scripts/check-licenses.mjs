import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const packageNames = [
  "@rwcourson/chart-elements",
  "@rwcourson/chart-elements-registry",
  "@rwcourson/chart-elements-cli"
];
const allowedLicenses = new Set([
  "0BSD",
  "Apache-2.0",
  // DOMPurify is dual-licensed; releases use its Apache-2.0 option.
  "(MPL-2.0 OR Apache-2.0)",
  "BSD-3-Clause",
  "ISC",
  "MIT",
  "MIT AND ISC",
  "Unlicense"
]);
const pnpm = process.platform === "win32" ? "pnpm.cmd" : "pnpm";

let hasFailure = false;
for (const packageName of packageNames) {
  const output = execFileSync(
    pnpm,
    ["--filter", packageName, "list", "--prod", "--json", "--depth", "Infinity"],
    { encoding: "utf8" }
  );
  const [workspacePackage] = JSON.parse(output);
  const dependencies = new Map();

  const visit = (dependencyMap = {}) => {
    for (const [dependencyName, dependency] of Object.entries(dependencyMap)) {
      const key = `${dependencyName}@${dependency.version}`;
      if (!dependencies.has(key)) dependencies.set(key, dependency);
      visit(dependency.dependencies);
      visit(dependency.optionalDependencies);
    }
  };
  visit(workspacePackage?.dependencies);
  visit(workspacePackage?.optionalDependencies);

  const licenses = new Set();
  for (const [dependencyName, dependency] of dependencies) {
    if (!dependency.path) {
      hasFailure = true;
      console.error(`${packageName} cannot resolve installed path for ${dependencyName}`);
      continue;
    }
    const manifest = JSON.parse(
      readFileSync(resolve(dependency.path, "package.json"), "utf8")
    );
    const license =
      typeof manifest.license === "string" ? manifest.license : manifest.license?.type;
    if (!license) {
      hasFailure = true;
      console.error(`${packageName} dependency ${dependencyName} has no declared license`);
      continue;
    }
    licenses.add(license);
  }

  const sortedLicenses = [...licenses].sort();
  const unexpected = sortedLicenses.filter((license) => !allowedLicenses.has(license));
  if (unexpected.length > 0) {
    hasFailure = true;
    console.error(`${packageName} has unreviewed production licenses: ${unexpected.join(", ")}`);
  } else {
    console.log(
      `${packageName}: ${sortedLicenses.join(", ") || "no runtime dependencies"} ` +
        `(${dependencies.size} installed production packages checked)`
    );
  }
}

if (hasFailure) {
  console.error("Review the dependency terms before expanding the allowlist.");
  process.exitCode = 1;
}
