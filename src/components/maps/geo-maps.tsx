/**
 * Compatibility barrel. Geographic/provider-free renderers and explicitly
 * schematic diagrams live in separate leaf modules so component ownership is
 * unambiguous to catalog and package tooling.
 */
export * from "./geographic-maps";
export * from "./schematic-maps";
