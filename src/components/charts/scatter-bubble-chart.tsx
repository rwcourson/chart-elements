"use client";

import {
  CartesianGrid,
  Legend,
  ReferenceArea,
  ReferenceLine,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis} from "recharts";
import { ChartResponsiveContainer } from "./chart-responsive";
import { CHART_COLORS } from "@/lib/chart-colors";
import { PLOT_MARGIN } from "@/lib/chart-marks";
import { useChartAnimation, useSeriesHover } from "@/lib/chart-motion";
import { ChartEmpty } from "./chart-frame";
import { ChartTooltip } from "./chart-tooltip";

export type ScatterBubbleDatum = Record<string, string | number | null | undefined>;

export type ScatterBubbleChartProps = {
  data: ScatterBubbleDatum[];
  variant?: "scatter" | "bubble" | "dot-plot" | "quadrant";
  xKey?: string;
  yKey?: string;
  zKey?: string;
  categoryKey?: string;
  xThreshold?: number;
  yThreshold?: number;
  quadrantLabels?: [string, string, string, string];
  showLegend?: boolean;
  xAxisLabel?: string;
  yAxisLabel?: string;
};

export function ScatterBubbleChart({
  data,
  variant = "scatter",
  xKey = "x",
  yKey = "y",
  zKey = "z",
  categoryKey = "category",
  xThreshold,
  yThreshold,
  quadrantLabels = ["Monitor", "Invest", "Deprioritize", "Maintain"],
  showLegend = true,
  xAxisLabel,
  yAxisLabel}: ScatterBubbleChartProps) {
  const validData = data
    .filter((datum) => Number.isFinite(Number(datum[xKey])))
    .filter((datum) => variant === "dot-plot" || Number.isFinite(Number(datum[yKey])))
    .map((datum) => ({
      ...datum,
      [xKey]: Number(datum[xKey]),
      [yKey]: variant === "dot-plot" ? datum[categoryKey] : Number(datum[yKey]),
      [zKey]: Math.max(0, Number(datum[zKey]) || 0),
      [categoryKey]: String(datum[categoryKey] ?? "Uncategorized")}));
  const categories = [...new Set(validData.map((d) => String(d[categoryKey])))];
  const range =
    variant === "bubble" ? [40, 400] : variant === "dot-plot" ? [40, 40] : [60, 60];
  const xValues = validData.map((datum) => Number(datum[xKey]));
  const yValues = validData.map((datum) => Number(datum[yKey])).filter(Number.isFinite);
  const xMin = Math.min(...xValues);
  const xMax = Math.max(...xValues);
  const yMin = Math.min(...yValues);
  const yMax = Math.max(...yValues);
  const resolvedXThreshold = xThreshold ?? (xMin + xMax) / 2;
  const resolvedYThreshold = yThreshold ?? (yMin + yMax) / 2;

  const anim = useChartAnimation();
  const hover = useSeriesHover();

  if (!validData.length) return <ChartEmpty />;

  return (
    <ChartResponsiveContainer width="100%" height="100%">
      <ScatterChart margin={{ ...PLOT_MARGIN }}>
        <CartesianGrid />
        <XAxis
          type="number"
          dataKey={xKey}
          tickLine={false}
          axisLine={false}
          name={xKey}
          label={xAxisLabel ? { value: xAxisLabel, position: "insideBottom", offset: -4 } : undefined}
        />
        <YAxis
          type={variant === "dot-plot" ? "category" : "number"}
          dataKey={yKey}
          tickLine={false}
          axisLine={false}
          name={variant === "dot-plot" ? categoryKey : yKey}
          width={variant === "dot-plot" ? 72 : 40}
          label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: "insideLeft" } : undefined}
        />
        <ZAxis type="number" dataKey={zKey} range={range as [number, number]} />
        <Tooltip cursor={{ strokeDasharray: "3 3" }} content={<ChartTooltip />} />
        {variant === "quadrant" ? (
          <>
            <ReferenceArea x1={xMin} x2={resolvedXThreshold} y1={resolvedYThreshold} y2={yMax} fill={CHART_COLORS[0]} fillOpacity={0.06} label={quadrantLabels[0]} />
            <ReferenceArea x1={resolvedXThreshold} x2={xMax} y1={resolvedYThreshold} y2={yMax} fill={CHART_COLORS[1]} fillOpacity={0.08} label={quadrantLabels[1]} />
            <ReferenceArea x1={xMin} x2={resolvedXThreshold} y1={yMin} y2={resolvedYThreshold} fill={CHART_COLORS[2]} fillOpacity={0.06} label={quadrantLabels[2]} />
            <ReferenceArea x1={resolvedXThreshold} x2={xMax} y1={yMin} y2={resolvedYThreshold} fill={CHART_COLORS[3]} fillOpacity={0.06} label={quadrantLabels[3]} />
            <ReferenceLine x={resolvedXThreshold} stroke="var(--foreground)" strokeDasharray="4 4" />
            <ReferenceLine y={resolvedYThreshold} stroke="var(--foreground)" strokeDasharray="4 4" />
          </>
        ) : null}
        {showLegend && categories.length > 1 ? (
          <Legend
            iconType="circle"
            {...hover.legendHandlers}
          />
        ) : null}
        {categories.map((category, index) => (
          <Scatter
            key={category}
            name={category}
            data={validData.filter((datum) => datum[categoryKey] === category)}
            fill={CHART_COLORS[index % CHART_COLORS.length]}
            fillOpacity={hover.opacityFor(category)}
            {...anim}
            {...hover.bind(category)}
          />
        ))}
      </ScatterChart>
    </ChartResponsiveContainer>
  );
}
