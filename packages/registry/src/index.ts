export type RegistrySupport = "stable" | "preview" | "experimental";

export type RegistryFamily = {
  id: string;
  label: string;
  importPath: `@rwcourson/chart-elements${string}`;
  support: RegistrySupport;
  description: string;
  requiredPackages: readonly string[];
};

export const registryFamilies = [
  {
    id: "charts",
    label: "Charts",
    importPath: "@rwcourson/chart-elements/charts",
    support: "stable",
    description: "Cartesian, statistical, hierarchy, flow, polar, and financial charts.",
    requiredPackages: ["recharts", "d3"]
  },
  {
    id: "cards",
    label: "Cards and gauges",
    importPath: "@rwcourson/chart-elements/cards",
    support: "stable",
    description: "KPI cards, scorecards, progress, and gauge components.",
    requiredPackages: ["recharts", "lucide-react"]
  },
  {
    id: "tables",
    label: "Tables",
    importPath: "@rwcourson/chart-elements/tables",
    support: "stable",
    description: "Data tables and matrix views with conditional formatting.",
    requiredPackages: ["lucide-react"]
  },
  {
    id: "slicers",
    label: "Slicers",
    importPath: "@rwcourson/chart-elements/slicers",
    support: "stable",
    description: "Controlled and uncontrolled filtering and selection controls.",
    requiredPackages: ["date-fns", "lucide-react"]
  },
  {
    id: "analytics",
    label: "Analytics",
    importPath: "@rwcourson/chart-elements/analytics",
    support: "preview",
    description: "Analytical narratives, decomposition, anomaly, forecast, and Q&A demos.",
    requiredPackages: ["recharts", "lucide-react"]
  },
  {
    id: "maps",
    label: "Maps",
    importPath: "@rwcourson/chart-elements/maps",
    support: "experimental",
    description: "Schematic geographic, indoor, route, and grid visualizations.",
    requiredPackages: []
  },
  {
    id: "navigation",
    label: "Navigation",
    importPath: "@rwcourson/chart-elements/navigation",
    support: "stable",
    description: "Report-style navigation buttons and navigators.",
    requiredPackages: ["lucide-react"]
  },
  {
    id: "shapes",
    label: "Shapes",
    importPath: "@rwcourson/chart-elements/shapes",
    support: "stable",
    description: "Text, image, and report-shape primitives.",
    requiredPackages: ["lucide-react"]
  },
  {
    id: "overlays",
    label: "Analytical overlays",
    importPath: "@rwcourson/chart-elements/overlays",
    support: "preview",
    description: "Reference lines, trend treatments, drill, and cross-filtering demos.",
    requiredPackages: ["recharts"]
  },
  {
    id: "declarative",
    label: "Declarative specifications",
    importPath: "@rwcourson/chart-elements/declarative",
    support: "preview",
    description: "Vega, Vega-Lite, and independent Deneb-compatible specification rendering.",
    requiredPackages: ["vega", "vega-lite", "vega-embed"]
  },
  {
    id: "ui",
    label: "UI primitives",
    importPath: "@rwcourson/chart-elements/ui",
    support: "stable",
    description: "Buttons, cards, inputs, selects, date fields, calendars, and badges.",
    requiredPackages: ["date-fns", "lucide-react"]
  }
] as const satisfies readonly RegistryFamily[];

export function getRegistryFamily(id: string): RegistryFamily | undefined {
  return registryFamilies.find((family) => family.id === id);
}

export function stableRegistryFamilies(): RegistryFamily[] {
  return registryFamilies.filter((family) => family.support === "stable");
}
