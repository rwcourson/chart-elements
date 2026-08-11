"use client";

/**
 * GENERATED FILE — do not edit by hand.
 * Source: scripts/generate-catalog.mjs · regenerate with `pnpm catalog`.
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
    `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64">` +
    `<rect width="64" height="64" rx="12" fill="${fills[i % fills.length]}"/>` +
    `<circle cx="32" cy="26" r="9" fill="#fff" fill-opacity="0.9"/>` +
    `<path d="M13 58c3.5-11 10.5-16.5 19-16.5S47.5 47 51 58z" fill="#fff" fill-opacity="0.9"/>` +
    `</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

const matrixRowsWithImages = matrixRows.map((r, i) => ({
  ...r,
  img: demoThumb(i),
}));

const LazyAdvancedDateSlicer = lazy(() => import("@/components/slicers/slicers").then((module) => ({ default: module.AdvancedDateSlicer })));
const LazyAdvancedGanttChart = lazy(() => import("@/components/charts/project-timeline-charts").then((module) => ({ default: module.AdvancedGanttChart })));
const LazyAdvancedHierarchySlicer = lazy(() => import("@/components/slicers/slicers").then((module) => ({ default: module.AdvancedHierarchySlicer })));
const LazyAIDecompositionTree = lazy(() => import("@/components/analytics/analytical-visuals").then((module) => ({ default: module.AIDecompositionTree })));
const LazyAlluvialDiagram = lazy(() => import("@/components/charts/flow-hierarchy-charts").then((module) => ({ default: module.AlluvialDiagram })));
const LazyAnimatedBarRace = lazy(() => import("@/components/charts/time-financial-charts").then((module) => ({ default: module.AnimatedBarRace })));
const LazyAnimatedScatter = lazy(() => import("@/components/charts/time-financial-charts").then((module) => ({ default: module.AnimatedScatter })));
const LazyAnimatedTimeline = lazy(() => import("@/components/charts/time-financial-charts").then((module) => ({ default: module.AnimatedTimeline })));
const LazyAnomalyDetection = lazy(() => import("@/components/analytics/analytical-visuals").then((module) => ({ default: module.AnomalyDetection })));
const LazyAnomalyOverlayDemo = lazy(() => import("@/components/analytics/analytical-visuals").then((module) => ({ default: module.AnomalyOverlayDemo })));
const LazyApplyAllSlicersButton = lazy(() => import("@/components/navigation/nav-visuals").then((module) => ({ default: module.ApplyAllSlicersButton })));
const LazyArrowShape = lazy(() => import("@/components/shapes/shape-visuals").then((module) => ({ default: module.ArrowShape })));
const LazyAverageLine = lazy(() => import("@/components/overlays/analytical-overlays").then((module) => ({ default: module.AverageLine })));
const LazyBackButton = lazy(() => import("@/components/navigation/nav-visuals").then((module) => ({ default: module.BackButton })));
const LazyBandChart = lazy(() => import("@/components/charts/time-financial-charts").then((module) => ({ default: module.BandChart })));
const LazyBarColumnChart = lazy(() => import("@/components/charts/bar-column-chart").then((module) => ({ default: module.BarColumnChart })));
const LazyBeeswarmPlot = lazy(() => import("@/components/charts/statistical-charts").then((module) => ({ default: module.BeeswarmPlot })));
const LazyBetweenSlicer = lazy(() => import("@/components/slicers/slicers").then((module) => ({ default: module.BetweenSlicer })));
const LazyBlankButton = lazy(() => import("@/components/navigation/nav-visuals").then((module) => ({ default: module.BlankButton })));
const LazyBookmarkButton = lazy(() => import("@/components/navigation/nav-visuals").then((module) => ({ default: module.BookmarkButton })));
const LazyBookmarkNavigator = lazy(() => import("@/components/navigation/nav-visuals").then((module) => ({ default: module.BookmarkNavigator })));
const LazyBowTieDiagram = lazy(() => import("@/components/charts/time-financial-charts").then((module) => ({ default: module.BowTieDiagram })));
const LazyBoxPlot = lazy(() => import("@/components/charts/statistical-charts").then((module) => ({ default: module.BoxPlot })));
const LazyBulletChart = lazy(() => import("@/components/cards/gauges").then((module) => ({ default: module.BulletChart })));
const LazyBumpChart = lazy(() => import("@/components/charts/polar-comparison-charts").then((module) => ({ default: module.BumpChart })));
const LazyButterflyChart = lazy(() => import("@/components/charts/polar-comparison-charts").then((module) => ({ default: module.ButterflyChart })));
const LazyButtonGrid = lazy(() => import("@/components/slicers/slicers").then((module) => ({ default: module.ButtonGrid })));
const LazyButtonList = lazy(() => import("@/components/slicers/slicers").then((module) => ({ default: module.ButtonList })));
const LazyButtonSlicer = lazy(() => import("@/components/slicers/slicers").then((module) => ({ default: module.ButtonSlicer })));
const LazyCalendarHeatmap = lazy(() => import("@/components/charts/time-financial-charts").then((module) => ({ default: module.CalendarHeatmap })));
const LazyCalendarVisual = lazy(() => import("@/components/charts/time-financial-charts").then((module) => ({ default: module.CalendarVisual })));
const LazyCandlestickChart = lazy(() => import("@/components/charts/time-financial-charts").then((module) => ({ default: module.CandlestickChart })));
const LazyChicletSlicer = lazy(() => import("@/components/slicers/slicers").then((module) => ({ default: module.ChicletSlicer })));
const LazyChordDiagram = lazy(() => import("@/components/charts/flow-hierarchy-charts").then((module) => ({ default: module.ChordDiagram })));
const LazyCirclePacking = lazy(() => import("@/components/charts/flow-hierarchy-charts").then((module) => ({ default: module.CirclePacking })));
const LazyClearAllSlicersButton = lazy(() => import("@/components/navigation/nav-visuals").then((module) => ({ default: module.ClearAllSlicersButton })));
const LazyClusterPlot = lazy(() => import("@/components/charts/statistical-charts").then((module) => ({ default: module.ClusterPlot })));
const LazyColumnSparkline = lazy(() => import("@/components/charts/sparklines").then((module) => ({ default: module.ColumnSparkline })));
const LazyComboChart = lazy(() => import("@/components/charts/combo-chart").then((module) => ({ default: module.ComboChart })));
const LazyConditionalDataColors = lazy(() => import("@/components/overlays/analytical-overlays").then((module) => ({ default: module.ConditionalDataColors })));
const LazyConditionalListSlicer = lazy(() => import("@/components/slicers/slicers").then((module) => ({ default: module.ConditionalListSlicer })));
const LazyConfidenceBandPlot = lazy(() => import("@/components/charts/statistical-charts").then((module) => ({ default: module.ConfidenceBandPlot })));
const LazyConfidenceIntervalChart = lazy(() => import("@/components/charts/time-financial-charts").then((module) => ({ default: module.ConfidenceIntervalChart })));
const LazyConfusionMatrix = lazy(() => import("@/components/charts/statistical-charts").then((module) => ({ default: module.ConfusionMatrix })));
const LazyConnectedDotPlot = lazy(() => import("@/components/charts/polar-comparison-charts").then((module) => ({ default: module.ConnectedDotPlot })));
const LazyConstantLine = lazy(() => import("@/components/overlays/analytical-overlays").then((module) => ({ default: module.ConstantLine })));
const LazyContainsFilter = lazy(() => import("@/components/slicers/slicers").then((module) => ({ default: module.ContainsFilter })));
const LazyContourPlot = lazy(() => import("@/components/charts/statistical-charts").then((module) => ({ default: module.ContourPlot })));
const LazyControlChart = lazy(() => import("@/components/charts/time-financial-charts").then((module) => ({ default: module.ControlChart })));
const LazyCorrelogram = lazy(() => import("@/components/charts/statistical-charts").then((module) => ({ default: module.Correlogram })));
const LazyCoxcombChart = lazy(() => import("@/components/charts/polar-comparison-charts").then((module) => ({ default: module.CoxcombChart })));
const LazyCrossFilterDemo = lazy(() => import("@/components/overlays/analytical-overlays").then((module) => ({ default: module.CrossFilterDemo })));
const LazyDataTable = lazy(() => import("@/components/tables/data-table").then((module) => ({ default: module.DataTable })));
const LazyDataTicker = lazy(() => import("@/components/charts/time-financial-charts").then((module) => ({ default: module.DataTicker })));
const LazyDateHierarchySlicer = lazy(() => import("@/components/slicers/slicers").then((module) => ({ default: module.DateHierarchySlicer })));
const LazyDatePickerSlicer = lazy(() => import("@/components/slicers/slicers").then((module) => ({ default: module.DatePickerSlicer })));
const LazyDateRangeSlicer = lazy(() => import("@/components/slicers/slicers").then((module) => ({ default: module.DateRangeSlicer })));
const LazyDecisionTree = lazy(() => import("@/components/charts/flow-hierarchy-charts").then((module) => ({ default: module.DecisionTree })));
const LazyDecompositionTree = lazy(() => import("@/components/analytics/analytical-visuals").then((module) => ({ default: module.DecompositionTree })));
const LazyDendrogram = lazy(() => import("@/components/charts/statistical-charts").then((module) => ({ default: module.Dendrogram })));
const LazyDenebSpecRenderer = lazy(() => import("@/components/declarative/vega-visual").then((module) => ({ default: module.DenebSpecRenderer })));
const LazyDensityPlot = lazy(() => import("@/components/charts/statistical-charts").then((module) => ({ default: module.DensityPlot })));
const LazyDependencyGraph = lazy(() => import("@/components/charts/flow-hierarchy-charts").then((module) => ({ default: module.DependencyGraph })));
const LazyDialGauge = lazy(() => import("@/components/cards/gauges").then((module) => ({ default: module.DialGauge })));
const LazyDivergingBarChart = lazy(() => import("@/components/charts/polar-comparison-charts").then((module) => ({ default: module.DivergingBarChart })));
const LazyDotDensityChart = lazy(() => import("@/components/charts/statistical-charts").then((module) => ({ default: module.DotDensityChart })));
const LazyDrillDownDemo = lazy(() => import("@/components/overlays/analytical-overlays").then((module) => ({ default: module.DrillDownDemo })));
const LazyDrillThroughButton = lazy(() => import("@/components/navigation/nav-visuals").then((module) => ({ default: module.DrillThroughButton })));
const LazyDropdownSlicer = lazy(() => import("@/components/slicers/slicers").then((module) => ({ default: module.DropdownSlicer })));
const LazyDumbbellChart = lazy(() => import("@/components/charts/polar-comparison-charts").then((module) => ({ default: module.DumbbellChart })));
const LazyDynamicImage = lazy(() => import("@/components/shapes/shape-visuals").then((module) => ({ default: module.DynamicImage })));
const LazyDynamicReferenceLine = lazy(() => import("@/components/overlays/analytical-overlays").then((module) => ({ default: module.DynamicReferenceLine })));
const LazyDynamicText = lazy(() => import("@/components/shapes/shape-visuals").then((module) => ({ default: module.DynamicText })));
const LazyDynamicTitle = lazy(() => import("@/components/overlays/analytical-overlays").then((module) => ({ default: module.DynamicTitle })));
const LazyErrorBarPlot = lazy(() => import("@/components/charts/statistical-charts").then((module) => ({ default: module.ErrorBarPlot })));
const LazyErrorBarsOverlay = lazy(() => import("@/components/overlays/analytical-overlays").then((module) => ({ default: module.ErrorBarsOverlay })));
const LazyEulerDiagram = lazy(() => import("@/components/charts/time-financial-charts").then((module) => ({ default: module.EulerDiagram })));
const LazyExactTextFilter = lazy(() => import("@/components/slicers/slicers").then((module) => ({ default: module.ExactTextFilter })));
const LazyFacetedCharts = lazy(() => import("@/components/overlays/analytical-overlays").then((module) => ({ default: module.FacetedCharts })));
const LazyFacetedPlot = lazy(() => import("@/components/charts/statistical-charts").then((module) => ({ default: module.FacetedPlot })));
const LazyFanChart = lazy(() => import("@/components/charts/time-financial-charts").then((module) => ({ default: module.FanChart })));
const LazyFeatureImportanceChart = lazy(() => import("@/components/charts/statistical-charts").then((module) => ({ default: module.FeatureImportanceChart })));
const LazyFinancialWaterfall = lazy(() => import("@/components/charts/time-financial-charts").then((module) => ({ default: module.FinancialWaterfall })));
const LazyFishboneDiagram = lazy(() => import("@/components/charts/time-financial-charts").then((module) => ({ default: module.FishboneDiagram })));
const LazyFlowchart = lazy(() => import("@/components/charts/flow-hierarchy-charts").then((module) => ({ default: module.Flowchart })));
const LazyForceDirectedNetwork = lazy(() => import("@/components/charts/flow-hierarchy-charts").then((module) => ({ default: module.ForceDirectedNetwork })));
const LazyForecastDemo = lazy(() => import("@/components/analytics/analytical-visuals").then((module) => ({ default: module.ForecastDemo })));
const LazyFreeFormInput = lazy(() => import("@/components/slicers/slicers").then((module) => ({ default: module.FreeFormInput })));
const LazyFrequencyPolygon = lazy(() => import("@/components/charts/statistical-charts").then((module) => ({ default: module.FrequencyPolygon })));
const LazyFunnelChart = lazy(() => import("@/components/charts/funnel-chart").then((module) => ({ default: module.FunnelChart })));
const LazyGanttChart = lazy(() => import("@/components/charts/project-timeline-charts").then((module) => ({ default: module.GanttChart })));
const LazyGreaterThanSlicer = lazy(() => import("@/components/slicers/slicers").then((module) => ({ default: module.GreaterThanSlicer })));
const LazyHexbinPlot = lazy(() => import("@/components/charts/statistical-charts").then((module) => ({ default: module.HexbinPlot })));
const LazyHexMap = lazy(() => import("@/components/maps/schematic-maps").then((module) => ({ default: module.HexMap })));
const LazyHierarchicalEdgeBundling = lazy(() => import("@/components/charts/flow-hierarchy-charts").then((module) => ({ default: module.HierarchicalEdgeBundling })));
const LazyHierarchicalListSlicer = lazy(() => import("@/components/slicers/slicers").then((module) => ({ default: module.HierarchicalListSlicer })));
const LazyHierarchicalSlicer = lazy(() => import("@/components/slicers/slicers").then((module) => ({ default: module.HierarchicalSlicer })));
const LazyHistogram = lazy(() => import("@/components/charts/statistical-charts").then((module) => ({ default: module.Histogram })));
const LazyHorizonChart = lazy(() => import("@/components/charts/time-financial-charts").then((module) => ({ default: module.HorizonChart })));
const LazyIcicleChart = lazy(() => import("@/components/charts/flow-hierarchy-charts").then((module) => ({ default: module.IcicleChart })));
const LazyIconArray = lazy(() => import("@/components/charts/polar-comparison-charts").then((module) => ({ default: module.IconArray })));
const LazyIconButtons = lazy(() => import("@/components/slicers/slicers").then((module) => ({ default: module.IconButtons })));
const LazyImageButtons = lazy(() => import("@/components/slicers/slicers").then((module) => ({ default: module.ImageButtons })));
const LazyImageCarousel = lazy(() => import("@/components/charts/time-financial-charts").then((module) => ({ default: module.ImageCarousel })));
const LazyImageGrid = lazy(() => import("@/components/charts/time-financial-charts").then((module) => ({ default: module.ImageGrid })));
const LazyImageVisual = lazy(() => import("@/components/shapes/shape-visuals").then((module) => ({ default: module.ImageVisual })));
const LazyInputCollection = lazy(() => import("@/components/slicers/slicers").then((module) => ({ default: module.InputCollection })));
const LazyInputSlicer = lazy(() => import("@/components/slicers/slicers").then((module) => ({ default: module.InputSlicer })));
const LazyJitterPlot = lazy(() => import("@/components/charts/statistical-charts").then((module) => ({ default: module.JitterPlot })));
const LazyJourneyMap = lazy(() => import("@/components/charts/flow-hierarchy-charts").then((module) => ({ default: module.JourneyMap })));
const LazyKagiChart = lazy(() => import("@/components/charts/time-financial-charts").then((module) => ({ default: module.KagiChart })));
const LazyKernelDensityPlot = lazy(() => import("@/components/charts/statistical-charts").then((module) => ({ default: module.KernelDensityPlot })));
const LazyKeyInfluencers = lazy(() => import("@/components/analytics/analytical-visuals").then((module) => ({ default: module.KeyInfluencers })));
const LazyKPITicker = lazy(() => import("@/components/charts/time-financial-charts").then((module) => ({ default: module.KPITicker })));
const LazyKpiVisual = lazy(() => import("@/components/cards/kpi-cards").then((module) => ({ default: module.KpiVisual })));
const LazyLegacyCard = lazy(() => import("@/components/cards/kpi-cards").then((module) => ({ default: module.LegacyCard })));
const LazyLessThanSlicer = lazy(() => import("@/components/slicers/slicers").then((module) => ({ default: module.LessThanSlicer })));
const LazyLikertChart = lazy(() => import("@/components/charts/polar-comparison-charts").then((module) => ({ default: module.LikertChart })));
const LazyLineAreaChart = lazy(() => import("@/components/charts/line-area-chart").then((module) => ({ default: module.LineAreaChart })));
const LazyLinearGauge = lazy(() => import("@/components/cards/gauges").then((module) => ({ default: module.LinearGauge })));
const LazyLineShape = lazy(() => import("@/components/shapes/shape-visuals").then((module) => ({ default: module.LineShape })));
const LazyLineSparkline = lazy(() => import("@/components/charts/sparklines").then((module) => ({ default: module.LineSparkline })));
const LazyListSlicer = lazy(() => import("@/components/slicers/slicers").then((module) => ({ default: module.ListSlicer })));
const LazyLollipopChart = lazy(() => import("@/components/charts/polar-comparison-charts").then((module) => ({ default: module.LollipopChart })));
const LazyMachineLearningResultPlot = lazy(() => import("@/components/analytics/analytical-visuals").then((module) => ({ default: module.MachineLearningResultPlot })));
const LazyMarimekkoChart = lazy(() => import("@/components/charts/polar-comparison-charts").then((module) => ({ default: module.MarimekkoChart })));
const LazyMatplotlibArtifact = lazy(() => import("@/components/content/safe-content-visuals").then((module) => ({ default: module.MatplotlibArtifact })));
const LazyMatrixTable = lazy(() => import("@/components/tables/data-table").then((module) => ({ default: module.MatrixTable })));
const LazyMaxLine = lazy(() => import("@/components/overlays/analytical-overlays").then((module) => ({ default: module.MaxLine })));
const LazyMedianLine = lazy(() => import("@/components/overlays/analytical-overlays").then((module) => ({ default: module.MedianLine })));
const LazyMekkoChart = lazy(() => import("@/components/charts/polar-comparison-charts").then((module) => ({ default: module.MekkoChart })));
const LazyMilestoneChart = lazy(() => import("@/components/charts/project-timeline-charts").then((module) => ({ default: module.MilestoneChart })));
const LazyMinLine = lazy(() => import("@/components/overlays/analytical-overlays").then((module) => ({ default: module.MinLine })));
const LazyModernCard = lazy(() => import("@/components/cards/kpi-cards").then((module) => ({ default: module.ModernCard })));
const LazyMosaicPlot = lazy(() => import("@/components/charts/polar-comparison-charts").then((module) => ({ default: module.MosaicPlot })));
const LazyMultiCardLayout = lazy(() => import("@/components/cards/kpi-cards").then((module) => ({ default: module.MultiCardLayout })));
const LazyMultiCategoryCards = lazy(() => import("@/components/cards/kpi-cards").then((module) => ({ default: module.MultiCategoryCards })));
const LazyMultiRowCard = lazy(() => import("@/components/cards/kpi-cards").then((module) => ({ default: module.MultiRowCard })));
const LazyMultiSelectButtons = lazy(() => import("@/components/slicers/slicers").then((module) => ({ default: module.MultiSelectButtons })));
const LazyNavButton = lazy(() => import("@/components/navigation/nav-visuals").then((module) => ({ default: module.NavButton })));
const LazyNetworkDiagram = lazy(() => import("@/components/charts/flow-hierarchy-charts").then((module) => ({ default: module.NetworkDiagram })));
const LazyNetworkPlot = lazy(() => import("@/components/charts/statistical-charts").then((module) => ({ default: module.NetworkPlot })));
const LazyNightingaleRose = lazy(() => import("@/components/charts/polar-comparison-charts").then((module) => ({ default: module.NightingaleRose })));
const LazyNumericInputFilter = lazy(() => import("@/components/slicers/slicers").then((module) => ({ default: module.NumericInputFilter })));
const LazyNumericRangeSlicer = lazy(() => import("@/components/slicers/slicers").then((module) => ({ default: module.NumericRangeSlicer })));
const LazyNumericSlicer = lazy(() => import("@/components/slicers/slicers").then((module) => ({ default: module.NumericSlicer })));
const LazyOHLCChart = lazy(() => import("@/components/charts/time-financial-charts").then((module) => ({ default: module.OHLCChart })));
const LazyOrgChart = lazy(() => import("@/components/charts/flow-hierarchy-charts").then((module) => ({ default: module.OrgChart })));
const LazyOvalShape = lazy(() => import("@/components/shapes/shape-visuals").then((module) => ({ default: module.OvalShape })));
const LazyPageNavigationButton = lazy(() => import("@/components/navigation/nav-visuals").then((module) => ({ default: module.PageNavigationButton })));
const LazyPageNavigator = lazy(() => import("@/components/navigation/nav-visuals").then((module) => ({ default: module.PageNavigator })));
const LazyPaginatedReport = lazy(() => import("@/components/reports/paginated-report").then((module) => ({ default: module.PaginatedReport })));
const LazyPairPlot = lazy(() => import("@/components/charts/statistical-charts").then((module) => ({ default: module.PairPlot })));
const LazyParallelCoordinates = lazy(() => import("@/components/charts/polar-comparison-charts").then((module) => ({ default: module.ParallelCoordinates })));
const LazyParallelSets = lazy(() => import("@/components/charts/polar-comparison-charts").then((module) => ({ default: module.ParallelSets })));
const LazyParetoChart = lazy(() => import("@/components/charts/time-financial-charts").then((module) => ({ default: module.ParetoChart })));
const LazyPastedValueFilter = lazy(() => import("@/components/slicers/slicers").then((module) => ({ default: module.PastedValueFilter })));
const LazyPCAPlot = lazy(() => import("@/components/charts/statistical-charts").then((module) => ({ default: module.PCAPlot })));
const LazyPercentileLine = lazy(() => import("@/components/overlays/analytical-overlays").then((module) => ({ default: module.PercentileLine })));
const LazyPictogramChart = lazy(() => import("@/components/charts/polar-comparison-charts").then((module) => ({ default: module.PictogramChart })));
const LazyPieDonutChart = lazy(() => import("@/components/charts/pie-donut-chart").then((module) => ({ default: module.PieDonutChart })));
const LazyPolarAreaChart = lazy(() => import("@/components/charts/polar-comparison-charts").then((module) => ({ default: module.PolarAreaChart })));
const LazyPolarChart = lazy(() => import("@/components/charts/polar-comparison-charts").then((module) => ({ default: module.PolarChart })));
const LazyPopulationPyramid = lazy(() => import("@/components/charts/polar-comparison-charts").then((module) => ({ default: module.PopulationPyramid })));
const LazyPowerAppsVisual = lazy(() => import("@/components/integrations/application-adapters").then((module) => ({ default: module.PowerAppsVisual })));
const LazyPowerAutomateVisual = lazy(() => import("@/components/integrations/application-adapters").then((module) => ({ default: module.PowerAutomateVisual })));
const LazyPrecisionRecallCurve = lazy(() => import("@/components/charts/statistical-charts").then((module) => ({ default: module.PrecisionRecallCurve })));
const LazyProcessFlow = lazy(() => import("@/components/charts/flow-hierarchy-charts").then((module) => ({ default: module.ProcessFlow })));
const LazyProgressBar = lazy(() => import("@/components/cards/gauges").then((module) => ({ default: module.ProgressBar })));
const LazyProgressRing = lazy(() => import("@/components/cards/gauges").then((module) => ({ default: module.ProgressRing })));
const LazyProjectRoadmap = lazy(() => import("@/components/charts/project-timeline-charts").then((module) => ({ default: module.ProjectRoadmap })));
const LazyQAButton = lazy(() => import("@/components/navigation/nav-visuals").then((module) => ({ default: module.QAButton })));
const LazyQAEngineVisual = lazy(() => import("@/components/analytics/analytical-visuals").then((module) => ({ default: module.QAEngineVisual })));
const LazyQAVisual = lazy(() => import("@/components/analytics/analytical-visuals").then((module) => ({ default: module.QAVisual })));
const LazyQQPlot = lazy(() => import("@/components/charts/statistical-charts").then((module) => ({ default: module.QQPlot })));
const LazyRadarChart = lazy(() => import("@/components/charts/polar-comparison-charts").then((module) => ({ default: module.RadarChart })));
const LazyRadialGauge = lazy(() => import("@/components/cards/gauges").then((module) => ({ default: module.RadialGauge })));
const LazyRaincloudPlot = lazy(() => import("@/components/charts/statistical-charts").then((module) => ({ default: module.RaincloudPlot })));
const LazyRangeAreaChart = lazy(() => import("@/components/charts/time-financial-charts").then((module) => ({ default: module.RangeAreaChart })));
const LazyRectangleShape = lazy(() => import("@/components/shapes/shape-visuals").then((module) => ({ default: module.RectangleShape })));
const LazyRegressionPlot = lazy(() => import("@/components/charts/statistical-charts").then((module) => ({ default: module.RegressionPlot })));
const LazyRelativeDateSlicer = lazy(() => import("@/components/slicers/slicers").then((module) => ({ default: module.RelativeDateSlicer })));
const LazyRelativeTimeSlicer = lazy(() => import("@/components/slicers/slicers").then((module) => ({ default: module.RelativeTimeSlicer })));
const LazyRenkoChart = lazy(() => import("@/components/charts/time-financial-charts").then((module) => ({ default: module.RenkoChart })));
const LazyReportShape = lazy(() => import("@/components/shapes/shape-visuals").then((module) => ({ default: module.ReportShape })));
const LazyResidualPlot = lazy(() => import("@/components/charts/statistical-charts").then((module) => ({ default: module.ResidualPlot })));
const LazyRibbonChart = lazy(() => import("@/components/charts/ribbon-chart").then((module) => ({ default: module.RibbonChart })));
const LazyRidgelinePlot = lazy(() => import("@/components/charts/statistical-charts").then((module) => ({ default: module.RidgelinePlot })));
const LazyRiskMatrix = lazy(() => import("@/components/charts/statistical-charts").then((module) => ({ default: module.RiskMatrix })));
const LazyROCCurve = lazy(() => import("@/components/charts/statistical-charts").then((module) => ({ default: module.ROCCurve })));
const LazyRoseChart = lazy(() => import("@/components/charts/polar-comparison-charts").then((module) => ({ default: module.RoseChart })));
const LazyRunChart = lazy(() => import("@/components/charts/time-financial-charts").then((module) => ({ default: module.RunChart })));
const LazySafeHtmlVisual = lazy(() => import("@/components/content/safe-content-visuals").then((module) => ({ default: module.SafeHtmlVisual })));
const LazySafeSvgVisual = lazy(() => import("@/components/content/safe-content-visuals").then((module) => ({ default: module.SafeSvgVisual })));
const LazySankeyDiagram = lazy(() => import("@/components/charts/flow-hierarchy-charts").then((module) => ({ default: module.SankeyDiagram })));
const LazyScatterBubbleChart = lazy(() => import("@/components/charts/scatter-bubble-chart").then((module) => ({ default: module.ScatterBubbleChart })));
const LazyScatterplotMatrix = lazy(() => import("@/components/charts/statistical-charts").then((module) => ({ default: module.ScatterplotMatrix })));
const LazyScientificSpecVisual = lazy(() => import("@/components/declarative/vega-visual").then((module) => ({ default: module.ScientificSpecVisual })));
const LazyScorecard = lazy(() => import("@/components/cards/kpi-cards").then((module) => ({ default: module.Scorecard })));
const LazyScrollingText = lazy(() => import("@/components/charts/time-financial-charts").then((module) => ({ default: module.ScrollingText })));
const LazySearchableListSlicer = lazy(() => import("@/components/slicers/slicers").then((module) => ({ default: module.SearchableListSlicer })));
const LazySearchableSlicer = lazy(() => import("@/components/slicers/slicers").then((module) => ({ default: module.SearchableSlicer })));
const LazySingleSelectButtons = lazy(() => import("@/components/slicers/slicers").then((module) => ({ default: module.SingleSelectButtons })));
const LazySlopeChart = lazy(() => import("@/components/charts/polar-comparison-charts").then((module) => ({ default: module.SlopeChart })));
const LazySmallMultiples = lazy(() => import("@/components/overlays/analytical-overlays").then((module) => ({ default: module.SmallMultiples })));
const LazySmartNarrative = lazy(() => import("@/components/analytics/analytical-visuals").then((module) => ({ default: module.SmartNarrative })));
const LazySPCChart = lazy(() => import("@/components/charts/time-financial-charts").then((module) => ({ default: module.SPCChart })));
const LazySpiderChart = lazy(() => import("@/components/charts/polar-comparison-charts").then((module) => ({ default: module.SpiderChart })));
const LazySplineChart = lazy(() => import("@/components/charts/time-financial-charts").then((module) => ({ default: module.SplineChart })));
const LazyStandardSlicer = lazy(() => import("@/components/slicers/slicers").then((module) => ({ default: module.StandardSlicer })));
const LazyStartsWithFilter = lazy(() => import("@/components/slicers/slicers").then((module) => ({ default: module.StartsWithFilter })));
const LazyStaticImage = lazy(() => import("@/components/shapes/shape-visuals").then((module) => ({ default: module.StaticImage })));
const LazyStatisticalHeatmap = lazy(() => import("@/components/charts/statistical-charts").then((module) => ({ default: module.StatisticalHeatmap })));
const LazyStepChart = lazy(() => import("@/components/charts/time-financial-charts").then((module) => ({ default: module.StepChart })));
const LazyStockChart = lazy(() => import("@/components/charts/time-financial-charts").then((module) => ({ default: module.StockChart })));
const LazyStreamgraph = lazy(() => import("@/components/charts/time-financial-charts").then((module) => ({ default: module.Streamgraph })));
const LazyStripPlot = lazy(() => import("@/components/charts/statistical-charts").then((module) => ({ default: module.StripPlot })));
const LazySunburstChart = lazy(() => import("@/components/charts/flow-hierarchy-charts").then((module) => ({ default: module.SunburstChart })));
const LazySurvivalCurve = lazy(() => import("@/components/charts/statistical-charts").then((module) => ({ default: module.SurvivalCurve })));
const LazyTagCloud = lazy(() => import("@/components/charts/time-financial-charts").then((module) => ({ default: module.TagCloud })));
const LazyTernaryPlot = lazy(() => import("@/components/charts/polar-comparison-charts").then((module) => ({ default: module.TernaryPlot })));
const LazyTextBox = lazy(() => import("@/components/shapes/shape-visuals").then((module) => ({ default: module.TextBox })));
const LazyThermometerGauge = lazy(() => import("@/components/cards/gauges").then((module) => ({ default: module.ThermometerGauge })));
const LazyTileGridMap = lazy(() => import("@/components/maps/schematic-maps").then((module) => ({ default: module.TileGridMap })));
const LazyTileSlicer = lazy(() => import("@/components/slicers/slicers").then((module) => ({ default: module.TileSlicer })));
const LazyTimelineChart = lazy(() => import("@/components/charts/project-timeline-charts").then((module) => ({ default: module.TimelineChart })));
const LazyTimelineSlicer = lazy(() => import("@/components/slicers/slicers").then((module) => ({ default: module.TimelineSlicer })));
const LazyTopSegments = lazy(() => import("@/components/analytics/analytical-visuals").then((module) => ({ default: module.TopSegments })));
const LazyTornadoChart = lazy(() => import("@/components/charts/polar-comparison-charts").then((module) => ({ default: module.TornadoChart })));
const LazyTrafficLightKpi = lazy(() => import("@/components/cards/kpi-cards").then((module) => ({ default: module.TrafficLightKpi })));
const LazyTreeDiagram = lazy(() => import("@/components/charts/flow-hierarchy-charts").then((module) => ({ default: module.TreeDiagram })));
const LazyTreemapChart = lazy(() => import("@/components/charts/treemap-chart").then((module) => ({ default: module.TreemapChart })));
const LazyTrellisCharts = lazy(() => import("@/components/overlays/analytical-overlays").then((module) => ({ default: module.TrellisCharts })));
const LazyTrendAnalysis = lazy(() => import("@/components/overlays/analytical-overlays").then((module) => ({ default: module.TrendAnalysis })));
const LazyVegaChart = lazy(() => import("@/components/declarative/vega-visual").then((module) => ({ default: module.VegaChart })));
const LazyVegaLiteChart = lazy(() => import("@/components/declarative/vega-visual").then((module) => ({ default: module.VegaLiteChart })));
const LazyVennDiagram = lazy(() => import("@/components/charts/time-financial-charts").then((module) => ({ default: module.VennDiagram })));
const LazyVerticalListSlicer = lazy(() => import("@/components/slicers/slicers").then((module) => ({ default: module.VerticalListSlicer })));
const LazyViolinPlot = lazy(() => import("@/components/charts/statistical-charts").then((module) => ({ default: module.ViolinPlot })));
const LazyVisualTooltipDemo = lazy(() => import("@/components/overlays/analytical-overlays").then((module) => ({ default: module.VisualTooltipDemo })));
const LazyWaffleChart = lazy(() => import("@/components/charts/polar-comparison-charts").then((module) => ({ default: module.WaffleChart })));
const LazyWaterfallChart = lazy(() => import("@/components/charts/waterfall-chart").then((module) => ({ default: module.WaterfallChart })));
const LazyWebUrlButton = lazy(() => import("@/components/navigation/nav-visuals").then((module) => ({ default: module.WebUrlButton })));
const LazyWordCloud = lazy(() => import("@/components/charts/time-financial-charts").then((module) => ({ default: module.WordCloud })));
const LazyXAxisReferenceLine = lazy(() => import("@/components/overlays/analytical-overlays").then((module) => ({ default: module.XAxisReferenceLine })));
const LazyYAxisReferenceLine = lazy(() => import("@/components/overlays/analytical-overlays").then((module) => ({ default: module.YAxisReferenceLine })));

export type CatalogEntry = CatalogManifestEntry & {
  render: () => ReactNode;
};

const renderers = {
  "clustered-bar-chart": () => <LazyBarColumnChart data={stackedSeries} seriesKeys={["product","service","other"]} variant="clustered-bar" />,
  "stacked-bar-chart": () => <LazyBarColumnChart data={stackedSeries} seriesKeys={["product","service","other"]} variant="stacked-bar" />,
  "100-stacked-bar-chart": () => <LazyBarColumnChart data={stackedSeries} seriesKeys={["product","service","other"]} variant="percent-bar" />,
  "clustered-column-chart": () => <LazyBarColumnChart data={stackedSeries} seriesKeys={["product","service","other"]} variant="clustered-column" />,
  "stacked-column-chart": () => <LazyBarColumnChart data={stackedSeries} seriesKeys={["product","service","other"]} variant="stacked-column" />,
  "100-stacked-column-chart": () => <LazyBarColumnChart data={stackedSeries} seriesKeys={["product","service","other"]} variant="percent-column" />,
  "line-chart": () => <LazyLineAreaChart data={stackedSeries} categoryKey="name" seriesKeys={["product","service","other"]} variant="line" />,
  "area-chart": () => <LazyLineAreaChart data={stackedSeries} categoryKey="name" seriesKeys={["product","service","other"]} variant="area" />,
  "stacked-area-chart": () => <LazyLineAreaChart data={stackedSeries} categoryKey="name" seriesKeys={["product","service","other"]} variant="stacked-area" />,
  "100-stacked-area-chart": () => <LazyLineAreaChart data={stackedSeries} categoryKey="name" seriesKeys={["product","service","other"]} variant="percent-area" />,
  "line-and-clustered-column-chart": () => <LazyComboChart data={salesByRegion} barKeys={["sales"]} lineKeys={["profit"]} variant="line-clustered-column" />,
  "line-and-stacked-column-chart": () => <LazyComboChart data={salesByRegion} barKeys={["sales"]} lineKeys={["profit"]} variant="line-stacked-column" />,
  "dual-axis-combo-chart-configurations": () => <LazyComboChart data={salesByRegion} barKeys={["sales"]} lineKeys={["profit"]} variant="dual-axis" />,
  "waterfall-chart": () => <LazyWaterfallChart data={waterfallData} />,
  "ribbon-chart": () => <LazyRibbonChart data={stackedSeries} seriesKeys={["product","service","other"]} />,
  "pie-chart": () => <LazyPieDonutChart data={partToWhole} variant="pie" />,
  "donut-chart": () => <LazyPieDonutChart data={partToWhole} variant="donut" innerLabel="100%" />,
  "treemap": () => <LazyTreemapChart data={treemapData} />,
  "funnel-chart": () => <LazyFunnelChart data={funnelStages} />,
  "scatter-plot": () => <LazyScatterBubbleChart data={scatterPoints} variant="scatter" />,
  "bubble-chart": () => <LazyScatterBubbleChart data={scatterPoints} variant="bubble" />,
  "dot-plot": () => <LazyScatterBubbleChart data={scatterPoints} variant="dot-plot" />,
  "table": () => <LazyDataTable columns={tableColumns} rows={matrixRows} />,
  "matrix": () => <LazyMatrixTable rows={matrixRows} rowKey="region" columns={["q1","q2","q3","q4"]} />,
  "hierarchical-matrix": () => <LazyMatrixTable rows={matrixRows} rowKey="region" columns={["q1","q2","q3","q4"]} showSubtotals />,
  "pivot-style-matrix": () => <LazyMatrixTable rows={matrixRows} rowKey="region" columns={["q1","q2","q3","q4"]} showGrandTotal />,
  "table-with-totals": () => <LazyDataTable columns={tableColumns} rows={matrixRows} showTotals />,
  "matrix-with-subtotals": () => <LazyMatrixTable rows={matrixRows} rowKey="region" columns={["q1","q2","q3","q4"]} showSubtotals />,
  "matrix-with-grand-totals": () => <LazyMatrixTable rows={matrixRows} rowKey="region" columns={["q1","q2","q3","q4"]} showGrandTotal />,
  "table-matrix-with-conditional-background-colors": () => <LazyDataTable columns={tableColumns} rows={matrixRows} conditionalBackground />,
  "table-matrix-with-conditional-font-colors": () => <LazyDataTable columns={tableColumns} rows={matrixRows} conditionalFont />,
  "table-matrix-with-icons": () => <LazyDataTable columns={tableColumns} rows={matrixRows} showIcons />,
  "table-matrix-with-data-bars": () => <LazyDataTable columns={tableColumns} rows={matrixRows} showDataBars />,
  "table-matrix-with-web-urls": () => <LazyDataTable columns={[...tableColumns, {key:"url", label:"Link"}]} rows={matrixRowsWithLinks} linkKeys={["url"]} />,
  "table-matrix-with-images": () => <LazyDataTable columns={[{key:"img",label:"Avatar"},{key:"region",label:"Region"},...tableColumns.slice(1)]} rows={matrixRowsWithImages} imageKeys={["img"]} />,
  "table-matrix-with-sparklines": () => <LazyDataTable columns={tableColumns} rows={matrixRows} sparklineKey="trend" />,
  "line-sparkline": () => <LazyLineSparkline />,
  "column-sparkline": () => <LazyColumnSparkline />,
  "modern-card-visual-single-card-layout": () => <LazyModernCard metric={kpiMetrics[0]} withReference />,
  "modern-card-visual-multi-card-layout": () => <LazyMultiCardLayout metrics={kpiMetrics} />,
  "modern-card-visual-multi-category-card-layout": () => <LazyMultiCategoryCards metrics={kpiMetrics.map((m,i)=>({...m, category: i<2?"Growth":"Quality"}))} />,
  "modern-card-visual-card-with-reference-labels": () => <LazyModernCard metric={kpiMetrics[0]} withReference />,
  "modern-card-visual-card-with-images": () => <LazyModernCard metric={kpiMetrics[1]} withImage />,
  "modern-card-visual-data-driven-card-images": () => <LazyModernCard metric={{...kpiMetrics[0], imageUrl: demoThumb(1)}} withImage />,
  "legacy-single-card": () => <LazyLegacyCard metric={kpiMetrics[0]} />,
  "legacy-multi-row-card": () => <LazyMultiRowCard metrics={kpiMetrics} />,
  "kpi-visual": () => <LazyKpiVisual metric={kpiMetrics[0]} />,
  "radial-gauge": () => <LazyRadialGauge value={72} label="Attainment" ranges={[{to:50,color:"var(--chart-negative)"},{to:80,color:"var(--chart-warning)"},{to:100,color:"var(--chart-positive)"}]} />,
  "goals-scorecard-visual": () => <LazyScorecard metrics={kpiMetrics.slice(0,3)} />,
  "hex-maps": () => <LazyHexMap />,
  "tile-grid-maps": () => <LazyTileGridMap />,
  "decomposition-tree": () => <LazyDecompositionTree />,
  "ai-assisted-decomposition-tree": () => <LazyAIDecompositionTree />,
  "key-influencers": () => <LazyKeyInfluencers />,
  "top-segments": () => <LazyTopSegments />,
  "smart-narrative": () => <LazySmartNarrative />,
  "anomaly-detection": () => <LazyAnomalyDetection />,
  "q-a-visual": () => <LazyQAVisual />,
  "other-compatible-visuals-selected-by-the-q-a-engine": () => <LazyQAEngineVisual mock />,
  "standard-slicer": () => <LazyStandardSlicer />,
  "button-slicer": () => <LazyButtonSlicer />,
  "list-slicer": () => <LazyListSlicer />,
  "input-slicer": () => <LazyInputSlicer />,
  "vertical-list-slicer": () => <LazyVerticalListSlicer />,
  "dropdown-slicer": () => <LazyDropdownSlicer />,
  "tile-slicer": () => <LazyTileSlicer />,
  "hierarchical-slicer": () => <LazyHierarchicalSlicer />,
  "searchable-slicer": () => <LazySearchableSlicer />,
  "numeric-slicer": () => <LazyNumericSlicer />,
  "numeric-range-slicer": () => <LazyNumericRangeSlicer />,
  "between-slicer": () => <LazyBetweenSlicer />,
  "greater-than-after-slicer": () => <LazyGreaterThanSlicer />,
  "less-than-before-slicer": () => <LazyLessThanSlicer />,
  "date-range-slicer": () => <LazyDateRangeSlicer />,
  "date-hierarchy-slicer": () => <LazyDateHierarchySlicer />,
  "relative-date-slicer": () => <LazyRelativeDateSlicer />,
  "relative-time-slicer": () => <LazyRelativeTimeSlicer />,
  "date-picker": () => <LazyDatePickerSlicer />,
  "single-select-buttons": () => <LazySingleSelectButtons />,
  "multi-select-buttons": () => <LazyMultiSelectButtons />,
  "button-grid": () => <LazyButtonGrid />,
  "button-list": () => <LazyButtonList />,
  "image-buttons": () => <LazyImageButtons />,
  "icon-buttons": () => <LazyIconButtons />,
  "searchable-list": () => <LazySearchableListSlicer />,
  "hierarchical-list": () => <LazyHierarchicalListSlicer />,
  "conditionally-formatted-list": () => <LazyConditionalListSlicer />,
  "exact-text-filter": () => <LazyExactTextFilter />,
  "contains-filter": () => <LazyContainsFilter />,
  "starts-with-filter": () => <LazyStartsWithFilter />,
  "numeric-input-filter": () => <LazyNumericInputFilter />,
  "free-form-input": () => <LazyFreeFormInput />,
  "pasted-value-filtering": () => <LazyPastedValueFilter />,
  "input-collection-for-write-back-translytical-scenarios": () => <LazyInputCollection />,
  "chiclet-slicer": () => <LazyChicletSlicer />,
  "timeline-slicer": () => <LazyTimelineSlicer />,
  "advanced-date-slicer": () => <LazyAdvancedDateSlicer />,
  "advanced-hierarchy-slicer": () => <LazyAdvancedHierarchySlicer />,
  "image-visual": () => <LazyImageVisual />,
  "static-image": () => <LazyStaticImage />,
  "dynamic-data-driven-image": () => <LazyDynamicImage />,
  "text-box": () => <LazyTextBox />,
  "dynamic-data-bound-text": () => <LazyDynamicText />,
  "rectangle": () => <LazyRectangleShape />,
  "oval": () => <LazyOvalShape />,
  "line": () => <LazyLineShape />,
  "arrow": () => <LazyArrowShape />,
  "other-report-shapes": () => <LazyReportShape />,
  "button": () => <LazyNavButton />,
  "blank-button": () => <LazyBlankButton />,
  "back-button": () => <LazyBackButton />,
  "bookmark-button": () => <LazyBookmarkButton />,
  "drill-through-button": () => <LazyDrillThroughButton />,
  "page-navigation-button": () => <LazyPageNavigationButton />,
  "web-url-button": () => <LazyWebUrlButton />,
  "q-a-button": () => <LazyQAButton />,
  "apply-all-slicers-button": () => <LazyApplyAllSlicersButton />,
  "clear-all-slicers-button": () => <LazyClearAllSlicersButton />,
  "page-navigator": () => <LazyPageNavigator />,
  "bookmark-navigator": () => <LazyBookmarkNavigator />,
  "power-apps-visual": () => <LazyPowerAppsVisual mock />,
  "power-automate-visual": () => <LazyPowerAutomateVisual flowId="publish-report" mock />,
  "histogram": () => <LazyHistogram />,
  "density-plot": () => <LazyDensityPlot />,
  "kernel-density-plot": () => <LazyKernelDensityPlot />,
  "box-plot": () => <LazyBoxPlot />,
  "violin-plot": () => <LazyViolinPlot />,
  "ridgeline-plot": () => <LazyRidgelinePlot />,
  "hexbin-plot": () => <LazyHexbinPlot />,
  "correlogram": () => <LazyCorrelogram />,
  "scatterplot-matrix": () => <LazyScatterplotMatrix />,
  "statistical-heatmap": () => <LazyStatisticalHeatmap />,
  "dendrogram": () => <LazyDendrogram />,
  "hierarchical-clustering-plot": () => <LazyDendrogram />,
  "survival-curve": () => <LazySurvivalCurve />,
  "roc-curve": () => <LazyROCCurve />,
  "precision-recall-curve": () => <LazyPrecisionRecallCurve />,
  "qq-plot": () => <LazyQQPlot />,
  "residual-plot": () => <LazyResidualPlot />,
  "regression-plot": () => <LazyRegressionPlot />,
  "contour-plot": () => <LazyContourPlot />,
  "faceted-plots": () => <LazyFacetedPlot />,
  "confidence-band-plots": () => <LazyConfidenceBandPlot />,
  "network-plots": () => <LazyNetworkPlot />,
  "specialized-scientific-plots": () => <LazyScientificSpecVisual spec={scientificContourSpec} methodLabel="Sampled scalar field" units="normalized intensity" reference="Vega-Lite rect encoding" />,
  "kde-plot": () => <LazyKernelDensityPlot />,
  "heatmap": () => <LazyStatisticalHeatmap />,
  "correlation-matrix": () => <LazyCorrelogram />,
  "pair-plot": () => <LazyPairPlot />,
  "regression-chart": () => <LazyRegressionPlot />,
  "contour-chart": () => <LazyContourPlot />,
  "error-bar-plot": () => <LazyErrorBarPlot />,
  "statistical-distribution-plot": () => <LazyDensityPlot />,
  "time-series-analysis-chart": () => <LazyTrendAnalysis />,
  "forecast-visualization": () => <LazyForecastDemo />,
  "machine-learning-result-plots": () => <LazyMachineLearningResultPlot result={mlFeatureResult} />,
  "cluster-plots": () => <LazyClusterPlot />,
  "pca-plots": () => <LazyPCAPlot />,
  "confusion-matrix": () => <LazyConfusionMatrix />,
  "feature-importance-chart": () => <LazyFeatureImportanceChart />,
  "precision-recall-chart": () => <LazyPrecisionRecallCurve />,
  "custom-matplotlib-visualizations": () => <LazyMatplotlibArtifact src={galleryImages[0].src} alt="Revenue trend exported from a Matplotlib workflow" format="svg" caption="Static artifact supplied by the caller" />,
  "gantt-chart": () => <LazyGanttChart data={ganttTasks} />,
  "advanced-gantt-chart": () => <LazyAdvancedGanttChart data={ganttTasks} />,
  "timeline-chart": () => <LazyTimelineChart events={timelineEvents} />,
  "milestone-chart": () => <LazyMilestoneChart events={timelineEvents} />,
  "project-roadmap": () => <LazyProjectRoadmap data={ganttTasks} />,
  "sankey-diagram": () => <LazySankeyDiagram />,
  "alluvial-diagram": () => <LazyAlluvialDiagram />,
  "chord-diagram": () => <LazyChordDiagram />,
  "network-diagram": () => <LazyNetworkDiagram />,
  "force-directed-network": () => <LazyForceDirectedNetwork />,
  "dependency-graph": () => <LazyDependencyGraph />,
  "organizational-chart": () => <LazyOrgChart />,
  "process-flow": () => <LazyProcessFlow />,
  "flowchart": () => <LazyFlowchart />,
  "journey-map": () => <LazyJourneyMap />,
  "decision-tree": () => <LazyDecisionTree />,
  "tree-diagram": () => <LazyTreeDiagram />,
  "sunburst-chart": () => <LazySunburstChart />,
  "icicle-chart": () => <LazyIcicleChart />,
  "circle-packing": () => <LazyCirclePacking />,
  "hierarchical-edge-bundling": () => <LazyHierarchicalEdgeBundling />,
  "radar-chart": () => <LazyRadarChart />,
  "spider-chart": () => <LazySpiderChart />,
  "polar-chart": () => <LazyPolarChart />,
  "rose-chart": () => <LazyRoseChart />,
  "coxcomb-chart": () => <LazyCoxcombChart />,
  "nightingale-rose-chart": () => <LazyNightingaleRose />,
  "polar-area-chart": () => <LazyPolarAreaChart />,
  "bullet-chart": () => <LazyBulletChart value={72} target={80} label="Attainment" />,
  "linear-gauge": () => <LazyLinearGauge value={64} label="Utilization" />,
  "thermometer-gauge": () => <LazyThermometerGauge value={78} />,
  "dial-gauge": () => <LazyDialGauge value={66} label="Score" />,
  "speedometer": () => <LazyDialGauge value={82} label="Velocity" />,
  "advanced-kpi": () => <LazyKpiVisual metric={kpiMetrics[0]} />,
  "traffic-light-kpi": () => <LazyTrafficLightKpi metric={kpiMetrics[0]} />,
  "progress-bar": () => <LazyProgressBar value={0.68} label="Pipeline" />,
  "progress-ring": () => <LazyProgressRing value={0.74} label="Complete" />,
  "waffle-chart": () => <LazyWaffleChart />,
  "pictogram-chart": () => <LazyPictogramChart />,
  "icon-array": () => <LazyIconArray />,
  "infographic-chart": () => <LazyWaffleChart />,
  "lollipop-chart": () => <LazyLollipopChart />,
  "dumbbell-chart": () => <LazyDumbbellChart />,
  "connected-dot-plot": () => <LazyConnectedDotPlot />,
  "slope-chart": () => <LazySlopeChart />,
  "bump-chart": () => <LazyBumpChart />,
  "butterfly-chart": () => <LazyButterflyChart />,
  "tornado-chart": () => <LazyTornadoChart />,
  "population-pyramid": () => <LazyPopulationPyramid />,
  "diverging-bar-chart": () => <LazyDivergingBarChart />,
  "likert-chart": () => <LazyLikertChart />,
  "dot-density-chart": () => <LazyDotDensityChart />,
  "strip-plot": () => <LazyStripPlot />,
  "beeswarm-plot": () => <LazyBeeswarmPlot />,
  "jitter-plot": () => <LazyJitterPlot />,
  "box-and-whisker-plot": () => <LazyBoxPlot />,
  "raincloud-plot": () => <LazyRaincloudPlot />,
  "frequency-polygon": () => <LazyFrequencyPolygon />,
  "ridgeline-chart": () => <LazyRidgelinePlot />,
  "2d-density-plot": () => <LazyContourPlot />,
  "calendar-heatmap": () => <LazyCalendarHeatmap />,
  "matrix-heatmap": () => <LazyStatisticalHeatmap />,
  "correlation-heatmap": () => <LazyCorrelogram />,
  "risk-matrix": () => <LazyRiskMatrix />,
  "quadrant-chart": () => <LazyScatterBubbleChart data={scatterPoints} variant="quadrant" xThreshold={60} yThreshold={50} />,
  "mekko-chart": () => <LazyMekkoChart />,
  "marimekko-chart": () => <LazyMarimekkoChart />,
  "mosaic-plot": () => <LazyMosaicPlot />,
  "parallel-coordinates-plot": () => <LazyParallelCoordinates />,
  "parallel-sets": () => <LazyParallelSets />,
  "ternary-plot": () => <LazyTernaryPlot />,
  "streamgraph": () => <LazyStreamgraph />,
  "horizon-chart": () => <LazyHorizonChart />,
  "step-chart": () => <LazyStepChart />,
  "spline-chart": () => <LazySplineChart />,
  "range-area-chart": () => <LazyRangeAreaChart />,
  "band-chart": () => <LazyBandChart />,
  "fan-chart": () => <LazyFanChart />,
  "confidence-interval-chart": () => <LazyConfidenceIntervalChart />,
  "error-bar-chart": () => <LazyErrorBarPlot />,
  "candlestick-chart": () => <LazyCandlestickChart />,
  "ohlc-chart": () => <LazyOHLCChart />,
  "stock-chart": () => <LazyStockChart />,
  "renko-chart": () => <LazyRenkoChart />,
  "kagi-chart": () => <LazyKagiChart />,
  "financial-waterfall": () => <LazyFinancialWaterfall />,
  "pareto-chart": () => <LazyParetoChart />,
  "control-chart": () => <LazyControlChart />,
  "spc-chart": () => <LazySPCChart />,
  "run-chart": () => <LazyRunChart />,
  "fishbone-ishikawa-diagram": () => <LazyFishboneDiagram />,
  "bow-tie-diagram": () => <LazyBowTieDiagram />,
  "funnel-variants": () => <LazyFunnelChart data={funnelStages} />,
  "pyramid-chart": () => <LazyFunnelChart data={funnelStages} variant="pyramid" />,
  "venn-diagram": () => <LazyVennDiagram />,
  "euler-diagram": () => <LazyEulerDiagram />,
  "word-cloud": () => <LazyWordCloud />,
  "tag-cloud": () => <LazyTagCloud />,
  "calendar-visual": () => <LazyCalendarVisual />,
  "kpi-ticker": () => <LazyKPITicker />,
  "data-ticker": () => <LazyDataTicker />,
  "scrolling-text-visual": () => <LazyScrollingText />,
  "animated-bar-race-chart": () => <LazyAnimatedBarRace frames={barRaceFrames} />,
  "animated-scatter-chart": () => <LazyAnimatedScatter frames={animatedScatterFrames} />,
  "animated-timeline": () => <LazyAnimatedTimeline frames={animatedTimelineFrames} />,
  "image-grid": () => <LazyImageGrid images={galleryImages} />,
  "image-carousel": () => <LazyImageCarousel images={galleryImages} />,
  "svg-visualizations": () => <LazySafeSvgVisual svg={gallerySafeSvg} title="Sanitized SVG column chart" description="Four ascending columns rendered from caller-supplied SVG." />,
  "html-based-visualizations": () => <LazySafeHtmlVisual html={gallerySafeHtml} ariaLabel="Sanitized quarterly operating summary" />,
  "vega-charts": () => <LazyVegaChart spec={vegaBarSpec} />,
  "vega-lite-charts": () => <LazyVegaLiteChart spec={vegaLiteScatterSpec} />,
  "deneb-visuals": () => <LazyDenebSpecRenderer spec={denebCompatibleSpec} mode="vega-lite" />,
  "small-multiples": () => <LazySmallMultiples />,
  "trellis-charts": () => <LazyTrellisCharts />,
  "faceted-charts": () => <LazyFacetedCharts />,
  "drill-down": () => <LazyDrillDownDemo />,
  "drill-up": () => <LazyDrillDownDemo />,
  "expand-all-hierarchy": () => <LazyDecompositionTree />,
  "cross-filtering": () => <LazyCrossFilterDemo />,
  "cross-highlighting": () => <LazyCrossFilterDemo />,
  "report-page-tooltips": () => <LazyVisualTooltipDemo />,
  "visual-tooltips": () => <LazyVisualTooltipDemo />,
  "forecasting": () => <LazyForecastDemo />,
  "anomaly-overlays": () => <LazyAnomalyOverlayDemo />,
  "error-bars": () => <LazyErrorBarsOverlay />,
  "constant-lines": () => <LazyConstantLine />,
  "x-axis-reference-lines": () => <LazyXAxisReferenceLine />,
  "y-axis-reference-lines": () => <LazyYAxisReferenceLine />,
  "average-lines": () => <LazyAverageLine />,
  "minimum-lines": () => <LazyMinLine />,
  "maximum-lines": () => <LazyMaxLine />,
  "median-lines": () => <LazyMedianLine />,
  "percentile-lines": () => <LazyPercentileLine />,
  "dynamic-reference-lines": () => <LazyDynamicReferenceLine />,
  "trend-analysis": () => <LazyTrendAnalysis />,
  "conditional-data-colors": () => <LazyConditionalDataColors />,
  "conditional-icons": () => <LazyDataTable columns={tableColumns} rows={matrixRows} showIcons />,
  "conditional-data-bars": () => <LazyDataTable columns={tableColumns} rows={matrixRows} showDataBars />,
  "conditional-backgrounds": () => <LazyDataTable columns={tableColumns} rows={matrixRows} conditionalBackground />,
  "dynamic-titles": () => <LazyDynamicTitle />,
  "dynamic-labels": () => <LazyDynamicText />,
  "dynamic-images": () => <LazyDynamicImage />,
  "page-measurement": () => <LazyPaginatedReport variant="page-measurement" maxPreviewPages={2} />,
  "explicit-page-breaks": () => <LazyPaginatedReport variant="explicit-page-breaks" maxPreviewPages={2} />,
  "repeated-table-headers": () => <LazyPaginatedReport variant="repeated-table-headers" maxPreviewPages={2} />,
  "group-headers": () => <LazyPaginatedReport variant="group-headers" maxPreviewPages={2} />,
  "nested-groups": () => <LazyPaginatedReport variant="nested-groups" maxPreviewPages={2} />,
  "group-subtotals": () => <LazyPaginatedReport variant="group-subtotals" maxPreviewPages={2} />,
  "grand-total": () => <LazyPaginatedReport variant="grand-total" maxPreviewPages={2} />,
  "running-totals": () => <LazyPaginatedReport variant="running-totals" maxPreviewPages={2} />,
  "page-numbers": () => <LazyPaginatedReport variant="page-numbers" maxPreviewPages={2} />,
  "first-and-last-page-sections": () => <LazyPaginatedReport variant="first-last-page-sections" maxPreviewPages={2} />,
  "keep-groups-together": () => <LazyPaginatedReport variant="keep-groups-together" maxPreviewPages={2} />,
  "orphan-control": () => <LazyPaginatedReport variant="orphan-control" maxPreviewPages={2} />,
  "nested-data-regions": () => <LazyPaginatedReport variant="nested-data-regions" maxPreviewPages={2} />,
  "subreport-region": () => <LazyPaginatedReport variant="subreport-region" maxPreviewPages={2} />,
  "chart-data-region": () => <LazyPaginatedReport variant="chart-data-region" maxPreviewPages={2} />,
  "table-data-region": () => <LazyPaginatedReport variant="table-data-region" maxPreviewPages={2} />,
  "matrix-data-region": () => <LazyPaginatedReport variant="matrix-data-region" maxPreviewPages={2} />,
  "list-data-region": () => <LazyPaginatedReport variant="list-data-region" maxPreviewPages={2} />,
  "two-column-flow": () => <LazyPaginatedReport variant="two-column-flow" maxPreviewPages={2} />,
  "letter-landscape": () => <LazyPaginatedReport variant="letter-landscape" maxPreviewPages={2} />,
  "legal-portrait": () => <LazyPaginatedReport variant="legal-portrait" maxPreviewPages={2} />,
  "custom-page-size": () => <LazyPaginatedReport variant="custom-page-size" maxPreviewPages={2} />,
  "print-margin-guide": () => <LazyPaginatedReport variant="print-margin-guide" maxPreviewPages={2} />,
  "report-header-and-footer": () => <LazyPaginatedReport variant="report-header-footer" maxPreviewPages={2} />,
  "conditional-group-page-breaks": () => <LazyPaginatedReport variant="conditional-group-breaks" maxPreviewPages={2} />,
  "deterministic-sort-and-group": () => <LazyPaginatedReport variant="deterministic-sort-group" maxPreviewPages={2} />,
  "parameter-and-filter-summary": () => <LazyPaginatedReport variant="parameter-filter-summary" maxPreviewPages={2} />,
  "document-map": () => <LazyPaginatedReport variant="document-map" maxPreviewPages={2} />,
  "drillthrough-links": () => <LazyPaginatedReport variant="drillthrough-links" maxPreviewPages={2} />,
  "monochrome-print-style": () => <LazyPaginatedReport variant="monochrome-print-style" maxPreviewPages={2} />,
  "pdf-export-layout-preview": () => <LazyPaginatedReport variant="pdf-export-layout-preview" maxPreviewPages={2} />,
  "accessible-reading-order": () => <LazyPaginatedReport variant="accessible-reading-order" maxPreviewPages={2} />,
} satisfies Record<CatalogManifestId, () => ReactNode>;

export const catalog: CatalogEntry[] = catalogManifest.map((entry) => ({
  ...entry,
  render: renderers[entry.id],
}));

export const categories = [...new Set(catalog.map((c) => c.category))];
