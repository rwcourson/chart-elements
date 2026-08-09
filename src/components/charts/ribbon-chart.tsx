"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CHART_COLORS } from "@/lib/chart-colors";
import { useChartAnimation, useSeriesHover } from "@/lib/chart-motion";
import { ChartTooltip, legendLabel } from "./chart-tooltip";

/** Rank-flow style ribbon using stacked areas (Power BI ribbon analogue). */
export function RibbonChart({
  data,
  categoryKey = "name",
  seriesKeys,
}: {
  data: Record<string, string | number>[];
  categoryKey?: string;
  seriesKeys: string[];
}) {
  const anim = useChartAnimation();
  const hover = useSeriesHover();

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 12, right: 16, left: 4, bottom: 8 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey={categoryKey} tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} width={40} />
        <Tooltip content={<ChartTooltip showTotal />} />
        <Legend
          iconType="circle"
          formatter={legendLabel}
          {...hover.legendHandlers}
        />
        {seriesKeys.map((key, i) => (
          <Area
            key={key}
            type="monotone"
            dataKey={key}
            stackId="ribbon"
            stroke={CHART_COLORS[i % CHART_COLORS.length]}
            strokeWidth={2.25}
            strokeLinecap="round"
            strokeOpacity={hover.opacityFor(key)}
            fill={CHART_COLORS[i % CHART_COLORS.length]}
            fillOpacity={0.55 * hover.opacityFor(key)}
            activeDot={{ r: 4, strokeWidth: 0 }}
            {...anim}
            {...hover.bind(key)}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}
