import { readFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";

const assetsDirectory = resolve("dist/assets");
const files = (await readdir(assetsDirectory)).filter((file) => file.endsWith(".js"));
const bundle = (
  await Promise.all(files.map((file) => readFile(resolve(assetsDirectory, file), "utf8")))
).join("\n");

if (!bundle.includes("18.2.0")) {
  throw new Error("The Vite fixture did not bundle its pinned React 18.2 runtime.");
}
if (bundle.includes("19.2.8")) {
  throw new Error("The Vite fixture bundled the library's React 19 development copy.");
}

console.log("Verified a single React 18.2 consumer runtime.");
