"use client";

import * as React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis} from "recharts";
import { ChartResponsiveContainer } from "./chart-responsive";
import { CHART_COLORS } from "@/lib/chart-colors";
import {
  BAR_RADIUS_BAR,
  BAR_RADIUS_COLUMN,
  BAR_RADIUS_STACKED,
  MAX_BAR_SIZE,
  PLOT_MARGIN} from "@/lib/chart-marks";
import { useChartAnimation, useSeriesHover } from "@/lib/chart-motion";
import { ChartEmpty } from "./chart-frame";
import { ChartTooltip, legendLabel } from "./chart-tooltip";

export type BarColumnVariant =
  | "clustered-bar"
  | "stacked-bar"
  | "percent-bar"
  | "clustered-column"
  | "stacked-column"
  | "percent-column"
  | "grouped-stacked-bar"
  | "grouped-stacked-column"
  | "3d-clustered-bar"
  | "3d-clustered-column"
  | "3d-cylinder-bar"
  | "3d-cylinder-column";

export type BarColumnDatum = Record<string, string | number | null | undefined>;

export type BarColumnChartProps = {
  data: BarColumnDatum[];
  categoryKey?: string;
  seriesKeys: string[];
  variant?: BarColumnVariant;
  /** Separate stacks rendered side by side for grouped-stacked variants. */
  stackGroups?: string[][];
  showLegend?: boolean;
  xAxisLabel?: string;
  yAxisLabel?: string;
  valueFormatter?: (value: number) => string;
};

function finite(value: unknown) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

/** Normalize positive and negative stacks independently around a zero baseline. */
export function normalizePercentRows(data: BarColumnDatum[], keys: string[]): BarColumnDatum[] {
  return data.map((row) => {
    const values = keys.map((key) => finite(row[key]));
    const positiveTotal = values.reduce((sum, value) => sum + Math.max(0, value), 0);
    const negativeTotal = values.reduce((sum, value) => sum + Math.abs(Math.min(0, value)), 0);
    const next: BarColumnDatum = { ...row };
    keys.forEach((k) => {
      const value = values[keys.indexOf(k)];
      next[k] = value >= 0
        ? positiveTotal > 0 ? value / positiveTotal : 0
        : negativeTotal > 0 ? value / negativeTotal : 0;
    });
    return next;
  });
}

type ShapeProps = {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  fill?: string;
};

/**
 * Subtle dimensional flavour for 3d-* variants — soft depth, not clip-art
 * extrude. Opacity steps stay close so dark mode fills do not muddy.
 */
function DimensionalBarShape({
  x = 0,
  y = 0,
  width = 0,
  height = 0,
  fill = "currentColor",
  horizontal,
  cylinder}: ShapeProps & { horizontal: boolean; cylinder: boolean }) {
  if (width <= 0 || height <= 0) return null;
  if (cylinder) {
    // Soft caps only — avoid high-contrast “plastic” ends.
    const cap = Math.max(2, Math.min(4, (horizontal ? height : width) * 0.14));
    return horizontal ? (
      <g>
        <rect x={x} y={y} width={width} height={height} fill={fill} opacity={0.94} rx={1} />
        <ellipse cx={x} cy={y + height / 2} rx={cap} ry={height / 2} fill={fill} opacity={0.86} />
        <ellipse cx={x + width} cy={y + height / 2} rx={cap} ry={height / 2} fill={fill} opacity={0.94} />
      </g>
    ) : (
      <g>
        <rect x={x} y={y} width={width} height={height} fill={fill} opacity={0.94} rx={1} />
        <ellipse cx={x + width / 2} cy={y + height} rx={width / 2} ry={cap} fill={fill} opacity={0.86} />
        <ellipse cx={x + width / 2} cy={y} rx={width / 2} ry={cap} fill={fill} opacity={0.94} />
      </g>
    );
  }

  const depth = Math.max(2, Math.min(4, (horizontal ? height : width) * 0.1));
  return horizontal ? (
    <g>
      <rect x={x} y={y} width={Math.max(0, width - depth)} height={height} rx={2} fill={fill} opacity={0.94} />
      <path
        d={`M${x + width - depth},${y} L${x + width},${y + depth} L${x + width},${y + height} L${x + width - depth},${y + height - depth} Z`}
        fill={fill}
        opacity={0.82}
      />
      <path
        d={`M${x},${y} L${x + width - depth},${y} L${x + width},${y + depth} L${x + depth},${y + depth} Z`}
        fill={fill}
        opacity={0.9}
      />
    </g>
  ) : (
    <g>
      <rect x={x} y={y + depth} width={width} height={Math.max(0, height - depth)} rx={2} fill={fill} opacity={0.94} />
      <path
        d={`M${x},${y + depth} L${x + depth},${y} L${x + width + depth},${y} L${x + width},${y + depth} Z`}
        fill={fill}
        opacity={0.9}
      />
      <path
        d={`M${x + width},${y + depth} L${x + width + depth},${y} L${x + width + depth},${y + height - depth} L${x + width},${y + height} Z`}
        fill={fill}
        opacity={0.82}
      />
    </g>
  );
}

export function BarColumnChart({
  data,
  categoryKey = "name",
  seriesKeys,
  variant = "clustered-column",
  stackGroups,
  showLegend = true,
  xAxisLabel,
  yAxisLabel,
  valueFormatter}: BarColumnChartProps) {
  // `isBar` = horizontal bars, which Recharts expresses as layout="vertical".
  const isBar = variant.includes("bar");
  const groupedStacked = variant.includes("grouped-stacked");
  const stacked = groupedStacked || variant.includes("stacked") || variant.includes("percent");
  const percent = variant.includes("percent");
  const dimensional = variant.startsWith("3d-");
  const cylinder = variant.includes("cylinder");
  const chartData = percent ? normalizePercentRows(data, seriesKeys) : data;
  const validSeries = seriesKeys.filter((key) => data.some((row) => Number.isFinite(Number(row[key]))));
  const groupFor = (key: string) =>
    stackGroups?.findIndex((group) => group.includes(key)) ??
    (groupedStacked ? Math.min(1, validSeries.indexOf(key)) : 0);

  const anim = useChartAnimation();
  const hover = useSeriesHover();
  // Gradient ids must be unique per instance — two charts sharing a series key
  // on one page would otherwise reference the same <defs>.
  const uid = React.useId().replace(/[^a-zA-Z0-9]/g, "");

  if (!chartData.length || !validSeries.length) return <ChartEmpty />;

  return (
    <ChartResponsiveContainer width="100%" height="100%">
      <BarChart
        data={chartData}
        layout={isBar ? "vertical" : "horizontal"}
        margin={{ ...PLOT_MARGIN }}
        barCategoryGap="18%"
        // Clustered bars share a narrow band; a wide gap starves each bar.
        barGap={stacked ? 0 : 2}
      >
        <defs>
          {seriesKeys.map((key, i) => (
            // Depth without color math: the fill eases to 82% opacity toward
            // the baseline, which reads as a soft top light on both themes.
            <linearGradient
              key={key}
              id={`bar-${uid}-${i}`}
              x1="0"
              y1="0"
              x2={isBar ? "1" : "0"}
              y2={isBar ? "0" : "1"}
            >
              <stop
                offset="0%"
                stopColor={CHART_COLORS[i % CHART_COLORS.length]}
                stopOpacity={1}
              />
              <stop
                offset="100%"
                stopColor={CHART_COLORS[i % CHART_COLORS.length]}
                stopOpacity={0.82}
              />
            </linearGradient>
          ))}
        </defs>
        {/* Gridlines belong on the value axis, which flips with the layout.
            Solid hairlines, not dashes — the faint --chart-grid color carries
            the quiet; dashes just add noise. */}
        <CartesianGrid
          horizontal={!isBar}
          vertical={isBar}
        />
        {isBar ? (
          <>
            <XAxis
              type="number"
              tickLine={false}
              axisLine={false}
              tickFormatter={percent ? (v) => `${Math.round(Number(v) * 100)}%` : undefined}
              label={xAxisLabel ? { value: xAxisLabel, position: "insideBottom", offset: -4 } : undefined}
            />
            <YAxis
              type="category"
              dataKey={categoryKey}
              width={72}
              tickLine={false}
              axisLine={false}
              label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: "insideLeft" } : undefined}
            />
          </>
        ) : (
          <>
            <XAxis
              dataKey={categoryKey}
              tickLine={false}
              axisLine={false}
              label={xAxisLabel ? { value: xAxisLabel, position: "insideBottom", offset: -4 } : undefined}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={40}
              tickFormatter={percent ? (v) => `${Math.round(Number(v) * 100)}%` : undefined}
              label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: "insideLeft" } : undefined}
            />
          </>
        )}
        <Tooltip
          content={
            <ChartTooltip
              showTotal={stacked && !percent}
              valueFormatter={
                percent
                  ? (n) => `${Math.round(n * 100)}%`
                  : valueFormatter
              }
            />
          }
        />
        {showLegend ? (
          <Legend
            iconType="circle"
            formatter={legendLabel}
            {...hover.legendHandlers}
          />
        ) : null}
        {validSeries.map((key, i) => (
          <Bar
            key={key}
            dataKey={key}
            stackId={stacked ? `stack-${groupFor(key)}` : undefined}
            fill={`url(#bar-${uid}-${i})`}
            fillOpacity={hover.opacityFor(key)}
            radius={
              stacked
                ? [...BAR_RADIUS_STACKED]
                : isBar
                  ? [...BAR_RADIUS_BAR]
                  : [...BAR_RADIUS_COLUMN]
            }
            maxBarSize={MAX_BAR_SIZE}
            // Keeps a dense cluster from collapsing into hairlines.
            minPointSize={1}
            shape={
              dimensional
                ? (props: unknown) => (
                    <DimensionalBarShape
                      {...(props as ShapeProps)}
                      horizontal={isBar}
                      cylinder={cylinder}
                    />
                  )
                : undefined
            }
            {...anim}
            {...hover.bind(key)}
          />
        ))}
      </BarChart>
    </ChartResponsiveContainer>
  );
}
