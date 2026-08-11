import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const manifestSource = readFileSync(resolve(root, "src/registry/catalog-manifest.ts"), "utf8");
const manifestIds = [...manifestSource.matchAll(/^  "id": "([^"]+)",$/gm)].map((match) => match[1]);
const galleryDirectory = resolve(root, ".next/server/app/gallery");
const htmlFiles = readdirSync(galleryDirectory).filter((file) => file.endsWith(".html"));

if (manifestIds.length !== 336 || new Set(manifestIds).size !== 336) {
  throw new Error(`Expected 336 unique manifest ids, received ${manifestIds.length}/${new Set(manifestIds).size}.`);
}

const htmlIds = new Set(htmlFiles.map((file) => file.slice(0, -".html".length)));
const missing = manifestIds.filter((id) => !htmlIds.has(id));
const unexpected = [...htmlIds].filter((id) => !manifestIds.includes(id));
if (missing.length || unexpected.length) {
  throw new Error(`Static gallery drift. Missing: ${missing.join(", ") || "none"}; unexpected: ${unexpected.join(", ") || "none"}.`);
}

const voidElements = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"]);
const geometryAttributes = new Set(["d", "x", "y", "x1", "x2", "y1", "y2", "cx", "cy", "r", "width", "height", "points", "transform"]);

function attributesFrom(source) {
  const attributes = new Map();
  const pattern = /([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
  for (const match of source.matchAll(pattern)) {
    attributes.set(match[1].toLowerCase(), match[2] ?? match[3] ?? match[4] ?? "");
  }
  return attributes;
}

function isInteractive(tag, attributes) {
  if (tag === "button" || tag === "select" || tag === "textarea") return true;
  if (tag === "a") return attributes.has("href");
  return tag === "input" && attributes.get("type")?.toLowerCase() !== "hidden";
}

function inspectDocument(route, html) {
  const failures = [];
  const ids = new Set();
  const labelFors = new Set();
  const controls = [];
  const stack = [];
  const tagPattern = /<!--[\s\S]*?-->|<![^>]*>|<\/?([A-Za-z][\w:-]*)([^<>]*?)>/g;
  let match;

  while ((match = tagPattern.exec(html))) {
    if (!match[1]) continue;
    const raw = match[0];
    const tag = match[1].toLowerCase();
    const closing = raw.startsWith("</");
    if (closing) {
      const index = stack.map((node) => node.tag).lastIndexOf(tag);
      if (index >= 0) stack.length = index;
      continue;
    }

    const attributes = attributesFrom(match[2] ?? "");
    const id = attributes.get("id");
    if (id) {
      if (ids.has(id)) failures.push(`duplicate id ${JSON.stringify(id)}`);
      ids.add(id);
    }
    if (tag === "label" && attributes.get("for")) labelFors.add(attributes.get("for"));
    if (tag === "img" && !attributes.has("alt")) failures.push("image without alt attribute");

    for (const [name, value] of attributes) {
      if (geometryAttributes.has(name) && /NaN|Infinity|undefined/.test(value)) {
        failures.push(`${tag}.${name} contains ${JSON.stringify(value)}`);
      }
    }

    const interactive = isInteractive(tag, attributes);
    if (interactive && stack.some((node) => node.interactive)) {
      failures.push(`${tag} is nested inside another interactive element`);
    }
    if (tag === "input" || tag === "select" || tag === "textarea") {
      controls.push({
        tag,
        id,
        labelled:
          attributes.has("aria-label") ||
          attributes.has("aria-labelledby") ||
          stack.some((node) => node.tag === "label"),
      });
    }
    if (tag === "a") {
      const href = attributes.get("href");
      if (href && /^(?:javascript|data|vbscript):/i.test(href)) {
        failures.push(`unsafe link protocol in ${JSON.stringify(href)}`);
      }
      if (attributes.get("target") === "_blank") {
        const rel = attributes.get("rel") ?? "";
        if (!/\bnoopener\b/.test(rel) || !/\bnoreferrer\b/.test(rel)) {
          failures.push(`target=_blank link lacks noopener noreferrer: ${JSON.stringify(href)}`);
        }
      }
    }

    if (!voidElements.has(tag) && !raw.endsWith("/>")) {
      stack.push({ tag, interactive });
      if (tag === "script" || tag === "style") {
        const closingTag = `</${tag}>`;
        const closingIndex = html.indexOf(closingTag, tagPattern.lastIndex);
        if (closingIndex >= 0) {
          tagPattern.lastIndex = closingIndex + closingTag.length;
          stack.pop();
        }
      }
    }
  }

  for (const control of controls) {
    if (!control.labelled && !(control.id && labelFors.has(control.id))) {
      failures.push(`${control.tag}${control.id ? `#${control.id}` : ""} has no accessible label`);
    }
  }
  if (!/<main\b/i.test(html)) failures.push("missing main landmark");
  return [...new Set(failures)];
}

const failures = [];
for (const route of manifestIds) {
  const routeFailures = inspectDocument(
    route,
    readFileSync(resolve(galleryDirectory, `${route}.html`), "utf8"),
  );
  if (routeFailures.length) failures.push({ route, failures: routeFailures });
}

if (failures.length) {
  for (const failure of failures) console.error(`${failure.route}: ${failure.failures.join("; ")}`);
  throw new Error(`Static gallery validation failed for ${failures.length} of ${manifestIds.length} routes.`);
}

console.log(`Validated static HTML for ${manifestIds.length} gallery routes.`);
