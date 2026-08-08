"use client";

import * as React from "react";
import * as d3 from "d3";
import { CHART_COLORS, colorAt } from "@/lib/chart-colors";
import { sankeyLinks, sankeyNodes } from "@/lib/sample-data";
import { cn } from "@/lib/utils";

function Shell({ children, className }: { children: React.ReactNode; className?: string }) {
  // focusable=false keeps WebKit from parking a rectangular focus ring on the
  // SVG that then gets squared off by the chart-surface overflow clip — the
  // same "selection box cut off" look that showed up on the leftmost tree node.
  return (
    <div className={cn("h-full w-full", className)} data-chart-svg="">
      {children}
    </div>
  );
}

/**
 * Distance from a node's center to its border along the direction `(ux, uy)`.
 * Used to park connectors on the box edge instead of running them through the
 * label — center-to-center links read as a strike-through on every node.
 */
function rectEdge(
  halfW: number,
  halfH: number,
  ux: number,
  uy: number,
) {
  return 1 / Math.hypot(ux / halfW || 0, uy / halfH || 0);
}

type TreeDatum = { name: string; children?: TreeDatum[] };

const defaultTree: TreeDatum = {
  name: "CEO",
  children: [
    {
      name: "Engineering",
      children: [{ name: "Platform" }, { name: "Product" }],
    },
    {
      name: "Sales",
      children: [{ name: "Enterprise" }, { name: "SMB" }],
    },
    { name: "Marketing" },
  ],
};

const defaultFlow = [
  { id: "start", label: "Start", x: 8, y: 45 },
  { id: "review", label: "Review", x: 35, y: 20 },
  { id: "build", label: "Build", x: 35, y: 70 },
  { id: "ship", label: "Ship", x: 72, y: 45 },
];

const defaultJourney = [
  { stage: "Awareness", score: 82 },
  { stage: "Consider", score: 68 },
  { stage: "Trial", score: 54 },
  { stage: "Purchase", score: 42 },
  { stage: "Retain", score: 76 },
];

const defaultNetworkNodes = [
  { id: "n1", group: 1 },
  { id: "n2", group: 1 },
  { id: "n3", group: 2 },
  { id: "n4", group: 2 },
  { id: "n5", group: 3 },
];

const defaultNetworkLinks = [
  { source: "n1", target: "n2" },
  { source: "n2", target: "n3" },
  { source: "n3", target: "n4" },
  { source: "n4", target: "n5" },
  { source: "n1", target: "n5" },
];

function layoutSankey(
  nodes: { name: string }[],
  links: { source: number; target: number; value: number }[],
  width = 400,
  height = 220,
) {
  const nodeWidth = 10;
  const cols = [0.15, 0.5, 0.85];
  const colOf = (i: number) => (i < 3 ? 0 : i < 5 ? 1 : 2);
  const byCol = [0, 0, 0];
  const laid = nodes.map((n, i) => {
    const col = colOf(i);
    const y = 24 + byCol[col] * 48;
    byCol[col] += 1;
    return { ...n, x: cols[col]! * width - nodeWidth / 2, y, w: nodeWidth, h: 36, i };
  });
  const nodeLinks = links.map((l) => ({
    ...l,
    sy: laid[l.source]!.y + laid[l.source]!.h / 2,
    ty: laid[l.target]!.y + laid[l.target]!.h / 2,
    sx: laid[l.source]!.x + nodeWidth,
    tx: laid[l.target]!.x,
  }));
  return { nodes: laid, links: nodeLinks, width, height };
}

function TreeSvg({ rootData = defaultTree, variant = "tree" }: { rootData?: TreeDatum; variant?: "tree" | "decision" }) {
  const width = 400;
  const height = 240;
  // One footprint for every node — decision/tree/org all share this so a short
  // "CEO" and a long "Engineering" read as the same chip.
  const nodeW = 88;
  const nodeH = 28;
  const vGap = 16;
  const hGap = 44;
  const pad = 16;
  // nodeSize locks center-to-center spacing in data units so siblings never
  // collapse under each other the way `.size()` did when cousin separation
  // stole vertical room from Sales/Marketing. We then scale the whole layout
  // into the padded viewBox — and keep scale ≥ the floor that preserves a
  // clear gap between chip edges.
  const root = d3
    .tree<TreeDatum>()
    .nodeSize([nodeH + vGap, nodeW + hGap])
    .separation(() => 1)(d3.hierarchy<TreeDatum>(rootData));
  const nodes = root.descendants();
  const links = root.links();

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (const n of nodes) {
    if (n.x < minX) minX = n.x;
    if (n.x > maxX) maxX = n.x;
    if (n.y < minY) minY = n.y;
    if (n.y > maxY) maxY = n.y;
  }
  const spanX = Math.max(maxX - minX, 1);
  const spanY = Math.max(maxY - minY, 1);
  const innerW = width - pad * 2 - nodeW;
  const innerH = height - pad * 2 - nodeH;
  // Never compress below 1: shrinking would put 28px chips closer than vGap.
  // Extra room letterboxes via centering instead.
  const scale = Math.min(1, innerW / spanY, innerH / spanX);
  const usedW = spanY * scale + nodeW;
  const usedH = spanX * scale + nodeH;
  const ox = (width - usedW) / 2 + nodeW / 2;
  const oy = (height - usedH) / 2 + nodeH / 2;
  const px = (n: d3.HierarchyPointNode<TreeDatum>) => (n.y - minY) * scale + ox;
  const py = (n: d3.HierarchyPointNode<TreeDatum>) => (n.x - minX) * scale + oy;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-full w-full"
      preserveAspectRatio="xMidYMid meet"
      focusable="false"
      tabIndex={-1}
    >
      {links.map((l, i) => {
        // Horizontal tree: park the curve on the parent's right edge and the
        // child's left edge. Center-to-center drew a strike-through across every
        // label.
        const sx = px(l.source) + nodeW / 2;
        const sy = py(l.source);
        const tx = px(l.target) - nodeW / 2;
        const ty = py(l.target);
        const mx = (sx + tx) / 2;
        return (
          <path
            key={i}
            d={`M${sx},${sy}C${mx},${sy} ${mx},${ty} ${tx},${ty}`}
            fill="none"
            stroke="var(--chart-axis)"
            strokeWidth={1}
          />
        );
      })}
      {nodes.map((d, i) => (
        <g key={i} transform={`translate(${px(d)},${py(d)})`}>
          <rect
            x={-nodeW / 2}
            y={-nodeH / 2}
            width={nodeW}
            height={nodeH}
            rx={variant === "decision" ? nodeH / 2 : 6}
            fill={colorAt(i)}
            fillOpacity={0.2}
            stroke={colorAt(i)}
            strokeWidth={1.25}
          />
          {/* Node fill is a 20% tint, so it stays light in the light theme and
              dark in the dark theme — foreground ink reads on both. Axis ink
              was failing WCAG here at roughly 2:1. */}
          <text
            textAnchor="middle"
            dominantBaseline="central"
            fill="var(--foreground)"
            fontSize={10}
            fontWeight={500}
          >
            {d.data.name}
          </text>
        </g>
      ))}
    </svg>
  );
}

export function SankeyDiagram({
  nodes = sankeyNodes,
  links = sankeyLinks,
}: {
  nodes?: typeof sankeyNodes;
  links?: typeof sankeyLinks;
}) {
  const { nodes: laid, links: laidLinks, width, height } = layoutSankey(nodes, links);

  return (
    <Shell>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full" preserveAspectRatio="xMidYMid meet">
        {laidLinks.map((l, i) => {
          const path = `M${l.sx},${l.sy}C${l.sx + 40},${l.sy} ${l.tx - 40},${l.ty} ${l.tx},${l.ty}`;
          return (
            <path key={i} d={path} fill="none" stroke={colorAt(i)} strokeOpacity={0.35} strokeWidth={l.value / 3} />
          );
        })}
        {laid.map((n, i) => (
          <rect key={n.name} x={n.x} y={n.y} width={n.w} height={n.h} fill={colorAt(i)} rx={2} />
        ))}
      </svg>
    </Shell>
  );
}

export function AlluvialDiagram({
  nodes = sankeyNodes,
  links = sankeyLinks,
}: {
  nodes?: typeof sankeyNodes;
  links?: typeof sankeyLinks;
}) {
  const width = 400;
  const height = 220;
  const streams = links.map((l, i) => {
    const y0 = 30 + l.source * 22;
    const y1 = 30 + l.target * 22;
    return { y0, y1, value: l.value, i };
  });

  return (
    <Shell>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full" preserveAspectRatio="xMidYMid meet">
        {streams.map((s) => (
          <path
            key={s.i}
            d={`M60,${s.y0}C180,${s.y0} 220,${s.y1} 340,${s.y1}`}
            fill="none"
            stroke={colorAt(s.i)}
            strokeOpacity={0.45}
            strokeWidth={s.value / 2.5}
          />
        ))}
        {nodes.map((n, i) => (
          <text key={n.name} x={i < 3 ? 8 : 352} y={30 + i * 22} className="fill-[var(--chart-axis)] text-[9px]">{n.name}</text>
        ))}
      </svg>
    </Shell>
  );
}

export function ChordDiagram() {
  const width = 400;
  const height = 220;
  const outer = 80;
  const cx = width / 2;
  const cy = height / 2 + 10;
  const names = ["A", "B", "C", "D", "E"];
  const n = names.length;
  const angle = (2 * Math.PI) / n;

  return (
    <Shell>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full" preserveAspectRatio="xMidYMid meet">
        <g transform={`translate(${cx},${cy})`}>
          {names.map((name, i) => {
            const a0 = i * angle - Math.PI / 2;
            const a1 = a0 + angle * 0.85;
            const x0 = Math.cos(a0) * outer;
            const y0 = Math.sin(a0) * outer;
            const x1 = Math.cos(a1) * outer;
            const y1 = Math.sin(a1) * outer;
            const large = angle > Math.PI ? 1 : 0;
            return (
              <path
                key={name}
                d={`M${x0},${y0}A${outer},${outer},0,${large},1,${x1},${y1}L${Math.cos(a1) * (outer - 14)},${Math.sin(a1) * (outer - 14)}A${outer - 14},${outer - 14},0,${large},0,${Math.cos(a0) * (outer - 14)},${Math.sin(a0) * (outer - 14)}Z`}
                fill={colorAt(i)}
                fillOpacity={0.65}
                stroke="var(--background)"
              />
            );
          })}
          {names.flatMap((_, i) =>
            names.map((_, j) => {
              if (i === j) return null;
              const si = i * angle - Math.PI / 2 + angle / 2;
              const sj = j * angle - Math.PI / 2 + angle / 2;
              const r = outer - 14;
              return (
                <path
                  key={`${i}-${j}`}
                  d={`M${Math.cos(si) * r},${Math.sin(si) * r}Q0,0 ${Math.cos(sj) * r},${Math.sin(sj) * r}`}
                  fill="none"
                  stroke={colorAt(i)}
                  strokeOpacity={0.2}
                  strokeWidth={1}
                />
              );
            }),
          )}
        </g>
      </svg>
    </Shell>
  );
}

export function NetworkDiagram({
  nodes = defaultNetworkNodes,
  links = defaultNetworkLinks,
}: {
  nodes?: typeof defaultNetworkNodes;
  links?: typeof defaultNetworkLinks;
}) {
  return <ForceDirectedNetwork nodes={nodes} links={links} staticLayout />;
}

type SimNode = d3.SimulationNodeDatum & { id: string; group: number; x: number; y: number };

export function ForceDirectedNetwork({
  nodes = defaultNetworkNodes,
  links = defaultNetworkLinks,
  staticLayout = false,
}: {
  nodes?: typeof defaultNetworkNodes;
  links?: typeof defaultNetworkLinks;
  staticLayout?: boolean;
}) {
  const width = 400;
  const height = 220;

  const layout = React.useMemo(() => {
    const simNodes: SimNode[] = nodes.map((n, i) => ({
      id: n.id,
      group: n.group,
      x: 60 + (i % 3) * 110,
      y: 40 + Math.floor(i / 3) * 70,
    }));
    if (staticLayout) return simNodes;

    const simLinks = links.map((l) => ({ source: l.source, target: l.target }));
    const sim = d3
      .forceSimulation(simNodes)
      .force(
        "link",
        d3.forceLink(simLinks).id((d) => (d as SimNode).id).distance(70),
      )
      .force("charge", d3.forceManyBody().strength(-120))
      .force("center", d3.forceCenter(width / 2, height / 2));
    for (let i = 0; i < 80; i++) sim.tick();
    sim.stop();
    return simNodes;
  }, [staticLayout, nodes, links]);

  const pos = new Map(layout.map((n) => [n.id, n]));

  const r = 12;

  return (
    <Shell>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-full w-full"
        preserveAspectRatio="xMidYMid meet"
        focusable="false"
      >
        {links.map((l, i) => {
          const s = pos.get(l.source)!;
          const t = pos.get(l.target)!;
          const dx = t.x - s.x;
          const dy = t.y - s.y;
          const len = Math.hypot(dx, dy) || 1;
          const ux = dx / len;
          const uy = dy / len;
          // Stop on the circumference so the chord doesn't punch through the
          // filled node (same bug the tree charts had with rectangular chips).
          return (
            <line
              key={i}
              x1={s.x + ux * r}
              y1={s.y + uy * r}
              x2={t.x - ux * r}
              y2={t.y - uy * r}
              stroke="var(--chart-axis)"
              strokeWidth={1.25}
            />
          );
        })}
        {layout.map((n) => (
          <circle
            key={n.id}
            cx={n.x}
            cy={n.y}
            r={r}
            fill={colorAt(n.group)}
            fillOpacity={0.85}
            stroke={colorAt(n.group)}
            strokeWidth={1.25}
          />
        ))}
      </svg>
    </Shell>
  );
}

export function DependencyGraph() {
  const width = 400;
  const height = 220;
  // Fixed footprint so short labels ("api") and longer ones ("worker") share
  // one node size — sizing to content made the graph look uneven.
  const nodeW = 72;
  const nodeH = 28;
  const halfW = nodeW / 2;
  const halfH = nodeH / 2;
  const nodes = [
    { id: "api", x: 70, y: 48 },
    { id: "auth", x: 200, y: 40 },
    { id: "db", x: 330, y: 48 },
    { id: "cache", x: 130, y: 140 },
    { id: "worker", x: 270, y: 140 },
  ];
  const links = [
    { s: "api", t: "auth" },
    { s: "api", t: "cache" },
    { s: "auth", t: "db" },
    { s: "cache", t: "worker" },
    { s: "worker", t: "db" },
  ];
  const map = new Map(nodes.map((n) => [n.id, n]));
  // Unique per mount: multiple dependency graphs on one page would otherwise
  // share one marker id and steal each other's arrowheads.
  const markerId = React.useId().replace(/:/g, "");

  return (
    <Shell>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-full w-full"
        preserveAspectRatio="xMidYMid meet"
        focusable="false"
      >
        <defs>
          <marker
            id={markerId}
            markerWidth="7"
            markerHeight="7"
            refX="6"
            refY="3.5"
            orient="auto"
          >
            <path d="M0,0L7,3.5L0,7Z" fill="var(--chart-axis)" />
          </marker>
        </defs>
        {links.map((l, i) => {
          const s = map.get(l.s)!;
          const t = map.get(l.t)!;
          const dx = t.x - s.x;
          const dy = t.y - s.y;
          const len = Math.hypot(dx, dy) || 1;
          const ux = dx / len;
          const uy = dy / len;
          const from = rectEdge(halfW, halfH, ux, uy) + 1;
          // Extra trim on the tip so the arrowhead sits on the border instead
          // of burying itself in the fill.
          const to = rectEdge(halfW, halfH, -ux, -uy) + 8;
          return (
            <line
              key={i}
              x1={s.x + ux * from}
              y1={s.y + uy * from}
              x2={t.x - ux * to}
              y2={t.y - uy * to}
              stroke="var(--chart-axis)"
              strokeWidth={1.25}
              markerEnd={`url(#${markerId})`}
            />
          );
        })}
        {nodes.map((n, i) => (
          <g key={n.id} transform={`translate(${n.x},${n.y})`}>
            <rect
              x={-halfW}
              y={-halfH}
              width={nodeW}
              height={nodeH}
              rx={5}
              fill={colorAt(i)}
              fillOpacity={0.25}
              stroke={colorAt(i)}
            />
            <text
              textAnchor="middle"
              dominantBaseline="central"
              fill="var(--foreground)"
              fontSize={10}
              fontWeight={500}
            >
              {n.id}
            </text>
          </g>
        ))}
      </svg>
    </Shell>
  );
}

export function OrgChart({ data = defaultTree }: { data?: typeof defaultTree }) {
  return (
    <Shell>
      <TreeSvg rootData={data} />
    </Shell>
  );
}

export function ProcessFlow({ steps = defaultFlow }: { steps?: typeof defaultFlow }) {
  const width = 400;
  const height = 140;
  const nodeW = 76;
  const nodeH = 30;
  const pad = 14;

  const layout = React.useMemo(() => {
    if (!steps.length) return [];
    // The incoming x/y are percentages, so a step at x=8 put its pill half
    // outside the viewBox. Normalize the extent into a range that reserves
    // half a node plus padding, which also spreads the flow across the frame
    // instead of leaving dead space on one side.
    const xs = steps.map((s) => s.x);
    const ys = steps.map((s) => s.y);
    const fit = (
      v: number,
      lo: number,
      hi: number,
      min: number,
      max: number,
    ) => (hi === lo ? (min + max) / 2 : min + ((v - lo) / (hi - lo)) * (max - min));
    const xLo = Math.min(...xs);
    const xHi = Math.max(...xs);
    const yLo = Math.min(...ys);
    const yHi = Math.max(...ys);
    return steps.map((s) => ({
      ...s,
      cx: fit(s.x, xLo, xHi, nodeW / 2 + pad, width - nodeW / 2 - pad),
      cy: fit(s.y, yLo, yHi, nodeH / 2 + pad, height - nodeH / 2 - pad),
    }));
  }, [steps]);

  const markerId = React.useId().replace(/:/g, "");

  return (
    <Shell>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-full w-full"
        preserveAspectRatio="xMidYMid meet"
        focusable="false"
      >
        <defs>
          <marker
            id={markerId}
            markerWidth="6"
            markerHeight="6"
            refX="5"
            refY="3"
            orient="auto"
          >
            <path d="M0,0L6,3L0,6Z" fill="var(--chart-axis)" />
          </marker>
        </defs>
        {layout.slice(0, -1).map((s, i) => {
          const next = layout[i + 1]!;
          // Trim the connector to each pill's edge along the actual direction
          // of travel. Fixed horizontal offsets drew vertical links backwards.
          const dx = next.cx - s.cx;
          const dy = next.cy - s.cy;
          const len = Math.hypot(dx, dy) || 1;
          const ux = dx / len;
          const uy = dy / len;
          const from = rectEdge(nodeW / 2, nodeH / 2, ux, uy) + 2;
          const to = rectEdge(nodeW / 2, nodeH / 2, -ux, -uy) + 7;
          return (
            <line
              key={s.id}
              x1={s.cx + ux * from}
              y1={s.cy + uy * from}
              x2={next.cx - ux * to}
              y2={next.cy - uy * to}
              stroke="var(--chart-axis)"
              strokeWidth={1.5}
              markerEnd={`url(#${markerId})`}
            />
          );
        })}
        {layout.map((s, i) => (
          <g key={s.id} transform={`translate(${s.cx},${s.cy})`}>
            <rect
              x={-nodeW / 2}
              y={-nodeH / 2}
              width={nodeW}
              height={nodeH}
              rx={nodeH / 2}
              fill={colorAt(i)}
              fillOpacity={0.22}
              stroke={colorAt(i)}
            />
            <text
              textAnchor="middle"
              dominantBaseline="central"
              fill="var(--foreground)"
              fontSize={10}
              fontWeight={500}
            >
              {s.label}
            </text>
          </g>
        ))}
      </svg>
    </Shell>
  );
}

export function Flowchart() {
  return <ProcessFlow />;
}

export function JourneyMap({ stages = defaultJourney }: { stages?: typeof defaultJourney }) {
  const width = 400;
  const height = 160;
  const pad = 32;
  const r = 6;
  const w = width - pad * 2;
  const x = d3.scalePoint().domain(stages.map((s) => s.stage)).range([0, w]);
  const y = d3.scaleLinear().domain([0, 100]).range([height - 36, 24]);
  const pts = stages.map((s) => ({ s, px: x(s.stage)!, py: y(s.score) }));

  return (
    <Shell>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-full w-full"
        preserveAspectRatio="xMidYMid meet"
        focusable="false"
      >
        <g transform={`translate(${pad},0)`}>
          {pts.slice(0, -1).map((a, i) => {
            const b = pts[i + 1]!;
            const dx = b.px - a.px;
            const dy = b.py - a.py;
            const len = Math.hypot(dx, dy) || 1;
            const ux = dx / len;
            const uy = dy / len;
            return (
              <line
                key={a.s.stage}
                x1={a.px + ux * r}
                y1={a.py + uy * r}
                x2={b.px - ux * r}
                y2={b.py - uy * r}
                stroke={CHART_COLORS[0]}
                strokeWidth={2}
              />
            );
          })}
          {pts.map(({ s, px, py }, i) => (
            <g key={s.stage} transform={`translate(${px},${py})`}>
              <circle r={r} fill={colorAt(i)} />
              <text y={22} textAnchor="middle" className="fill-[var(--chart-axis)] text-[8px]">{s.stage}</text>
            </g>
          ))}
        </g>
      </svg>
    </Shell>
  );
}

export function DecisionTree({ data = defaultTree }: { data?: typeof defaultTree }) {
  return (
    <Shell>
      <TreeSvg rootData={data} variant="decision" />
    </Shell>
  );
}

export function TreeDiagram({ data = defaultTree }: { data?: typeof defaultTree }) {
  return (
    <Shell>
      <TreeSvg rootData={data} />
    </Shell>
  );
}

export function SunburstChart({ data = defaultTree }: { data?: TreeDatum }) {
  const width = 400;
  const height = 220;
  const radius = Math.min(width, height) / 2 - 8;
  const root = d3.hierarchy<TreeDatum>(data).sum((d) => (d.children ? 0 : 1));
  d3.partition<TreeDatum>().size([2 * Math.PI, radius])(root);
  const arc = d3.arc<d3.HierarchyRectangularNode<TreeDatum>>()
    .startAngle((d) => d.x0)
    .endAngle((d) => d.x1)
    .innerRadius((d) => d.y0)
    .outerRadius((d) => d.y1);
  const descendants = root.descendants().filter((d) => d.depth) as d3.HierarchyRectangularNode<TreeDatum>[];

  return (
    <Shell>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full" preserveAspectRatio="xMidYMid meet">
        <g transform={`translate(${width / 2},${height / 2})`}>
          {descendants.map((d, i) => (
            <path key={i} d={arc(d) ?? ""} fill={colorAt(i)} fillOpacity={0.35 + d.depth * 0.15} stroke="var(--background)" strokeWidth={0.5} />
          ))}
        </g>
      </svg>
    </Shell>
  );
}

export function IcicleChart({ data = defaultTree }: { data?: TreeDatum }) {
  const width = 400;
  const height = 220;
  const root = d3.hierarchy<TreeDatum>(data).sum((d) => (d.children ? 0 : 1));
  d3.partition<TreeDatum>().size([width, height]).padding(2)(root);
  const descendants = root.descendants() as d3.HierarchyRectangularNode<TreeDatum>[];

  return (
    <Shell>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full" preserveAspectRatio="xMidYMid meet">
        {descendants.map((d, i) => (
          <rect
            key={i}
            x={d.x0}
            y={d.y0}
            width={d.x1 - d.x0}
            height={d.y1 - d.y0}
            fill={colorAt(i)}
            fillOpacity={0.25 + d.depth * 0.12}
            stroke="var(--background)"
            strokeWidth={1}
            rx={2}
          />
        ))}
      </svg>
    </Shell>
  );
}

export function CirclePacking({ data = defaultTree }: { data?: TreeDatum }) {
  const width = 400;
  const height = 220;
  const root = d3.hierarchy<TreeDatum>(data).sum((d) => (d.children ? 0 : 12));
  const packed = d3.pack<TreeDatum>().size([width, height]).padding(6)(root);
  const nodes = packed.descendants();

  return (
    <Shell>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full" preserveAspectRatio="xMidYMid meet">
        {nodes.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r={d.r} fill={colorAt(i)} fillOpacity={0.2 + d.depth * 0.1} stroke={colorAt(i)} strokeWidth={1} />
        ))}
      </svg>
    </Shell>
  );
}

export function HierarchicalEdgeBundling() {
  const width = 400;
  const height = 220;
  const radius = 88;
  const cx = width / 2;
  const cy = height / 2 + 8;
  const clusterLayout = d3.cluster<TreeDatum>().size([2 * Math.PI, radius]);
  const root = clusterLayout(d3.hierarchy<TreeDatum>(defaultTree));
  const leaves = root.leaves() as d3.HierarchyPointNode<TreeDatum>[];
  const line = d3.lineRadial<d3.HierarchyPointNode<TreeDatum>>()
    .curve(d3.curveBundle.beta(0.85))
    .radius((d) => d.y)
    .angle((d) => d.x);

  const pairs = leaves.flatMap((a, i) =>
    leaves.slice(i + 1).filter((_, j) => j < 2).map((b) => [a, b] as const),
  );

  return (
    <Shell>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full" preserveAspectRatio="xMidYMid meet">
        <g transform={`translate(${cx},${cy})`}>
          {pairs.map(([a, b], i) => (
            <path
              key={i}
              d={line([a.parent as d3.HierarchyPointNode<TreeDatum>, a, b, b.parent as d3.HierarchyPointNode<TreeDatum>]) ?? ""}
              fill="none"
              stroke={colorAt(i)}
              strokeOpacity={0.35}
              strokeWidth={1}
            />
          ))}
          {leaves.map((d, i) => (
            <circle
              key={i}
              transform={`rotate(${(d.x * 180) / Math.PI - 90}) translate(${d.y},0)`}
              r={3}
              fill={colorAt(i)}
            />
          ))}
        </g>
      </svg>
    </Shell>
  );
}
