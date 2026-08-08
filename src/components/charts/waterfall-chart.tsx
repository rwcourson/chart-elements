"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { SEMANTIC } from "@/lib/chart-colors";
import { ChartEmpty } from "./chart-frame";
import { ChartTooltip } from "./chart-tooltip";

export type WaterfallPoint = {
  name: string;
  value: number;
  type: "increase" | "decrease" | "total";
};

type ShapedPoint = WaterfallPoint & {
  base: number;
  display: number;
  color: string;
};

/** Pure prefix scan — no mutation after render (React Compiler safe). */
function shapeWaterfall(data: WaterfallPoint[]): ShapedPoint[] {
  return data.reduce<{ rows: ShapedPoint[]; running: number }>(
    (acc, d) => {
      if (d.type === "total") {
        acc.rows.push({
          ...d,
          base: 0,
          display: d.value,
          color: "var(--chart-1)",
        });
        return { rows: acc.rows, running: d.value };
      }
      const next = acc.running + d.value;
      acc.rows.push({
        ...d,
        base: Math.min(acc.running, next),
        display: Math.abs(d.value),
        color: d.type === "increase" ? SEMANTIC.positive : SEMANTIC.negative,
      });
      return { rows: acc.rows, running: next };
    },
    { rows: [], running: 0 },
  ).rows;
}

export function WaterfallChart({ data }: { data: WaterfallPoint[] }) {
  const shaped = shapeWaterfall(data ?? []);

  if (!shaped.length) return <ChartEmpty />;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={shaped} margin={{ top: 12, right: 16, left: 4, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} width={40} />
        <Tooltip content={<ChartTooltip />} />
        <Bar dataKey="base" stackId="w" fill="transparent" />
        <Bar dataKey="display" stackId="w" radius={[4, 4, 0, 0]} maxBarSize={40}>
          {shaped.map((entry, i) => (
            <Cell key={i} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
