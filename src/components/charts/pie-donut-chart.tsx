"use client";

import * as React from "react";
import {
  Cell,
  Pie,
  PieChart,
  Sector,
  Tooltip} from "recharts";
import { ChartResponsiveContainer } from "./chart-responsive";
import type { Props as SectorProps } from "recharts/types/shape/Sector";
import { colorAt, SEMANTIC } from "@/lib/chart-colors";
import { CHART_TOOLTIP_CLASS } from "@/lib/chart-marks";
import { useChartAnimation } from "@/lib/chart-motion";
import { ChartEmpty } from "./chart-frame";

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
    // Labels live in a higher z-index layer; never intercept wedge hits.
    <g style={{ pointerEvents: "none" }}>
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
        <tspan fill="var(--muted-foreground)">
          {" "}
          {Math.round(payload.share * 100)}%
        </tspan>
      </text>
    </g>
  );
}

/**
 * Hover isolation via Recharts activeIndex (tooltip state), not CSS :hover.
 * CSS :hover fails as soon as the HTML tooltip sits under the cursor; the
 * library already tracks which sector is active for the tooltip, so dimming
 * follows that same signal.
 */
function ActiveSector(props: SectorProps) {
  return (
    <Sector
      {...props}
      stroke="var(--card)"
      strokeWidth={2}
      fillOpacity={1}
      style={{ outline: "none", cursor: "pointer", ...props.style }}
    />
  );
}

function InactiveSector(props: SectorProps) {
  return (
    <Sector
      {...props}
      stroke="var(--card)"
      strokeWidth={2}
      fillOpacity={0.34}
      style={{ outline: "none", cursor: "pointer", ...props.style }}
    />
  );
}

/** Pie/donut tooltip: always show share %, matching callout labels. */
function PieTooltip(props: {
  active?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Recharts tooltip payload is a deep union; narrow at runtime.
  payload?: readonly any[];
}) {
  const { active, payload } = props;
  if (!active || !payload?.length) return null;
  const item = payload[0] as {
    name?: string | number;
    value?: number | string | readonly (string | number)[];
    color?: string;
    payload?: Slice | Record<string, unknown>;
  };
  if (!item) return null;
  const raw = item.payload;
  const slice =
    raw && typeof raw === "object" && "share" in raw
      ? (raw as Slice)
      : undefined;
  const name = String(slice?.name ?? item.name ?? "");
  const numericValue =
    typeof item.value === "number"
      ? item.value
      : Array.isArray(item.value)
        ? Number(item.value[0])
        : Number(item.value);
  const sharePct =
    slice && Number.isFinite(slice.share)
      ? Math.round(slice.share * 100)
      : Number.isFinite(numericValue)
        ? Math.round(numericValue)
        : null;
  const display = sharePct != null ? `${sharePct}%` : String(item.value ?? "");
  const color = slice?.color ?? item.color;
  const announcement = `${name}: ${display}`;

  return (
    <div
      className={CHART_TOOLTIP_CLASS}
      role="status"
      aria-live="polite"
      aria-atomic="true"
      aria-label={announcement}
    >
      <div className="flex items-baseline gap-2 text-xs">
        <span
          aria-hidden="true"
          className="h-2 w-2 shrink-0 translate-y-px rounded-full"
          style={{ background: color }}
        />
        <span className="text-muted-foreground">{name}</span>
        <span className="ml-auto pl-4 font-semibold tabular-nums">{display}</span>
      </div>
    </div>
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
  maxSlices = 8}: {
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
        value: Number(d[valueKey] ?? 0)}))
      // Descending, so the eye reads the wedges in rank order from 12 o'clock
      // and the thin tail collects together instead of being scattered.
      .sort((a, b) => b.value - a.value);

    const kept = rows.slice(0, maxSlices);
    const tail = rows.slice(maxSlices);
    if (tail.length) {
      kept.push({
        name: "Others",
        value: tail.reduce((sum, r) => sum + r.value, 0)});
    }

    const total = kept.reduce((sum, r) => sum + r.value, 0) || 1;
    return kept.map((r, i) => ({
      ...r,
      share: r.value / total,
      color:
        tail.length && i === kept.length - 1 ? SEMANTIC.neutral : colorAt(i)}));
  }, [data, nameKey, valueKey, maxSlices]);

  const withLegend = showLegend ?? !showLabels;
  const anim = useChartAnimation();

  if (!slices.length || slices.every((s) => s.value <= 0)) {
    return <ChartEmpty label="No valid slices" />;
  }

  return (
    <div className="flex h-full w-full flex-col">
      {/*
        Plot owns its own box so the pie is centred; donut inner label is an
        overlay. Hover isolation uses activeShape/inactiveShape (tooltip
        activeIndex) — not CSS :hover, which loses to the HTML tooltip layer.
      */}
      <div className="ce-pie relative min-h-0 flex-1">
        <ChartResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              // Render-prop form so Recharts always injects active/payload.
              content={(tooltipProps) => (
                <PieTooltip
                  active={tooltipProps.active}
                  payload={tooltipProps.payload}
                />
              )}
              // Keep the panel out of the hit-test path so wedges stay active.
              wrapperStyle={{ pointerEvents: "none" }}
            />
            <Pie
              data={slices}
              dataKey="value"
              nameKey="name"
              // 12 o'clock, clockwise — conventional reading order for a ranked pie.
              startAngle={90}
              endAngle={-270}
              innerRadius={variant === "donut" ? "56%" : 0}
              // Gutter for callouts; without it labels clip at the SVG edge.
              outerRadius={showLabels ? "70%" : "82%"}
              paddingAngle={0}
              stroke="var(--card)"
              strokeWidth={2}
              {...anim}
              // Dim siblings while a sector is the tooltip target. Uses library
              // activeIndex, not pointer :hover — survives tooltip mounting.
              activeShape={ActiveSector}
              inactiveShape={InactiveSector}
              label={showLabels ? (Callout as never) : false}
              labelLine={false}
            >
              {slices.map((s) => (
                <Cell key={s.name} fill={s.color} />
              ))}
            </Pie>
          </PieChart>
        </ChartResponsiveContainer>
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
