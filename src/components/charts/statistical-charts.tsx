"use client";

import * as React from "react";
import * as d3 from "d3";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ReferenceLine,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis} from "recharts";
import { ChartResponsiveContainer } from "./chart-responsive";
import { CHART_COLORS, colorAt, SEMANTIC } from "@/lib/chart-colors";
import {
  ACTIVE_DOT,
  PLOT_MARGIN as SHARED_PLOT_MARGIN,
  SERIES_STROKE_WIDTH} from "@/lib/chart-marks";
import { useChartAnimation, useSeriesHover } from "@/lib/chart-motion";
import {
  distribution,
  matrixRows,
  scatterPoints,
  salesByRegion} from "@/lib/sample-data";
import { cn, roundSvgNumber } from "@/lib/utils";
import { ChartEmpty, ScreenReaderTable } from "./chart-frame";
import { ChartTooltip } from "./chart-tooltip";

function Shell({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "h-full w-full [&_.recharts-cartesian-grid_line]:stroke-[var(--chart-grid)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

// Shared pack margins with a slightly tighter bottom for dense statistical axes.
const PLOT_MARGIN = { ...SHARED_PLOT_MARGIN, bottom: 4 };

// Raw float domains (e.g. -2.9250000000000007) render as ~130px-wide tick
// labels that spill past the chart frame, so every numeric axis is formatted.
function formatAxisNumber(value: number | string) {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return String(value ?? "");
  if (Number.isInteger(n)) return String(n);
  const abs = Math.abs(n);
  const digits = abs >= 10 ? 0 : abs >= 1 ? 1 : 2;
  return n
    .toFixed(digits)
    .replace(/\.0+$/, "")
    .replace(/(\.\d*?)0+$/, "$1");
}

// Continuous x domains get a fixed precision so the tick row doesn't mix
// "-2.4" with "-0.27". Kept single-argument: recharts passes the tick index as
// a second argument to tickFormatter.
function formatAxisTenths(value: number | string) {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return String(value ?? "");
  return n.toFixed(1).replace(/\.0$/, "");
}

type HistogramBin = { name: string; count: number; x0: number; x1: number };

function binHistogram(values: number[], bins = 12): HistogramBin[] {
  if (values.length === 0) return [];
  const extent = d3.extent(values) as [number, number];
  const hist = d3
    .bin()
    .domain(extent)
    .thresholds(bins)(values)
    .map((b) => ({
      name: `${b.x0?.toFixed(1)}`,
      count: b.length,
      x0: b.x0 ?? 0,
      x1: b.x1 ?? 0}));
  return hist;
}

const defaultValues = distribution.map((d) => d.x);
const defaultHist = binHistogram(defaultValues);
const defaultKde = distribution.map((d) => ({ x: d.x, density: d.y / 40 }));

type KdePoint = { x: number; density: number };

function kdeLine(values: number[], points = 40): KdePoint[] {
  if (values.length === 0 || points < 1) return [];
  const [min, max] = d3.extent(values) as [number, number];
  // A degenerate extent (all values equal) would make the kernel divide by zero.
  const bandwidth = (max - min) / 8 || 1;
  const normalizer = values.length * bandwidth * Math.sqrt(2 * Math.PI) || 1;
  const span = Math.max(1, points - 1);
  return d3.range(points).map((i) => {
    const x = min + (i / span) * (max - min);
    const density =
      values.reduce((sum, v) => sum + Math.exp(-0.5 * ((x - v) / bandwidth) ** 2), 0) / normalizer;
    return { x, density };
  });
}

// Deterministic bell-shaped samples: the probit of evenly spaced probabilities.
// The violin has to run a real kernel density over actual values to get a real
// silhouette, and Math.random() at render time breaks hydration.
function normalSpread(count: number, mean: number, sd: number): number[] {
  return d3.range(count).map((i) => {
    const u = (i + 0.5) / count;
    // Logistic quantile scaled to match a normal — monotone on (0,1), smooth,
    // and dense in the middle, which is all the density curve needs.
    return mean + sd * (Math.log(u / (1 - u)) / 1.702);
  });
}

type DistributionGroup = {
  name: string;
  values: number[];
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
};

function summarizeGroup(name: string, raw: number[]): DistributionGroup {
  const values = [...raw].sort(d3.ascending);
  return {
    name,
    values,
    min: values[0] ?? 0,
    q1: d3.quantile(values, 0.25) ?? 0,
    median: d3.quantile(values, 0.5) ?? 0,
    q3: d3.quantile(values, 0.75) ?? 0,
    max: values[values.length - 1] ?? 0};
}

// One set of channels with four deliberately different distributions — broad,
// bimodal, tight, and long-tailed — so the violins have distinct shapes instead
// of four copies of the same blob.
const defaultGroups: DistributionGroup[] = [
  summarizeGroup("Retail", normalSpread(36, 46, 11)),
  summarizeGroup("Direct", [...normalSpread(22, 38, 6), ...normalSpread(14, 68, 5)]),
  summarizeGroup("Online", normalSpread(40, 40, 7)),
  summarizeGroup("Partner", [...normalSpread(28, 58, 12), ...normalSpread(8, 27, 4)]),
];

const defaultBox = defaultGroups.map(({ name, min, q1, median, q3, max }) => ({
  name,
  min,
  q1,
  median,
  q3,
  max}));

// Dedicated sample for the raincloud — same units the box summarises, not a
// remapped slice of the unit-normal `defaultValues` (that used to pin every
// raindrop under the left whisker).
const raincloudValues = normalSpread(56, 42, 13);

const defaultCorrVars = ["Q1", "Q2", "Q3", "Q4"];
const defaultCorr = (() => {
  const keys = defaultCorrVars;
  return keys.flatMap((a, i) =>
    keys.map((b, j) => ({
      x: a,
      y: b,
      value: i === j ? 1 : 0.45 + ((i * 3 + j * 7) % 11) / 20})),
  );
})();

const defaultConfusion = [
  { actual: "A", predicted: "A", count: 42 },
  { actual: "A", predicted: "B", count: 8 },
  { actual: "B", predicted: "A", count: 6 },
  { actual: "B", predicted: "B", count: 38 },
  { actual: "C", predicted: "C", count: 30 },
  { actual: "C", predicted: "B", count: 5 },
];

const defaultFeatures = [
  { feature: "Revenue", importance: 0.34 },
  { feature: "Retention", importance: 0.28 },
  { feature: "NPS", importance: 0.18 },
  { feature: "CAC", importance: 0.12 },
  { feature: "Churn", importance: 0.08 },
];

const defaultSurvival = [
  { t: 0, survival: 1 },
  { t: 2, survival: 0.92 },
  { t: 4, survival: 0.84 },
  { t: 6, survival: 0.76 },
  { t: 8, survival: 0.68 },
  { t: 10, survival: 0.6 },
];

const defaultRoc = [
  { fpr: 0, tpr: 0 },
  { fpr: 0.1, tpr: 0.55 },
  { fpr: 0.25, tpr: 0.72 },
  { fpr: 0.45, tpr: 0.84 },
  { fpr: 0.7, tpr: 0.92 },
  { fpr: 1, tpr: 1 },
];

const defaultPr = [
  { recall: 0, precision: 1 },
  { recall: 0.2, precision: 0.88 },
  { recall: 0.45, precision: 0.78 },
  { recall: 0.7, precision: 0.65 },
  { recall: 1, precision: 0.42 },
];

const defaultResiduals = scatterPoints.slice(0, 24).map((p, i) => ({
  x: p.x,
  residual: (p.y - p.x * 0.8) + ((i % 5) - 2) * 2}));

const defaultRegression = scatterPoints.slice(0, 20);

export type RegressionPoint = { x: number; y: number };

export type LinearRegressionResult = {
  slope: number;
  intercept: number;
  rSquared: number;
};

export function linearRegression(data: readonly RegressionPoint[]): LinearRegressionResult | null {
  const points = data.filter(
    (point) => Number.isFinite(point.x) && Number.isFinite(point.y),
  );
  if (points.length < 2) return null;
  const meanX = d3.mean(points, (point) => point.x) ?? 0;
  const meanY = d3.mean(points, (point) => point.y) ?? 0;
  const denominator = d3.sum(points, (point) => (point.x - meanX) ** 2);
  if (denominator === 0) return null;
  const slope =
    d3.sum(points, (point) => (point.x - meanX) * (point.y - meanY)) /
    denominator;
  const intercept = meanY - slope * meanX;
  const residual = d3.sum(
    points,
    (point) => (point.y - (slope * point.x + intercept)) ** 2,
  );
  const total = d3.sum(points, (point) => (point.y - meanY) ** 2);
  return {
    slope,
    intercept,
    rSquared: total === 0 ? 1 : Math.max(0, 1 - residual / total)};
}

/** Acklam's deterministic approximation of the standard-normal quantile. */
export function standardNormalQuantile(probability: number): number {
  const p = Math.min(1 - Number.EPSILON, Math.max(Number.EPSILON, probability));
  const a = [-39.6968302866538, 220.946098424521, -275.928510446969, 138.357751867269, -30.6647980661472, 2.50662827745924];
  const b = [-54.4760987982241, 161.585836858041, -155.698979859887, 66.8013118877197, -13.2806815528857];
  const c = [-0.00778489400243029, -0.322396458041136, -2.40075827716184, -2.54973253934373, 4.37466414146497, 2.93816398269878];
  const d = [0.00778469570904146, 0.32246712907004, 2.44513413714299, 3.75440866190742];
  const low = 0.02425;
  const high = 1 - low;
  if (p < low) {
    const q = Math.sqrt(-2 * Math.log(p));
    return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
      ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  }
  if (p > high) {
    const q = Math.sqrt(-2 * Math.log(1 - p));
    return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
      ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  }
  const q = p - 0.5;
  const r = q * q;
  return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q /
    (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
}

// Service-dependency graph laid out as a hub plus a ring of consumers and four
// chords. A bare cycle gave every node the same degree, so there was nothing for
// the size channel to encode and nothing that read as a network. Angles are
// fixed rather than force-simulated: deterministic, and nothing settles after
// hydration. Coordinates are 0–100, mapped into the padded frame below.
const NETWORK_RING = ["Store", "Queue", "Auth", "Web", "CDN", "Cache"];

const defaultNetwork = {
  nodes: [
    { id: "API", x: 50, y: 50 },
    ...NETWORK_RING.map((id, i) => {
      const angle = (i / NETWORK_RING.length) * Math.PI * 2;
      return {
        id,
        x: 50 + 50 * Math.cos(angle),
        y: 50 + 50 * Math.sin(angle)};
    }),
  ],
  links: [
    ...NETWORK_RING.map((id) => ({ source: "API", target: id })),
    { source: "Auth", target: "Web" },
    { source: "Auth", target: "Queue" },
    { source: "Auth", target: "Store" },
    { source: "CDN", target: "Cache" },
    { source: "Cache", target: "Store" },
  ]};

const defaultErrorBars = salesByRegion.map((r) => ({
  name: r.name,
  value: r.sales,
  error: 28 + (r.sales % 20)}));

const defaultPca = scatterPoints.slice(0, 30).map((p, i) => ({
  pc1: p.x - 50,
  pc2: p.y - 40,
  cluster: ["C1", "C2", "C3"][i % 3]!}));

const defaultRidgeline = ["Alpha", "Beta", "Gamma"].map((name, i) => ({
  name,
  points: kdeLine(defaultValues.map((v) => v + i * 0.4), 24)}));

// Frame shared by the hand-drawn categorical plots (box, violin, error bar).
// 400x250 is 1.60 against the card surface's 1.587, so `xMidYMid meet` scales it
// into the slot with no letterbox left over — the old 400x200 boxes lost 60px of
// height to centring before a single mark was drawn.
const CAT_FRAME = { width: 400, height: 250 };
const CAT_MARGIN = { top: 18, right: 14, bottom: 30, left: 40 };
const CAT_W = CAT_FRAME.width - CAT_MARGIN.left - CAT_MARGIN.right;
const CAT_H = CAT_FRAME.height - CAT_MARGIN.top - CAT_MARGIN.bottom;

// These charts show a spread around a level rather than a magnitude, so forcing
// a zero baseline would strand the data in the top third of the plot. Niceing
// and ticking at the same count makes the domain top land on a tick, so the
// gridlines reach the top of the plot instead of leaving a dead band there.
function valueScale(lo: number, hi: number) {
  const pad = (hi - lo) * 0.08 || 1;
  const scale = d3
    .scaleLinear()
    .domain([lo - pad, hi + pad])
    .nice(6)
    .range([CAT_H, 0]);
  const [d0, d1] = scale.domain() as [number, number];
  return { scale, ticks: d3.ticks(d0, d1, 6) };
}

// Ticks, a gridline per tick, a baseline and the category row. Without these the
// marks were unreadable placeholder art: no scale to read a value against and
// nothing naming the groups.
function CatScaffold({
  y,
  ticks,
  x}: {
  y: (value: number) => number;
  ticks: number[];
  x: d3.ScaleBand<string>;
}) {
  return (
    <>
      {ticks.map((t) => (
        <g key={t}>
          <line x1={0} x2={CAT_W} y1={y(t)} y2={y(t)} stroke="var(--chart-grid)" strokeWidth={1} />
          <text x={-8} y={y(t) + 3.5} textAnchor="end" fontSize={10} fill="var(--chart-axis)">
            {formatAxisNumber(t)}
          </text>
        </g>
      ))}
      <line x1={0} x2={CAT_W} y1={CAT_H} y2={CAT_H} stroke="var(--border-strong)" strokeWidth={1} />
      {x.domain().map((name) => (
        <text
          key={name}
          x={(x(name) ?? 0) + x.bandwidth() / 2}
          y={CAT_H + 17}
          textAnchor="middle"
          fontSize={10}
          fill="var(--foreground)"
        >
          {name}
        </text>
      ))}
    </>
  );
}

function BoxPlotSvg({ data = defaultBox }: { data?: typeof defaultBox }) {
  const lo = d3.min(data, (d) => d.min) ?? 0;
  const hi = d3.max(data, (d) => d.max) ?? 100;
  const { scale: y, ticks } = valueScale(lo, hi);
  const x = d3
    .scaleBand<string>()
    .domain(data.map((d) => d.name))
    .range([0, CAT_W])
    // Boxes are the subject here, so they take most of the band instead of the
    // 35%-of-a-35%-padded-band sliver they used to get.
    .padding(0.42);
  const boxW = Math.min(x.bandwidth(), 58);

  return (
    <svg
      viewBox={`0 0 ${CAT_FRAME.width} ${CAT_FRAME.height}`}
      className="h-full w-full"
      preserveAspectRatio="xMidYMid meet"
    >
      <g transform={`translate(${CAT_MARGIN.left},${CAT_MARGIN.top})`}>
        <CatScaffold y={y} ticks={ticks} x={x} />
        {data.map((d, i) => {
          const cx = (x(d.name) ?? 0) + x.bandwidth() / 2;
          const cap = boxW * 0.46;
          return (
            <g key={d.name}>
              <line x1={cx} x2={cx} y1={y(d.max)} y2={y(d.q3)} stroke={colorAt(i)} strokeWidth={1.25} />
              <line x1={cx} x2={cx} y1={y(d.q1)} y2={y(d.min)} stroke={colorAt(i)} strokeWidth={1.25} />
              {/* Capped whiskers: an uncapped hairline read as a stray tick. */}
              <line
                x1={cx - cap / 2}
                x2={cx + cap / 2}
                y1={y(d.max)}
                y2={y(d.max)}
                stroke={colorAt(i)}
                strokeWidth={1.25}
              />
              <line
                x1={cx - cap / 2}
                x2={cx + cap / 2}
                y1={y(d.min)}
                y2={y(d.min)}
                stroke={colorAt(i)}
                strokeWidth={1.25}
              />
              <rect
                x={cx - boxW / 2}
                y={y(d.q3)}
                width={boxW}
                height={Math.max(1, y(d.q1) - y(d.q3))}
                fill={colorAt(i)}
                fillOpacity={0.22}
                stroke={colorAt(i)}
                strokeWidth={1.25}
                rx={2}
              />
              {/* The median overshoots the box and is drawn at full weight, so it
                  reads as the summary statistic rather than another box edge. */}
              <line
                x1={cx - boxW / 2 - 3}
                x2={cx + boxW / 2 + 3}
                y1={y(d.median)}
                y2={y(d.median)}
                stroke={colorAt(i)}
                strokeWidth={2.75}
                strokeLinecap="round"
              />
            </g>
          );
        })}
      </g>
    </svg>
  );
}

export function Histogram({ data = defaultHist }: { data?: typeof defaultHist }) {
  const anim = useChartAnimation();
  const hover = useSeriesHover();
  const uid = React.useId().replace(/[^a-zA-Z0-9]/g, "");

  return (
    <Shell>
      <ChartResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={PLOT_MARGIN}>
          <defs>
            {/* Depth without color math: the fill eases to 82% opacity toward
                the baseline, which reads as a soft top light on both themes. */}
            <linearGradient id={`hist-${uid}-0`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={CHART_COLORS[0]} stopOpacity={1} />
              <stop offset="100%" stopColor={CHART_COLORS[0]} stopOpacity={0.82} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="name" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} width={36} />
          <Tooltip content={<ChartTooltip />} />
          <Bar
            dataKey="count"
            fill={`url(#hist-${uid}-0)`}
            radius={[4, 4, 0, 0]}
            maxBarSize={32}
            {...anim}
          >
            {data.map((d) => (
              <Cell
                key={d.name}
                fillOpacity={hover.opacityFor(d.name)}
                {...hover.bind(d.name)}
              />
            ))}
          </Bar>
        </BarChart>
      </ChartResponsiveContainer>
    </Shell>
  );
}

export function DensityPlot({ data = defaultKde }: { data?: typeof defaultKde }) {
  const anim = useChartAnimation();

  return (
    <Shell>
      <ChartResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={PLOT_MARGIN}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="x"
            tickLine={false}
            axisLine={false}
            tickFormatter={formatAxisTenths}
            tickMargin={8}
            minTickGap={24}
          />
          <YAxis tickLine={false} axisLine={false} width={44} tickMargin={6} tickFormatter={formatAxisNumber} />
          <Tooltip content={<ChartTooltip />} />
          <Area
            type="monotone"
            dataKey="density"
            stroke={CHART_COLORS[1]}
            fill={CHART_COLORS[1]}
            fillOpacity={0.25}
            strokeWidth={SERIES_STROKE_WIDTH}
            strokeLinecap="round"
            activeDot={ACTIVE_DOT}
            {...anim}
          />
        </AreaChart>
      </ChartResponsiveContainer>
    </Shell>
  );
}

export function KernelDensityPlot({ values = defaultValues }: { values?: number[] }) {
  const anim = useChartAnimation();
  const data = kdeLine(values);

  if (data.length === 0) {
    return (
      <Shell>
        <ChartEmpty />
      </Shell>
    );
  }

  // Density maxima land on values like 0.183, whose auto ticks (0.045, 0.135)
  // are wider than the y gutter. A nice()d domain yields short, exact labels.
  const [, niceMax] = d3.nice(0, d3.max(data, (d) => d.density) ?? 1, 4);
  const yTicks = d3.ticks(0, niceMax, 4);

  return (
    <Shell>
      <ChartResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={PLOT_MARGIN}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="x"
            tickLine={false}
            axisLine={false}
            tickFormatter={formatAxisTenths}
            tickMargin={8}
            minTickGap={24}
          />
          <YAxis
            domain={[0, niceMax]}
            ticks={yTicks}
            tickLine={false}
            axisLine={false}
            width={44}
            tickMargin={6}
            tickFormatter={formatAxisNumber}
          />
          <Tooltip content={<ChartTooltip />} />
          <Line
            type="monotone"
            dataKey="density"
            stroke={CHART_COLORS[2]}
            strokeWidth={SERIES_STROKE_WIDTH}
            strokeLinecap="round"
            dot={false}
            activeDot={ACTIVE_DOT}
            {...anim}
          />
        </LineChart>
      </ChartResponsiveContainer>
    </Shell>
  );
}

export function BoxPlot({ data = defaultBox }: { data?: typeof defaultBox }) {
  if (data.length === 0) {
    return (
      <Shell>
        <ChartEmpty />
      </Shell>
    );
  }

  return (
    <Shell>
      <BoxPlotSvg data={data} />
    </Shell>
  );
}

export function ViolinPlot({ groups = defaultGroups }: { groups?: DistributionGroup[] }) {
  // A single value has no density to estimate, and kdeLine would divide by a
  // zero-width extent.
  const rows = groups.filter((g) => g.values.length > 1);

  if (rows.length === 0) {
    return (
      <Shell>
        <ChartEmpty />
      </Shell>
    );
  }

  const lo = d3.min(rows, (g) => g.min) ?? 0;
  const hi = d3.max(rows, (g) => g.max) ?? 100;
  const { scale: y, ticks } = valueScale(lo, hi);
  const x = d3
    .scaleBand<string>()
    .domain(rows.map((g) => g.name))
    .range([0, CAT_W])
    .padding(0.18);
  // The old shape was `sin(t * PI)` — a symmetric lens that said nothing about
  // the data. The silhouette is now the mirrored kernel density, so it bulges
  // where the values actually pile up.
  const curves = rows.map((g) => ({ group: g, kde: kdeLine(g.values, 48) }));
  const maxDensity = d3.max(curves, (c) => d3.max(c.kde, (p) => p.density)) ?? 1;
  // One shared density-to-width scale across groups, so a tight cluster reads as
  // a fat violin beside a spread-out one instead of every shape being equally
  // wide and equally uninformative.
  const halfWidth = d3
    .scaleLinear()
    .domain([0, maxDensity])
    .range([0, x.bandwidth() / 2]);
  const silhouette = d3
    .area<KdePoint>()
    .x0((p) => -halfWidth(p.density))
    .x1((p) => halfWidth(p.density))
    .y((p) => y(p.x))
    .curve(d3.curveCatmullRom.alpha(0.5));

  return (
    <Shell>
      <svg
        viewBox={`0 0 ${CAT_FRAME.width} ${CAT_FRAME.height}`}
        className="h-full w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <g transform={`translate(${CAT_MARGIN.left},${CAT_MARGIN.top})`}>
          <CatScaffold y={y} ticks={ticks} x={x} />
          {curves.map(({ group, kde }, i) => {
            const cx = (x(group.name) ?? 0) + x.bandwidth() / 2;
            return (
              <g key={group.name} transform={`translate(${cx},0)`}>
                <path
                  d={silhouette(kde) ?? ""}
                  fill={colorAt(i)}
                  fillOpacity={0.28}
                  stroke={colorAt(i)}
                  strokeWidth={1.25}
                />
                {/* Interquartile bar plus a median dot, so the summary numbers
                    stay legible inside the density shape. */}
                <rect
                  x={-4}
                  y={y(group.q3)}
                  width={8}
                  height={Math.max(1, y(group.q1) - y(group.q3))}
                  fill={colorAt(i)}
                  rx={4}
                />
                <circle
                  cy={y(group.median)}
                  r={3}
                  fill="var(--card)"
                  stroke={colorAt(i)}
                  strokeWidth={1.25}
                />
              </g>
            );
          })}
        </g>
      </svg>
    </Shell>
  );
}

export function RidgelinePlot({ series = defaultRidgeline }: { series?: typeof defaultRidgeline }) {
  const width = 400;
  const height = 200;
  // Series without points cannot be drawn (and would break the path endpoints).
  const rows = series.filter((s) => s.points.length > 0);
  const rowH = height / (rows.length || 1);
  const xMax = d3.max(rows, (s) => d3.max(s.points, (p) => p.x)) ?? 3;
  const xMin = d3.min(rows, (s) => d3.min(s.points, (p) => p.x)) ?? -3;
  const yMax = d3.max(rows, (s) => d3.max(s.points, (p) => p.density)) ?? 1;
  const x = d3.scaleLinear().domain([xMin, xMax]).range([40, width - 12]);
  const yScale = d3.scaleLinear().domain([0, yMax]).range([0, rowH * 0.7]);

  if (rows.length === 0) {
    return (
      <Shell>
        <ChartEmpty />
      </Shell>
    );
  }

  return (
    <Shell>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full" preserveAspectRatio="xMidYMid meet">
        {rows.map((s, i) => {
          const baseY = i * rowH + rowH * 0.85;
          const line = s.points
            .map((p) => `${x(p.x)},${baseY - yScale(p.density)}`)
            .join("L");
          return (
            <g key={s.name}>
              <text x={8} y={baseY - 4} className="fill-[var(--foreground)] text-[10px]">{s.name}</text>
              <path d={`M${line}L${x(s.points[s.points.length - 1]!.x)},${baseY}L${x(s.points[0]!.x)},${baseY}Z`} fill={colorAt(i)} fillOpacity={0.35} stroke={colorAt(i)} strokeWidth={1} />
            </g>
          );
        })}
      </svg>
    </Shell>
  );
}

function hexagonPath(r: number) {
  return d3.range(6)
    .map((i) => {
      const a = (Math.PI / 3) * i - Math.PI / 6;
      return `${r * Math.cos(a)},${r * Math.sin(a)}`;
    })
    .join("L");
}

export function HexbinPlot({ points = scatterPoints.slice(0, 40) }: { points?: typeof scatterPoints }) {
  const width = 400;
  const height = 220;
  // Cells small enough that every point lands alone defeat the purpose: the
  // count ramp only reads once neighbouring points share a cell.
  const radius = 26;
  const margin = 4;
  // hexagonPath() draws a pointy-top hexagon: sqrt(3)r wide, 2r tall. The
  // lattice steps have to match that geometry or the cells overlap sideways
  // while leaving gaps between rows.
  const hexW = Math.sqrt(3) * radius;
  const hexH = 2 * radius;
  const colStep = hexW;
  const rowStep = 1.5 * radius;
  const frameW = width - margin * 2;
  const frameH = height - margin * 2;

  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const sx = d3.scaleLinear().domain(d3.extent(xs) as [number, number]).range([0, Math.max(1, frameW - hexW)]);
  const sy = d3.scaleLinear().domain(d3.extent(ys) as [number, number]).range([Math.max(1, frameH - hexH), 0]);

  const bins = new Map<string, { x: number; y: number; count: number }>();
  points.forEach((p) => {
    const px = sx(p.x);
    const py = sy(p.y);
    const row = Math.round(py / rowStep);
    const rowOffset = row % 2 ? colStep / 2 : 0;
    const col = Math.round((px - rowOffset) / colStep);
    const key = `${col},${row}`;
    const existing = bins.get(key);
    if (existing) existing.count += 1;
    else bins.set(key, { x: col * colStep + rowOffset, y: row * rowStep, count: 1 });
  });
  const values = Array.from(bins.values());
  const max = d3.max(values, (b) => b.count) ?? 1;

  if (values.length === 0) {
    return (
      <Shell>
        <ChartEmpty />
      </Shell>
    );
  }

  // Fit the finished lattice into the padded frame so no cell can be clipped,
  // whatever the incoming domain looks like.
  const minX = d3.min(values, (b) => b.x) ?? 0;
  const maxX = d3.max(values, (b) => b.x) ?? 0;
  const minY = d3.min(values, (b) => b.y) ?? 0;
  const maxY = d3.max(values, (b) => b.y) ?? 0;
  const fieldW = maxX - minX + hexW;
  const fieldH = maxY - minY + hexH;
  const k = Math.min(1, frameW / fieldW, frameH / fieldH);
  const tx = margin + (frameW - fieldW * k) / 2 - (minX - hexW / 2) * k;
  const ty = margin + (frameH - fieldH * k) / 2 - (minY - hexH / 2) * k;

  return (
    <Shell>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full" preserveAspectRatio="xMidYMid meet">
        <g transform={`translate(${tx},${ty}) scale(${k})`}>
          {values.map((b, i) => (
            <path
              key={i}
              d={`M${hexagonPath(radius)}Z`}
              transform={`translate(${b.x},${b.y})`}
              // One hue with a density ramp — per-bin hues read as confetti and
              // hide the count encoding that is the point of a hexbin.
              fill={CHART_COLORS[1]}
              fillOpacity={0.3 + (b.count / max) * 0.6}
              stroke="var(--chart-grid)"
              strokeWidth={0.5}
            />
          ))}
        </g>
      </svg>
    </Shell>
  );
}

function HeatmapGrid({
  cells,
  xLabels,
  yLabels,
  showValues = false}: {
  cells: { x: string; y: string; value: number }[];
  xLabels: string[];
  yLabels: string[];
  showValues?: boolean;
}) {
  const width = 400;
  const height = 220;
  // The label row belongs directly under the cells; the previous single `pad`
  // both offset the grid and sized it, leaving a 36u gap plus a clipped
  // descender on the bottom label row.
  const margin = { top: 10, right: 10, bottom: 24, left: 54 };
  const w = width - margin.left - margin.right;
  const h = height - margin.top - margin.bottom;
  const x = d3.scaleBand().domain(xLabels).range([0, w]).padding(0.06);
  const y = d3.scaleBand().domain(yLabels).range([0, h]).padding(0.06);
  const max = d3.max(cells, (c) => c.value) ?? 1;
  // A full 0.15–1.0 ramp passes through tints where neither dark nor light ink
  // clears 4.5:1, so when the numbers are printed the tint stays gentle and
  // foreground ink reads on every cell in both themes. Without labels the
  // stronger ramp is kept, since colour is then the only encoding.
  const minAlpha = showValues ? 0.12 : 0.15;
  const maxAlpha = showValues ? 0.45 : 1;
  const alphaFor = (v: number) => minAlpha + (v / max) * (maxAlpha - minAlpha);
  // Decided per matrix, not per cell, so a correlation grid doesn't mix "1"
  // with "0.60" while a grid of counts stays free of pointless decimals.
  const fractional = cells.some((c) => !Number.isInteger(c.value));
  const fmt = (v: number) => (fractional ? v.toFixed(2) : String(v));

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full" preserveAspectRatio="xMidYMid meet">
      <g transform={`translate(${margin.left},${margin.top})`}>
        {cells.map((c) => {
          const opacity = alphaFor(c.value);
          return (
            <rect
              key={`${c.x}-${c.y}`}
              x={x(c.x) ?? 0}
              y={y(c.y) ?? 0}
              width={x.bandwidth()}
              height={y.bandwidth()}
              fill={CHART_COLORS[2]}
              fillOpacity={opacity}
              rx={2}
            />
          );
        })}
        {showValues
          ? cells.map((c) => (
              <text
                key={`v-${c.x}-${c.y}`}
                x={(x(c.x) ?? 0) + x.bandwidth() / 2}
                y={(y(c.y) ?? 0) + y.bandwidth() / 2}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={10}
                fontWeight={500}
                fill="var(--foreground)"
              >
                {fmt(c.value)}
              </text>
            ))
          : null}
        {xLabels.map((l) => (
          <text key={l} x={(x(l) ?? 0) + x.bandwidth() / 2} y={h + 14} textAnchor="middle" className="fill-[var(--chart-axis)] text-[10px]">{l}</text>
        ))}
        {yLabels.map((l) => (
          <text key={l} x={-8} y={(y(l) ?? 0) + y.bandwidth() / 2 + 3.5} textAnchor="end" className="fill-[var(--chart-axis)] text-[10px]">{l}</text>
        ))}
      </g>
    </svg>
  );
}

export function Correlogram({ cells = defaultCorr }: { cells?: typeof defaultCorr }) {
  const labels = defaultCorrVars;
  return (
    <Shell>
      <HeatmapGrid cells={cells} xLabels={labels} yLabels={labels} showValues />
    </Shell>
  );
}

export function ScatterplotMatrix({ variables = ["x", "y", "z"] as const, data = scatterPoints.slice(0, 20) }: {
  variables?: readonly string[];
  data?: typeof scatterPoints;
}) {
  const size = 400;
  const n = variables.length;

  if (n === 0 || data.length === 0) {
    return (
      <Shell>
        <ChartEmpty />
      </Shell>
    );
  }

  const dot = 2.5;
  // Label gutters live in the margins, not inside the grid, so every panel is
  // the same size and the outer frame keeps a visible margin on all four sides.
  const margin = { top: 26, right: 6, bottom: 6, left: 34 };
  const gap = 14;
  const plotW = (size - margin.left - margin.right - gap * (n - 1)) / n;
  const plotH = (size - margin.top - margin.bottom - gap * (n - 1)) / n;

  const numberAt = (row: (typeof data)[number], key: string) => {
    const raw = Number(row[key as keyof typeof row] ?? 0);
    return Number.isFinite(raw) ? raw : 0;
  };
  const domainOf = (key: string) => {
    const [lo, hi] = d3.extent(data, (row) => numberAt(row, key)) as [number, number];
    // A single distinct value would collapse the scale onto one pixel column.
    return lo === hi ? [lo - 1, hi + 1] : [lo, hi];
  };
  const domains = new Map(variables.map((v) => [v, domainOf(v)] as const));
  // Insetting each range by the dot radius keeps marks off the panel edge.
  const scaleX = (key: string) =>
    d3.scaleLinear().domain(domains.get(key) ?? [0, 1]).range([dot, plotW - dot]);
  const scaleY = (key: string) =>
    d3.scaleLinear().domain(domains.get(key) ?? [0, 1]).range([plotH - dot, dot]);

  return (
    <Shell>
      <svg viewBox={`0 0 ${size} ${size}`} className="h-full w-full" preserveAspectRatio="xMidYMid meet">
        {variables.flatMap((rowVar, i) =>
          variables.map((colVar, j) => {
            const ox = margin.left + j * (plotW + gap);
            const oy = margin.top + i * (plotH + gap);
            const sx = scaleX(colVar);
            const sy = scaleY(rowVar);
            return (
              <g key={`${rowVar}-${colVar}`} transform={`translate(${ox},${oy})`}>
                <rect width={plotW} height={plotH} fill="var(--chart-grid)" fillOpacity={0.15} rx={3} />
                {data.map((d, k) => (
                  <circle
                    key={k}
                    cx={sx(numberAt(d, colVar))}
                    cy={sy(numberAt(d, rowVar))}
                    r={dot}
                    fill={colorAt(k % 5)}
                  />
                ))}
                {i === 0 ? (
                  <text x={plotW / 2} y={-9} textAnchor="middle" className="fill-[var(--foreground)] text-[10px]">{colVar}</text>
                ) : null}
                {j === 0 ? (
                  <text x={-9} y={plotH / 2 + 3.5} textAnchor="end" className="fill-[var(--foreground)] text-[10px]">{rowVar}</text>
                ) : null}
              </g>
            );
          }),
        )}
      </svg>
    </Shell>
  );
}

export function StatisticalHeatmap({ rows = matrixRows }: { rows?: typeof matrixRows }) {
  const keys = ["q1", "q2", "q3", "q4"] as const;
  // Raw data keys are lowercase; the axis shows them as column headings.
  const cells = rows.flatMap((r) =>
    keys.map((k) => ({ x: k.toUpperCase(), y: r.region, value: Number(r[k]) })),
  );
  return (
    <Shell>
      <HeatmapGrid
        cells={cells}
        xLabels={keys.map((k) => k.toUpperCase())}
        yLabels={rows.map((r) => r.region)}
        showValues
      />
    </Shell>
  );
}

type TreeDatum = { name?: string; height?: number; children?: TreeDatum[] };

// A real agglomerative merge sequence. d3.cluster spaces internal nodes by
// depth, not by distance, which put three merges at nearly the same x and drew a
// degenerate near-vertical bracket that read as a rendering bug. Each merge now
// carries its own well-separated height and the x axis is that distance.
const defaultCluster: TreeDatum = {
  height: 9.4,
  children: [
    {
      height: 5.6,
      children: [
        { height: 2.1, children: [{ name: "Retail" }, { name: "Outlet" }] },
        {
          height: 3.4,
          children: [
            { name: "Online" },
            { height: 1.2, children: [{ name: "Mobile" }, { name: "Kiosk" }] },
          ]},
      ]},
    { height: 4.2, children: [{ name: "Wholesale" }, { name: "Partner" }] },
  ]};

// Where the tree is cut into flat clusters. The dashed rule and the leaf colours
// read off the same number, so the grouping the hierarchy implies is visible
// rather than something you have to trace by eye.
const CLUSTER_CUT = 4.8;

type PlacedNode = {
  x: number;
  y: number;
  name?: string;
  cluster: number;
  children: PlacedNode[];
};

function countLeaves(node: TreeDatum): number {
  if (!node.children?.length) return 1;
  return node.children.reduce((sum, child) => sum + countLeaves(child), 0);
}

function maxMergeHeight(node: TreeDatum): number {
  return Math.max(node.height ?? 0, ...(node.children ?? []).map(maxMergeHeight));
}

// Leaves take evenly spaced rows; every merge sits at its own distance and at
// the midpoint of the rows it spans, which is what gives the bracket real,
// separated rungs.
function placeCluster(
  root: TreeDatum,
  toX: (height: number) => number,
  rowY: (index: number) => number,
) {
  let row = 0;
  let cluster = -1;
  const walk = (node: TreeDatum, group: number): PlacedNode => {
    const height = node.height ?? 0;
    // The first node at or below the cut opens a flat cluster; its whole subtree
    // inherits that colour.
    const own = group < 0 && height <= CLUSTER_CUT ? (cluster += 1) : group;
    if (!node.children?.length) {
      const y = rowY(row);
      row += 1;
      return { x: toX(0), y, name: node.name, cluster: own, children: [] };
    }
    const children = node.children.map((child) => walk(child, own));
    const ys = children.map((c) => c.y);
    return {
      x: toX(height),
      y: (Math.min(...ys) + Math.max(...ys)) / 2,
      cluster: own,
      children};
  };
  return walk(root, -1);
}

function dendrogramLinks(node: PlacedNode, key = "n") {
  const out: { key: string; d: string; cluster: number }[] = [];
  if (node.children.length === 0) return out;
  const ys = node.children.map((c) => c.y);
  out.push({
    key: `${key}-v`,
    cluster: node.cluster,
    d: `M${node.x},${Math.min(...ys)}V${Math.max(...ys)}`});
  node.children.forEach((child, i) => {
    out.push({ key: `${key}-h${i}`, cluster: child.cluster, d: `M${node.x},${child.y}H${child.x}` });
    out.push(...dendrogramLinks(child, `${key}-${i}`));
  });
  return out;
}

export function Dendrogram({ tree = defaultCluster }: { tree?: TreeDatum }) {
  const width = 400;
  const height = 250;
  // The left gutter holds the leaf labels, which were previously jammed against
  // the right edge with nothing to anchor them.
  const margin = { top: 12, right: 18, bottom: 44, left: 66 };
  const w = width - margin.left - margin.right;
  const h = height - margin.top - margin.bottom;
  const leaves = countLeaves(tree);
  const dist = d3
    .scaleLinear()
    .domain([0, maxMergeHeight(tree)])
    .nice(5)
    .range([0, w]);
  const [, distMax] = dist.domain() as [number, number];
  const ticks = d3.ticks(0, distMax, 5);
  const step = h / leaves;
  const root = placeCluster(tree, (v) => dist(v), (i) => (i + 0.5) * step);
  const links = dendrogramLinks(root);
  const leafNodes: PlacedNode[] = [];
  const collectLeaves = (node: PlacedNode) => {
    if (node.children.length === 0) leafNodes.push(node);
    else node.children.forEach(collectLeaves);
  };
  collectLeaves(root);

  return (
    <Shell>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full" preserveAspectRatio="xMidYMid meet">
        <g transform={`translate(${margin.left},${margin.top})`}>
          {ticks.map((t) => (
            <line
              key={t}
              x1={dist(t)}
              x2={dist(t)}
              y1={0}
              y2={h}
              stroke="var(--chart-grid)"
              strokeWidth={1}
            />
          ))}
          <line
            x1={dist(CLUSTER_CUT)}
            x2={dist(CLUSTER_CUT)}
            y1={0}
            y2={h}
            stroke="var(--border-strong)"
            strokeWidth={1}
            strokeDasharray="4 3"
          />
          {links.map((l) => (
            <path
              key={l.key}
              d={l.d}
              fill="none"
              // Merges above the cut are structure, not a cluster. They separate
              // by weight rather than hue: --chart-axis is almost the same value
              // as --chart-1 in the dark theme, which flattened the first
              // cluster into the scaffolding.
              stroke={l.cluster < 0 ? "var(--border-strong)" : colorAt(l.cluster)}
              strokeWidth={l.cluster < 0 ? 1.25 : 1.75}
              strokeLinecap="round"
            />
          ))}
          {leafNodes.map((leaf) => (
            <g key={leaf.name} transform={`translate(${leaf.x},${leaf.y})`}>
              <circle r={3.25} fill={colorAt(leaf.cluster)} />
              <text x={-8} y={3.5} textAnchor="end" fontSize={10} fill="var(--foreground)">
                {leaf.name}
              </text>
            </g>
          ))}
          <line x1={0} x2={w} y1={h} y2={h} stroke="var(--border-strong)" strokeWidth={1} />
          {ticks.map((t) => (
            <text
              key={t}
              x={dist(t)}
              y={h + 15}
              textAnchor="middle"
              fontSize={10}
              fill="var(--chart-axis)"
            >
              {formatAxisNumber(t)}
            </text>
          ))}
          <text x={w / 2} y={h + 31} textAnchor="middle" fontSize={10} fill="var(--foreground)">
            Merge distance
          </text>
        </g>
      </svg>
    </Shell>
  );
}

export function SurvivalCurve({ data = defaultSurvival }: { data?: typeof defaultSurvival }) {
  const anim = useChartAnimation();

  return (
    <Shell>
      <ChartResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={PLOT_MARGIN}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="t" tickLine={false} axisLine={false} />
          <YAxis domain={[0, 1]} tickLine={false} axisLine={false} width={36} />
          <Tooltip content={<ChartTooltip />} />
          <Line
            type="stepAfter"
            dataKey="survival"
            stroke={CHART_COLORS[0]}
            strokeWidth={SERIES_STROKE_WIDTH}
            strokeLinecap="round"
            dot={false}
            activeDot={ACTIVE_DOT}
            {...anim}
          />
        </LineChart>
      </ChartResponsiveContainer>
    </Shell>
  );
}

export function ROCCurve({ data = defaultRoc }: { data?: typeof defaultRoc }) {
  const anim = useChartAnimation();

  return (
    <Shell>
      <ChartResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={PLOT_MARGIN}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="fpr" tickLine={false} axisLine={false} />
          <YAxis domain={[0, 1]} tickLine={false} axisLine={false} width={36} />
          <Tooltip content={<ChartTooltip />} />
          <Line
            type="monotone"
            dataKey="tpr"
            stroke={CHART_COLORS[1]}
            strokeWidth={SERIES_STROKE_WIDTH}
            strokeLinecap="round"
            dot={false}
            activeDot={ACTIVE_DOT}
            {...anim}
          />
        </LineChart>
      </ChartResponsiveContainer>
    </Shell>
  );
}

export function PrecisionRecallCurve({ data = defaultPr }: { data?: typeof defaultPr }) {
  const anim = useChartAnimation();

  return (
    <Shell>
      <ChartResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={PLOT_MARGIN}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="recall" tickLine={false} axisLine={false} />
          <YAxis domain={[0, 1]} tickLine={false} axisLine={false} width={36} />
          <Tooltip content={<ChartTooltip />} />
          <Line
            type="monotone"
            dataKey="precision"
            stroke={CHART_COLORS[3]}
            strokeWidth={SERIES_STROKE_WIDTH}
            strokeLinecap="round"
            dot={false}
            activeDot={ACTIVE_DOT}
            {...anim}
          />
        </LineChart>
      </ChartResponsiveContainer>
    </Shell>
  );
}

export function QQPlot({ data = defaultValues }: { data?: number[] }) {
  const anim = useChartAnimation();
  const sorted = data.filter(Number.isFinite).sort(d3.ascending);
  const n = sorted.length;
  const points = sorted.map((v, i) => {
    const q = (i + 0.5) / (n || 1);
    return { theoretical: standardNormalQuantile(q), sample: v };
  });

  if (n === 0) {
    return (
      <Shell>
        <ChartEmpty />
      </Shell>
    );
  }

  return (
    <Shell>
      <ChartResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={PLOT_MARGIN}>
          <CartesianGrid />
          <XAxis type="number" dataKey="theoretical" tickLine={false} axisLine={false} />
          <YAxis type="number" dataKey="sample" tickLine={false} axisLine={false} width={36} />
          <Tooltip content={<ChartTooltip />} />
          <Scatter data={points} fill={CHART_COLORS[4]} {...anim} />
        </ScatterChart>
      </ChartResponsiveContainer>
    </Shell>
  );
}

export function ResidualPlot({ data = defaultResiduals }: { data?: typeof defaultResiduals }) {
  const anim = useChartAnimation();

  return (
    <Shell>
      <ChartResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={PLOT_MARGIN}>
          <CartesianGrid />
          <XAxis type="number" dataKey="x" tickLine={false} axisLine={false} />
          <YAxis type="number" dataKey="residual" tickLine={false} axisLine={false} width={36} />
          <ReferenceLine y={0} stroke="var(--muted-foreground)" strokeDasharray="4 4" />
          <Tooltip content={<ChartTooltip />} />
          <Scatter data={data} fill={CHART_COLORS[5]} {...anim} />
        </ScatterChart>
      </ChartResponsiveContainer>
    </Shell>
  );
}

export function RegressionPlot({ data = defaultRegression }: { data?: typeof defaultRegression }) {
  const width = 400;
  const height = 220;
  const pad = 32;
  const points = data.filter(
    (point) => Number.isFinite(point.x) && Number.isFinite(point.y),
  );

  if (points.length === 0) {
    return (
      <Shell>
        <ChartEmpty />
      </Shell>
    );
  }

  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);
  const xExtent = d3.extent(xs) as [number, number];
  const yExtent = d3.extent(ys) as [number, number];
  const xDomain: [number, number] = xExtent[0] === xExtent[1]
    ? [xExtent[0] - 1, xExtent[1] + 1]
    : xExtent;
  const yDomain: [number, number] = yExtent[0] === yExtent[1]
    ? [yExtent[0] - 1, yExtent[1] + 1]
    : yExtent;
  const x = d3.scaleLinear().domain(xDomain).nice().range([pad, width - pad]);
  const y = d3.scaleLinear().domain(yDomain).nice().range([height - pad, pad]);
  const regression = linearRegression(points);
  const lineStart = regression
    ? { x: x.domain()[0], y: regression.slope * x.domain()[0] + regression.intercept }
    : null;
  const lineEnd = regression
    ? { x: x.domain()[1], y: regression.slope * x.domain()[1] + regression.intercept }
    : null;

  return (
    <Shell>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-full w-full"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label={`Regression plot${regression ? `, R squared ${regression.rSquared.toFixed(2)}` : ""}`}
      >
        <title>Linear regression</title>
        <desc>{regression ? `Slope ${regression.slope.toFixed(3)}, intercept ${regression.intercept.toFixed(3)}, R squared ${regression.rSquared.toFixed(3)}.` : "A regression line cannot be calculated for these points."}</desc>
        {x.ticks(5).map((tick) => (
          <g key={`x-${tick}`}>
            <line x1={x(tick)} x2={x(tick)} y1={pad} y2={height - pad} stroke="var(--chart-grid)" />
            <text x={x(tick)} y={height - 10} textAnchor="middle" fill="var(--muted-foreground)" fontSize="11">{formatAxisNumber(tick)}</text>
          </g>
        ))}
        {y.ticks(4).map((tick) => (
          <g key={`y-${tick}`}>
            <line x1={pad} x2={width - pad} y1={y(tick)} y2={y(tick)} stroke="var(--chart-grid)" />
            <text x={pad - 6} y={y(tick) + 4} textAnchor="end" fill="var(--muted-foreground)" fontSize="11">{formatAxisNumber(tick)}</text>
          </g>
        ))}
        {points.map((point, index) => (
          <circle
            key={`${point.x}-${point.y}-${index}`}
            cx={x(point.x)}
            cy={y(point.y)}
            r={4}
            fill={CHART_COLORS[0]}
            fillOpacity={0.75}
            tabIndex={0}
            role="img"
            aria-label={`x ${formatAxisNumber(point.x)}, y ${formatAxisNumber(point.y)}`}
          />
        ))}
        {lineStart && lineEnd ? (
          <line
            x1={x(lineStart.x)}
            y1={y(lineStart.y)}
            x2={x(lineEnd.x)}
            y2={y(lineEnd.y)}
            stroke={CHART_COLORS[1]}
            strokeWidth={2}
          />
        ) : null}
      </svg>
    </Shell>
  );
}

export type ContourGrid = {
  columns: number;
  rows: number;
  values: readonly number[];
};

export type ContourPlotProps = {
  grid?: ContourGrid;
  thresholds?: number | readonly number[];
  ariaLabel?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
};

const defaultContourGrid: ContourGrid = (() => {
  const columns = 48;
  const rows = 30;
  const values = Array.from({ length: columns * rows }, (_, index) => {
    const x = index % columns;
    const y = Math.floor(index / columns);
    const left = Math.exp(-(((x - 16) ** 2) / 90 + ((y - 15) ** 2) / 54));
    const right = 0.74 * Math.exp(-(((x - 34) ** 2) / 66 + ((y - 10) ** 2) / 42));
    return left + right;
  });
  return { columns, rows, values };
})();

export function ContourPlot({
  grid = defaultContourGrid,
  thresholds = 7,
  ariaLabel = "Contour plot",
  xAxisLabel = "X",
  yAxisLabel = "Y"}: ContourPlotProps) {
  const columns = Math.trunc(grid.columns);
  const rows = Math.trunc(grid.rows);
  const values = [...grid.values];
  if (columns < 2 || rows < 2 || values.length !== columns * rows || values.some((value) => !Number.isFinite(value))) {
    return <ChartEmpty label="Contour grid dimensions and finite values must agree" />;
  }
  const requestedThresholds = typeof thresholds === "number"
    ? Math.max(1, Math.min(24, Math.trunc(thresholds)))
    : [...thresholds].filter(Number.isFinite).sort(d3.ascending);
  const contours = d3.contours().size([columns, rows]).thresholds(requestedThresholds)(values);
  if (!contours.length) return <ChartEmpty label="No contour levels could be derived" />;
  const width = 420;
  const height = 250;
  const pad = { left: 42, right: 14, top: 12, bottom: 34 };
  const plotWidth = width - pad.left - pad.right;
  const plotHeight = height - pad.top - pad.bottom;
  const scaleX = plotWidth / columns;
  const scaleY = plotHeight / rows;

  return (
    <Shell>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full" preserveAspectRatio="xMidYMid meet" role="img" aria-label={ariaLabel}>
        <title>{ariaLabel}</title><desc>{contours.length} ordered levels derived from a {columns} by {rows} caller-supplied grid.</desc>
        <g transform={`translate(${pad.left},${pad.top}) scale(${scaleX},${scaleY})`}>
          {contours.map((contour, index) => <path key={`${contour.value}-${index}`} d={d3.geoPath().projection(null)(contour) ?? ""} fill={colorAt(index)} fillOpacity={0.18 + (index / Math.max(contours.length - 1, 1)) * 0.52} stroke={colorAt(index)} strokeWidth={0.7 / Math.max(scaleX, scaleY)} />)}
        </g>
        <line x1={pad.left} x2={width - pad.right} y1={height - pad.bottom} y2={height - pad.bottom} stroke="var(--chart-axis)" />
        <line x1={pad.left} x2={pad.left} y1={pad.top} y2={height - pad.bottom} stroke="var(--chart-axis)" />
        <text x={(pad.left + width - pad.right) / 2} y={height - 10} textAnchor="middle" fontSize={11} fill="var(--foreground)">{xAxisLabel}</text>
        <text x={12} y={(pad.top + height - pad.bottom) / 2} textAnchor="middle" transform={`rotate(-90 12 ${(pad.top + height - pad.bottom) / 2})`} fontSize={11} fill="var(--foreground)">{yAxisLabel}</text>
        {contours.map((contour, index) => <g key={`legend-${contour.value}-${index}`} transform={`translate(${width - 80},${16 + index * 14})`}><rect width="9" height="9" fill={colorAt(index)} fillOpacity={0.55} /><text x="13" y="8" fontSize="9" fill="var(--muted-foreground)">{formatAxisNumber(contour.value)}</text></g>)}
      </svg>
      <ScreenReaderTable><caption>{ariaLabel} levels</caption><thead><tr><th scope="col">Level</th><th scope="col">Polygons</th></tr></thead><tbody>{contours.map((contour, index) => <tr key={`${contour.value}-${index}`}><th scope="row">{formatAxisNumber(contour.value)}</th><td>{contour.coordinates.length}</td></tr>)}</tbody></ScreenReaderTable>
    </Shell>
  );
}

export type ConfidenceBandDatum = {
  category: string;
  value: number;
  lower: number;
  upper: number;
};

export type ConfidenceBandPlotProps = {
  data?: readonly ConfidenceBandDatum[];
  ariaLabel?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  valueFormatter?: (value: number) => string;
};

const defaultConfidenceBand: ConfidenceBandDatum[] = [
  { category: "Jan", value: 42, lower: 36, upper: 48 },
  { category: "Feb", value: 48, lower: 42, upper: 54 },
  { category: "Mar", value: 51, lower: 45, upper: 57 },
  { category: "Apr", value: 46, lower: 40, upper: 52 },
  { category: "May", value: 56, lower: 50, upper: 62 },
  { category: "Jun", value: 61, lower: 55, upper: 67 },
];

export function ConfidenceBandPlot({
  data = defaultConfidenceBand,
  ariaLabel = "Confidence band plot",
  xAxisLabel,
  yAxisLabel,
  valueFormatter = (value) => formatAxisNumber(value)}: ConfidenceBandPlotProps) {
  const anim = useChartAnimation();
  const valid = data.flatMap((datum) => Number.isFinite(datum.value) && Number.isFinite(datum.lower) && Number.isFinite(datum.upper) && datum.category.trim() && datum.lower <= datum.upper
    ? [{ ...datum, range: [datum.lower, datum.upper] as [number, number] }]
    : []);
  if (!valid.length) return <ChartEmpty label="No valid confidence intervals" />;
  return (
    <Shell>
      <ChartResponsiveContainer width="100%" height="100%">
        <AreaChart data={valid} margin={{ ...PLOT_MARGIN, bottom: xAxisLabel ? 18 : PLOT_MARGIN.bottom }} accessibilityLayer>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="category" tickLine={false} axisLine={false} label={xAxisLabel ? { value: xAxisLabel, position: "insideBottom", offset: -12 } : undefined} />
          <YAxis tickLine={false} axisLine={false} width={44} tickFormatter={valueFormatter} label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: "insideLeft" } : undefined} />
          <Tooltip content={<ChartTooltip />} />
          <Area type="monotone" dataKey="range" stroke={CHART_COLORS[1]} strokeOpacity={0.45} fill={CHART_COLORS[1]} fillOpacity={0.16} connectNulls={false} {...anim} />
          <Line
            type="monotone"
            dataKey="value"
            stroke={CHART_COLORS[1]}
            strokeWidth={SERIES_STROKE_WIDTH}
            strokeLinecap="round"
            dot={false}
            activeDot={ACTIVE_DOT}
            {...anim}
          />
        </AreaChart>
      </ChartResponsiveContainer>
      <ScreenReaderTable><caption>{ariaLabel} data</caption><thead><tr><th scope="col">Category</th><th scope="col">Value</th><th scope="col">Lower</th><th scope="col">Upper</th></tr></thead><tbody>{valid.map((datum) => <tr key={datum.category}><th scope="row">{datum.category}</th><td>{valueFormatter(datum.value)}</td><td>{valueFormatter(datum.lower)}</td><td>{valueFormatter(datum.upper)}</td></tr>)}</tbody></ScreenReaderTable>
    </Shell>
  );
}

export function NetworkPlot({ network = defaultNetwork }: { network?: typeof defaultNetwork }) {
  const width = 420;
  const height = 280;
  const chartFont =
    'var(--font-manrope), "Manrope", ui-sans-serif, system-ui, sans-serif';

  if (network.nodes.length === 0) {
    return (
      <Shell>
        <ChartEmpty />
      </Shell>
    );
  }

  const degree = new Map(network.nodes.map((n) => [n.id, 0]));
  network.links.forEach((l) => {
    degree.set(l.source, (degree.get(l.source) ?? 0) + 1);
    degree.set(l.target, (degree.get(l.target) ?? 0) + 1);
  });
  const degrees = [...degree.values()];
  const radius = d3
    .scaleSqrt()
    .domain([d3.min(degrees) ?? 0, d3.max(degrees) ?? 1])
    .range([10, 15]);
  const maxR = 15;
  // Room for outward labels (name + a few px gap) around the graph hull.
  const labelPad = 22;
  const inset = {
    top: maxR + labelPad,
    right: maxR + labelPad + 8,
    bottom: maxR + labelPad,
    left: maxR + labelPad + 8};
  const px = (x: number) =>
    roundSvgNumber(inset.left + (x / 100) * (width - inset.left - inset.right));
  const py = (y: number) =>
    roundSvgNumber(inset.top + (y / 100) * (height - inset.top - inset.bottom));
  const nodeMap = new Map(network.nodes.map((n) => [n.id, n]));

  // Layout centroid — labels push outward from here so they never sit inside
  // the hull (the old fixed y = r+12 put top-node names inside the polygon).
  const cx =
    network.nodes.reduce((sum, n) => sum + n.x, 0) / network.nodes.length;
  const cy =
    network.nodes.reduce((sum, n) => sum + n.y, 0) / network.nodes.length;

  return (
    <Shell>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-full w-full"
        preserveAspectRatio="xMidYMid meet"
        style={{ fontFamily: chartFont }}
        data-chart-svg
      >
        {network.links.map((l) => {
          const s = nodeMap.get(l.source);
          const t = nodeMap.get(l.target);
          if (!s || !t) return null;
          return (
            <line
              key={`${l.source}-${l.target}`}
              x1={px(s.x)}
              y1={py(s.y)}
              x2={px(t.x)}
              y2={py(t.y)}
              stroke="var(--chart-axis)"
              strokeOpacity={0.4}
              strokeWidth={1.5}
            />
          );
        })}
        {network.nodes.map((n, i) => {
          const r = radius(degree.get(n.id) ?? 0);
          const dx = n.x - cx;
          const dy = n.y - cy;
          // Hub / center nodes: park the label below the circle.
          const isHub = Math.hypot(dx, dy) < 8;
          const angle = isHub ? Math.PI / 2 : Math.atan2(dy, dx);
          const cos = Math.cos(angle);
          const sin = Math.sin(angle);
          const labelDist = r + 14;
          const lx = isHub ? 0 : roundSvgNumber(cos * labelDist);
          const ly = isHub
            ? r + 14
            : roundSvgNumber(sin * labelDist);
          const textAnchor =
            isHub || Math.abs(cos) < 0.35
              ? "middle"
              : cos > 0
                ? "start"
                : "end";
          const dominantBaseline =
            isHub || Math.abs(sin) < 0.35
              ? "central"
              : sin > 0
                ? "hanging"
                : "auto";

          return (
            <g key={n.id} transform={`translate(${px(n.x)},${py(n.y)})`}>
              <circle
                r={r}
                fill={colorAt(i)}
                stroke="var(--card)"
                strokeWidth={1.5}
              />
              <text
                x={lx}
                y={ly}
                textAnchor={textAnchor}
                dominantBaseline={dominantBaseline}
                fontSize={12}
                fontWeight={500}
                letterSpacing="-0.01em"
                fill="var(--secondary-foreground)"
              >
                {n.id}
                <title>{n.id}</title>
              </text>
            </g>
          );
        })}
      </svg>
    </Shell>
  );
}

export function ErrorBarPlot({ data = defaultErrorBars }: { data?: typeof defaultErrorBars }) {
  if (data.length === 0) {
    return (
      <Shell>
        <ChartEmpty />
      </Shell>
    );
  }

  const lo = d3.min(data, (d) => d.value - d.error) ?? 0;
  const hi = d3.max(data, (d) => d.value + d.error) ?? 100;
  const { scale: y, ticks } = valueScale(lo, hi);
  const x = d3
    .scaleBand<string>()
    .domain(data.map((d) => d.name))
    .range([0, CAT_W])
    .padding(0.3);
  // Caps scale with the band instead of being a fixed 12u, so they stay in
  // proportion whatever number of categories comes in.
  const cap = Math.min(x.bandwidth() * 0.36, 22);

  return (
    <Shell>
      <svg
        viewBox={`0 0 ${CAT_FRAME.width} ${CAT_FRAME.height}`}
        className="h-full w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <g transform={`translate(${CAT_MARGIN.left},${CAT_MARGIN.top})`}>
          <CatScaffold y={y} ticks={ticks} x={x} />
          {data.map((d, i) => {
            const cx = (x(d.name) ?? 0) + x.bandwidth() / 2;
            const top = y(d.value + d.error);
            const bottom = y(d.value - d.error);
            return (
              <g key={d.name}>
                <line x1={cx} x2={cx} y1={top} y2={bottom} stroke={colorAt(i)} strokeWidth={1.75} />
                <line x1={cx - cap / 2} x2={cx + cap / 2} y1={top} y2={top} stroke={colorAt(i)} strokeWidth={1.75} />
                <line
                  x1={cx - cap / 2}
                  x2={cx + cap / 2}
                  y1={bottom}
                  y2={bottom}
                  stroke={colorAt(i)}
                  strokeWidth={1.75}
                />
                {/* A card-coloured ring lifts the point estimate off the bar it
                    sits on, in either theme. */}
                <circle
                  cx={cx}
                  cy={y(d.value)}
                  r={4.5}
                  fill={colorAt(i)}
                  stroke="var(--card)"
                  strokeWidth={1.5}
                />
              </g>
            );
          })}
        </g>
      </svg>
    </Shell>
  );
}

export function PairPlot({ data = scatterPoints.slice(0, 16) }: { data?: typeof scatterPoints }) {
  return <ScatterplotMatrix variables={["x", "y", "z"]} data={data} />;
}

export function ConfusionMatrix({ cells = defaultConfusion }: { cells?: typeof defaultConfusion }) {
  const labels = [
    ...new Set(cells.flatMap((cell) => [cell.actual, cell.predicted])),
  ];
  const heat = labels.flatMap((actual) =>
    labels.map((predicted) => ({
      x: predicted,
      y: actual,
      value: cells.find((c) => c.actual === actual && c.predicted === predicted)?.count ?? 0})),
  );
  return (
    <Shell>
      <HeatmapGrid cells={heat} xLabels={labels} yLabels={labels} />
    </Shell>
  );
}

export type RiskMatrixDatum = {
  id: string;
  label: string;
  likelihood: number;
  impact: number;
};

export type RiskMatrixProps = {
  data?: RiskMatrixDatum[];
  likelihoodLabel?: string;
  impactLabel?: string;
};

const defaultRisks: RiskMatrixDatum[] = [
  { id: "supply", label: "Supply interruption", likelihood: 4, impact: 5 },
  { id: "quality", label: "Quality escape", likelihood: 3, impact: 4 },
  { id: "schedule", label: "Schedule delay", likelihood: 4, impact: 3 },
  { id: "minor", label: "Minor rework", likelihood: 2, impact: 2 },
];

/** Conventional likelihood-by-impact risk matrix, distinct from classification confusion matrices. */
export function RiskMatrix({
  data = defaultRisks,
  likelihoodLabel = "Likelihood",
  impactLabel = "Impact"}: RiskMatrixProps) {
  const width = 400;
  const height = 250;
  const margin = { left: 54, right: 18, top: 12, bottom: 42 };
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;
  const cellWidth = plotWidth / 5;
  const cellHeight = plotHeight / 5;
  const uid = React.useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const valid = data.filter(
    (risk) =>
      risk.id &&
      risk.label &&
      Number.isFinite(risk.likelihood) &&
      Number.isFinite(risk.impact) &&
      risk.likelihood >= 1 &&
      risk.likelihood <= 5 &&
      risk.impact >= 1 &&
      risk.impact <= 5,
  );

  if (!valid.length) {
    return (
      <Shell><ChartEmpty /></Shell>
    );
  }

  const cellColor = (score: number) =>
    score >= 16
      ? SEMANTIC.negative
      : score >= 9
        ? SEMANTIC.warning
        : SEMANTIC.positive;

  return (
    <Shell>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-full w-full"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-labelledby={`risk-title-${uid} risk-desc-${uid}`}
      >
        <title id={`risk-title-${uid}`}>Risk matrix</title>
        <desc id={`risk-desc-${uid}`}>
          {valid.length} risks plotted by likelihood from one to five and impact from one to five.
        </desc>
        <g transform={`translate(${margin.left},${margin.top})`}>
          {Array.from({ length: 5 }, (_, impactIndex) =>
            Array.from({ length: 5 }, (_, likelihoodIndex) => {
              const likelihood = likelihoodIndex + 1;
              const impact = 5 - impactIndex;
              return (
                <rect
                  key={`${likelihood}-${impact}`}
                  x={likelihoodIndex * cellWidth}
                  y={impactIndex * cellHeight}
                  width={cellWidth}
                  height={cellHeight}
                  fill={cellColor(likelihood * impact)}
                  fillOpacity={0.15 + Math.min(0.28, likelihood * impact * 0.012)}
                  stroke="var(--card)"
                  strokeWidth={2}
                />
              );
            }),
          )}
          {Array.from({ length: 5 }, (_, index) => (
            <React.Fragment key={index}>
              <text x={(index + 0.5) * cellWidth} y={plotHeight + 18} textAnchor="middle" fill="var(--muted-foreground)" fontSize={11}>
                {index + 1}
              </text>
              <text x={-12} y={(4 - index + 0.5) * cellHeight} textAnchor="end" dominantBaseline="central" fill="var(--muted-foreground)" fontSize={11}>
                {index + 1}
              </text>
            </React.Fragment>
          ))}
          {valid.map((risk, index) => {
            const duplicatesBefore = valid.slice(0, index).filter(
              (candidate) => candidate.likelihood === risk.likelihood && candidate.impact === risk.impact,
            ).length;
            const jitter = (duplicatesBefore % 3 - 1) * 8;
            const x = (risk.likelihood - 0.5) * cellWidth + jitter;
            const y = (5 - risk.impact + 0.5) * cellHeight - jitter * 0.4;
            return (
              <g
                key={risk.id}
                transform={`translate(${x},${y})`}
                tabIndex={0}
                role="graphics-symbol"
                aria-label={`${risk.label}: likelihood ${risk.likelihood}, impact ${risk.impact}, score ${risk.likelihood * risk.impact}`}
                className="outline-none"
              >
                <circle r={8} fill={cellColor(risk.likelihood * risk.impact)} stroke="var(--card)" strokeWidth={2} />
                <text y={-12} textAnchor="middle" fill="var(--foreground)" fontSize={10} fontWeight={600}>
                  {risk.label.length > 14 ? `${risk.label.slice(0, 13)}…` : risk.label}
                </text>
                <title>{risk.label}</title>
              </g>
            );
          })}
          <text x={plotWidth / 2} y={plotHeight + 36} textAnchor="middle" fill="var(--foreground)" fontSize={12} fontWeight={600}>
            {likelihoodLabel}
          </text>
          <text transform={`translate(${-42},${plotHeight / 2}) rotate(-90)`} textAnchor="middle" fill="var(--foreground)" fontSize={12} fontWeight={600}>
            {impactLabel}
          </text>
        </g>
      </svg>
    </Shell>
  );
}

export function FeatureImportanceChart({ data = defaultFeatures }: { data?: typeof defaultFeatures }) {
  const anim = useChartAnimation();
  const hover = useSeriesHover();
  const uid = React.useId().replace(/[^a-zA-Z0-9]/g, "");

  return (
    <Shell>
      <ChartResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={PLOT_MARGIN}>
          <defs>
            {/* Depth without color math: the fill eases to 82% opacity toward
                the bar tip, which reads as a soft light on both themes. */}
            <linearGradient id={`feat-${uid}-0`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={CHART_COLORS[6]} stopOpacity={1} />
              <stop offset="100%" stopColor={CHART_COLORS[6]} stopOpacity={0.82} />
            </linearGradient>
          </defs>
          <CartesianGrid horizontal={false} />
          <XAxis type="number" tickLine={false} axisLine={false} />
          <YAxis type="category" dataKey="feature" width={72} tickLine={false} axisLine={false} />
          <Tooltip content={<ChartTooltip />} />
          <Bar
            dataKey="importance"
            fill={`url(#feat-${uid}-0)`}
            radius={[0, 4, 4, 0]}
            maxBarSize={18}
            {...anim}
          >
            {data.map((d) => (
              <Cell
                key={d.feature}
                fillOpacity={hover.opacityFor(d.feature)}
                {...hover.bind(d.feature)}
              />
            ))}
          </Bar>
        </BarChart>
      </ChartResponsiveContainer>
    </Shell>
  );
}

export function PCAPlot({ data = defaultPca }: { data?: typeof defaultPca }) {
  const cats = [...new Set(data.map((d) => d.cluster))];
  const anim = useChartAnimation();
  const hover = useSeriesHover();
  return (
    <Shell>
      <ChartResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={PLOT_MARGIN}>
          <CartesianGrid />
          <XAxis type="number" dataKey="pc1" tickLine={false} axisLine={false} />
          <YAxis type="number" dataKey="pc2" tickLine={false} axisLine={false} width={36} />
          <Tooltip content={<ChartTooltip />} />
          <Scatter data={data} fill={CHART_COLORS[0]} {...anim}>
            {data.map((d, i) => {
              const idx = cats.indexOf(d.cluster);
              return (
                <Cell
                  key={i}
                  fill={colorAt(idx)}
                  fillOpacity={hover.opacityFor(d.cluster)}
                  {...hover.bind(d.cluster)}
                />
              );
            })}
          </Scatter>
        </ScatterChart>
      </ChartResponsiveContainer>
    </Shell>
  );
}

export function ClusterPlot({ data = defaultPca }: { data?: typeof defaultPca }) {
  return <PCAPlot data={data} />;
}

export function BeeswarmPlot({ values = defaultValues.slice(0, 40) }: { values?: number[] }) {
  const width = 400;
  const height = 220;
  const pad = 40;
  const w = width - pad * 2;
  const radius = 5;
  const finiteValues = values.filter(Number.isFinite);

  if (finiteValues.length === 0) {
    return (
      <Shell>
        <ChartEmpty />
      </Shell>
    );
  }

  const extent = d3.extent(finiteValues) as [number, number];
  const domain: [number, number] = extent[0] === extent[1]
    ? [extent[0] - 1, extent[1] + 1]
    : extent;
  const y = d3.scaleLinear().domain(domain).nice().range([height - 24, 24]);
  const sorted = [...finiteValues].sort(d3.ascending);
  const placed: { x: number; cy: number; value: number }[] = [];
  const center = pad + w / 2;

  sorted.forEach((value) => {
    const cy = y(value);
    let selected = center;
    const step = radius * 1.1;
    for (let index = 0; index < Math.ceil(w / step); index += 1) {
      const offset = Math.ceil(index / 2) * step * (index % 2 === 0 ? -1 : 1);
      const candidate = center + offset;
      if (candidate < pad + radius || candidate > width - pad - radius) continue;
      const collides = placed.some(
        (point) => Math.hypot(point.x - candidate, point.cy - cy) < radius * 2.2,
      );
      if (!collides) {
        selected = candidate;
        break;
      }
    }
    placed.push({ x: selected, cy, value });
  });

  return (
    <Shell>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full" preserveAspectRatio="xMidYMid meet" role="img" aria-label={`Beeswarm plot of ${placed.length} values`}>
        <title>Beeswarm distribution</title>
        <line x1={center} x2={center} y1="20" y2={height - 20} stroke="var(--chart-grid)" />
        {placed.map((p, i) => (
          <circle key={`${p.value}-${i}`} cx={p.x} cy={p.cy} r={radius} fill={CHART_COLORS[0]} fillOpacity={0.75} tabIndex={0} role="img" aria-label={formatAxisNumber(p.value)} />
        ))}
      </svg>
    </Shell>
  );
}

export function StripPlot({ values = defaultValues.slice(0, 30) }: { values?: number[] }) {
  const width = 400;
  const height = 120;
  const pad = 32;
  const x = d3.scaleLinear().domain(d3.extent(values) as [number, number]).range([pad, width - pad]);
  const y = height / 2;

  if (values.length === 0) {
    return (
      <Shell>
        <ChartEmpty />
      </Shell>
    );
  }

  return (
    <Shell>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full" preserveAspectRatio="xMidYMid meet">
        <line x1={pad} x2={width - pad} y1={y} y2={y} stroke="var(--chart-grid)" strokeWidth={2} />
        {values.map((v, i) => (
          <circle key={i} cx={x(v)} cy={y + ((i % 3) - 1) * 3} r={4} fill={colorAt(i % 5)} />
        ))}
      </svg>
    </Shell>
  );
}

export function JitterPlot({ data = scatterPoints.slice(0, 30) }: { data?: typeof scatterPoints }) {
  const anim = useChartAnimation();
  const jittered = data.map((d, i) => ({
    ...d,
    x: d.x + ((i % 5) - 2) * 2,
    y: d.y + ((i % 4) - 1.5) * 2}));
  return (
    <Shell>
      <ChartResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={PLOT_MARGIN}>
          <CartesianGrid />
          <XAxis type="number" dataKey="x" tickLine={false} axisLine={false} />
          <YAxis type="number" dataKey="y" tickLine={false} axisLine={false} width={36} />
          <Tooltip content={<ChartTooltip />} />
          <Scatter data={jittered} fill={CHART_COLORS[2]} fillOpacity={0.75} {...anim} />
        </ScatterChart>
      </ChartResponsiveContainer>
    </Shell>
  );
}

export function RaincloudPlot({ values = raincloudValues }: { values?: number[] }) {
  if (values.length < 2) {
    return (
      <Shell>
        <ChartEmpty />
      </Shell>
    );
  }

  const box = summarizeGroup("A", values);
  // Match the categorical plot frame so the card fills the same way box/violin
  // do — the old 400×160 viewBox letterboxed inside a ~1.6 slot and left a dead
  // band on the right.
  const width = CAT_FRAME.width;
  const height = CAT_FRAME.height;
  const padL = 36;
  const padR = 20;
  const padT = 14;
  const padB = 28;
  const x = d3
    .scaleLinear()
    .domain([box.min, box.max])
    .nice(6)
    .range([padL, width - padR]);
  const [d0, d1] = x.domain() as [number, number];
  const ticks = d3.ticks(d0, d1, 6);

  const kde = kdeLine(values, 56);
  const maxDensity = d3.max(kde, (p) => p.density) ?? 1;
  // Vertical bands: density cloud → box → rain. Fixed lanes keep the three
  // layers from colliding when the KDE peaks hard.
  const cloudBase = 96;
  const cloudTop = padT + 4;
  const yDensity = d3.scaleLinear().domain([0, maxDensity]).range([cloudBase, cloudTop]);
  const cloud = d3
    .area<KdePoint>()
    .x((p) => x(p.x))
    .y0(cloudBase)
    .y1((p) => yDensity(p.density))
    .curve(d3.curveBasis);

  const boxY = 112;
  const boxH = 20;
  const whiskerY = boxY + boxH / 2;
  const rainTop = 148;
  const rainBottom = height - padB - 4;
  const rainMid = (rainTop + rainBottom) / 2;
  const rainSpread = (rainBottom - rainTop) / 2;

  return (
    <Shell>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-full w-full"
        preserveAspectRatio="xMidYMid meet"
        focusable="false"
      >
        {ticks.map((t) => (
          <line
            key={t}
            x1={x(t)}
            x2={x(t)}
            y1={padT}
            y2={height - padB}
            stroke="var(--chart-grid)"
            strokeDasharray="3 3"
          />
        ))}
        <path
          d={cloud(kde) ?? ""}
          fill={CHART_COLORS[2]}
          fillOpacity={0.28}
          stroke={CHART_COLORS[2]}
          strokeWidth={1.25}
        />
        {/* Capped whiskers + IQR box + median, aligned to the same x scale as
            the cloud and the rain so the three layers read as one distribution. */}
        <line
          x1={x(box.min)}
          x2={x(box.q1)}
          y1={whiskerY}
          y2={whiskerY}
          stroke={CHART_COLORS[0]}
          strokeWidth={1.25}
        />
        <line
          x1={x(box.q3)}
          x2={x(box.max)}
          y1={whiskerY}
          y2={whiskerY}
          stroke={CHART_COLORS[0]}
          strokeWidth={1.25}
        />
        <line
          x1={x(box.min)}
          x2={x(box.min)}
          y1={whiskerY - 6}
          y2={whiskerY + 6}
          stroke={CHART_COLORS[0]}
          strokeWidth={1.25}
        />
        <line
          x1={x(box.max)}
          x2={x(box.max)}
          y1={whiskerY - 6}
          y2={whiskerY + 6}
          stroke={CHART_COLORS[0]}
          strokeWidth={1.25}
        />
        <rect
          x={x(box.q1)}
          y={boxY}
          width={Math.max(1, x(box.q3) - x(box.q1))}
          height={boxH}
          fill={CHART_COLORS[0]}
          fillOpacity={0.28}
          stroke={CHART_COLORS[0]}
          strokeWidth={1.25}
          rx={4}
        />
        <line
          x1={x(box.median)}
          x2={x(box.median)}
          y1={boxY + 2}
          y2={boxY + boxH - 2}
          stroke={CHART_COLORS[0]}
          strokeWidth={2}
        />
        {values.map((v, i) => {
          // Hash-based vertical jitter — `(i % 3)` drew diagonal chains that
          // looked like a rendering artifact rather than rain.
          const hash = (i * 2654435761) >>> 0;
          const jy = ((hash % 1000) / 1000 - 0.5) * 2 * rainSpread;
          return (
            <circle
              key={i}
              cx={x(v)}
              cy={rainMid + jy}
              r={2.75}
              fill={CHART_COLORS[1]}
              fillOpacity={0.85}
            />
          );
        })}
        <line
          x1={padL}
          x2={width - padR}
          y1={height - padB}
          y2={height - padB}
          stroke="var(--chart-axis)"
          strokeWidth={1}
        />
        {ticks.map((t) => (
          <text
            key={`t-${t}`}
            x={x(t)}
            y={height - padB + 14}
            textAnchor="middle"
            className="fill-[var(--chart-axis)] text-[9px]"
          >
            {formatAxisNumber(t)}
          </text>
        ))}
      </svg>
    </Shell>
  );
}

export function FrequencyPolygon({ data = defaultHist }: { data?: typeof defaultHist }) {
  const anim = useChartAnimation();

  return (
    <Shell>
      <ChartResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={PLOT_MARGIN}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="name" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} width={36} />
          <Tooltip content={<ChartTooltip />} />
          <Line
            type="linear"
            dataKey="count"
            stroke={CHART_COLORS[4]}
            strokeWidth={SERIES_STROKE_WIDTH}
            strokeLinecap="round"
            dot={false}
            activeDot={ACTIVE_DOT}
            {...anim}
          />
        </LineChart>
      </ChartResponsiveContainer>
    </Shell>
  );
}

export function DotDensityChart({ count = 120 }: { count?: number }) {
  const width = 400;
  const height = 220;
  const cols = 20;
  const rows = Math.ceil(count / cols) || 1;
  const cellW = width / cols;
  const cellH = height / rows;

  if (count <= 0) {
    return (
      <Shell>
        <ChartEmpty />
      </Shell>
    );
  }

  return (
    <Shell>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full" preserveAspectRatio="xMidYMid meet">
        {Array.from({ length: count }, (_, i) => {
          const col = i % cols;
          const row = Math.floor(i / cols);
          return (
            <circle
              key={i}
              cx={col * cellW + cellW / 2}
              cy={row * cellH + cellH / 2}
              r={3}
              fill={colorAt(i % 8)}
              fillOpacity={0.8}
            />
          );
        })}
      </svg>
    </Shell>
  );
}

export function FacetedPlot({ regions = salesByRegion }: { regions?: typeof salesByRegion }) {
  const size = 400;
  const n = regions.length;

  if (n === 0) {
    return (
      <Shell>
        <ChartEmpty />
      </Shell>
    );
  }

  // A near-square grid keeps each facet portrait-shaped, so the bar reads as a
  // chart instead of a wide slab floating in an oversized panel.
  const cols = n <= 2 ? n : Math.ceil(Math.sqrt(n));
  const rows = Math.ceil(n / cols);
  const margin = { top: 8, right: 8, bottom: 6, left: 8 };
  // Each cell reserves a strip under the panel for its caption, so the bottom
  // row's labels sit inside the frame instead of hanging off it.
  const captionH = 18;
  const gapX = 16;
  const gapY = 14;
  const cellW = (size - margin.left - margin.right - gapX * (cols - 1)) / cols;
  const cellH = (size - margin.top - margin.bottom - gapY * (rows - 1)) / rows;
  const plotH = cellH - captionH;
  // One shared scale across facets — the whole point of small multiples.
  const yMax = (d3.max(regions, (r) => r.sales) ?? 1) * 1.1;
  const barLength = d3.scaleLinear().domain([0, yMax]).range([0, plotH]);
  const barW = Math.min(cellW * 0.55, 72);

  return (
    <Shell>
      <svg viewBox={`0 0 ${size} ${size}`} className="h-full w-full" preserveAspectRatio="xMidYMid meet">
        {regions.map((r, i) => {
          const col = i % cols;
          const row = Math.floor(i / cols);
          const ox = margin.left + col * (cellW + gapX);
          const oy = margin.top + row * (cellH + gapY);
          const barH = barLength(r.sales);
          return (
            <g key={r.name} transform={`translate(${ox},${oy})`}>
              <rect width={cellW} height={plotH} fill="var(--chart-grid)" fillOpacity={0.12} rx={4} />
              <rect
                x={(cellW - barW) / 2}
                y={plotH - barH}
                width={barW}
                height={barH}
                fill={colorAt(i)}
                rx={3}
              />
              <text x={cellW / 2} y={plotH + 13} textAnchor="middle" className="fill-[var(--foreground)] text-[10px]">{r.name}</text>
            </g>
          );
        })}
      </svg>
    </Shell>
  );
}
