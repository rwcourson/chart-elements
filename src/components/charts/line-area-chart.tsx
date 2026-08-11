"use client";

import * as React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis} from "recharts";
import { ChartResponsiveContainer } from "./chart-responsive";
import { CHART_COLORS } from "@/lib/chart-colors";
import { ACTIVE_DOT, PLOT_MARGIN, SERIES_STROKE_WIDTH } from "@/lib/chart-marks";
import { useChartAnimation, useSeriesHover } from "@/lib/chart-motion";
import { ChartEmpty } from "./chart-frame";
import { ChartTooltip, legendLabel } from "./chart-tooltip";

export type LineAreaVariant =
  | "line"
  | "area"
  | "stacked-area"
  | "percent-area"
  | "spline-area"
  | "step"
  | "spline";

export type LineAreaDatum = Record<string, string | number | null | undefined>;

export type LineAreaChartProps = {
  data: LineAreaDatum[];
  categoryKey?: string;
  seriesKeys: string[];
  variant?: LineAreaVariant;
  showLegend?: boolean;
  xAxisLabel?: string;
  yAxisLabel?: string;
  valueFormatter?: (value: number) => string;
  missingValues?: "gap" | "connect" | "zero";
};

function finiteValue(value: unknown): number | null {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function toPercent(data: LineAreaDatum[], keys: string[]): LineAreaDatum[] {
  return data.map((row) => {
    // A 100% stack is undefined for signed values. Treat negatives and invalid
    // values as absent rather than producing reversed or infinite shares.
    const values = keys.map((key) => Math.max(0, finiteValue(row[key]) ?? 0));
    const total = values.reduce((sum, value) => sum + value, 0);
    const next: LineAreaDatum = { ...row };
    keys.forEach((k) => {
      const value = values[keys.indexOf(k)];
      next[k] = total > 0 ? value / total : 0;
    });
    return next;
  });
}

export function LineAreaChart({
  data,
  categoryKey = "date",
  seriesKeys,
  variant = "line",
  showLegend = true,
  xAxisLabel,
  yAxisLabel,
  valueFormatter,
  missingValues = "gap"}: LineAreaChartProps) {
  const percent = variant === "percent-area";
  const stacked = variant === "stacked-area" || percent;
  const chartData = React.useMemo(() => {
    const normalized = percent ? toPercent(data, seriesKeys) : data;
    if (missingValues !== "zero") return normalized;
    return normalized.map((row) => ({
      ...row,
      ...Object.fromEntries(
        seriesKeys.map((key) => [key, finiteValue(row[key]) ?? 0]),
      )}));
  }, [data, missingValues, percent, seriesKeys]);
  const isArea = variant.includes("area");
  const type =
    variant === "step"
      ? "stepAfter"
      : variant === "spline" || variant === "spline-area"
        ? "monotone"
        : "linear";

  const anim = useChartAnimation();
  const hover = useSeriesHover();
  const uid = React.useId().replace(/[^a-zA-Z0-9]/g, "");

  if (!chartData.length || !seriesKeys.length) return <ChartEmpty />;

  if (isArea) {
    return (
      <ChartResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ ...PLOT_MARGIN }}>
          <defs>
            {seriesKeys.map((key, i) => (
              // Three-stop fade: a hint of body near the line, then a fast fall
              // to nothing — reads more natural than one linear ramp.
              <linearGradient key={key} id={`area-${uid}-${i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={CHART_COLORS[i % CHART_COLORS.length]} stopOpacity={0.28} />
                <stop offset="55%" stopColor={CHART_COLORS[i % CHART_COLORS.length]} stopOpacity={0.1} />
                <stop offset="100%" stopColor={CHART_COLORS[i % CHART_COLORS.length]} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid vertical={false} />
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
          <Tooltip
            content={
              <ChartTooltip
                showTotal={stacked && !percent}
                valueFormatter={
                  percent
                    ? (value) => `${Math.round(value * 1000) / 10}%`
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
          {seriesKeys.map((key, i) => (
            <Area
              key={key}
              type={type}
              dataKey={key}
              stackId={stacked ? "1" : undefined}
              stroke={CHART_COLORS[i % CHART_COLORS.length]}
              strokeWidth={SERIES_STROKE_WIDTH}
              strokeLinecap="round"
              strokeOpacity={hover.opacityFor(key)}
              fill={`url(#area-${uid}-${i})`}
              fillOpacity={hover.opacityFor(key)}
              activeDot={ACTIVE_DOT}
              connectNulls={missingValues === "connect"}
              {...anim}
              {...hover.bind(key)}
            />
          ))}
        </AreaChart>
      </ChartResponsiveContainer>
    );
  }

  return (
    <ChartResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData} margin={{ ...PLOT_MARGIN }}>
        <CartesianGrid vertical={false} />
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
          label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: "insideLeft" } : undefined}
        />
        <Tooltip content={<ChartTooltip valueFormatter={valueFormatter} />} />
        {showLegend ? (
          <Legend
            iconType="circle"
            formatter={legendLabel}
            {...hover.legendHandlers}
          />
        ) : null}
        {seriesKeys.map((key, i) => (
          <Line
            key={key}
            type={type}
            dataKey={key}
            stroke={CHART_COLORS[i % CHART_COLORS.length]}
            strokeWidth={SERIES_STROKE_WIDTH}
            strokeLinecap="round"
            strokeOpacity={hover.opacityFor(key)}
            dot={false}
            activeDot={ACTIVE_DOT}
            connectNulls={missingValues === "connect"}
            {...anim}
            {...hover.bind(key)}
          />
        ))}
      </LineChart>
    </ChartResponsiveContainer>
  );
}
