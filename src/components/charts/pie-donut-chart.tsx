"use client";

import * as React from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { colorAt, SEMANTIC } from "@/lib/chart-colors";
import { useChartAnimation } from "@/lib/chart-motion";
import { ChartTooltip } from "./chart-tooltip";

const RAD = Math.PI / 180;

type Slice = { name: string; value: number; color: string; share: number };

/**
 * Callout label: a two-segment leader from the arc edge out to a horizontal
 * shelf, then the category and its share. Drawn here rather than with
 * Recharts' `labelLine`, because that positions its line from its own label
 * geometry and would not meet this text.
 */
function Callout(props: {
  cx: number;
  cy: number;
  midAngle: number;
  outerRadius: number;
  payload: Slice;
}) {
  const { cx, cy, midAngle, outerRadius, payload } = props;
  const cos = Math.cos(-midAngle * RAD);
  const sin = Math.sin(-midAngle * RAD);
  const elbow = outerRadius + 13;
  const shelf = 11;
  const toRight = cos >= 0;
  const ex = cx + elbow * cos;
  const ey = cy + elbow * sin;
  const tx = ex + (toRight ? shelf : -shelf);

  return (
    <g>
      <polyline
        points={`${cx + (outerRadius + 2) * cos},${cy + (outerRadius + 2) * sin} ${ex},${ey} ${tx},${ey}`}
        fill="none"
        stroke="var(--chart-axis)"
        strokeWidth={1}
      />
      <text
        x={tx + (toRight ? 4 : -4)}
        y={ey}
        textAnchor={toRight ? "start" : "end"}
        dominantBaseline="central"
        fill="var(--foreground)"
        fontSize={11}
        fontWeight={500}
      >
        {payload.name}
        <tspan fill="var(--muted-foreground)"> {Math.round(payload.share * 100)}%</tspan>
      </text>
    </g>
  );
}

export function PieDonutChart({
  data,
  nameKey = "name",
  valueKey = "value",
  variant = "pie",
  innerLabel,
  showLabels = true,
  showLegend,
  maxSlices = 8,
}: {
  data: Record<string, string | number>[];
  nameKey?: string;
  valueKey?: string;
  variant?: "pie" | "donut";
  innerLabel?: string;
  /** Callout labels with leader lines, naming each slice and its share. */
  showLabels?: boolean;
  /** Defaults to the opposite of `showLabels`: showing both repeats every category. */
  showLegend?: boolean;
  /** Slices beyond this are pooled into a neutral "Others" wedge. */
  maxSlices?: number;
}) {
  const slices = React.useMemo<Slice[]>(() => {
    const rows = data
      .map((d) => ({
        name: String(d[nameKey] ?? ""),
        value: Number(d[valueKey] ?? 0),
      }))
      // Descending, so the eye reads the wedges in rank order from 12 o'clock
      // and the thin tail collects together instead of being scattered.
      .sort((a, b) => b.value - a.value);

    const kept = rows.slice(0, maxSlices);
    const tail = rows.slice(maxSlices);
    if (tail.length) {
      kept.push({
        name: "Others",
        value: tail.reduce((sum, r) => sum + r.value, 0),
      });
    }

    const total = kept.reduce((sum, r) => sum + r.value, 0) || 1;
    return kept.map((r, i) => ({
      ...r,
      share: r.value / total,
      color:
        tail.length && i === kept.length - 1 ? SEMANTIC.neutral : colorAt(i),
    }));
  }, [data, nameKey, valueKey, maxSlices]);

  const withLegend = showLegend ?? !showLabels;
  const anim = useChartAnimation();

  return (
    <div className="flex h-full w-full flex-col">
      {/* The plot owns its own box so the pie is centred in it. That lets the
          donut's inner label be a plain centred overlay, and keeps the legend
          out of the SVG where its type and colour can't be styled properly. */}
      {/*
        ce-pie: hover isolation is pure CSS (globals.css). Driving it from
        React state re-runs Recharts' sector animation on every hover, and
        Recharts hides labels while animating — the callouts flickered off
        on every hover.
      */}
      <div className="ce-pie relative min-h-0 flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<ChartTooltip />} />
            <Pie
              data={slices}
              dataKey="value"
              nameKey="name"
              // 12 o'clock, clockwise — the conventional reading order for a
              // ranked pie. Recharts' default starts at 3 o'clock.
              startAngle={90}
              endAngle={-270}
              innerRadius={variant === "donut" ? "56%" : 0}
              // Leaves a gutter wide enough for the callouts; without it the
              // labels render outside the SVG viewport and are clipped.
              outerRadius={showLabels ? "70%" : "82%"}
              // No paddingAngle wedge: the card-coloured stroke already draws
              // a clean straight divider between slices.
              paddingAngle={0}
              stroke="var(--card)"
              strokeWidth={2}
              {...anim}
              label={showLabels ? (Callout as never) : false}
              labelLine={false}
            >
              {slices.map((s) => (
                <Cell key={s.name} fill={s.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        {variant === "donut" && innerLabel ? (
          <div className="pointer-events-none absolute inset-0 grid place-items-center">
            <span className="tabular text-sm font-semibold text-foreground">
              {innerLabel}
            </span>
          </div>
        ) : null}
      </div>
      {withLegend ? (
        <ul className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5">
          {slices.map((s) => (
            <li
              key={s.name}
              className="flex items-center gap-1.5 text-[12px] leading-none text-muted-foreground"
            >
              <span
                aria-hidden="true"
                className="size-2.5 shrink-0 rounded-full"
                style={{ background: s.color }}
              />
              {s.name}
              <span className="tabular">{Math.round(s.share * 100)}%</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
