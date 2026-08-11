/**
 * Public entry point.
 *
 * Uses relative specifiers (not the `@/*` tsconfig alias) so this module
 * resolves for consumers outside this app. Demo/sample data is intentionally
 * NOT re-exported here — import it from `./lib/sample-data` if you want it.
 */
export * from "./components/charts";
export * from "./components/cards";
export * from "./components/tables";
export * from "./components/slicers";
export * from "./components/maps";
export * from "./components/reports";
export * from "./components/analytics";
export * from "./components/navigation";
export * from "./components/shapes";
export * from "./components/overlays";
export * from "./components/declarative";
export * from "./components/content";
export * from "./components/integrations";
export * from "./components/ui";
export * from "./lib/utils";
export * from "./lib/chart-colors";
export * from "./lib/chart-marks";
