"use client";

import { ResponsiveContainer, Tooltip, Treemap } from "recharts";
import { CHART_COLORS } from "@/lib/chart-colors";
import {
  useChartAnimation,
  useSeriesHover,
  type SeriesHover,
} from "@/lib/chart-motion";
import { formatCompact } from "@/lib/utils";
import { ChartTooltip } from "./chart-tooltip";

type Node = { name: string; size?: number; children?: Node[] };

/**
 * Leaves in draw order, each with its own palette slot. Colouring by
 * `parentIndex + childIndex` gave different tiles the same fill — with the
 * sample data, Software matched Americas and Services matched EMEA — which in a
 * treemap reads as a claim that the two are related.
 */
function flatten(nodes: Node[]): { name: string; size: number; fill: string }[] {
  const out: { name: string; size: number; fill: string }[] = [];
  const push = (name: string, size?: number) =>
    out.push({
      name,
      size: size ?? 1,
      fill: CHART_COLORS[out.length % CHART_COLORS.length]!,
    });

  for (const n of nodes) {
    if (n.children?.length) for (const c of n.children) push(c.name, c.size);
    else push(n.name, n.size);
  }
  return out;
}

function Content(props: {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  name?: string;
  size?: number;
  fill?: string;
  hover?: SeriesHover;
}) {
  const { x = 0, y = 0, width = 0, height = 0, name, size, fill, hover } = props;
  // Hover isolation is per leaf name, like the waterfall's per-category bind.
  const nodeKey = String(name ?? "");
  const tile = (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      fill={fill}
      fillOpacity={hover?.opacityFor(nodeKey)}
      rx={4}
      stroke="var(--card)"
      strokeWidth={2}
    />
  );

  if (width < 40 || height < 28) return <g {...hover?.bind(nodeKey)}>{tile}</g>;

  // A tile is only worth a value if the label above it has somewhere to sit.
  const showValue = size != null && width >= 64 && height >= 44;

  return (
    <g {...hover?.bind(nodeKey)}>
      {tile}
      {/*
        stroke="none" is load-bearing: the surrounding Recharts layer carries the
        tile stroke, and SVG text inherits it, which outlined every glyph and
        made the labels read as heavy and fuzzy.
      */}
      <text
        x={x + 9}
        y={y + 17}
        fill="var(--chart-label)"
        fontSize={11}
        fontWeight={500}
        stroke="none"
      >
        {name}
      </text>
      {showValue ? (
        <text
          x={x + 9}
          y={y + 33}
          fill="var(--chart-label)"
          fillOpacity={0.72}
          fontSize={12}
          fontWeight={600}
          stroke="none"
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          {formatCompact(size)}
        </text>
      ) : null}
    </g>
  );
}

/**
 * Recharts gives a treemap's tooltip the node under `payload` but no `color`,
 * so the shared tooltip's swatch would render empty. This lifts the tile's own
 * fill onto the item.
 */
function TreemapTooltip(props: {
  active?: boolean;
  payload?: { name?: string; value?: number; payload?: Record<string, unknown> }[];
}) {
  const items = props.payload?.map((item) => ({
    ...item,
    name: String(item.payload?.name ?? item.name ?? ""),
    color: String(item.payload?.fill ?? ""),
  }));
  return <ChartTooltip active={props.active} payload={items} />;
}

export function TreemapChart({ data }: { data: Node[] }) {
  const flat = flatten(data);
  const anim = useChartAnimation();
  const hover = useSeriesHover();
  return (
    <ResponsiveContainer width="100%" height="100%">
      <Treemap
        data={flat}
        dataKey="size"
        content={<Content hover={hover} />}
        {...anim}
      >
        {/* Values are on the tiles now, so this only really serves the tiles too
            small to carry text. The default tooltip rendered near-black text on
            the dark panel; the shared one is themed. */}
        <Tooltip content={<TreemapTooltip />} />
      </Treemap>
    </ResponsiveContainer>
  );
}
