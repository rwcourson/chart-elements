"use client";

import * as React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CHART_COLORS } from "@/lib/chart-colors";
import { useChartAnimation, useSeriesHover } from "@/lib/chart-motion";
import { ChartTooltip, legendLabel } from "./chart-tooltip";

export type LineAreaVariant =
  | "line"
  | "area"
  | "stacked-area"
  | "percent-area"
  | "step"
  | "spline";

type Row = Record<string, string | number>;

function toPercent(data: Row[], keys: string[]): Row[] {
  return data.map((row) => {
    const total = keys.reduce((s, k) => s + Number(row[k] ?? 0), 0) || 1;
    const next: Row = { ...row };
    keys.forEach((k) => {
      next[k] = Number(row[k] ?? 0) / total;
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
}: {
  data: Row[];
  categoryKey?: string;
  seriesKeys: string[];
  variant?: LineAreaVariant;
  showLegend?: boolean;
}) {
  const percent = variant === "percent-area";
  const stacked = variant === "stacked-area" || percent;
  const chartData = percent ? toPercent(data, seriesKeys) : data;
  const isArea = variant.includes("area");
  const type =
    variant === "step" ? "stepAfter" : variant === "spline" ? "monotone" : "monotone";

  const anim = useChartAnimation();
  const hover = useSeriesHover();
  const uid = React.useId().replace(/[^a-zA-Z0-9]/g, "");

  if (isArea) {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 12, right: 16, left: 4, bottom: 8 }}>
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
          <XAxis dataKey={categoryKey} tickLine={false} axisLine={false} />
          <YAxis
            tickLine={false}
            axisLine={false}
            width={40}
            tickFormatter={percent ? (v) => `${Math.round(Number(v) * 100)}%` : undefined}
          />
          <Tooltip content={<ChartTooltip showTotal={stacked && !percent} />} />
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
              type="monotone"
              dataKey={key}
              stackId={stacked ? "1" : undefined}
              stroke={CHART_COLORS[i % CHART_COLORS.length]}
              strokeWidth={2.25}
              strokeLinecap="round"
              strokeOpacity={hover.opacityFor(key)}
              fill={`url(#area-${uid}-${i})`}
              fillOpacity={hover.opacityFor(key)}
              activeDot={{ r: 4, strokeWidth: 0 }}
              {...anim}
              {...hover.bind(key)}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData} margin={{ top: 12, right: 16, left: 4, bottom: 8 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey={categoryKey} tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} width={40} />
        <Tooltip content={<ChartTooltip />} />
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
            strokeWidth={2.25}
            strokeLinecap="round"
            strokeOpacity={hover.opacityFor(key)}
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0 }}
            {...anim}
            {...hover.bind(key)}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
