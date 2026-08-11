import { execFileSync } from "node:child_process";
import { lstatSync, mkdtempSync, realpathSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, resolve, sep } from "node:path";

const pnpm = process.platform === "win32" ? "pnpm.cmd" : "pnpm";
const cacheDirectory = mkdtempSync(resolve(tmpdir(), "chart-elements-attw-cache-"));
const temporaryPrefix = `${realpathSync(tmpdir())}${sep}`;

try {
  execFileSync(pnpm, ["exec", "attw", ...process.argv.slice(2)], {
    cwd: process.cwd(),
    env: { ...process.env, npm_config_cache: cacheDirectory },
    stdio: "inherit"
  });
} finally {
  const resolvedCache = realpathSync(cacheDirectory);
  if (
    !resolvedCache.startsWith(temporaryPrefix) ||
    !basename(resolvedCache).startsWith("chart-elements-attw-cache-") ||
    lstatSync(resolvedCache).isSymbolicLink()
  ) {
    throw new Error(`Refusing to remove unexpected attw cache path: ${resolvedCache}`);
  }
  rmSync(resolvedCache, { recursive: true, force: false });
}
