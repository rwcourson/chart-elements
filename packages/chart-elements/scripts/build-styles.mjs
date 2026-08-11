import { readFile, unlink, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import postcss from "postcss";
import { findBlockedBrandContent } from "../../../scripts/brand-policy.mjs";

const packageDirectory = resolve(fileURLToPath(new URL("..", import.meta.url)));
const rootDirectory = resolve(packageDirectory, "../..");
const distDirectory = resolve(packageDirectory, "dist");
const rawUtilitiesPath = resolve(distDirectory, "components.raw.css");
const globalsPath = resolve(rootDirectory, "src/app/globals.css");
const palettesPath = resolve(rootDirectory, "src/app/palettes.css");

function assertBrandFree(source, label) {
  const violation = findBlockedBrandContent(source);
  if (violation) throw new Error(`${label} contains ${violation}`);
}

function isComponentSelector(selector) {
  const value = selector.trim();
  return (
    value.startsWith(".recharts") ||
    value.startsWith(".chart-surface") ||
    value.startsWith("[data-chart-svg]") ||
    value.startsWith(".ce-") ||
    value.startsWith(".chart-skeleton")
  );
}

function filterComponentRules(container) {
  for (const node of [...(container.nodes ?? [])]) {
    if (node.type === "rule") {
      const selectors = postcss.list.comma(node.selector).filter(isComponentSelector);
      if (selectors.length === 0) node.remove();
      else node.selector = selectors.join(",\n");
      continue;
    }
    if (node.type !== "atrule") {
      node.remove();
      continue;
    }
    if (node.name === "keyframes") {
      if (!node.params.startsWith("ce-")) node.remove();
      continue;
    }
    if (node.name === "media" || node.name === "supports" || node.name === "layer") {
      filterComponentRules(node);
      if (!node.nodes?.length) node.remove();
      continue;
    }
    node.remove();
  }
}

function assertNoGlobalSelectors(root, label) {
  root.walkAtRules("import", (rule) => {
    throw rule.error(`${label} must not contain imports`);
  });
  root.walkAtRules("layer", (rule) => {
    if (rule.params === "base") throw rule.error(`${label} must not contain Tailwind preflight`);
  });
  root.walkRules((rule) => {
    for (const selector of postcss.list.comma(rule.selector)) {
      const value = selector.trim().toLowerCase();
      if (
        value === "*" ||
        value.startsWith("*:before") ||
        value.startsWith("*::before") ||
        value.startsWith("*:after") ||
        value.startsWith("*::after") ||
        value === "body" ||
        value === "html" ||
        value === ":root" ||
        value === ":host"
      ) {
        throw rule.error(`${label} contains forbidden global selector ${selector}`);
      }
    }
  });
}

const rawUtilities = postcss.parse(await readFile(rawUtilitiesPath, "utf8"));
rawUtilities.walkAtRules("layer", (rule) => {
  if (rule.params === "properties") rule.remove();
  else if (rule.params === "utilities") rule.params = "chart-elements";
});
rawUtilities.walkAtRules((rule) => {
  rule.params = rule.params.replaceAll("--tw-", "--ce-tw-");
});
rawUtilities.walkDecls((declaration) => {
  declaration.prop = declaration.prop.replaceAll("--tw-", "--ce-tw-");
  declaration.value = declaration.value.replaceAll("--tw-", "--ce-tw-");
});
assertNoGlobalSelectors(rawUtilities, "component utilities");

const globals = postcss.parse(await readFile(globalsPath, "utf8"), { from: globalsPath });
const componentOverrides = postcss.root();
for (const node of globals.nodes) componentOverrides.append(node.clone());
filterComponentRules(componentOverrides);
assertNoGlobalSelectors(componentOverrides, "component overrides");
const componentOverrideLayer = postcss.atRule({ name: "layer", params: "chart-elements" });
componentOverrideLayer.append(componentOverrides.nodes);

const componentBanner =
  "/* Chart Elements component utilities and scoped chart overrides. No reset or document tokens. */\n";
const componentsCss = `${componentBanner}${rawUtilities.toString()}\n${componentOverrideLayer.toString()}\n`;
assertBrandFree(componentsCss, "components.css");
await writeFile(resolve(distDirectory, "components.css"), componentsCss);
await writeFile(resolve(distDirectory, "styles.css"), componentsCss);

const tokenRoot = postcss.root();
for (const node of globals.nodes) {
  if (node.type === "rule" && (node.selector === ":root" || node.selector === ".dark")) {
    tokenRoot.append(node.clone());
  }
}
const tokensCss = `/* Optional Chart Elements default light and dark tokens. */\n${tokenRoot.toString()}\n`;
assertBrandFree(tokensCss, "tokens.css");
await writeFile(resolve(distDirectory, "tokens.css"), tokensCss);

const sourcePalettes = postcss.parse(await readFile(palettesPath, "utf8"), { from: palettesPath });
const paletteRoot = postcss.root();
for (const node of sourcePalettes.nodes) {
  if (node.type === "rule" && node.selector.includes("[data-palette=")) {
    paletteRoot.append(node.clone());
  }
}
const palettesCss = `/* Optional unbranded Chart Elements demo palettes. */\n${paletteRoot.toString()}\n`;
assertBrandFree(palettesCss, "palettes.css");
await writeFile(resolve(distDirectory, "palettes.css"), palettesCss);

await unlink(rawUtilitiesPath);
