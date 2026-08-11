/**
 * OSS brand policy: keep company identifiers out of the public tree.
 * Palette colors may be reused under neutral names (e.g. Cobalt).
 */
const blockedNameSource = [
  "(?:B",
  "&G|Bras",
  "field|Gor",
  "rie|bg[-_ ]?(?:brand|time))"
].join("");

export const blockedBrandPattern = new RegExp(blockedNameSource, "i");

export function findBlockedBrandContent(source) {
  if (blockedBrandPattern.test(source)) return "blocked brand identifier";
  return undefined;
}
