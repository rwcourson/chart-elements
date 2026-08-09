"use client";

import {
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { CHART_COLORS } from "@/lib/chart-colors";
import { useChartAnimation, useSeriesHover } from "@/lib/chart-motion";
import { ChartTooltip } from "./chart-tooltip";

export function ScatterBubbleChart({
  data,
  variant = "scatter",
  xKey = "x",
  yKey = "y",
  zKey = "z",
  categoryKey = "category",
}: {
  data: Record<string, string | number>[];
  variant?: "scatter" | "bubble" | "dot-plot";
  xKey?: string;
  yKey?: string;
  zKey?: string;
  categoryKey?: string;
}) {
  const categories = [...new Set(data.map((d) => String(d[categoryKey] ?? "")))];
  const range =
    variant === "bubble" ? [40, 400] : variant === "dot-plot" ? [40, 40] : [60, 60];

  const anim = useChartAnimation();
  const hover = useSeriesHover();

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart margin={{ top: 12, right: 16, left: 4, bottom: 8 }}>
        <CartesianGrid />
        <XAxis type="number" dataKey={xKey} tickLine={false} axisLine={false} name={xKey} />
        <YAxis type="number" dataKey={yKey} tickLine={false} axisLine={false} name={yKey} width={40} />
        <ZAxis type="number" dataKey={zKey} range={range as [number, number]} />
        <Tooltip cursor={{ strokeDasharray: "3 3" }} content={<ChartTooltip />} />
        <Scatter data={data} fill={CHART_COLORS[0]} {...anim}>
          {data.map((entry, i) => {
            const cat = String(entry[categoryKey] ?? "");
            const idx = Math.max(0, categories.indexOf(cat));
            return (
              <Cell
                key={i}
                fill={CHART_COLORS[idx % CHART_COLORS.length]}
                fillOpacity={hover.opacityFor(cat)}
                {...hover.bind(cat)}
              />
            );
          })}
        </Scatter>
      </ScatterChart>
    </ResponsiveContainer>
  );
}
