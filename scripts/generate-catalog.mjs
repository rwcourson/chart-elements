import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Components whose own markup already opens a Card or a ChartFrame. The gallery
 * must not wrap these in a second frame: doing so nests a card inside a card,
 * duplicates the title, and — because the inner panel carries its own fixed
 * height plus a header — pushes content past the outer card's clip boundary.
 *
 * Derived from the source rather than hand-listed so a new self-framed visual
 * can't quietly regress the gallery.
 */
function detectSelfFramed(dir) {
  const found = new Set();
  const walk = (d) => {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      const p = join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name.endsWith(".tsx")) {
        const src = readFileSync(p, "utf8");
        const marks = [...src.matchAll(/export function ([A-Z][A-Za-z0-9]*)\s*\(/g)]
          .map((m) => ({ name: m[1], start: m.index }));
        marks.forEach((mk, i) => {
          const body = src.slice(mk.start, marks[i + 1]?.start ?? src.length);
          if (/<ChartFrame|<Card[\s>]/.test(body)) found.add(mk.name);
        });
      }
    }
  };
  walk(dir);
  found.delete("ChartFrame");
  return found;
}

/**
 * Resolve public component names to their actual source module. The manifest's
 * `source.module` remains the documented family entry point, while the gallery
 * can load the leaf file and avoid turning one thumbnail into a request for the
 * entire component suite.
 */
function detectLeafModules(dir) {
  const modules = new Map();
  const srcRoot = new URL("../src", import.meta.url).pathname.replace(/\/$/, "");
  const walk = (current) => {
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      const path = join(current, entry.name);
      if (entry.isDirectory()) {
        walk(path);
        continue;
      }
      if (!/\.(?:ts|tsx)$/.test(entry.name) || entry.name === "index.ts") continue;
      const source = readFileSync(path, "utf8");
      for (const match of source.matchAll(
        /export\s+(?:async\s+)?(?:function|const|class)\s+([A-Z](?=[A-Za-z0-9]*[a-z])[A-Za-z0-9]*)/g,
      )) {
        const modulePath = `@${path
          .slice(srcRoot.length)
          .replace(/\\/g, "/")
          .replace(/\.(?:ts|tsx)$/, "")}`;
        const previous = modules.get(match[1]);
        if (previous && previous !== modulePath) {
          throw new Error(
            `Component ${match[1]} is exported by multiple leaf modules: ${previous}, ${modulePath}`,
          );
        }
        modules.set(match[1], modulePath);
      }
    }
  };
  walk(dir);
  return modules;
}

const selfFramed = detectSelfFramed(
  new URL("../src/components", import.meta.url).pathname,
);
const leafModules = detectLeafModules(
  new URL("../src/components", import.meta.url).pathname,
);

/**
 * Natural content height, in px, for visuals that overflow their category's
 * default slot. Measured from the rendered gallery — the shortfall showed up as
 * a clipped last row or a sliced control, not as a scrollbar.
 */
const MIN_HEIGHTS = {
  SearchableSlicer: 250,
  SearchableListSlicer: 250,
  ImageVisual: 240,
  StaticImage: 200,
  DynamicImage: 200,
  // Two stacked category groups; at 300 the second group's cards were sliced.
  MultiCategoryCards: 350,
};

/**
 * Categories whose visuals are form controls and buttons rather than plots. These
 * have a natural height, so the gallery lets them size to their content instead of
 * pinning a 44px field inside a 220px card.
 */
const AUTO_HEIGHT_CATEGORIES = new Set([
  "Slicer Visualizations",
  "Navigation and Interactivity Visuals",
]);

/**
 * Same idea for individual components in mixed categories. `DataTable` already
 * scrolls inside a constrained parent and hugs its rows otherwise, so a fixed
 * frame only adds empty space under a short table. The sparkline entries that
 * share its category are charts and stay pinned.
 */
const AUTO_HEIGHT_COMPONENTS = new Set([
  "DataTable",
  "MatrixTable",
  // Text visuals wrap to their copy. The shapes they share a category with are
  // drawn to fill their slot and stay pinned.
  "TextBox",
  "DynamicText",
  // Form adapters size to their fields; a fixed frame clipped the submit row.
  "PowerAppsVisual",
  "PowerAutomateVisual",
]);

/** Every slicer is a control panel, including the few borrowed by other categories. */
const AUTO_HEIGHT_IMPORTS = new Set(["@/components/slicers"]);

/** @type {{ category: string, id: string, title: string, importFrom: string, component: string, props?: string, height?: number | "auto", semanticDistinction?: string }[]} */
const items = [];

function add(category, title, component, importFrom, props = "", height, semanticDistinction) {
  const id = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const floor = MIN_HEIGHTS[component];
  // A measured floor still wins: a couple of control panels do overflow a slot,
  // and those were sized from the rendered page.
  const resolved = floor
    ? Math.max(height ?? 0, floor)
    : AUTO_HEIGHT_CATEGORIES.has(category) ||
        AUTO_HEIGHT_COMPONENTS.has(component) ||
        AUTO_HEIGHT_IMPORTS.has(importFrom)
      ? "auto"
      : height;
  items.push({ category, id, title, importFrom, component, props, height: resolved, semanticDistinction });
}

/**
 * Entries in this map intentionally stand in for something the backing
 * component does not yet implement. They remain visible as roadmap inventory,
 * but the manifest must never call them verified or silently present them as an
 * equivalent visual.
 */
const PLACEHOLDER_TRUTH = new Map([]);

/** Backing components known to be real work in progress after the semantic audit. */
const IMPLEMENTING_COMPONENTS = new Set([]);

/**
 * Curated heroes that completed a craft + empty-state + theming verification pass.
 * Do not mass-add entries — each note must reference real evidence (see docs/VISUAL_AUDIT.md).
 * Paginated reports must stay ≤ review (enforced by package tests).
 */
const VERIFIED_HEROES = new Map([
  [
    "clustered-column-chart",
    "Verified 2026-08-10: shared mark constants, empty state, gradient bars, series hover, light/dark tokens (docs/VISUAL_AUDIT.md).",
  ],
  [
    "clustered-bar-chart",
    "Verified 2026-08-10: horizontal layout, shared margins/radius, empty state, hover isolation (docs/VISUAL_AUDIT.md).",
  ],
  [
    "line-chart",
    "Verified 2026-08-10: SERIES_STROKE_WIDTH/ACTIVE_DOT, empty series, legend hover dim (docs/VISUAL_AUDIT.md).",
  ],
  [
    "area-chart",
    "Verified 2026-08-10: area gradients, shared stroke, reduced-motion animation gate (docs/VISUAL_AUDIT.md).",
  ],
  [
    "pie-chart",
    "Verified 2026-08-10: callout leaders, empty slices, CSS hover isolation, legend craft (docs/VISUAL_AUDIT.md).",
  ],
  [
    "donut-chart",
    "Verified 2026-08-10: inner label, stroke dividers, empty state, token series colors (docs/VISUAL_AUDIT.md).",
  ],
  [
    "waterfall-chart",
    "Verified 2026-08-10: shared tooltip tokens, semantic increase/decrease, empty path (docs/VISUAL_AUDIT.md).",
  ],
  [
    "line-and-clustered-column-chart",
    "Verified 2026-08-10: combo empty state, shared bar/line marks, dual-series hover (docs/VISUAL_AUDIT.md).",
  ],
  [
    "funnel-chart",
    "Verified 2026-08-10: custom SVG stages, empty invalid stages, series hover focus (docs/VISUAL_AUDIT.md).",
  ],
  [
    "scatter-plot",
    "Verified 2026-08-10: shared plot margin, empty data, category colors from tokens (docs/VISUAL_AUDIT.md).",
  ],
  [
    "kpi-visual",
    "Verified 2026-08-10: tabular values, semantic delta badges, card shadow tokens (docs/VISUAL_AUDIT.md).",
  ],
  [
    "radial-gauge",
    "Verified 2026-08-10: meter ARIA, semantic thresholds, range notices (docs/VISUAL_AUDIT.md).",
  ],
  [
    "searchable-slicer",
    "Verified 2026-08-10: focus rings, empty options copy, accent selection tokens (docs/VISUAL_AUDIT.md).",
  ],
  [
    "table",
    "Verified 2026-08-10: empty rows status UI, sticky header, token density (docs/VISUAL_AUDIT.md).",
  ],
]);

/**
 * Duplicate render recipes are allowed only when their complete id group is
 * listed here. This turns an accidental copy/paste into a generation failure.
 * The note is emitted as the alias distinction in the typed manifest.
 *
 * A new duplicate recipe must add a deliberate note to this truth ledger.
 */
const DOCUMENTED_DUPLICATE_RECIPE_GROUPS = new Map([
  ["funnel-chart|funnel-variants", "Funnel variants currently reuses the base funnel recipe until distinct funnel options are supplied."],
  ["hierarchical-matrix|matrix-with-subtotals", "Both labels intentionally demonstrate the same current subtotal configuration; hierarchy remains under review."],
  ["matrix-with-grand-totals|pivot-style-matrix", "Both labels intentionally demonstrate the same current grand-total configuration; pivot behavior remains under review."],
  ["conditional-backgrounds|table-matrix-with-conditional-background-colors", "The analytical-technique and table-family labels intentionally share one conditional-background recipe."],
  ["conditional-icons|table-matrix-with-icons", "The analytical-technique and table-family labels intentionally share one conditional-icon recipe."],
  ["conditional-data-bars|table-matrix-with-data-bars", "The analytical-technique and table-family labels intentionally share one data-bar recipe."],
  ["modern-card-visual-card-with-reference-labels|modern-card-visual-single-card-layout", "The two card labels intentionally share the same reference-label card recipe."],
  ["advanced-kpi|kpi-visual", "Advanced KPI currently aliases the base KPI recipe and is tracked separately as an extended-family label."],
  ["decomposition-tree|expand-all-hierarchy", "Expand-all hierarchy intentionally demonstrates the existing decomposition-tree component."],
  ["dynamic-data-driven-image|dynamic-images", "The visual-family and analytical-technique labels intentionally share one dynamic-image example."],
  ["dynamic-data-bound-text|dynamic-labels", "The visual-family and analytical-technique labels intentionally share one dynamic-text example."],
  ["density-plot|statistical-distribution-plot", "The generic distribution label intentionally aliases the density-plot recipe."],
  ["kde-plot|kernel-density-plot", "KDE and kernel-density labels intentionally share the same estimator recipe."],
  ["box-and-whisker-plot|box-plot", "Box-plot naming variants intentionally share the same component-default recipe."],
  ["ridgeline-chart|ridgeline-plot", "Ridgeline naming variants intentionally share the same component-default recipe."],
  ["correlation-heatmap|correlation-matrix|correlogram", "The three correlation labels intentionally share one correlogram recipe while naming different analytical contexts."],
  ["heatmap|matrix-heatmap|statistical-heatmap", "The generic and matrix labels intentionally share one statistical-heatmap recipe."],
  ["dendrogram|hierarchical-clustering-plot", "The hierarchical-clustering label intentionally aliases the dendrogram recipe."],
  ["precision-recall-chart|precision-recall-curve", "Chart and curve naming variants intentionally share the same precision-recall recipe."],
  ["regression-chart|regression-plot", "The regression naming variants intentionally share the same regression recipe."],
  ["2d-density-plot|contour-chart|contour-plot", "The contour and density naming variants intentionally share one sampled-field contour recipe."],
  ["error-bar-chart|error-bar-plot", "Chart and plot naming variants intentionally share the same error-bar recipe."],
  ["time-series-analysis-chart|trend-analysis", "The generic time-series-analysis label intentionally aliases the current trend-analysis recipe."],
  ["forecast-visualization|forecasting", "The statistical and analytical-technique labels intentionally share the same forecast demo."],
  ["infographic-chart|waffle-chart", "The generic infographic label intentionally uses the waffle chart as its concrete example."],
  ["drill-down|drill-up", "Drill-down and drill-up currently share one static drill-path demonstration."],
  ["cross-filtering|cross-highlighting", "Cross-filter and cross-highlight currently share one static paired-chart demonstration."],
  ["report-page-tooltips|visual-tooltips", "Both tooltip labels intentionally share the same tooltip demonstration."],
]);

const FIXTURE_IDS = [
  "kpiMetrics",
  "matrixRows",
  "matrixRowsWithLinks",
  "matrixRowsWithImages",
  "partToWhole",
  "salesByRegion",
  "scatterPoints",
  "animatedTimelineFrames",
  "stackedSeries",
  "treemapData",
  "funnelStages",
  "waterfallData",
  "vegaBarSpec",
  "vegaLiteScatterSpec",
  "denebCompatibleSpec",
  "gallerySafeHtml",
  "gallerySafeSvg",
  "scientificContourSpec",
  "mlFeatureResult",
];

const SOURCE_DEPENDENCIES = {
  "@/components/charts": ["react", "recharts", "d3", "lucide-react"],
  "@/components/cards": ["react", "recharts", "lucide-react"],
  "@/components/tables": ["react", "lucide-react"],
  "@/components/slicers": ["react", "date-fns", "lucide-react"],
  "@/components/maps": ["react", "d3"],
  "@/components/reports": ["react"],
  "@/components/analytics": ["react", "recharts", "lucide-react"],
  "@/components/navigation": ["react", "lucide-react"],
  "@/components/shapes": ["react", "lucide-react"],
  "@/components/overlays": ["react", "recharts"],
  "@/components/declarative": ["react", "vega", "vega-lite", "vega-embed"],
  "@/components/content": ["react", "dompurify"],
  "@/components/integrations": ["react", "lucide-react"],
};

function normalizedRecipe(item) {
  return `${item.component}|${item.props.replace(/\s+/g, " ").trim()}`;
}

function duplicateGroupKey(group) {
  return group.map((item) => item.id).sort().join("|");
}

function explicitVariant(item) {
  return item.props.match(/\bvariant="([^"]+)"/)?.[1] ?? null;
}

function fixtureFor(item) {
  const ids = FIXTURE_IDS.filter((id) => new RegExp(`\\b${id}\\b`).test(item.props));
  if (ids.length) return { kind: "catalog", ids };
  if (item.component === "PaginatedReport") return { kind: "component-default", ids: [] };
  if (!item.props) return { kind: "component-default", ids: [] };
  return { kind: "none", ids: [] };
}

function referenceKind(category) {
  if (
    /Power BI|Slicer|AI and Analytical|Natural-Language|Navigation|Embedded|Paginated/.test(
      category,
    )
  ) {
    return "power-bi";
  }
  if (/Text, Images|Cards, KPIs|KPI and Gauge/.test(category)) {
    return "component-pattern";
  }
  return "chart-convention";
}

function capabilitiesFor(item, fixture, selfFramedEntry) {
  const capabilities = ["themed"];
  if (
    item.importFrom === "@/components/slicers" ||
    item.importFrom === "@/components/navigation"
  ) {
    capabilities.push("interactive-control");
  } else {
    capabilities.push("visualization", "responsive-container");
  }
  if (fixture.kind === "catalog") capabilities.push("catalog-fixture", "consumer-data");
  else if (item.props) capabilities.push("consumer-data");
  if (fixture.kind === "component-default") capabilities.push("component-default-fixture");
  if (/Animated|Scrolling|Ticker|Carousel/.test(item.component)) capabilities.push("animated");
  if (selfFramedEntry) capabilities.push("self-framed");
  if (PLACEHOLDER_TRUTH.has(item.id)) capabilities.push("demo-only");
  return [...new Set(capabilities)];
}

// 1. Bar and Column
const barCol = "clustered-bar|stacked-bar|percent-bar|clustered-column|stacked-column|percent-column".split("|");
const barTitles = [
  "Clustered bar chart",
  "Stacked bar chart",
  "100% stacked bar chart",
  "Clustered column chart",
  "Stacked column chart",
  "100% stacked column chart",
];
barTitles.forEach((t, i) =>
  add(
    "Bar and Column Charts",
    t,
    "BarColumnChart",
    "@/components/charts",
    `data={stackedSeries} seriesKeys={["product","service","other"]} variant="${barCol[i]}"`,
  ),
);

// 2. Line and Area
[
  ["Line chart", "line"],
  ["Area chart", "area"],
  ["Stacked area chart", "stacked-area"],
  ["100% stacked area chart", "percent-area"],
].forEach(([t, v]) =>
  add(
    "Line and Area Charts",
    t,
    "LineAreaChart",
    "@/components/charts",
    `data={stackedSeries} categoryKey="name" seriesKeys={["product","service","other"]} variant="${v}"`,
  ),
);

// 3. Combo
[
  ["Line and clustered column chart", "line-clustered-column"],
  ["Line and stacked column chart", "line-stacked-column"],
  ["Dual-axis combo chart configurations", "dual-axis"],
].forEach(([t, v]) =>
  add(
    "Combination Charts",
    t,
    "ComboChart",
    "@/components/charts",
    `data={salesByRegion} barKeys={["sales"]} lineKeys={["profit"]} variant="${v}"`,
  ),
);

// 4. Change / ranking
add("Change and Ranking Charts", "Waterfall chart", "WaterfallChart", "@/components/charts", "data={waterfallData}");
add("Change and Ranking Charts", "Ribbon chart", "RibbonChart", "@/components/charts", `data={stackedSeries} seriesKeys={["product","service","other"]}`);

// 5. Part-to-whole
add("Part-to-Whole and Process Charts", "Pie chart", "PieDonutChart", "@/components/charts", `data={partToWhole} variant="pie"`);
add("Part-to-Whole and Process Charts", "Donut chart", "PieDonutChart", "@/components/charts", `data={partToWhole} variant="donut" innerLabel="100%"`);
add("Part-to-Whole and Process Charts", "Treemap", "TreemapChart", "@/components/charts", "data={treemapData}");
add("Part-to-Whole and Process Charts", "Funnel chart", "FunnelChart", "@/components/charts", "data={funnelStages}");

// 6. Relationship
add("Relationship and Distribution Charts", "Scatter plot", "ScatterBubbleChart", "@/components/charts", `data={scatterPoints} variant="scatter"`);
add("Relationship and Distribution Charts", "Bubble chart", "ScatterBubbleChart", "@/components/charts", `data={scatterPoints} variant="bubble"`);
add("Relationship and Distribution Charts", "Dot plot", "ScatterBubbleChart", "@/components/charts", `data={scatterPoints} variant="dot-plot"`);

// 7. Tables
const tableCat = "Tables and Matrix Visualizations";
[
  ["Table", "DataTable", `columns={tableColumns} rows={matrixRows}`],
  ["Matrix", "MatrixTable", `rows={matrixRows} rowKey="region" columns={["q1","q2","q3","q4"]}`],
  ["Hierarchical matrix", "MatrixTable", `rows={matrixRows} rowKey="region" columns={["q1","q2","q3","q4"]} showSubtotals`],
  ["Pivot-style matrix", "MatrixTable", `rows={matrixRows} rowKey="region" columns={["q1","q2","q3","q4"]} showGrandTotal`],
  ["Table with totals", "DataTable", `columns={tableColumns} rows={matrixRows} showTotals`],
  ["Matrix with subtotals", "MatrixTable", `rows={matrixRows} rowKey="region" columns={["q1","q2","q3","q4"]} showSubtotals`],
  ["Matrix with grand totals", "MatrixTable", `rows={matrixRows} rowKey="region" columns={["q1","q2","q3","q4"]} showGrandTotal`],
  ["Table/matrix with conditional background colors", "DataTable", `columns={tableColumns} rows={matrixRows} conditionalBackground`],
  ["Table/matrix with conditional font colors", "DataTable", `columns={tableColumns} rows={matrixRows} conditionalFont`],
  ["Table/matrix with icons", "DataTable", `columns={tableColumns} rows={matrixRows} showIcons`],
  ["Table/matrix with data bars", "DataTable", `columns={tableColumns} rows={matrixRows} showDataBars`],
  ["Table/matrix with web URLs", "DataTable", `columns={[...tableColumns, {key:"url", label:"Link"}]} rows={matrixRowsWithLinks} linkKeys={["url"]}`],
  // An image cell next to real measures, not on its own: a two-column table has
  // nothing to fill the width, so the thumbnail ended up stranded mid-row.
  // Avatar leads the row so the thumbnail sits next to its label rather than
  // floating in a gap between Region and the metrics.
  ["Table/matrix with images", "DataTable", `columns={[{key:"img",label:"Avatar"},{key:"region",label:"Region"},...tableColumns.slice(1)]} rows={matrixRowsWithImages} imageKeys={["img"]}`],
  ["Table/matrix with sparklines", "DataTable", `columns={tableColumns} rows={matrixRows} sparklineKey="trend"`],
  ["Line sparkline", "LineSparkline", "", "@/components/charts"],
  ["Column sparkline", "ColumnSparkline", "", "@/components/charts"],
].forEach(([t, c, p, from]) =>
  add(tableCat, t, c, from || "@/components/tables", p || ""),
);

// Fix sparkline import paths in items already added - handled above with from

// 8. Cards KPI Gauges
const cardCat = "Cards, KPIs, and Gauges";
[
  ["Modern Card visual — Single-card layout", "ModernCard", "metric={kpiMetrics[0]} withReference"],
  ["Modern Card visual — Multi-card layout", "MultiCardLayout", "metrics={kpiMetrics}"],
  ["Modern Card visual — Multi-category card layout", "MultiCategoryCards", `metrics={kpiMetrics.map((m,i)=>({...m, category: i<2?"Growth":"Quality"}))}`],
  ["Modern Card visual — Card with reference labels", "ModernCard", "metric={kpiMetrics[0]} withReference"],
  ["Modern Card visual — Card with images", "ModernCard", "metric={kpiMetrics[1]} withImage"],
  ["Modern Card visual — Data-driven card images", "ModernCard", "metric={{...kpiMetrics[0], imageUrl: demoThumb(1)}} withImage"],
  ["Legacy single Card", "LegacyCard", "metric={kpiMetrics[0]}"],
  ["Legacy Multi-row Card", "MultiRowCard", "metrics={kpiMetrics}"],
  ["KPI visual", "KpiVisual", "metric={kpiMetrics[0]}"],
  ["Radial Gauge", "RadialGauge", `value={72} label="Attainment" ranges={[{to:50,color:"var(--chart-negative)"},{to:80,color:"var(--chart-warning)"},{to:100,color:"var(--chart-positive)"}]}`],
  ["Goals / Scorecard visual", "Scorecard", "metrics={kpiMetrics.slice(0,3)}"],
].forEach(([t, c, p]) => add(cardCat, t, c, "@/components/cards", p));

// 9. Maps
const mapCat = "Geographic and Map Visualizations";
const maps = [
  ["Azure Maps", "AzureMapsAdapter"],
  ["Shape Map", "ShapeMap"],
  ["Basic / Bubble Map", "BubbleMap"],
  ["Filled / Choropleth Map", "FilledChoroplethMap"],
  ["ArcGIS for Power BI", "ArcGISMapsAdapter"],
  ["Bubble map", "BubbleMap"],
  ["Proportional-symbol map", "ProportionalSymbolMap"],
  ["3D column map", "Column3DMap"],
  ["Heat map", "HeatMapGeo"],
  ["Filled map", "FilledChoroplethMap"],
  ["Polygon map", "PolygonMap"],
  ["Choropleth map", "FilledChoroplethMap"],
  ["Marker map", "MarkerMap"],
  ["Custom-icon marker map", "CustomIconMarkerMap"],
  ["Image-marker map", "ImageMarkerMap"],
  ["Path map", "PathMap"],
  ["Route visualization", "RouteMap"],
  ["Reference layer", "ReferenceLayerMap"],
  ["Pie-chart map overlay", "PieChartMapOverlay"],
  ["Point clustering", "PointClusterMap"],
  ["Country map", "CountryMap"],
  ["State / province map", "StateMap"],
  ["County map", "CountyMap"],
  ["Sales territory map", "TerritoryMap"],
  ["Electoral district map", "TerritoryMap"],
  ["Custom geographic region map", "PolygonMap"],
  ["Floor plan", "FloorPlanMap"],
  ["Building layout", "BuildingLayoutMap"],
  ["Seating plan", "SeatingPlanMap"],
  ["Stadium section map", "SeatingPlanMap"],
  ["Warehouse layout", "WarehouseLayoutMap"],
  ["Campus layout", "CampusMap"],
  ["Custom TopoJSON geometry", "ShapeMap"],
  ["Custom GeoJSON geometry", "PolygonMap"],
  ["Route maps", "RouteMap"],
  ["Flow maps", "FlowMap"],
  ["Arc maps", "ArcMap"],
  ["Network maps", "NetworkMap"],
  ["Hex maps", "HexMap"],
  ["Tile / grid maps", "TileGridMap"],
  ["Indoor maps", "IndoorMap"],
  ["Floor-plan maps", "FloorPlanMap"],
  ["Geographic heat maps", "HeatMapGeo"],
  ["Isochrone maps", "IsochroneMap"],
  ["Custom shape maps", "ShapeMap"],
  ["3D maps", "Column3DMap"],
];
maps.forEach(([t, c]) => add(mapCat, t, c, "@/components/maps"));

// 10-11 AI / NL
const aiCat = "AI and Analytical Visuals";
[
  ["Decomposition Tree", "DecompositionTree"],
  ["AI-assisted Decomposition Tree", "AIDecompositionTree"],
  ["Key Influencers", "KeyInfluencers"],
  ["Top Segments", "TopSegments"],
  ["Smart Narrative", "SmartNarrative"],
  ["Anomaly Detection", "AnomalyDetection"],
].forEach(([t, c]) => add(aiCat, t, c, "@/components/analytics"));

const nlCat = "Natural-Language Visualization";
[
  ["Q&A visual", "QAVisual", ""],
  ["Other compatible visuals selected by the Q&A engine", "QAEngineVisual", "mock"],
].forEach(([t, c, props]) => add(nlCat, t, c, "@/components/analytics", props));

// 12. Slicers
const slicerCat = "Slicer Visualizations";
const slicers = [
  ["Standard Slicer", "StandardSlicer"],
  ["Button Slicer", "ButtonSlicer"],
  ["List Slicer", "ListSlicer"],
  ["Input Slicer", "InputSlicer"],
  ["Vertical list slicer", "VerticalListSlicer"],
  ["Dropdown slicer", "DropdownSlicer"],
  ["Tile slicer", "TileSlicer"],
  ["Hierarchical slicer", "HierarchicalSlicer"],
  ["Searchable slicer", "SearchableSlicer"],
  ["Numeric slicer", "NumericSlicer"],
  ["Numeric range slicer", "NumericRangeSlicer"],
  ["Between slicer", "BetweenSlicer"],
  ["Greater-than / After slicer", "GreaterThanSlicer"],
  ["Less-than / Before slicer", "LessThanSlicer"],
  ["Date range slicer", "DateRangeSlicer"],
  ["Date hierarchy slicer", "DateHierarchySlicer"],
  ["Relative date slicer", "RelativeDateSlicer"],
  ["Relative time slicer", "RelativeTimeSlicer"],
  ["Date picker", "DatePickerSlicer"],
  ["Single-select buttons", "SingleSelectButtons"],
  ["Multi-select buttons", "MultiSelectButtons"],
  ["Button grid", "ButtonGrid"],
  ["Button list", "ButtonList"],
  ["Image buttons", "ImageButtons"],
  ["Icon buttons", "IconButtons"],
  ["Searchable list", "SearchableListSlicer"],
  ["Hierarchical list", "HierarchicalListSlicer"],
  ["Conditionally formatted list", "ConditionalListSlicer"],
  ["Exact-text filter", "ExactTextFilter"],
  ["Contains filter", "ContainsFilter"],
  ["Starts-with filter", "StartsWithFilter"],
  ["Numeric-input filter", "NumericInputFilter"],
  ["Free-form input", "FreeFormInput"],
  ["Pasted-value filtering", "PastedValueFilter"],
  ["Input collection for write-back / translytical scenarios", "InputCollection"],
  ["Chiclet slicer", "ChicletSlicer"],
  ["Timeline slicer", "TimelineSlicer"],
  ["Advanced date slicer", "AdvancedDateSlicer"],
  ["Advanced hierarchy slicer", "AdvancedHierarchySlicer"],
];
slicers.forEach(([t, c]) => add(slicerCat, t, c, "@/components/slicers", "", 220));

// 13. Text images shapes
const shapeCat = "Text, Images, and Shapes";
[
  ["Image visual", "ImageVisual"],
  ["Static image", "StaticImage"],
  ["Dynamic / data-driven image", "DynamicImage"],
  ["Text box", "TextBox"],
  ["Dynamic / data-bound text", "DynamicText"],
  ["Rectangle", "RectangleShape"],
  ["Oval", "OvalShape"],
  ["Line", "LineShape"],
  ["Arrow", "ArrowShape"],
  ["Other report shapes", "ReportShape"],
].forEach(([t, c]) => add(shapeCat, t, c, "@/components/shapes", "", 180));

// 14. Navigation
const navCat = "Navigation and Interactivity Visuals";
[
  ["Button", "NavButton"],
  ["Blank button", "BlankButton"],
  ["Back button", "BackButton"],
  ["Bookmark button", "BookmarkButton"],
  ["Drill-through button", "DrillThroughButton"],
  ["Page navigation button", "PageNavigationButton"],
  ["Web URL button", "WebUrlButton"],
  ["Q&A button", "QAButton"],
  ["Apply-all-slicers button", "ApplyAllSlicersButton"],
  ["Clear-all-slicers button", "ClearAllSlicersButton"],
  ["Page Navigator", "PageNavigator"],
  ["Bookmark Navigator", "BookmarkNavigator"],
].forEach(([t, c]) => add(navCat, t, c, "@/components/navigation", "", 180));

// 15. Embedded - provide React shells via analytics/shapes
add("Embedded and Application Visuals", "Power Apps visual", "PowerAppsVisual", "@/components/integrations", "mock");
add("Embedded and Application Visuals", "Power Automate visual", "PowerAutomateVisual", "@/components/integrations", `flowId="publish-report" mock`);

// 16-17 Statistical (R/Python equivalents)
const statCat = "Statistical & Scientific Charts";
const stats = [
  ["Histogram", "Histogram"],
  ["Density plot", "DensityPlot"],
  ["Kernel-density plot", "KernelDensityPlot"],
  ["Box plot", "BoxPlot"],
  ["Violin plot", "ViolinPlot"],
  ["Ridgeline plot", "RidgelinePlot"],
  ["Hexbin plot", "HexbinPlot"],
  ["Correlogram", "Correlogram"],
  ["Scatterplot matrix", "ScatterplotMatrix"],
  ["Statistical heatmap", "StatisticalHeatmap"],
  ["Dendrogram", "Dendrogram"],
  ["Hierarchical clustering plot", "Dendrogram"],
  ["Survival curve", "SurvivalCurve"],
  ["ROC curve", "ROCCurve"],
  ["Precision-recall curve", "PrecisionRecallCurve"],
  ["QQ plot", "QQPlot"],
  ["Residual plot", "ResidualPlot"],
  ["Regression plot", "RegressionPlot"],
  ["Contour plot", "ContourPlot"],
  ["Faceted plots", "FacetedPlot"],
  ["Confidence-band plots", "ConfidenceBandPlot"],
  ["Network plots", "NetworkPlot"],
  ["Specialized scientific plots", "ScientificSpecVisual", `spec={scientificContourSpec} methodLabel="Sampled scalar field" units="normalized intensity" reference="Vega-Lite rect encoding"`],
  ["KDE plot", "KernelDensityPlot"],
  ["Heatmap", "StatisticalHeatmap"],
  ["Correlation matrix", "Correlogram"],
  ["Pair plot", "PairPlot"],
  ["Regression chart", "RegressionPlot"],
  ["Contour chart", "ContourPlot"],
  ["Error-bar plot", "ErrorBarPlot"],
  ["Statistical distribution plot", "DensityPlot"],
  ["Time-series analysis chart", "TrendAnalysis"],
  ["Forecast visualization", "ForecastDemo"],
  ["Machine-learning result plots", "MachineLearningResultPlot", "result={mlFeatureResult}"],
  ["Cluster plots", "ClusterPlot"],
  ["PCA plots", "PCAPlot"],
  ["Confusion matrix", "ConfusionMatrix"],
  ["Feature-importance chart", "FeatureImportanceChart"],
  ["Precision-recall chart", "PrecisionRecallCurve"],
  ["Custom Matplotlib visualizations", "MatplotlibArtifact", `src={galleryImages[0].src} alt="Revenue trend exported from a Matplotlib workflow" format="svg" caption="Static artifact supplied by the caller"`],
];
stats.forEach(([t, c, props]) => {
  const from =
    c === "TrendAnalysis"
      ? "@/components/overlays"
      : c === "ForecastDemo"
        ? "@/components/analytics"
        : c === "MachineLearningResultPlot"
          ? "@/components/analytics"
          : c === "ScientificSpecVisual"
            ? "@/components/declarative"
        : c === "MatplotlibArtifact"
          ? "@/components/content"
        : "@/components/charts";
  add(statCat, t, c, from, props ?? "");
});

// 18 AppSource families already partly covered + extras
const proj = "Project and Timeline Visuals";
[
  ["Gantt chart", "GanttChart", "data={ganttTasks}"],
  ["Advanced Gantt chart", "AdvancedGanttChart", "data={ganttTasks}"],
  ["Timeline chart", "TimelineChart", "events={timelineEvents}"],
  ["Milestone chart", "MilestoneChart", "events={timelineEvents}"],
  ["Project roadmap", "ProjectRoadmap", "data={ganttTasks}"],
].forEach(([t, c, props]) => add(proj, t, c, "@/components/charts", props));

const flow = "Flow and Network Visuals";
[
  ["Sankey diagram", "SankeyDiagram"],
  ["Alluvial diagram", "AlluvialDiagram"],
  ["Chord diagram", "ChordDiagram"],
  ["Network diagram", "NetworkDiagram"],
  ["Force-directed network", "ForceDirectedNetwork"],
  ["Dependency graph", "DependencyGraph"],
  ["Organizational chart", "OrgChart"],
  ["Process flow", "ProcessFlow"],
  ["Flowchart", "Flowchart"],
  ["Journey map", "JourneyMap"],
  ["Decision tree", "DecisionTree"],
  ["Tree diagram", "TreeDiagram"],
].forEach(([t, c]) => add(flow, t, c, "@/components/charts"));

const hier = "Hierarchy Visuals";
[
  ["Sunburst chart", "SunburstChart"],
  ["Icicle chart", "IcicleChart"],
  ["Circle packing", "CirclePacking"],
  ["Hierarchical edge bundling", "HierarchicalEdgeBundling"],
].forEach(([t, c]) => add(hier, t, c, "@/components/charts"));

const polar = "Polar and Radial Visuals";
[
  ["Radar chart", "RadarChart"],
  ["Spider chart", "SpiderChart"],
  ["Polar chart", "PolarChart"],
  ["Rose chart", "RoseChart"],
  ["Coxcomb chart", "CoxcombChart"],
  ["Nightingale rose chart", "NightingaleRose"],
  ["Polar area chart", "PolarAreaChart"],
].forEach(([t, c]) => add(polar, t, c, "@/components/charts"));

const kpi2 = "KPI and Gauge Visuals (Extended)";
[
  ["Bullet chart", "BulletChart", "@/components/cards", "value={72} target={80} label=\"Attainment\""],
  ["Linear gauge", "LinearGauge", "@/components/cards", "value={64} label=\"Utilization\""],
  ["Thermometer gauge", "ThermometerGauge", "@/components/cards", "value={78}"],
  ["Dial gauge", "DialGauge", "@/components/cards", "value={66} label=\"Score\""],
  ["Speedometer", "DialGauge", "@/components/cards", "value={82} label=\"Velocity\""],
  ["Advanced KPI", "KpiVisual", "@/components/cards", "metric={kpiMetrics[0]}"],
  ["Traffic-light KPI", "TrafficLightKpi", "@/components/cards", "metric={kpiMetrics[0]}"],
  ["Progress bar", "ProgressBar", "@/components/cards", "value={0.68} label=\"Pipeline\""],
  ["Progress ring", "ProgressRing", "@/components/cards", "value={0.74} label=\"Complete\""],
].forEach(([t, c, from, p]) => add(kpi2, t, c, from, p));

const info = "Infographic Visuals";
[
  ["Waffle chart", "WaffleChart"],
  ["Pictogram chart", "PictogramChart"],
  ["Icon array", "IconArray"],
  ["Infographic chart", "WaffleChart"],
].forEach(([t, c]) => add(info, t, c, "@/components/charts"));

const cmp = "Comparison Visuals";
[
  ["Lollipop chart", "LollipopChart"],
  ["Dumbbell chart", "DumbbellChart"],
  ["Connected-dot plot", "ConnectedDotPlot"],
  ["Slope chart", "SlopeChart"],
  ["Bump chart", "BumpChart"],
  ["Butterfly chart", "ButterflyChart"],
  ["Tornado chart", "TornadoChart"],
  ["Population pyramid", "PopulationPyramid"],
  ["Diverging bar chart", "DivergingBarChart"],
  ["Likert chart", "LikertChart"],
].forEach(([t, c]) => add(cmp, t, c, "@/components/charts"));

const dist = "Distribution Visuals";
[
  ["Dot-density chart", "DotDensityChart"],
  ["Strip plot", "StripPlot"],
  ["Beeswarm plot", "BeeswarmPlot"],
  ["Jitter plot", "JitterPlot"],
  ["Box-and-whisker plot", "BoxPlot"],
  ["Raincloud plot", "RaincloudPlot"],
  ["Frequency polygon", "FrequencyPolygon"],
  ["Ridgeline chart", "RidgelinePlot"],
  ["2D density plot", "ContourPlot"],
].forEach(([t, c]) => add(dist, t, c, "@/components/charts"));

const heat = "Heatmap and Matrix Visuals";
[
  ["Calendar heatmap", "CalendarHeatmap"],
  ["Matrix heatmap", "StatisticalHeatmap"],
  ["Correlation heatmap", "Correlogram"],
  ["Risk matrix", "RiskMatrix"],
  ["Quadrant chart", "ScatterBubbleChart"],
].forEach(([t, c]) => {
  const from = c === "ScatterBubbleChart" ? "@/components/charts" : "@/components/charts";
  const props =
    c === "ScatterBubbleChart"
      ? `data={scatterPoints} variant="quadrant" xThreshold={60} yThreshold={50}`
      : "";
  add(heat, t, c, from, props);
});

const compo = "Composition Visuals";
[
  ["Mekko chart", "MekkoChart"],
  ["Marimekko chart", "MarimekkoChart"],
  ["Mosaic plot", "MosaicPlot"],
].forEach(([t, c]) => add(compo, t, c, "@/components/charts"));

const multi = "Multivariate Visuals";
[
  ["Parallel coordinates plot", "ParallelCoordinates"],
  ["Parallel sets", "ParallelSets"],
  ["Ternary plot", "TernaryPlot"],
].forEach(([t, c]) => add(multi, t, c, "@/components/charts"));

const ts = "Time-Series and Range Visuals";
[
  ["Streamgraph", "Streamgraph"],
  ["Horizon chart", "HorizonChart"],
  ["Step chart", "StepChart"],
  ["Spline chart", "SplineChart"],
  ["Range area chart", "RangeAreaChart"],
  ["Band chart", "BandChart"],
  ["Fan chart", "FanChart"],
  ["Confidence-interval chart", "ConfidenceIntervalChart"],
  ["Error-bar chart", "ErrorBarPlot"],
].forEach(([t, c]) => add(ts, t, c, "@/components/charts"));

const fin = "Financial Visuals";
[
  ["Candlestick chart", "CandlestickChart"],
  ["OHLC chart", "OHLCChart"],
  ["Stock chart", "StockChart"],
  ["Renko chart", "RenkoChart"],
  ["Kagi chart", "KagiChart"],
  ["Financial waterfall", "FinancialWaterfall"],
].forEach(([t, c]) => add(fin, t, c, "@/components/charts"));

const qual = "Quality and Process Visuals";
[
  ["Pareto chart", "ParetoChart"],
  ["Control chart", "ControlChart"],
  ["SPC chart", "SPCChart"],
  ["Run chart", "RunChart"],
  ["Fishbone / Ishikawa diagram", "FishboneDiagram"],
  ["Bow-tie diagram", "BowTieDiagram"],
].forEach(([t, c]) => add(qual, t, c, "@/components/charts"));

const spec = "Specialty Composition Visuals";
[
  ["Funnel variants", "FunnelChart", "@/components/charts", "data={funnelStages}"],
  ["Pyramid chart", "FunnelChart", "@/components/charts", `data={funnelStages} variant="pyramid"`],
  ["Venn diagram", "VennDiagram", "@/components/charts", ""],
  ["Euler diagram", "EulerDiagram", "@/components/charts", ""],
].forEach(([t, c, from, p]) => add(spec, t, c, from, p));

const textCal = "Text and Calendar Visuals";
[
  ["Word cloud", "WordCloud"],
  ["Tag cloud", "TagCloud"],
  ["Calendar visual", "CalendarVisual"],
  ["KPI ticker", "KPITicker"],
  ["Data ticker", "DataTicker"],
  ["Scrolling text visual", "ScrollingText"],
].forEach(([t, c]) => add(textCal, t, c, "@/components/charts"));

const anim = "Animated Visuals";
[
  ["Animated bar-race chart", "AnimatedBarRace", "frames={barRaceFrames}"],
  ["Animated scatter chart", "AnimatedScatter", "frames={animatedScatterFrames}"],
  ["Animated timeline", "AnimatedTimeline", "frames={animatedTimelineFrames}"],
].forEach(([t, c, props]) => add(anim, t, c, "@/components/charts", props));

const img = "Image, SVG, and HTML Visuals";
[
  ["Image grid", "ImageGrid", "images={galleryImages}"],
  ["Image carousel", "ImageCarousel", "images={galleryImages}"],
  ["SVG visualizations", "SafeSvgVisual", `svg={gallerySafeSvg} title="Sanitized SVG column chart" description="Four ascending columns rendered from caller-supplied SVG."`],
  ["HTML-based visualizations", "SafeHtmlVisual", `html={gallerySafeHtml} ariaLabel="Sanitized quarterly operating summary"`],
].forEach(([t, c, props]) =>
  add(
    img,
    t,
    c,
    c === "SafeSvgVisual" || c === "SafeHtmlVisual"
      ? "@/components/content"
      : "@/components/charts",
    props,
  ),
);

add("Grammar-of-Graphics / Declarative Visuals", "Vega charts", "VegaChart", "@/components/declarative", "spec={vegaBarSpec}");
add("Grammar-of-Graphics / Declarative Visuals", "Vega-Lite charts", "VegaLiteChart", "@/components/declarative", "spec={vegaLiteScatterSpec}");
add("Grammar-of-Graphics / Declarative Visuals", "Deneb visuals", "DenebSpecRenderer", "@/components/declarative", "spec={denebCompatibleSpec} mode=\"vega-lite\"");

// 19 Analytical techniques
const tech = "Analytical and Formatting Techniques";
[
  ["Small multiples", "SmallMultiples", "@/components/overlays"],
  ["Trellis charts", "TrellisCharts", "@/components/overlays"],
  ["Faceted charts", "FacetedCharts", "@/components/overlays"],
  ["Drill-down", "DrillDownDemo", "@/components/overlays"],
  ["Drill-up", "DrillDownDemo", "@/components/overlays"],
  ["Expand-all hierarchy", "DecompositionTree", "@/components/analytics"],
  ["Cross-filtering", "CrossFilterDemo", "@/components/overlays"],
  ["Cross-highlighting", "CrossFilterDemo", "@/components/overlays"],
  ["Report-page tooltips", "VisualTooltipDemo", "@/components/overlays"],
  ["Visual tooltips", "VisualTooltipDemo", "@/components/overlays"],
  ["Forecasting", "ForecastDemo", "@/components/analytics"],
  ["Anomaly overlays", "AnomalyOverlayDemo", "@/components/analytics"],
  ["Error bars", "ErrorBarsOverlay", "@/components/overlays"],
  ["Constant lines", "ConstantLine", "@/components/overlays"],
  ["X-axis reference lines", "XAxisReferenceLine", "@/components/overlays"],
  ["Y-axis reference lines", "YAxisReferenceLine", "@/components/overlays"],
  ["Average lines", "AverageLine", "@/components/overlays"],
  ["Minimum lines", "MinLine", "@/components/overlays"],
  ["Maximum lines", "MaxLine", "@/components/overlays"],
  ["Median lines", "MedianLine", "@/components/overlays"],
  ["Percentile lines", "PercentileLine", "@/components/overlays"],
  ["Dynamic reference lines", "DynamicReferenceLine", "@/components/overlays"],
  ["Trend analysis", "TrendAnalysis", "@/components/overlays"],
  ["Conditional data colors", "ConditionalDataColors", "@/components/overlays"],
  ["Conditional icons", "DataTable", "@/components/tables", `columns={tableColumns} rows={matrixRows} showIcons`],
  ["Conditional data bars", "DataTable", "@/components/tables", `columns={tableColumns} rows={matrixRows} showDataBars`],
  ["Conditional backgrounds", "DataTable", "@/components/tables", `columns={tableColumns} rows={matrixRows} conditionalBackground`],
  ["Dynamic titles", "DynamicTitle", "@/components/overlays"],
  ["Dynamic labels", "DynamicText", "@/components/shapes"],
  ["Dynamic images", "DynamicImage", "@/components/shapes"],
].forEach(([t, c, from, p]) => add(tech, t, c, from, p || "", c.includes("Table") ? 280 : 260));

// 20. Deterministic paginated-report configurations
const pag = "Paginated Report Visualizations";
const paginatedReportRecipes = [
  ["Page measurement", "page-measurement", "Measures physical paper, printable body, margins, and point-to-inch conversion."],
  ["Explicit page breaks", "explicit-page-breaks", "Starts a named detail row in a fresh flow frame without changing source order."],
  ["Repeated table headers", "repeated-table-headers", "Repeats the detail-column header on every continuation frame."],
  ["Group headers", "group-headers", "Creates one named section header before each geographic group."],
  ["Nested groups", "nested-groups", "Nests deterministic team headers beneath geographic group headers."],
  ["Group subtotals", "group-subtotals", "Calculates quantity and amount subtotal rows independently per group."],
  ["Grand total", "grand-total", "Adds one report-level quantity and amount total after all detail rows."],
  ["Running totals", "running-totals", "Displays a cumulative amount from the filtered and sorted row stream."],
  ["Page numbers", "page-numbers", "Labels generated pages as page n of the deterministic total page count."],
  ["First and last page sections", "first-last-page-sections", "Uses distinct first-page context and last-page completion sections."],
  ["Keep groups together", "keep-groups-together", "Moves a fitting group to a fresh frame when remaining space is insufficient."],
  ["Orphan control", "orphan-control", "Requires three detail rows to remain with a newly placed group header."],
  ["Nested data regions", "nested-data-regions", "Places a measured matrix summary before the paginated detail region."],
  ["Subreport region", "subreport-region", "Reserves measured flow space for an independently labeled nested subreport."],
  ["Chart data region", "chart-data-region", "Renders a source-backed aggregate chart inside a measured report block."],
  ["Table data region", "table-data-region", "Uses a fixed-column detail table as the primary paginated data region."],
  ["Matrix data region", "matrix-data-region", "Cross-tabulates group and team amounts with row totals."],
  ["List data region", "list-data-region", "Flows records as labeled list cards while retaining deterministic row heights."],
  ["Two-column flow", "two-column-flow", "Flows continuation frames into two physical columns before adding a page."],
  ["Letter landscape", "letter-landscape", "Measures against a 792 by 612 point US Letter landscape page."],
  ["Legal portrait", "legal-portrait", "Measures against a 612 by 1008 point US Legal portrait page."],
  ["Custom page size", "custom-page-size", "Uses an explicit 420 by 595 point page and custom margins."],
  ["Print margin guide", "print-margin-guide", "Displays the printable boundary separately from paper edges and body content."],
  ["Report header and footer", "report-header-footer", "Reserves non-flowing page header and footer bands around each body frame."],
  ["Conditional group page breaks", "conditional-group-breaks", "Starts selected named groups on fresh pages while others flow naturally."],
  ["Deterministic sort and group", "deterministic-sort-group", "Sorts by group, subgroup, and label with original-position tie breaking."],
  ["Parameter and filter summary", "parameter-filter-summary", "Filters rows and records the active rule in a measured summary block."],
  ["Document map", "document-map", "Builds a navigable group outline targeting stable report section anchors."],
  ["Drillthrough links", "drillthrough-links", "Uses caller-supplied row destinations instead of inventing navigation targets."],
  ["Monochrome print style", "monochrome-print-style", "Applies high-contrast monochrome styling without changing pagination."],
  ["PDF export layout preview", "pdf-export-layout-preview", "Previews fixed page boxes and reserved bands without claiming a PDF-render baseline."],
  ["Accessible reading order", "accessible-reading-order", "Exposes pages, columns, headers, details, and totals in deterministic DOM order."],
];
if (paginatedReportRecipes.length !== 32) {
  throw new Error(`Paginated Report Visualizations must contain exactly 32 entries; found ${paginatedReportRecipes.length}.`);
}
paginatedReportRecipes.forEach(([title, variant, distinction]) => {
  if (!distinction?.trim()) {
    throw new Error(`Paginated report ${JSON.stringify(title)} needs a semantic distinction.`);
  }
  add(
    pag,
    title,
    "PaginatedReport",
    "@/components/reports",
    `variant="${variant}" maxPreviewPages={2}`,
    480,
    distinction,
  );
});

/**
 * Geographic visuals remain parked until their data fixtures and gallery
 * recipes are reviewed individually. Only the explicitly schematic grid and
 * hex matrices remain in the catalog. Provider adapters remain publicly
 * exported, but do not masquerade as paginated-report data regions.
 *
 * The components are all still in `src/components/maps` — to bring them back,
 * widen `KEPT_MAPS` or delete this filter and run `pnpm catalog`.
 */
const KEPT_MAPS = new Set(["HexMap", "TileGridMap"]);
const isParkedMap = (it) =>
  it.importFrom === "@/components/maps" && !KEPT_MAPS.has(it.component);

const catalogItems = items.filter((it) => !isParkedMap(it));
const activePaginatedReports = catalogItems.filter((item) => item.category === pag);
if (activePaginatedReports.length !== 32) {
  throw new Error(
    `Generated paginated-report family must contain exactly 32 entries; found ${activePaginatedReports.length}.`,
  );
}
if (activePaginatedReports.some((item) => !item.semanticDistinction?.trim())) {
  throw new Error("Every paginated-report entry needs a named semantic distinction.");
}

// Truth ledgers must fail closed as the catalog evolves. A misspelled or
// removed id/component should not leave dead metadata that appears enforced.
const catalogIds = new Set(catalogItems.map((item) => item.id));
for (const id of PLACEHOLDER_TRUTH.keys()) {
  if (!catalogIds.has(id)) {
    throw new Error(`Stale placeholder truth metadata for ${JSON.stringify(id)}.`);
  }
}
const catalogComponents = new Set(catalogItems.map((item) => item.component));
for (const component of IMPLEMENTING_COMPONENTS) {
  if (!catalogComponents.has(component)) {
    throw new Error(
      `Stale implementing-component metadata for ${JSON.stringify(component)}.`,
    );
  }
}

// IDs are public links, so uniqueness is global rather than category-scoped.
const ids = new Map();
for (const item of catalogItems) {
  const previous = ids.get(item.id);
  if (previous) {
    throw new Error(
      `Duplicate catalog id ${JSON.stringify(item.id)}: ${previous.title} and ${item.title}`,
    );
  }
  ids.set(item.id, item);
}

const recipeGroups = new Map();
for (const item of catalogItems) {
  const recipe = normalizedRecipe(item);
  if (!recipeGroups.has(recipe)) recipeGroups.set(recipe, []);
  recipeGroups.get(recipe).push(item);
}

const duplicateRecipeGroups = [...recipeGroups.values()].filter(
  (group) => group.length > 1,
);
const usedDuplicateDocs = new Set();
const undocumentedDuplicateRecipes = [];
for (const group of duplicateRecipeGroups) {
  const key = duplicateGroupKey(group);
  const note = DOCUMENTED_DUPLICATE_RECIPE_GROUPS.get(key);
  if (!note?.trim()) {
    undocumentedDuplicateRecipes.push(
      `${JSON.stringify(key)}, // ${normalizedRecipe(group[0])}`,
    );
    continue;
  }
  usedDuplicateDocs.add(key);
}
if (undocumentedDuplicateRecipes.length) {
  throw new Error(
    `Undocumented duplicate render recipes. Add each exact id group and a semantic distinction to DOCUMENTED_DUPLICATE_RECIPE_GROUPS:\n${undocumentedDuplicateRecipes.join("\n")}`,
  );
}
for (const key of DOCUMENTED_DUPLICATE_RECIPE_GROUPS.keys()) {
  if (!usedDuplicateDocs.has(key)) {
    throw new Error(
      `Stale duplicate-recipe documentation for ${JSON.stringify(key)}. Remove it or update the ids.`,
    );
  }
}

const componentGroups = new Map();
for (const item of catalogItems) {
  if (!componentGroups.has(item.component)) componentGroups.set(item.component, []);
  componentGroups.get(item.component).push(item);
}

function canonicalRecipeEntry(group) {
  return group.find((item) => !PLACEHOLDER_TRUTH.has(item.id)) ?? group[0];
}

function manifestEntry(item) {
  const recipeGroup = recipeGroups.get(normalizedRecipe(item));
  const recipeCanonical = canonicalRecipeEntry(recipeGroup);
  const componentGroup = componentGroups.get(item.component);
  const componentCanonical =
    componentGroup.find((candidate) => !PLACEHOLDER_TRUTH.has(candidate.id)) ??
    componentGroup[0];
  const variant = explicitVariant(item);
  const fixture = fixtureFor(item);
  const isSelfFramed = selfFramed.has(item.component);
  const status = PLACEHOLDER_TRUTH.has(item.id)
    ? "planned"
    : IMPLEMENTING_COMPONENTS.has(item.component)
      ? "implementing"
      : VERIFIED_HEROES.has(item.id)
        ? "verified"
        : "review";

  let semantic;
  if (PLACEHOLDER_TRUTH.has(item.id)) {
    const of = recipeCanonical.id !== item.id ? recipeCanonical.id : componentCanonical.id;
    semantic = {
      kind: "placeholder",
      ...(of !== item.id ? { of } : {}),
      distinction: PLACEHOLDER_TRUTH.get(item.id),
    };
  } else if (recipeGroup.length > 1 && recipeCanonical.id !== item.id) {
    semantic = {
      kind: "alias",
      of: recipeCanonical.id,
      distinction: `${DOCUMENTED_DUPLICATE_RECIPE_GROUPS.get(duplicateGroupKey(recipeGroup))} Catalog label: ${item.title}.`,
    };
  } else if (variant && componentCanonical.id !== item.id) {
    semantic = {
      kind: "variant",
      of: componentCanonical.id,
      distinction:
        item.semanticDistinction ??
        `Configures ${item.component} with the explicit ${variant} variant.`,
    };
  } else {
    semantic = {
      kind: "canonical",
      distinction:
        item.semanticDistinction ??
        (variant
          ? `Primary catalog recipe for the ${variant} configuration of ${item.component}.`
          : `Primary catalog recipe for ${item.component}.`),
    };
  }

  return {
    id: item.id,
    title: item.title,
    category: item.category,
    variant,
    component: item.component,
    status,
    statusNote:
      status === "planned"
        ? PLACEHOLDER_TRUTH.get(item.id)
        : status === "implementing"
          ? "A backing component exists, but semantic completeness or correctness remains active work."
          : status === "verified"
            ? VERIFIED_HEROES.get(item.id)
            : "A backing component exists, but this catalog entry has not completed verification.",
    semantic,
    source: {
      module: item.importFrom,
      exportName: item.component,
    },
    dependencies: SOURCE_DEPENDENCIES[item.importFrom] ?? ["react"],
    lazyLoader: {
      module: item.importFrom,
      exportName: item.component,
      clientOnly: true,
    },
    fixture,
    docs: {
      slug: item.id,
      state: "draft",
    },
    reference: {
      kind: referenceKind(item.category),
      label: item.title,
      state: "catalog-label",
    },
    capabilities: capabilitiesFor(item, fixture, isSelfFramed),
    ...(item.height ? { height: item.height } : {}),
    ...(isSelfFramed ? { selfFramed: true } : {}),
  };
}

const manifest = catalogItems.map(manifestEntry);

const lazyComponents = new Map();
for (const item of catalogItems) {
  const leafModule = leafModules.get(item.component) ?? item.importFrom;
  lazyComponents.set(item.component, leafModule);
}

const lazyBlocks = [...lazyComponents.entries()]
  .sort(([a], [b]) => a.localeCompare(b))
  .map(
    ([component, modulePath]) =>
      `const Lazy${component} = lazy(() => import(${JSON.stringify(modulePath)}).then((module) => ({ default: module.${component} })));`,
  )
  .join("\n");

const renderers = catalogItems
  .map((it) => {
    const props = it.props ? ` ${it.props}` : "";
    return `  ${JSON.stringify(it.id)}: () => <Lazy${it.component}${props} />,`;
  })
  .join("\n");

const manifestEntries = manifest
  .map((entry) => JSON.stringify(entry, null, 2))
  .join(",\n");

const manifestFile = `/**
 * GENERATED FILE — do not edit by hand.
 * Source: scripts/generate-catalog.mjs · regenerate with \`pnpm catalog\`.
 *
 * Unlike the gallery renderer, this module is serializable and does not import
 * every visual. Tooling can inspect implementation truth without loading the UI.
 */

import type { CatalogManifestEntry } from "./catalog-types";

export const catalogManifest = [
${manifestEntries}
] as const satisfies readonly CatalogManifestEntry[];

export type CatalogManifestId = (typeof catalogManifest)[number]["id"];

export const catalogManifestById = Object.fromEntries(
  catalogManifest.map((entry) => [entry.id, entry]),
) as Record<CatalogManifestId, (typeof catalogManifest)[number]>;
`;

const file = `"use client";

/**
 * GENERATED FILE — do not edit by hand.
 * Source: scripts/generate-catalog.mjs · regenerate with \`pnpm catalog\`.
 */

import { lazy, type ReactNode } from "react";
import { catalogManifest, type CatalogManifestId } from "./catalog-manifest";
import type { CatalogManifestEntry } from "./catalog-types";
import {
  kpiMetrics,
  animatedScatterFrames,
  animatedTimelineFrames,
  barRaceFrames,
  galleryImages,
  gallerySafeHtml,
  gallerySafeSvg,
  scientificContourSpec,
  mlFeatureResult,
  matrixRows,
  partToWhole,
  salesByRegion,
  scatterPoints,
  stackedSeries,
  treemapData,
  funnelStages,
  ganttTasks,
  timelineEvents,
  waterfallData,
  vegaBarSpec,
  vegaLiteScatterSpec,
  denebCompatibleSpec,
} from "@/lib/sample-data";

const tableColumns = [
  { key: "region", label: "Region" },
  { key: "q1", label: "Q1", numeric: true as const },
  { key: "q2", label: "Q2", numeric: true as const },
  { key: "q3", label: "Q3", numeric: true as const },
  { key: "q4", label: "Q4", numeric: true as const },
];

const matrixRowsWithLinks = matrixRows.map((r) => ({
  ...r,
  url: "https://example.com",
}));

/**
 * Deterministic, offline thumbnail for the image-cell demos. Fetching sample
 * photos from a third party made the gallery depend on the network and on a
 * service staying up.
 */
const demoThumb = (i: number) => {
  const fills = ["#0c2048", "#315fbb", "#1f6b4a", "#8a5010"];
  const svg =
    \`<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64">\` +
    \`<rect width="64" height="64" rx="12" fill="\${fills[i % fills.length]}"/>\` +
    \`<circle cx="32" cy="26" r="9" fill="#fff" fill-opacity="0.9"/>\` +
    \`<path d="M13 58c3.5-11 10.5-16.5 19-16.5S47.5 47 51 58z" fill="#fff" fill-opacity="0.9"/>\` +
    \`</svg>\`;
  return \`data:image/svg+xml,\${encodeURIComponent(svg)}\`;
};

const matrixRowsWithImages = matrixRows.map((r, i) => ({
  ...r,
  img: demoThumb(i),
}));

${lazyBlocks}

export type CatalogEntry = CatalogManifestEntry & {
  render: () => ReactNode;
};

const renderers = {
${renderers}
} satisfies Record<CatalogManifestId, () => ReactNode>;

export const catalog: CatalogEntry[] = catalogManifest.map((entry) => ({
  ...entry,
  render: renderers[entry.id],
}));

export const categories = [...new Set(catalog.map((c) => c.category))];
`;

const outputs = [
  {
    url: new URL("../src/registry/catalog-manifest.ts", import.meta.url),
    label: "src/registry/catalog-manifest.ts",
    content: manifestFile,
  },
  {
    url: new URL("../src/registry/catalog.tsx", import.meta.url),
    label: "src/registry/catalog.tsx",
    content: file,
  },
];

if (process.argv.includes("--check")) {
  const stale = outputs.filter(({ url, content }) => {
    try {
      return readFileSync(url, "utf8") !== content;
    } catch {
      return true;
    }
  });
  if (stale.length) {
    console.error(
      `Catalog output is stale or missing: ${stale.map((output) => output.label).join(", ")}. Run node scripts/generate-catalog.mjs.`,
    );
    process.exitCode = 1;
  } else {
    console.log(
      `Catalog check passed: ${catalogItems.length} entries, ${recipeGroups.size} normalized render recipes.`,
    );
  }
} else {
  for (const output of outputs) writeFileSync(output.url, output.content);
  console.log(
    `Wrote ${catalogItems.length} catalog entries across ${new Set(catalogItems.map((item) => item.category)).size} categories`,
  );
}
const usedSelfFramed = [...new Set(catalogItems.filter((item) => selfFramed.has(item.component)).map((item) => item.component))].sort();
console.log(`Self-framed components (rendered without a gallery frame): ${usedSelfFramed.join(", ")}`);
