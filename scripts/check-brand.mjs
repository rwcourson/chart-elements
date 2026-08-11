import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { findBlockedBrandContent } from "./brand-policy.mjs";

const files = execFileSync(
  "git",
  ["ls-files", "--cached", "--others", "--exclude-standard", "-z"],
  { encoding: "utf8", maxBuffer: 16 * 1024 * 1024 }
)
  .split("\0")
  .filter(Boolean);

const violations = [];
for (const file of files) {
  const pathViolation = findBlockedBrandContent(file);
  if (pathViolation) violations.push(`${file}: path contains ${pathViolation}`);

  const buffer = readFileSync(file);
  if (buffer.includes(0)) continue;
  const contentViolation = findBlockedBrandContent(buffer.toString("utf8"));
  if (contentViolation) violations.push(`${file}: contains ${contentViolation}`);
}

if (violations.length) {
  console.error("Brand-content check failed:\n" + violations.map((item) => `- ${item}`).join("\n"));
  process.exit(1);
}

console.log(`Brand-content check passed (${files.length} source files scanned).`);
