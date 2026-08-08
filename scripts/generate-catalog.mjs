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

const selfFramed = detectSelfFramed(
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
]);

/** Every slicer is a control panel, including the few borrowed by other categories. */
const AUTO_HEIGHT_IMPORTS = new Set(["@/components/slicers"]);

/** @type {{ category: string, id: string, title: string, importFrom: string, component: string, props?: string, height?: number | "auto" }[]} */
const items = [];

function add(category, title, component, importFrom, props = "", height) {
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
  items.push({ category, id, title, importFrom, component, props, height: resolved });
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
  ["Azure Maps", "BubbleMap"],
  ["Shape Map", "ShapeMap"],
  ["Basic / Bubble Map", "BubbleMap"],
  ["Filled / Choropleth Map", "FilledChoroplethMap"],
  ["ArcGIS for Power BI", "ReferenceLayerMap"],
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
  ["Q&A visual", "QAVisual"],
  ["Other compatible visuals selected by the Q&A engine", "QAVisual"],
].forEach(([t, c]) => add(nlCat, t, c, "@/components/analytics"));

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
add("Embedded and Application Visuals", "Power Apps visual", "InputCollection", "@/components/slicers", "", 220);
add("Embedded and Application Visuals", "Power Automate visual", "ProcessFlow", "@/components/charts");

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
  ["Specialized scientific plots", "ContourPlot"],
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
  ["Machine-learning result plots", "FeatureImportanceChart"],
  ["Cluster plots", "ClusterPlot"],
  ["PCA plots", "PCAPlot"],
  ["Confusion matrix", "ConfusionMatrix"],
  ["Feature-importance chart", "FeatureImportanceChart"],
  ["Precision-recall chart", "PrecisionRecallCurve"],
  ["Custom Matplotlib visualizations", "FacetedPlot"],
];
stats.forEach(([t, c]) => {
  const from =
    c === "TrendAnalysis"
      ? "@/components/overlays"
      : c === "ForecastDemo"
        ? "@/components/analytics"
        : "@/components/charts";
  add(statCat, t, c, from);
});

// 18 AppSource families already partly covered + extras
const proj = "Project and Timeline Visuals";
[
  ["Gantt chart", "AnimatedTimeline"],
  ["Advanced Gantt chart", "AnimatedTimeline"],
  ["Timeline chart", "AnimatedTimeline"],
  ["Milestone chart", "AnimatedTimeline"],
  ["Project roadmap", "AnimatedTimeline"],
].forEach(([t, c]) => add(proj, t, c, "@/components/charts"));

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
  ["Risk matrix", "ConfusionMatrix"],
  ["Quadrant chart", "ScatterBubbleChart"],
].forEach(([t, c]) => {
  const from = c === "ScatterBubbleChart" ? "@/components/charts" : "@/components/charts";
  const props =
    c === "ScatterBubbleChart"
      ? `data={scatterPoints} variant="scatter"`
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
  ["Animated bar-race chart", "AnimatedBarRace"],
  ["Animated scatter chart", "AnimatedScatter"],
  ["Animated timeline", "AnimatedTimeline"],
].forEach(([t, c]) => add(anim, t, c, "@/components/charts"));

const img = "Image, SVG, and HTML Visuals";
[
  ["Image grid", "ImageGrid"],
  ["Image carousel", "ImageCarousel"],
  ["SVG visualizations", "SunburstChart"],
  ["HTML-based visualizations", "SmartNarrative"],
].forEach(([t, c]) =>
  add(img, t, c, c === "SmartNarrative" ? "@/components/analytics" : "@/components/charts"),
);

add("Grammar-of-Graphics / Declarative Visuals", "Vega charts", "FacetedPlot", "@/components/charts");
add("Grammar-of-Graphics / Declarative Visuals", "Vega-Lite charts", "RegressionPlot", "@/components/charts");
add("Grammar-of-Graphics / Declarative Visuals", "Deneb visuals", "ParallelCoordinates", "@/components/charts");

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

// 20 Paginated variants (map to existing)
const pag = "Paginated Report Visualizations";
[
  ["Area", "LineAreaChart", `data={stackedSeries} categoryKey="name" seriesKeys={["product"]} variant="area"`],
  ["Stacked area", "LineAreaChart", `data={stackedSeries} categoryKey="name" seriesKeys={["product","service","other"]} variant="stacked-area"`],
  ["100% stacked area", "LineAreaChart", `data={stackedSeries} categoryKey="name" seriesKeys={["product","service","other"]} variant="percent-area"`],
  ["Smooth area", "LineAreaChart", `data={stackedSeries} categoryKey="name" seriesKeys={["product"]} variant="area"`],
  ["Bar", "BarColumnChart", `data={salesByRegion} seriesKeys={["sales"]} variant="clustered-bar"`],
  ["Stacked bar", "BarColumnChart", `data={stackedSeries} seriesKeys={["product","service","other"]} variant="stacked-bar"`],
  ["100% stacked bar", "BarColumnChart", `data={stackedSeries} seriesKeys={["product","service","other"]} variant="percent-bar"`],
  ["3D clustered bar", "BarColumnChart", `data={salesByRegion} seriesKeys={["sales","profit"]} variant="clustered-bar"`],
  ["3D cylinder bar", "BarColumnChart", `data={salesByRegion} seriesKeys={["sales"]} variant="clustered-bar"`],
  ["Grouped stacked bar", "BarColumnChart", `data={stackedSeries} seriesKeys={["product","service","other"]} variant="stacked-bar"`],
  ["Column", "BarColumnChart", `data={salesByRegion} seriesKeys={["sales"]} variant="clustered-column"`],
  ["Stacked column", "BarColumnChart", `data={stackedSeries} seriesKeys={["product","service","other"]} variant="stacked-column"`],
  ["100% stacked column", "BarColumnChart", `data={stackedSeries} seriesKeys={["product","service","other"]} variant="percent-column"`],
  ["3D clustered column", "BarColumnChart", `data={salesByRegion} seriesKeys={["sales","profit"]} variant="clustered-column"`],
  ["3D cylinder column", "BarColumnChart", `data={salesByRegion} seriesKeys={["sales"]} variant="clustered-column"`],
  ["Smooth line", "LineAreaChart", `data={timeSeries} seriesKeys={["revenue"]} variant="spline"`],
  ["Stepped line", "LineAreaChart", `data={timeSeries} seriesKeys={["revenue"]} variant="step"`],
  ["Range chart", "RangeAreaChart", ""],
  ["Smooth range", "RangeAreaChart", ""],
  ["Range column", "BandChart", ""],
  ["Range bar", "TornadoChart", ""],
  ["Gantt-style range chart", "AnimatedTimeline", ""],
  ["High-Low-Open-Close chart", "OHLCChart", ""],
  ["Gauge ranges", "RadialGauge", `value={70} ranges={[{to:40,color:"var(--chart-negative)"},{to:75,color:"var(--chart-warning)"},{to:100,color:"var(--chart-positive)"}]}`],
  ["Gauge pointers", "DialGauge", "value={55}"],
  ["KPI indicators", "TrafficLightKpi", "metric={kpiMetrics[2]}"],
  ["Indicators embedded in gauges", "RadialGauge", "value={88} label=\"Health\""],
  ["Sparkline", "LineSparkline", ""],
  ["Data bar", "DataBar", ""],
  ["Indicator", "TrafficLightKpi", "metric={kpiMetrics[1]}"],
  ["KPI status indicator", "KpiVisual", "metric={kpiMetrics[3]}"],
  ["Map data region", "FilledChoroplethMap", ""],
  ["Spatial map", "ShapeMap", ""],
  ["ESRI shapefile-based map", "ReferenceLayerMap", ""],
  ["SQL spatial map", "PolygonMap", ""],
  ["Bing tile-backed map", "TileGridMap", ""],
].forEach(([t, c, p]) => {
  const from = [
    "LineAreaChart",
    "BarColumnChart",
    "RangeAreaChart",
    "BandChart",
    "TornadoChart",
    "AnimatedTimeline",
    "OHLCChart",
    "LineSparkline",
    "DataBar",
  ].includes(c)
    ? "@/components/charts"
    : ["RadialGauge", "DialGauge", "TrafficLightKpi", "KpiVisual"].includes(c)
      ? "@/components/cards"
      : "@/components/maps";
  add(pag, t, c, from, p || "");
});

/**
 * Geographic visuals are parked for now. Only the grid and hex layouts stay:
 * those are really matrix visuals on an abstract lattice and carry no
 * cartography, projection or boundary data.
 *
 * The components are all still in `src/components/maps` — to bring them back,
 * widen `KEPT_MAPS` or delete this filter and run `pnpm catalog`.
 */
const KEPT_MAPS = new Set(["HexMap", "TileGridMap"]);
const isParkedMap = (it) =>
  it.importFrom === "@/components/maps" && !KEPT_MAPS.has(it.component);

// Deduplicate by id within category
const seen = new Set();
const unique = items.filter((it) => {
  if (isParkedMap(it)) return false;
  const key = `${it.category}::${it.id}`;
  if (seen.has(key)) return false;
  seen.add(key);
  return true;
});

const byImport = new Map();
for (const it of unique) {
  if (!byImport.has(it.importFrom)) byImport.set(it.importFrom, new Set());
  byImport.get(it.importFrom).add(it.component);
}

const importBlocks = [...byImport.entries()]
  .map(([from, comps]) => {
    const list = [...comps].sort().join(", ");
    return `import { ${list} } from "${from}";`;
  })
  .join("\n");

const entries = unique
  .map((it) => {
    const props = it.props ? ` ${it.props}` : "";
    const h = it.height
      ? `\n    height: ${typeof it.height === "number" ? it.height : JSON.stringify(it.height)},`
      : "";
    const sf = selfFramed.has(it.component) ? `\n    selfFramed: true,` : "";
    return `  {
    id: ${JSON.stringify(it.id)},
    title: ${JSON.stringify(it.title)},
    category: ${JSON.stringify(it.category)},${h}${sf}
    render: () => <${it.component}${props} />,
  }`;
  })
  .join(",\n");

const file = `"use client";

/**
 * GENERATED FILE — do not edit by hand.
 * Source: scripts/generate-catalog.mjs · regenerate with \`pnpm catalog\`.
 */

import type { ReactNode } from "react";
${importBlocks}
import {
  kpiMetrics,
  matrixRows,
  partToWhole,
  salesByRegion,
  scatterPoints,
  stackedSeries,
  timeSeries,
  treemapData,
  funnelStages,
  waterfallData,
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

export type CatalogEntry = {
  id: string;
  title: string;
  category: string;
  /** \`"auto"\` for control panels, which have a natural height. */
  height?: number | "auto";
  /**
   * The component supplies its own card. The gallery labels it and renders it
   * directly instead of nesting it in a second frame.
   */
  selfFramed?: boolean;
  render: () => ReactNode;
};

export const catalog: CatalogEntry[] = [
${entries}
];

export const categories = [...new Set(catalog.map((c) => c.category))];
`;

writeFileSync(
  new URL("../src/registry/catalog.tsx", import.meta.url),
  file,
);
console.log(`Wrote ${unique.length} catalog entries across ${new Set(unique.map((u) => u.category)).size} categories`);
const usedSelfFramed = [...new Set(unique.filter((u) => selfFramed.has(u.component)).map((u) => u.component))].sort();
console.log(`Self-framed components (rendered without a gallery frame): ${usedSelfFramed.join(", ")}`);
