import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const workflowDirectory = resolve(root, ".github/workflows");
const workflowFiles = readdirSync(workflowDirectory)
  .filter((file) => file.endsWith(".yml") || file.endsWith(".yaml"))
  .sort();
const failures = [];

for (const workflowFile of workflowFiles) {
  const source = readFileSync(resolve(workflowDirectory, workflowFile), "utf8");
  for (const match of source.matchAll(/^\s*-\s+uses:\s+([^\s#]+)(?:\s+#.*)?$/gm)) {
    const action = match[1];
    if (action.startsWith("./") || action.startsWith("docker://")) continue;
    const separator = action.lastIndexOf("@");
    const reference = separator === -1 ? "" : action.slice(separator + 1);
    if (!/^[0-9a-f]{40}$/.test(reference)) {
      failures.push(`${workflowFile}: ${action} must use an immutable 40-character commit SHA`);
    }
  }
}

if (failures.length > 0) {
  console.error(`GitHub Actions pin check failed:\n${failures.map((item) => `- ${item}`).join("\n")}`);
  process.exitCode = 1;
} else {
  console.log(`Validated immutable Action pins in ${workflowFiles.length} workflows.`);
}
