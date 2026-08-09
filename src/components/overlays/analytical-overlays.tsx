"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CHART_COLORS } from "@/lib/chart-colors";
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
  series = ["revenue", "cost", "forecast"],
}: {
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
  average,
  min,
  max,
  median,
  constant,
}: {
  average?: boolean;
  min?: boolean;
  max?: boolean;
  median?: boolean;
  constant?: number;
}) {
  const values = timeSeries.map((d) => d.revenue);
  const avg = values.reduce((a, b) => a + b, 0) / (values.length || 1);
  const mn = values.length ? Math.min(...values) : 0;
  const mx = values.length ? Math.max(...values) : 0;
  const sorted = [...values].sort((a, b) => a - b);
  const med = sorted[Math.floor(sorted.length / 2)] ?? 0;
  const anim = useChartAnimation();

  if (values.length === 0) return <ChartEmpty />;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={timeSeries} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="date" tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} width={40} />
        <Tooltip content={<ChartTooltip />} />
        <Line
          type="monotone"
          dataKey="revenue"
          stroke={CHART_COLORS[0]}
          strokeWidth={2.25}
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
        {constant != null ? (
          <ReferenceLine
            y={constant}
            stroke="var(--foreground)"
            strokeDasharray="6 3"
            label={refLabel("Const")}
          />
        ) : null}
      </LineChart>
    </ResponsiveContainer>
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
export function PercentileLine() {
  return <ReferenceLinesChart constant={5800} />;
}
export function DynamicReferenceLine() {
  return <ReferenceLinesChart average max />;
}
export function XAxisReferenceLine() {
  const anim = useChartAnimation();
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={timeSeries} margin={{ top: 20, right: 12, left: 0, bottom: 0 }}>
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
          strokeWidth={2.25}
          strokeLinecap="round"
          dot={false}
          activeDot={{ r: 4, strokeWidth: 0 }}
          {...anim}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
export function YAxisReferenceLine() {
  return <ReferenceLinesChart constant={5000} />;
}

export function ErrorBarsOverlay() {
  const anim = useChartAnimation();
  const data = timeSeries.map((d) => ({
    ...d,
    low: d.revenue * 0.92,
    high: d.revenue * 1.08,
  }));
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="date" tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} width={40} />
        <Tooltip content={<ChartTooltip />} />
        <Line type="monotone" dataKey="high" stroke="transparent" dot={false} {...anim} />
        <Line type="monotone" dataKey="low" stroke="transparent" dot={false} {...anim} />
        <Line
          type="monotone"
          dataKey="revenue"
          stroke={CHART_COLORS[0]}
          strokeWidth={2.25}
          strokeLinecap="round"
          dot
          activeDot={{ r: 4, strokeWidth: 0 }}
          {...anim}
        />
      </LineChart>
    </ResponsiveContainer>
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
                    : "var(--chart-1)",
            }}
          />
          <span className="text-[10px] text-muted-foreground">S{i + 1}</span>
        </div>
      ))}
    </div>
  );
}

export function DynamicTitle({
  title = "Revenue · East · Q2",
  className,
}: {
  title?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex h-full items-center justify-center", className)}>
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
    </div>
  );
}

export function CrossFilterDemo() {
  return (
    // Each panel is a column so the caption takes its line and the chart gets
    // the remainder. Letting the chart claim h-full alongside the caption made
    // the pair overflow the card by exactly the caption's height.
    <div className="grid h-full grid-cols-2 gap-2">
      <div className="flex min-h-0 flex-col rounded-lg border border-border p-2">
        <div className="mb-1 text-[10px] uppercase text-muted-foreground">Source</div>
        <div className="min-h-0 flex-1">
          <LineAreaChart data={timeSeries} seriesKeys={["revenue"]} showLegend={false} />
        </div>
      </div>
      <div className="flex min-h-0 flex-col rounded-lg border border-border p-2 opacity-80">
        <div className="mb-1 text-[10px] uppercase text-muted-foreground">Cross-filtered</div>
        <div className="min-h-0 flex-1">
          <LineAreaChart data={timeSeries.slice(0, 4)} seriesKeys={["cost"]} showLegend={false} />
        </div>
      </div>
    </div>
  );
}

export function DrillDownDemo() {
  return (
    <div className="flex h-full flex-col justify-center gap-2 p-3 text-sm">
      <div className="text-xs text-muted-foreground">Path: All → Region → East → Store 12</div>
      <div className="space-y-1">
        {["All regions", "East", "Store 12"].map((level, i) => (
          <div
            key={level}
            className="flex items-center justify-between rounded-lg border border-border px-3 py-2"
            style={{ marginLeft: i * 12 }}
          >
            <span>{level}</span>
            <span className="tabular-nums text-muted-foreground">{[100, 38, 12][i]}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function VisualTooltipDemo() {
  return (
    <div className="relative flex h-full items-center justify-center">
      <div className="h-24 w-40 rounded-lg bg-[var(--chart-1)]/20" />
      <div className="absolute right-8 top-8 w-44 rounded-lg border border-[var(--chart-tooltip-border)] bg-[var(--chart-tooltip-bg)] p-3 text-xs shadow-lg">
        <div className="font-medium">May · Report tooltip</div>
        <div className="mt-1 text-muted-foreground">Revenue $5.6k · +12% YoY</div>
      </div>
    </div>
  );
}
