import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const generator = fileURLToPath(
  new URL("./generate-catalog.mjs", import.meta.url),
);

const result = spawnSync(process.execPath, [generator, "--check"], {
  cwd: fileURLToPath(new URL("..", import.meta.url)),
  stdio: "inherit",
});

if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
