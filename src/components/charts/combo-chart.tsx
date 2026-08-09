"use client";

import * as React from "react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CHART_COLORS } from "@/lib/chart-colors";
import { useChartAnimation, useSeriesHover } from "@/lib/chart-motion";
import { ChartTooltip, legendLabel } from "./chart-tooltip";

export type ComboVariant =
  | "line-clustered-column"
  | "line-stacked-column"
  | "dual-axis";

type Row = Record<string, string | number>;

export function ComboChart({
  data,
  categoryKey = "name",
  barKeys,
  lineKeys,
  variant = "line-clustered-column",
}: {
  data: Row[];
  categoryKey?: string;
  barKeys: string[];
  lineKeys: string[];
  variant?: ComboVariant;
}) {
  const stacked = variant === "line-stacked-column";
  const dual = variant === "dual-axis";

  const anim = useChartAnimation();
  const hover = useSeriesHover();
  const uid = React.useId().replace(/[^a-zA-Z0-9]/g, "");

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data} margin={{ top: 12, right: dual ? 20 : 16, left: 4, bottom: 8 }}>
        <defs>
          {barKeys.map((key, i) => (
            // Same soft top-light fade as BarColumnChart.
            <linearGradient key={key} id={`combo-${uid}-${i}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={CHART_COLORS[i % CHART_COLORS.length]} stopOpacity={1} />
              <stop offset="100%" stopColor={CHART_COLORS[i % CHART_COLORS.length]} stopOpacity={0.82} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid vertical={false} />
        <XAxis dataKey={categoryKey} tickLine={false} axisLine={false} />
        <YAxis yAxisId="left" tickLine={false} axisLine={false} width={40} />
        {dual ? (
          <YAxis yAxisId="right" orientation="right" tickLine={false} axisLine={false} width={40} />
        ) : null}
        <Tooltip content={<ChartTooltip showTotal={stacked} />} />
        <Legend
          iconType="circle"
          formatter={legendLabel}
          {...hover.legendHandlers}
        />
        {barKeys.map((key, i) => (
          <Bar
            key={key}
            yAxisId="left"
            dataKey={key}
            stackId={stacked ? "bars" : undefined}
            fill={`url(#combo-${uid}-${i})`}
            fillOpacity={hover.opacityFor(key)}
            radius={stacked ? [0, 0, 0, 0] : [4, 4, 0, 0]}
            maxBarSize={32}
            {...anim}
            {...hover.bind(key)}
          />
        ))}
        {lineKeys.map((key, i) => (
          <Line
            key={key}
            yAxisId={dual ? "right" : "left"}
            type="monotone"
            dataKey={key}
            stroke={CHART_COLORS[(barKeys.length + i) % CHART_COLORS.length]}
            strokeWidth={2.25}
            strokeLinecap="round"
            strokeOpacity={hover.opacityFor(key)}
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0 }}
            {...anim}
            {...hover.bind(key)}
          />
        ))}
      </ComposedChart>
    </ResponsiveContainer>
  );
}
