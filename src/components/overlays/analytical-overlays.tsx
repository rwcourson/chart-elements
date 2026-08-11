"use client";

import * as React from "react";
import {CartesianGrid,
  ErrorBar,
  Line,
  LineChart,
  ReferenceLine,
  Tooltip,
  XAxis,
  YAxis} from "recharts";
import { ChartResponsiveContainer } from "@/components/charts/chart-responsive";
import { CHART_COLORS } from "@/lib/chart-colors";
import { PLOT_MARGIN_COMPACT, SERIES_STROKE_WIDTH } from "@/lib/chart-marks";
import { useChartAnimation } from "@/lib/chart-motion";
import { timeSeries } from "@/lib/sample-data";
import { ChartEmpty } from "@/components/charts/chart-frame";
import { ChartTooltip } from "@/components/charts/chart-tooltip";
import { LineAreaChart } from "@/components/charts/line-area-chart";
import { cn } from "@/lib/utils";

type RefLabelProps = {
  viewBox?: { x?: number; y?: number; width?: number; height?: number };
  value?: string | number;
  /** Horizontal (y=) lines sit the chip on the right; vertical (x=) lines sit it at the top. */
  orientation?: "horizontal" | "vertical";
};

export type AnalyticalOverlayDatum = Record<string, string | number | null | undefined>;

export type ReferenceLinesChartProps = {
  data?: AnalyticalOverlayDatum[];
  categoryKey?: string;
  valueKey?: string;
  average?: boolean;
  min?: boolean;
  max?: boolean;
  median?: boolean;
  percentile?: number;
  constant?: number;
};

export type ErrorBarDatum = {
  date: string;
  value: number;
  /** Symmetric error, or `[lowerError, upperError]`. */
  error: number | [number, number];
};

export type CrossFilterGroup = {
  id: string;
  label: string;
  data: AnalyticalOverlayDatum[];
};

export type CrossFilterDemoProps = {
  groups?: CrossFilterGroup[];
  selectedId?: string;
  defaultSelectedId?: string;
  onSelectionChange?: (id: string) => void;
};

export type DrillLevel = {
  id: string;
  label: string;
  value: number;
  children?: DrillLevel[];
};

/** Linear interpolation quantile over finite values. */
export function quantile(values: number[], percentile: number): number {
  const sorted = values.filter(Number.isFinite).sort((a, b) => a - b);
  if (!sorted.length) return 0;
  const p = Math.max(0, Math.min(1, percentile));
  const position = (sorted.length - 1) * p;
  const lower = Math.floor(position);
  const upper = Math.ceil(position);
  if (lower === upper) return sorted[lower];
  return sorted[lower] + (sorted[upper] - sorted[lower]) * (position - lower);
}

/**
 * Reference-line caption with a solid card chip behind it. Plain Recharts
 * `label="Const"` draws ink on top of the dashed stroke, so the dashes cut
 * through the letters — unreadable on both themes.
 */
function ReferenceLabel({ viewBox, value, orientation = "horizontal" }: RefLabelProps) {
  if (viewBox == null || value == null || value === "") return null;
  const text = String(value);
  const { x = 0, y = 0, width = 0 } = viewBox;
  const padX = 6;
  const padY = 3;
  const fontSize = 11;
  // Tight estimate — chips are short words (Avg/Min/Const/Event).
  const tw = Math.ceil(text.length * fontSize * 0.62) + padX * 2;
  const th = fontSize + padY * 2;

  const cx =
    orientation === "horizontal" ? x + width - 10 - tw / 2 : x;
  const cy =
    orientation === "horizontal" ? y : y + 12 + th / 2;

  return (
    <g transform={`translate(${cx},${cy})`} pointerEvents="none">
      <rect
        x={-tw / 2}
        y={-th / 2}
        width={tw}
        height={th}
        rx={4}
        fill="var(--card)"
        stroke="var(--border)"
        strokeWidth={1}
      />
      <text
        textAnchor="middle"
        dominantBaseline="central"
        fill="var(--foreground)"
        fontSize={fontSize}
        fontWeight={600}
      >
        {text}
      </text>
    </g>
  );
}

function refLabel(value: string, orientation: "horizontal" | "vertical" = "horizontal") {
  return (
    <ReferenceLabel
      value={value}
      orientation={orientation}
    />
  );
}

export function SmallMultiples({
  series = ["revenue", "cost", "forecast"]}: {
  series?: string[];
}) {
  return (
    <div className="grid h-full grid-cols-3 gap-2">
      {series.map((key) => (
        <div key={key} className="min-h-0 rounded-lg border border-border p-1">
          <div className="px-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            {key}
          </div>
          <div className="h-[calc(100%-16px)]">
            <LineAreaChart
              data={timeSeries}
              seriesKeys={[key]}
              variant="area"
              showLegend={false}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function TrellisCharts() {
  return <SmallMultiples series={["revenue", "cost"]} />;
}

export function FacetedCharts() {
  return <SmallMultiples series={["revenue", "cost", "forecast"]} />;
}

export function ReferenceLinesChart({
  data = timeSeries,
  categoryKey = "date",
  valueKey = "revenue",
  average,
  min,
  max,
  median,
  percentile,
  constant}: ReferenceLinesChartProps) {
  const values = data
    .map((datum) => Number(datum[valueKey]))
    .filter(Number.isFinite);
  const avg = values.reduce((a, b) => a + b, 0) / (values.length || 1);
  const mn = values.length ? Math.min(...values) : 0;
  const mx = values.length ? Math.max(...values) : 0;
  const med = quantile(values, 0.5);
  const percentileValue = percentile == null ? undefined : quantile(values, percentile);
  const anim = useChartAnimation();

  if (values.length === 0) return <ChartEmpty />;

  return (
    <ChartResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ ...PLOT_MARGIN_COMPACT, right: 16 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey={categoryKey} tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} width={40} />
        <Tooltip content={<ChartTooltip />} />
        <Line
          type="monotone"
          dataKey={valueKey}
          stroke={CHART_COLORS[0]}
          strokeWidth={SERIES_STROKE_WIDTH}
          strokeLinecap="round"
          dot={false}
          activeDot={{ r: 4, strokeWidth: 0 }}
          {...anim}
        />
        {average ? (
          <ReferenceLine y={avg} stroke={CHART_COLORS[1]} strokeDasharray="4 4" label={refLabel("Avg")} />
        ) : null}
        {min ? (
          <ReferenceLine y={mn} stroke={CHART_COLORS[2]} strokeDasharray="2 2" label={refLabel("Min")} />
        ) : null}
        {max ? (
          <ReferenceLine y={mx} stroke={CHART_COLORS[3]} strokeDasharray="2 2" label={refLabel("Max")} />
        ) : null}
        {median ? (
          <ReferenceLine y={med} stroke={CHART_COLORS[4]} strokeDasharray="4 4" label={refLabel("Med")} />
        ) : null}
        {percentileValue != null ? (
          <ReferenceLine
            y={percentileValue}
            stroke={CHART_COLORS[5]}
            strokeDasharray="5 3"
            label={refLabel(`P${Math.round(Math.max(0, Math.min(1, percentile ?? 0)) * 100)}`)}
          />
        ) : null}
        {constant != null ? (
          <ReferenceLine
            y={constant}
            stroke="var(--foreground)"
            strokeDasharray="6 3"
            label={refLabel("Const")}
          />
        ) : null}
      </LineChart>
    </ChartResponsiveContainer>
  );
}

export function ConstantLine() {
  return <ReferenceLinesChart constant={5500} />;
}
export function AverageLine() {
  return <ReferenceLinesChart average />;
}
export function MinLine() {
  return <ReferenceLinesChart min />;
}
export function MaxLine() {
  return <ReferenceLinesChart max />;
}
export function MedianLine() {
  return <ReferenceLinesChart median />;
}
export function PercentileLine({ percentile = 0.9 }: { percentile?: number }) {
  return <ReferenceLinesChart percentile={percentile} />;
}
export function DynamicReferenceLine() {
  return <ReferenceLinesChart average max />;
}
export function XAxisReferenceLine() {
  const anim = useChartAnimation();
  return (
    <ChartResponsiveContainer width="100%" height="100%">
      <LineChart data={timeSeries} margin={{ ...PLOT_MARGIN_COMPACT, top: 20 }} /* room for reference labels */>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="date" tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} width={40} />
        <Tooltip content={<ChartTooltip />} />
        <ReferenceLine
          x="May"
          stroke={CHART_COLORS[5]}
          label={refLabel("Event", "vertical")}
        />
        <Line
          type="monotone"
          dataKey="revenue"
          stroke={CHART_COLORS[0]}
          strokeWidth={SERIES_STROKE_WIDTH}
          strokeLinecap="round"
          dot={false}
          activeDot={{ r: 4, strokeWidth: 0 }}
          {...anim}
        />
      </LineChart>
    </ChartResponsiveContainer>
  );
}
export function YAxisReferenceLine() {
  return <ReferenceLinesChart constant={5000} />;
}

export function ErrorBarsOverlay({
  data = timeSeries.map((point) => ({
    date: point.date,
    value: point.revenue,
    error: point.revenue * 0.08}))}: {
  data?: ErrorBarDatum[];
}) {
  const anim = useChartAnimation();
  const validData = data.filter(
    (datum) =>
      Number.isFinite(datum.value) &&
      (Array.isArray(datum.error)
        ? datum.error.length === 2 && datum.error.every(Number.isFinite)
        : Number.isFinite(datum.error)),
  );

  if (!validData.length) return <ChartEmpty />;

  return (
    <ChartResponsiveContainer width="100%" height="100%">
      <LineChart data={validData} margin={{ ...PLOT_MARGIN_COMPACT, top: 18, right: 16, bottom: 4 }} /* annotation room */>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="date" tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} width={40} />
        <Tooltip content={<ChartTooltip />} />
        <Line
          type="monotone"
          dataKey="value"
          stroke={CHART_COLORS[0]}
          strokeWidth={SERIES_STROKE_WIDTH}
          strokeLinecap="round"
          dot={{ r: 3, fill: CHART_COLORS[0] }}
          activeDot={{ r: 4, strokeWidth: 0 }}
          {...anim}
        >
          <ErrorBar
            dataKey="error"
            direction="y"
            width={8}
            stroke={CHART_COLORS[1]}
            strokeWidth={1.5}
          />
        </Line>
      </LineChart>
    </ChartResponsiveContainer>
  );
}

export function TrendAnalysis() {
  return (
    <LineAreaChart
      data={timeSeries}
      seriesKeys={["revenue", "forecast"]}
      variant="line"
    />
  );
}

export function ConditionalDataColors() {
  return (
    <div className="flex h-full items-end gap-2 px-2 pb-2">
      {[42, 68, 55, 90, 33, 71, 48].map((v, i) => (
        <div key={i} className="flex flex-1 flex-col items-center gap-1">
          <div
            className="w-full rounded-t-md"
            style={{
              height: `${v}%`,
              background:
                v > 70
                  ? "var(--chart-positive)"
                  : v < 45
                    ? "var(--chart-negative)"
                    : "var(--chart-1)"}}
          />
          <span className="text-[10px] text-muted-foreground">S{i + 1}</span>
        </div>
      ))}
    </div>
  );
}

export function DynamicTitle({
  title = "Revenue · East · Q2",
  className}: {
  title?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex h-full items-center justify-center", className)}>
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
    </div>
  );
}

const defaultCrossFilterGroups: CrossFilterGroup[] = [
  {
    id: "west",
    label: "West",
    data: timeSeries.map((point) => ({ ...point, value: point.revenue }))},
  {
    id: "east",
    label: "East",
    data: timeSeries.map((point) => ({ ...point, value: Math.round(point.revenue * 0.82) }))},
  {
    id: "central",
    label: "Central",
    data: timeSeries.map((point) => ({ ...point, value: Math.round(point.revenue * 0.68) }))},
];

export function CrossFilterDemo({
  groups = defaultCrossFilterGroups,
  selectedId,
  defaultSelectedId = groups[0]?.id ?? "",
  onSelectionChange}: CrossFilterDemoProps) {
  const [internalSelectedId, setInternalSelectedId] = React.useState(defaultSelectedId);
  const activeId = selectedId ?? internalSelectedId;
  const activeGroup = groups.find((group) => group.id === activeId) ?? groups[0];
  const selectGroup = (id: string) => {
    if (selectedId === undefined) setInternalSelectedId(id);
    onSelectionChange?.(id);
  };

  if (!groups.length) return <ChartEmpty />;

  return (
    // Each panel is a column so the caption takes its line and the chart gets
    // the remainder. Letting the chart claim h-full alongside the caption made
    // the pair overflow the card by exactly the caption's height.
    <div className="grid h-full grid-cols-1 gap-2 sm:grid-cols-[minmax(8rem,0.65fr)_minmax(0,1.35fr)]">
      <div className="flex min-h-0 flex-col rounded-lg border border-border p-2">
        <div className="mb-1 text-[10px] uppercase text-muted-foreground">Source</div>
        <div className="flex min-h-0 flex-1 flex-col justify-center gap-2">
          {groups.map((group) => (
            <button
              key={group.id}
              type="button"
              aria-pressed={group.id === activeGroup.id}
              onClick={() => selectGroup(group.id)}
              className={cn(
                "min-h-11 rounded-md border px-3 py-2 text-left text-sm transition-colors",
                group.id === activeGroup.id
                  ? "border-accent bg-accent/10 font-semibold"
                  : "border-border hover:bg-muted",
              )}
            >
              {group.label}
            </button>
          ))}
        </div>
      </div>
      <div className="flex min-h-0 flex-col rounded-lg border border-border p-2">
        <div className="mb-1 text-[10px] uppercase text-muted-foreground">
          Cross-filtered · {activeGroup.label}
        </div>
        <div className="min-h-0 flex-1">
          <LineAreaChart data={activeGroup.data} seriesKeys={["value"]} showLegend={false} />
        </div>
      </div>
    </div>
  );
}

const defaultDrillRoot: DrillLevel = {
  id: "all",
  label: "All regions",
  value: 100,
  children: [
    {
      id: "east",
      label: "East",
      value: 38,
      children: [
        { id: "store-12", label: "Store 12", value: 12 },
        { id: "store-18", label: "Store 18", value: 10 },
        { id: "other-east", label: "Other East", value: 16 },
      ]},
    { id: "west", label: "West", value: 34 },
    { id: "central", label: "Central", value: 28 },
  ]};

export function DrillDownDemo({
  root = defaultDrillRoot,
  activePath,
  defaultActivePath = [root.id],
  onPathChange}: {
  root?: DrillLevel;
  activePath?: string[];
  defaultActivePath?: string[];
  onPathChange?: (path: string[]) => void;
}) {
  const [internalPath, setInternalPath] = React.useState(defaultActivePath);
  const requestedPath = activePath ?? internalPath;
  const resolved = [root];
  let cursor = root;
  for (const id of requestedPath.slice(1)) {
    const next = cursor.children?.find((child) => child.id === id);
    if (!next) break;
    resolved.push(next);
    cursor = next;
  }
  const setPath = (path: string[]) => {
    if (activePath === undefined) setInternalPath(path);
    onPathChange?.(path);
  };
  const current = resolved[resolved.length - 1];
  const options = current.children ?? [];

  return (
    <div className="flex h-full flex-col gap-3 p-3 text-sm">
      <nav aria-label="Drill path" className="flex flex-wrap items-center gap-1 text-xs">
        {resolved.map((level, index) => (
          <React.Fragment key={level.id}>
            {index ? <span aria-hidden="true">→</span> : null}
            <button
              type="button"
              className="min-h-8 rounded px-2 text-muted-foreground hover:bg-muted hover:text-foreground"
              onClick={() => setPath(resolved.slice(0, index + 1).map((item) => item.id))}
              aria-current={index === resolved.length - 1 ? "page" : undefined}
            >
              {level.label}
            </button>
          </React.Fragment>
        ))}
      </nav>
      <div className="space-y-1 overflow-auto" aria-live="polite">
        {options.length ? options.map((level) => (
          <button
            type="button"
            key={level.id}
            className="flex min-h-11 w-full items-center justify-between rounded-lg border border-border px-3 py-2 text-left hover:bg-muted"
            onClick={() => setPath([...resolved.map((item) => item.id), level.id])}
          >
            <span>{level.label}</span>
            <span className="tabular-nums text-muted-foreground">{level.value}%</span>
          </button>
        )) : (
          <div className="rounded-lg border border-border bg-muted/30 p-3">
            <div className="font-medium">{current.label}</div>
            <div className="text-muted-foreground">Leaf value: {current.value}%</div>
          </div>
        )}
      </div>
    </div>
  );
}

export function VisualTooltipDemo() {
  const [open, setOpen] = React.useState(false);
  const tooltipId = React.useId();
  return (
    <div className="relative flex h-full items-center justify-center">
      <button
        type="button"
        className="h-24 w-40 rounded-lg bg-[var(--chart-1)]/20 outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-describedby={open ? tooltipId : undefined}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onPointerEnter={() => setOpen(true)}
        onPointerLeave={() => setOpen(false)}
      >
        Focus or hover this mark
      </button>
      {open ? (
        <div
          id={tooltipId}
          role="status"
          className="ce-chart-tooltip absolute right-8 top-8 w-44 rounded-[var(--radius)] border border-[var(--chart-tooltip-border)] bg-[var(--chart-tooltip-bg)] p-3 text-xs text-[var(--chart-tooltip-fg)] shadow-[var(--overlay-shadow)]"
        >
          <div className="font-medium">May · Report tooltip</div>
          <div className="mt-1 text-muted-foreground">Revenue $5.6k · +12% YoY</div>
        </div>
      ) : null}
    </div>
  );
}
