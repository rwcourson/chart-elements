"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis} from "recharts";
import { ChartResponsiveContainer } from "./chart-responsive";
import { SEMANTIC } from "@/lib/chart-colors";
import { CHART_TOOLTIP_CLASS, MAX_BAR_SIZE, PLOT_MARGIN } from "@/lib/chart-marks";
import { useChartAnimation, useSeriesHover } from "@/lib/chart-motion";
import { formatCompact } from "@/lib/utils";
import { ChartEmpty } from "./chart-frame";

export type WaterfallPoint = {
  name: string;
  value: number;
  type: "increase" | "decrease" | "total";
};

export type WaterfallChartProps = {
  data: WaterfallPoint[];
  totalMode?: "absolute" | "computed";
  valueFormatter?: (value: number) => string;
};

type ShapedPoint = WaterfallPoint & {
  base: number;
  display: number;
  color: string;
  runningBefore: number;
  runningAfter: number;
};

/** Pure prefix scan — no mutation after render (React Compiler safe). */
export function shapeWaterfall(
  data: WaterfallPoint[],
  totalMode: "absolute" | "computed" = "absolute",
): ShapedPoint[] {
  return data.reduce<{ rows: ShapedPoint[]; running: number }>(
    (acc, d) => {
      if (d.type === "total") {
        const total = totalMode === "computed" ? acc.running : d.value;
        acc.rows.push({
          ...d,
          base: 0,
          value: total,
          display: Math.abs(total),
          color: "var(--chart-1)",
          runningBefore: acc.running,
          runningAfter: total});
        return { rows: acc.rows, running: total };
      }
      const next = acc.running + d.value;
      acc.rows.push({
        ...d,
        base: Math.min(acc.running, next),
        display: Math.abs(d.value),
        color: d.type === "increase" ? SEMANTIC.positive : SEMANTIC.negative,
        runningBefore: acc.running,
        runningAfter: next});
      return { rows: acc.rows, running: next };
    },
    { rows: [], running: 0 },
  ).rows;
}

type WaterfallShapeProps = {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  index?: number;
  payload?: ShapedPoint;
};

function WaterfallBar({
  x = 0,
  y = 0,
  width = 0,
  height = 0,
  index = 0,
  payload,
  count,
  opacity}: WaterfallShapeProps & { count: number; opacity: number }) {
  if (!payload) return null;
  const connectorY = payload.type === "decrease" ? y + height : y;
  return (
    <g opacity={opacity}>
      <rect x={x} y={y} width={width} height={height} rx="4" fill={payload.color} />
      {index < count - 1 ? (
        <line
          x1={x + width}
          x2={x + width + 18}
          y1={connectorY}
          y2={connectorY}
          stroke="var(--muted-foreground)"
          strokeWidth="1"
          strokeDasharray="3 3"
          aria-hidden="true"
        />
      ) : null}
    </g>
  );
}

function WaterfallTooltip({
  active,
  payload,
  valueFormatter}: {
  active?: boolean;
  payload?: Array<{ payload?: ShapedPoint }>;
  valueFormatter: (value: number) => string;
}) {
  const point = payload?.[0]?.payload;
  if (!active || !point) return null;
  return (
    <div className={`${CHART_TOOLTIP_CLASS} min-w-36 text-xs`}>
      <div className="font-medium">{point.name}</div>
      <div className="mt-1 flex items-center justify-between gap-4">
        <span className="text-muted-foreground">
          {point.type === "total" ? "Total" : "Change"}
        </span>
        <span className="font-semibold tabular-nums">{valueFormatter(point.value)}</span>
      </div>
      {point.type !== "total" ? (
        <div className="mt-1 flex items-center justify-between gap-4">
          <span className="text-muted-foreground">Running total</span>
          <span className="tabular-nums">{valueFormatter(point.runningAfter)}</span>
        </div>
      ) : null}
    </div>
  );
}

export function WaterfallChart({
  data,
  totalMode = "absolute",
  valueFormatter = formatCompact}: WaterfallChartProps) {
  const validData = (data ?? []).filter(
    (point) => point && Number.isFinite(point.value),
  );
  const shaped = shapeWaterfall(validData, totalMode);
  const anim = useChartAnimation();
  const hover = useSeriesHover();

  if (!shaped.length) return <ChartEmpty />;

  return (
    <ChartResponsiveContainer width="100%" height="100%">
      <BarChart data={shaped} margin={{ ...PLOT_MARGIN }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="name" tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} width={40} />
        <Tooltip content={<WaterfallTooltip valueFormatter={valueFormatter} />} />
        <Bar dataKey="base" stackId="w" fill="transparent" {...anim} />
        <Bar
          dataKey="display"
          stackId="w"
          maxBarSize={MAX_BAR_SIZE}
          shape={(props: WaterfallShapeProps) => (
            <WaterfallBar
              {...props}
              count={shaped.length}
              opacity={hover.opacityFor(props.payload?.name ?? "")}
            />
          )}
          {...anim}
        />
      </BarChart>
    </ChartResponsiveContainer>
  );
}
