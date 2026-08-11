"use client";

import * as React from "react";
import * as d3 from "d3";
import { CHART_COLORS, colorAt } from "@/lib/chart-colors";
import { sankeyLinks, sankeyNodes } from "@/lib/sample-data";
import { cn, roundSvgNumber, roundSvgPath } from "@/lib/utils";
import {
  buildSankeyLayout,
  layoutProcessFlow,
  validateChordInput,
  validateNetworkInput,
  validateTreeInput,
  type ChordDatum,
  type NetworkLinkDatum,
  type NetworkNodeDatum,
  type ProcessFlowLinkDatum,
  type ProcessFlowStepDatum,
  type ResolvedNetworkNode,
  type SankeyLinkDatum,
  type SankeyNodeDatum,
  type TreeDatum,
} from "./flow-hierarchy-layout";

export {
  buildSankeyLayout,
  layoutProcessFlow,
  validateChordInput,
  validateNetworkInput,
  validateTreeInput,
} from "./flow-hierarchy-layout";
export type {
  ChordDatum,
  ChordInput,
  NetworkLinkDatum,
  NetworkNodeDatum,
  PositionedProcessStep,
  ProcessFlowLayout,
  ProcessFlowLinkDatum,
  ProcessFlowStepDatum,
  ResolvedNetworkLink,
  ResolvedNetworkNode,
  SankeyLayout,
  SankeyLayoutLink,
  SankeyLayoutNode,
  SankeyLinkDatum,
  SankeyNodeDatum,
  TreeDatum,
  ValidationResult,
} from "./flow-hierarchy-layout";

export type FlowHierarchyChartProps = {
  className?: string;
  title?: string;
  description?: string;
};

export type SankeyDiagramProps = FlowHierarchyChartProps & {
  nodes?: readonly SankeyNodeDatum[];
  links?: readonly SankeyLinkDatum[];
};

export type AlluvialDiagramProps = SankeyDiagramProps;

export type ChordDiagramProps = FlowHierarchyChartProps & {
  groups?: readonly ChordDatum[];
  matrix?: readonly (readonly number[])[];
};

export type NetworkDiagramProps = FlowHierarchyChartProps & {
  nodes?: readonly NetworkNodeDatum[];
  links?: readonly NetworkLinkDatum[];
};

export type ForceDirectedNetworkProps = NetworkDiagramProps & {
  staticLayout?: boolean;
};

export type DependencyNodeDatum = NetworkNodeDatum & {
  x: number;
  y: number;
};

export type DependencyLinkDatum = NetworkLinkDatum;

export type DependencyGraphProps = FlowHierarchyChartProps & {
  nodes?: readonly DependencyNodeDatum[];
  links?: readonly DependencyLinkDatum[];
};

export type ProcessFlowProps = FlowHierarchyChartProps & {
  steps?: readonly ProcessFlowStepDatum[];
  /** Omit to connect each step to the next; pass an array for branches. */
  links?: readonly ProcessFlowLinkDatum[];
};

export type TreeChartProps = FlowHierarchyChartProps & {
  data?: TreeDatum;
};

export type OrgChartProps = TreeChartProps;
export type DecisionTreeProps = TreeChartProps;
export type TreeDiagramProps = TreeChartProps;
export type SunburstChartProps = TreeChartProps;
export type IcicleChartProps = TreeChartProps;
export type CirclePackingProps = TreeChartProps;

export type JourneyDatum = {
  id?: string;
  stage: string;
  /** Percentage score from zero through one hundred. */
  score: number;
};

export type JourneyMapProps = FlowHierarchyChartProps & {
  stages?: readonly JourneyDatum[];
};

export type HierarchicalEdgeLinkDatum = {
  /** Leaf id, or a unique leaf name when ids are omitted. */
  source: string;
  /** Leaf id, or a unique leaf name when ids are omitted. */
  target: string;
  value?: number;
  label?: string;
};

export type HierarchicalEdgeBundlingProps = TreeChartProps & {
  links?: readonly HierarchicalEdgeLinkDatum[];
};

function Shell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("h-full w-full", className)} data-chart-svg="">
      {children}
    </div>
  );
}

type AccessibleSvgProps = Omit<React.SVGProps<SVGSVGElement>, "title"> & {
  title: string;
  description: string;
};

function AccessibleSvg({
  title,
  description,
  className,
  children,
  ...props
}: AccessibleSvgProps) {
  const id = React.useId().replace(/:/g, "");
  const titleId = `flow-title-${id}`;
  const descriptionId = `flow-description-${id}`;
  return (
    <svg
      {...props}
      className={cn("h-full w-full outline-none", className)}
      role="img"
      aria-labelledby={`${titleId} ${descriptionId}`}
    >
      <title id={titleId}>{title}</title>
      <desc id={descriptionId}>{description}</desc>
      {children}
    </svg>
  );
}

function ChartState({
  title,
  message,
  className,
}: {
  title: string;
  message: string;
  className?: string;
}) {
  // Matches ChartEmpty semantics: calm status region, not a decorative image.
  return (
    <Shell className={className}>
      <div
        className="flex h-full min-h-32 w-full flex-col items-center justify-center gap-1 rounded-[var(--radius)] border border-dashed border-[var(--border)] bg-[color-mix(in_oklab,var(--muted)_55%,transparent)] px-6 text-center"
        role="status"
        aria-live="polite"
        aria-label={`${title}. ${message}`}
      >
        <span className="text-[13px] font-medium text-foreground/80">{title}</span>
        <span className="text-sm text-muted-foreground">{message}</span>
      </div>
    </Shell>
  );
}

const valueFormatter = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });

function formatValue(value: number) {
  return valueFormatter.format(value);
}

function colorIndex(value: string | number) {
  if (typeof value === "number" && Number.isFinite(value)) return Math.abs(Math.trunc(value));
  let hash = 0;
  for (const character of String(value)) hash = (hash * 31 + character.charCodeAt(0)) | 0;
  return Math.abs(hash);
}

function nodeColor(node: Pick<ResolvedNetworkNode, "group" | "color">) {
  return node.color || colorAt(colorIndex(node.group));
}

/** Distance from a rectangle's center to its border along `(ux, uy)`. */
function rectEdge(halfW: number, halfH: number, ux: number, uy: number) {
  if (Math.abs(ux) < 1e-6 && Math.abs(uy) < 1e-6) return 0;
  return 1 / Math.hypot(ux / halfW || 0, uy / halfH || 0);
}

/** Distance from a stadium/pill center to its edge along `(ux, uy)`. */
function capsuleEdge(halfW: number, halfH: number, ux: number, uy: number) {
  const radius = Math.min(halfW, halfH);
  const capCenter = halfW - radius;
  const absX = Math.abs(ux);
  const absY = Math.abs(uy);
  if (absX < 1e-6 && absY < 1e-6) return 0;
  if (absX < 1e-6) return halfH / absY;
  if (capCenter > 0 && (absY / absX) * capCenter <= radius) {
    const discriminant = radius * radius - capCenter * capCenter * absY * absY;
    return capCenter * absX + Math.sqrt(Math.max(0, discriminant));
  }
  if (absY < 1e-6) return halfW / absX;
  return halfH / absY;
}

const defaultTree: TreeDatum = {
  id: "company",
  name: "CEO",
  children: [
    {
      id: "engineering",
      name: "Engineering",
      children: [
        { id: "platform", name: "Platform", value: 32 },
        { id: "product", name: "Product", value: 24 },
      ],
    },
    {
      id: "sales",
      name: "Sales",
      children: [
        { id: "enterprise", name: "Enterprise", value: 28 },
        { id: "smb", name: "SMB", value: 18 },
      ],
    },
    { id: "marketing", name: "Marketing", value: 16 },
  ],
};

const defaultFlow = [
  { id: "start", label: "Start", x: 8, y: 45 },
  { id: "review", label: "Review", x: 35, y: 20 },
  { id: "build", label: "Build", x: 35, y: 70 },
  { id: "ship", label: "Ship", x: 72, y: 45 },
] satisfies readonly ProcessFlowStepDatum[];

const defaultFlowLinks = [
  { source: "start", target: "review" },
  { source: "start", target: "build" },
  { source: "review", target: "ship", label: "approved" },
  { source: "build", target: "ship", label: "ready" },
] satisfies readonly ProcessFlowLinkDatum[];

const defaultJourney = [
  { id: "awareness", stage: "Awareness", score: 82 },
  { id: "consider", stage: "Consider", score: 68 },
  { id: "trial", stage: "Trial", score: 54 },
  { id: "purchase", stage: "Purchase", score: 42 },
  { id: "retain", stage: "Retain", score: 76 },
] satisfies readonly JourneyDatum[];

const defaultNetworkNodes = [
  { id: "n1", label: "Source", group: 1 },
  { id: "n2", label: "Router", group: 1 },
  { id: "n3", label: "Service", group: 2 },
  { id: "n4", label: "Worker", group: 2 },
  { id: "n5", label: "Store", group: 3 },
] satisfies readonly NetworkNodeDatum[];

const defaultNetworkLinks = [
  { source: "n1", target: "n2", value: 3 },
  { source: "n2", target: "n3", value: 2 },
  { source: "n3", target: "n4", value: 2 },
  { source: "n4", target: "n5", value: 3 },
  { source: "n1", target: "n5", value: 1 },
] satisfies readonly NetworkLinkDatum[];

const defaultDependencyNodes = [
  { id: "api", label: "API", x: 70, y: 48, group: 0 },
  { id: "auth", label: "Auth", x: 200, y: 40, group: 1 },
  { id: "db", label: "Database", x: 330, y: 48, group: 2 },
  { id: "cache", label: "Cache", x: 130, y: 140, group: 3 },
  { id: "worker", label: "Worker", x: 270, y: 140, group: 4 },
] satisfies readonly DependencyNodeDatum[];

const defaultDependencyLinks = [
  { source: "api", target: "auth" },
  { source: "api", target: "cache" },
  { source: "auth", target: "db" },
  { source: "cache", target: "worker" },
  { source: "worker", target: "db" },
] satisfies readonly DependencyLinkDatum[];

const defaultChordGroups: readonly ChordDatum[] = [
  { id: "website", label: "Website" },
  { id: "sales", label: "Sales" },
  { id: "support", label: "Support" },
  { id: "product", label: "Product" },
];

const defaultChordMatrix = [
  [0, 28, 10, 18],
  [16, 0, 14, 22],
  [8, 12, 0, 20],
  [14, 18, 24, 0],
] satisfies readonly (readonly number[])[];

function flowRibbonPath(
  sourceX: number,
  sourceY: number,
  targetX: number,
  targetY: number,
  thickness: number,
) {
  const half = thickness / 2;
  const middle = (sourceX + targetX) / 2;
  return [
    `M${sourceX},${sourceY - half}`,
    `C${middle},${sourceY - half} ${middle},${targetY - half} ${targetX},${targetY - half}`,
    `L${targetX},${targetY + half}`,
    `C${middle},${targetY + half} ${middle},${sourceY + half} ${sourceX},${sourceY + half}`,
    "Z",
  ].join("");
}

function FlowDiagram({
  nodes,
  links,
  title,
  description,
  className,
  variant,
}: Required<Pick<SankeyDiagramProps, "nodes" | "links">> &
  FlowHierarchyChartProps & { variant: "sankey" | "alluvial" }) {
  const result = React.useMemo(() => buildSankeyLayout(nodes, links), [nodes, links]);
  const resolvedTitle = title ?? (variant === "sankey" ? "Sankey diagram" : "Alluvial diagram");
  if (!result.ok) {
    return <ChartState title={resolvedTitle} message={result.message} className={className} />;
  }
  const layout = result.data;
  const resolvedDescription =
    description ??
    `${layout.nodes.length} nodes and ${layout.links.length} value-scaled flows. Link widths conserve their values at each stratum.`;
  const terminalLayer = layout.nodes.reduce(
    (maximum, node) => Math.max(maximum, node.layer),
    0,
  );

  return (
    <Shell className={className}>
      <AccessibleSvg
        viewBox={`0 0 ${layout.width} ${layout.height}`}
        preserveAspectRatio="xMidYMid meet"
        title={resolvedTitle}
        description={resolvedDescription}
      >
        {layout.links.map((link) => {
          const label =
            link.label || `${link.source.name} to ${link.target.name}: ${formatValue(link.value)}`;
          return (
            <g key={link.id} tabIndex={0} role="img" aria-label={label}>
              <title>{label}</title>
              <path
                d={flowRibbonPath(
                  link.source.x1,
                  link.sourceY,
                  link.target.x0,
                  link.targetY,
                  link.thickness,
                )}
                fill={link.color || link.source.color || colorAt(link.source.index)}
                fillOpacity={variant === "sankey" ? 0.34 : 0.46}
                stroke={link.color || link.source.color || colorAt(link.source.index)}
                strokeOpacity={0.22}
                strokeWidth={0.5}
              />
            </g>
          );
        })}
        {layout.nodes.map((node) => {
          const isTerminal = node.layer === terminalLayer;
          const labelX = isTerminal ? node.x0 - 5 : node.x1 + 5;
          const accessibleLabel = `${node.name}: ${formatValue(node.value)} capacity, ${formatValue(node.incomingValue)} incoming, ${formatValue(node.outgoingValue)} outgoing`;
          return (
            <g key={node.id} tabIndex={0} role="img" aria-label={accessibleLabel}>
              <title>{accessibleLabel}</title>
              <rect
                x={node.x0}
                y={node.y0}
                width={node.x1 - node.x0}
                height={Math.max(0, node.y1 - node.y0)}
                fill={node.color || colorAt(node.index)}
                rx={2}
              />
              <text
                x={labelX}
                y={(node.y0 + node.y1) / 2}
                textAnchor={isTerminal ? "end" : "start"}
                dominantBaseline="central"
                fill="var(--foreground)"
                fontSize={9}
                fontWeight={500}
              >
                {node.name}
              </text>
            </g>
          );
        })}
      </AccessibleSvg>
    </Shell>
  );
}

export function SankeyDiagram({
  nodes = sankeyNodes,
  links = sankeyLinks,
  ...props
}: SankeyDiagramProps = {}) {
  return <FlowDiagram nodes={nodes} links={links} variant="sankey" {...props} />;
}

export function AlluvialDiagram({
  nodes = sankeyNodes,
  links = sankeyLinks,
  ...props
}: AlluvialDiagramProps = {}) {
  return <FlowDiagram nodes={nodes} links={links} variant="alluvial" {...props} />;
}

export function ChordDiagram({
  groups,
  matrix,
  title = "Chord diagram",
  description,
  className,
}: ChordDiagramProps = {}) {
  const hasPartialInput = (groups === undefined) !== (matrix === undefined);
  const resolvedGroups = groups ?? defaultChordGroups;
  const resolvedMatrix = matrix ?? defaultChordMatrix;
  const validation = React.useMemo(
    () =>
      hasPartialInput
        ? ({ ok: false, message: "Provide chord groups and matrix together." } as const)
        : validateChordInput(resolvedGroups, resolvedMatrix),
    [hasPartialInput, resolvedGroups, resolvedMatrix],
  );
  const chords = React.useMemo(() => {
    if (!validation.ok) return null;
    return d3
      .chord()
      .padAngle(0.045)
      .sortSubgroups(d3.descending)(validation.data.matrix.map((row) => [...row]));
  }, [validation]);

  if (!validation.ok || !chords) {
    return (
      <ChartState
        title={title}
        message={validation.ok ? "No chord relationships to display." : validation.message}
        className={className}
      />
    );
  }

  const width = 400;
  const height = 240;
  const innerRadius = 70;
  const outerRadius = 84;
  const arc = d3.arc<d3.ChordGroup>().innerRadius(innerRadius).outerRadius(outerRadius);
  const ribbon = d3.ribbon<d3.Chord, d3.ChordSubgroup>().radius(innerRadius);
  const resolvedDescription =
    description ??
    `${resolvedGroups.length} groups connected by ${chords.length} matrix-driven relationships.`;

  return (
    <Shell className={className}>
      <AccessibleSvg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        title={title}
        description={resolvedDescription}
      >
        <g transform={`translate(${width / 2},${height / 2})`}>
          {chords.map((chord, index) => {
            const source = resolvedGroups[chord.source.index]!;
            const target = resolvedGroups[chord.target.index]!;
            const label = `${source.label} to ${target.label}: ${formatValue(chord.source.value)}; reverse: ${formatValue(chord.target.value)}`;
            return (
              <path
                key={`${source.id}-${target.id}-${index}`}
                d={roundSvgPath(ribbon(chord) ?? "")}
                fill={source.color || colorAt(chord.source.index)}
                fillOpacity={0.28}
                stroke={source.color || colorAt(chord.source.index)}
                strokeOpacity={0.5}
                strokeWidth={0.6}
                tabIndex={0}
                role="img"
                aria-label={label}
              >
                <title>{label}</title>
              </path>
            );
          })}
          {chords.groups.map((group) => {
            const datum = resolvedGroups[group.index]!;
            const angle = (group.startAngle + group.endAngle) / 2;
            const labelRadius = outerRadius + 10;
            const x = roundSvgNumber(Math.cos(angle - Math.PI / 2) * labelRadius);
            const y = roundSvgNumber(Math.sin(angle - Math.PI / 2) * labelRadius);
            const label = `${datum.label}: ${formatValue(group.value)} total outgoing`;
            return (
              <g key={datum.id} tabIndex={0} role="img" aria-label={label}>
                <title>{label}</title>
                <path
                  d={arc(group) ?? ""}
                  fill={datum.color || colorAt(group.index)}
                  fillOpacity={0.78}
                  stroke="var(--background)"
                  strokeWidth={1}
                />
                <text
                  x={x}
                  y={y}
                  textAnchor={x < 0 ? "end" : "start"}
                  dominantBaseline="central"
                  fill="var(--foreground)"
                  fontSize={9}
                  fontWeight={500}
                >
                  {datum.label}
                </text>
              </g>
            );
          })}
        </g>
      </AccessibleSvg>
    </Shell>
  );
}

type SimNode = d3.SimulationNodeDatum & ResolvedNetworkNode & { x: number; y: number };

function initialNetworkNodes(nodes: readonly ResolvedNetworkNode[], width: number, height: number) {
  const radius = Math.min(width, height) * 0.32;
  return nodes.map<SimNode>((node, index) => {
    const angle = (index / Math.max(nodes.length, 1)) * Math.PI * 2 - Math.PI / 2;
    return {
      ...node,
      x: node.x ?? width / 2 + Math.cos(angle) * radius,
      y: node.y ?? height / 2 + Math.sin(angle) * radius,
    };
  });
}

export function NetworkDiagram(props: NetworkDiagramProps = {}) {
  return <ForceDirectedNetwork {...props} staticLayout />;
}

export function ForceDirectedNetwork({
  nodes = defaultNetworkNodes,
  links = defaultNetworkLinks,
  staticLayout = false,
  title = staticLayout ? "Network diagram" : "Force-directed network",
  description,
  className,
}: ForceDirectedNetworkProps = {}) {
  const width = 400;
  const height = 240;
  const validation = React.useMemo(() => validateNetworkInput(nodes, links), [nodes, links]);
  const layout = React.useMemo(() => {
    if (!validation.ok) return null;
    const simNodes = initialNetworkNodes(validation.data.nodes, width, height);
    if (!staticLayout && simNodes.length > 1) {
      const simLinks: d3.SimulationLinkDatum<SimNode>[] = validation.data.links.map((link) => ({
        source: link.source,
        target: link.target,
      }));
      const simulation = d3
        .forceSimulation(simNodes)
        .randomSource(d3.randomLcg(0.417))
        .force(
          "link",
          d3
            .forceLink<SimNode, d3.SimulationLinkDatum<SimNode>>(simLinks)
            .id((node) => node.id)
            .distance(72)
            .strength(0.7),
        )
        .force("charge", d3.forceManyBody().strength(-150))
        .force("collide", d3.forceCollide<SimNode>().radius((node) => 11 + Math.sqrt(node.value) * 3))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .stop();
      for (let index = 0; index < 120; index += 1) simulation.tick();
      simulation.stop();
    }
    for (const node of simNodes) {
      const radius = Math.min(20, 8 + Math.sqrt(node.value) * 3);
      node.x = roundSvgNumber(Math.max(radius + 4, Math.min(width - radius - 4, node.x)));
      node.y = roundSvgNumber(Math.max(radius + 4, Math.min(height - radius - 18, node.y)));
    }
    return simNodes;
  }, [staticLayout, validation]);

  if (!validation.ok || !layout) {
    return (
      <ChartState
        title={title}
        message={validation.ok ? "No network layout to display." : validation.message}
        className={className}
      />
    );
  }

  const positions = new Map(layout.map((node) => [node.id, node]));
  const resolvedDescription =
    description ??
    `${layout.length} nodes and ${validation.data.links.length} validated links in a deterministic ${staticLayout ? "radial" : "force"} layout.`;

  return (
    <Shell className={className}>
      <AccessibleSvg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        title={title}
        description={resolvedDescription}
      >
        {validation.data.links.map((link, index) => {
          const source = positions.get(link.source)!;
          const target = positions.get(link.target)!;
          const sourceRadius = Math.min(20, 8 + Math.sqrt(source.value) * 3);
          const targetRadius = Math.min(20, 8 + Math.sqrt(target.value) * 3);
          const dx = target.x - source.x;
          const dy = target.y - source.y;
          const length = Math.hypot(dx, dy) || 1;
          const ux = dx / length;
          const uy = dy / length;
          const label =
            link.label || `${source.label} to ${target.label}: weight ${formatValue(link.value)}`;
          return (
            <line
              key={`${link.source}-${link.target}-${index}`}
              x1={source.x + ux * sourceRadius}
              y1={source.y + uy * sourceRadius}
              x2={target.x - ux * targetRadius}
              y2={target.y - uy * targetRadius}
              stroke="var(--chart-axis)"
              strokeOpacity={0.7}
              strokeWidth={Math.min(5, 0.8 + Math.sqrt(link.value))}
              tabIndex={0}
              role="img"
              aria-label={label}
            >
              <title>{label}</title>
            </line>
          );
        })}
        {layout.map((node) => {
          const radius = Math.min(20, 8 + Math.sqrt(node.value) * 3);
          const label = `${node.label}: group ${node.group}, weight ${formatValue(node.value)}`;
          return (
            <g key={node.id} tabIndex={0} role="img" aria-label={label}>
              <title>{label}</title>
              <circle
                cx={node.x}
                cy={node.y}
                r={radius}
                fill={nodeColor(node)}
                fillOpacity={0.84}
                stroke={nodeColor(node)}
                strokeWidth={1.25}
              />
              <text
                x={node.x}
                y={node.y + radius + 11}
                textAnchor="middle"
                fill="var(--foreground)"
                fontSize={8.5}
                fontWeight={500}
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </AccessibleSvg>
    </Shell>
  );
}

export function DependencyGraph({
  nodes = defaultDependencyNodes,
  links = defaultDependencyLinks,
  title = "Dependency graph",
  description,
  className,
}: DependencyGraphProps = {}) {
  const validation = React.useMemo(() => validateNetworkInput(nodes, links), [nodes, links]);
  const markerId = `dependency-arrow-${React.useId().replace(/:/g, "")}`;
  const width = 400;
  const height = 220;
  const nodeWidth = 76;
  const nodeHeight = 30;
  const layout = React.useMemo(() => {
    if (!validation.ok) return null;
    if (validation.data.nodes.some((node) => node.x === undefined || node.y === undefined)) return null;
    const xs = validation.data.nodes.map((node) => node.x!);
    const ys = validation.data.nodes.map((node) => node.y!);
    const xLow = Math.min(...xs);
    const xHigh = Math.max(...xs);
    const yLow = Math.min(...ys);
    const yHigh = Math.max(...ys);
    const fit = (value: number, low: number, high: number, outLow: number, outHigh: number) =>
      high === low ? (outLow + outHigh) / 2 : outLow + ((value - low) / (high - low)) * (outHigh - outLow);
    return validation.data.nodes.map((node) => ({
      ...node,
      x: fit(node.x!, xLow, xHigh, nodeWidth / 2 + 10, width - nodeWidth / 2 - 10),
      y: fit(node.y!, yLow, yHigh, nodeHeight / 2 + 10, height - nodeHeight / 2 - 10),
    }));
  }, [validation]);

  if (!validation.ok || !layout) {
    return (
      <ChartState
        title={title}
        message={
          validation.ok
            ? "Dependency nodes must all include finite x and y coordinates."
            : validation.message
        }
        className={className}
      />
    );
  }

  const positions = new Map(layout.map((node) => [node.id, node]));
  const overlappingLink = validation.data.links.find((link) => {
    const source = positions.get(link.source)!;
    const target = positions.get(link.target)!;
    return source.x === target.x && source.y === target.y;
  });
  if (overlappingLink) {
    return (
      <ChartState
        title={title}
        message={`Dependency link ${JSON.stringify(overlappingLink.source)} to ${JSON.stringify(overlappingLink.target)} has overlapping endpoints.`}
        className={className}
      />
    );
  }
  return (
    <Shell className={className}>
      <AccessibleSvg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        title={title}
        description={
          description ?? `${layout.length} positioned dependencies with ${links.length} directed links.`
        }
      >
        <defs>
          <marker id={markerId} markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
            <path d="M0,0L7,3.5L0,7Z" fill="var(--chart-axis)" />
          </marker>
        </defs>
        {validation.data.links.map((link, index) => {
          const source = positions.get(link.source)!;
          const target = positions.get(link.target)!;
          const dx = target.x - source.x;
          const dy = target.y - source.y;
          const length = Math.hypot(dx, dy) || 1;
          const ux = dx / length;
          const uy = dy / length;
          const from = rectEdge(nodeWidth / 2, nodeHeight / 2, ux, uy) + 1;
          const to = rectEdge(nodeWidth / 2, nodeHeight / 2, -ux, -uy) + 8;
          const label = link.label || `${source.label} depends on ${target.label}`;
          return (
            <line
              key={`${link.source}-${link.target}-${index}`}
              x1={source.x + ux * from}
              y1={source.y + uy * from}
              x2={target.x - ux * to}
              y2={target.y - uy * to}
              stroke="var(--chart-axis)"
              strokeWidth={Math.min(4, 1 + Math.sqrt(link.value) * 0.4)}
              markerEnd={`url(#${markerId})`}
              tabIndex={0}
              role="img"
              aria-label={label}
            >
              <title>{label}</title>
            </line>
          );
        })}
        {layout.map((node) => {
          const label = `${node.label}, dependency node`;
          return (
            <g key={node.id} transform={`translate(${node.x},${node.y})`} tabIndex={0} role="img" aria-label={label}>
              <title>{label}</title>
              <rect
                x={-nodeWidth / 2}
                y={-nodeHeight / 2}
                width={nodeWidth}
                height={nodeHeight}
                rx={6}
                fill={nodeColor(node)}
                fillOpacity={0.23}
                stroke={nodeColor(node)}
              />
              <text
                textAnchor="middle"
                dominantBaseline="central"
                fill="var(--foreground)"
                fontSize={10}
                fontWeight={500}
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </AccessibleSvg>
    </Shell>
  );
}

function TreeSvg({
  rootData,
  variant,
  title,
  description,
}: {
  rootData: TreeDatum;
  variant: "tree" | "decision";
  title: string;
  description: string;
}) {
  const nodeWidth = 88;
  const nodeHeight = 28;
  const root = d3
    .tree<TreeDatum>()
    .nodeSize([nodeHeight + 16, nodeWidth + 44])
    .separation(() => 1)(d3.hierarchy(rootData, (datum) => datum.children));
  const nodes = root.descendants();
  const links = root.links();
  const xExtent = d3.extent(nodes, (node) => node.x) as [number, number];
  const yExtent = d3.extent(nodes, (node) => node.y) as [number, number];
  const spanX = Math.max(xExtent[1] - xExtent[0], 1);
  const spanY = Math.max(yExtent[1] - yExtent[0], 1);
  // A content-sized viewBox scales connectors, nodes, and text together. It
  // avoids the overlap caused by compressing only node coordinates while
  // leaving each chip at a fixed 88×28 footprint.
  const viewPadding = 16;
  const viewX = yExtent[0] - nodeWidth / 2 - viewPadding;
  const viewY = xExtent[0] - nodeHeight / 2 - viewPadding;
  const viewWidth = spanY + nodeWidth + viewPadding * 2;
  const viewHeight = spanX + nodeHeight + viewPadding * 2;
  const px = (node: d3.HierarchyPointNode<TreeDatum>) => node.y;
  const py = (node: d3.HierarchyPointNode<TreeDatum>) => node.x;

  return (
    <AccessibleSvg
      viewBox={`${viewX} ${viewY} ${viewWidth} ${viewHeight}`}
      preserveAspectRatio="xMidYMid meet"
      title={title}
      description={description}
    >
      {links.map((link) => {
        const sourceX = px(link.source) + nodeWidth / 2;
        const sourceY = py(link.source);
        const targetX = px(link.target) - nodeWidth / 2;
        const targetY = py(link.target);
        const middle = (sourceX + targetX) / 2;
        return (
          <path
            key={`${link.source.data.id ?? link.source.data.name}-${link.target.data.id ?? link.target.data.name}`}
            d={`M${sourceX},${sourceY}C${middle},${sourceY} ${middle},${targetY} ${targetX},${targetY}`}
            fill="none"
            stroke="var(--chart-axis)"
            strokeWidth={1}
          />
        );
      })}
      {nodes.map((node, index) => {
        const label = `${node.data.name}, depth ${node.depth}${node.data.value === undefined ? "" : `, value ${formatValue(node.data.value)}`}`;
        return (
          <g
            key={node.data.id || `${node.ancestors().map((ancestor) => ancestor.data.name).reverse().join("/")}-${index}`}
            transform={`translate(${px(node)},${py(node)})`}
            tabIndex={0}
            role="img"
            aria-label={label}
          >
            <title>{label}</title>
            <rect
              x={-nodeWidth / 2}
              y={-nodeHeight / 2}
              width={nodeWidth}
              height={nodeHeight}
              rx={variant === "decision" ? nodeHeight / 2 : 6}
              fill={colorAt(index)}
              fillOpacity={0.2}
              stroke={colorAt(index)}
              strokeWidth={1.25}
            />
            <text
              textAnchor="middle"
              dominantBaseline="central"
              fill="var(--foreground)"
              fontSize={10}
              fontWeight={500}
            >
              {node.data.name.length > 13 ? `${node.data.name.slice(0, 12)}…` : node.data.name}
            </text>
          </g>
        );
      })}
    </AccessibleSvg>
  );
}

function TreeComponent({
  data,
  variant,
  title,
  description,
  className,
}: TreeChartProps & { variant: "tree" | "decision"; title: string }) {
  const rootData = data ?? defaultTree;
  const validation = React.useMemo(() => validateTreeInput(rootData), [rootData]);
  if (!validation.ok) {
    return <ChartState title={title} message={validation.message} className={className} />;
  }
  const nodeCount = d3.hierarchy(validation.data, (datum) => datum.children).descendants().length;
  return (
    <Shell className={className}>
      <TreeSvg
        rootData={validation.data}
        variant={variant}
        title={title}
        description={description ?? `${nodeCount} validated hierarchy nodes arranged from root to leaves.`}
      />
    </Shell>
  );
}

export function OrgChart({
  data,
  title = "Organization chart",
  ...props
}: OrgChartProps = {}) {
  return <TreeComponent data={data} title={title} variant="tree" {...props} />;
}

export function DecisionTree({
  data,
  title = "Decision tree",
  ...props
}: DecisionTreeProps = {}) {
  return <TreeComponent data={data} title={title} variant="decision" {...props} />;
}

export function TreeDiagram({
  data,
  title = "Tree diagram",
  ...props
}: TreeDiagramProps = {}) {
  return <TreeComponent data={data} title={title} variant="tree" {...props} />;
}

export function ProcessFlow({
  steps = defaultFlow,
  links,
  title = "Process flow",
  description,
  className,
}: ProcessFlowProps = {}) {
  const effectiveLinks = links ?? (steps === defaultFlow ? defaultFlowLinks : undefined);
  const result = React.useMemo(
    () => layoutProcessFlow(steps, effectiveLinks),
    [steps, effectiveLinks],
  );
  const markerId = `process-arrow-${React.useId().replace(/:/g, "")}`;
  const nodeWidth = 82;
  const nodeHeight = 32;
  if (!result.ok) {
    return <ChartState title={title} message={result.message} className={className} />;
  }
  const positions = new Map(result.data.steps.map((step) => [step.id, step]));
  return (
    <Shell className={className}>
      <AccessibleSvg
        viewBox={`0 0 ${result.data.width} ${result.data.height}`}
        preserveAspectRatio="xMidYMid meet"
        title={title}
        description={
          description ??
          `${result.data.steps.length} process steps connected by ${result.data.links.length} validated transitions, including branches.`
        }
      >
        <defs>
          <marker id={markerId} markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
            <path d="M0,0L7,3.5L0,7Z" fill="var(--chart-axis)" />
          </marker>
        </defs>
        {result.data.links.map((link, index) => {
          const source = positions.get(link.source)!;
          const target = positions.get(link.target)!;
          const dx = target.cx - source.cx;
          const dy = target.cy - source.cy;
          const length = Math.hypot(dx, dy) || 1;
          const ux = dx / length;
          const uy = dy / length;
          const from = capsuleEdge(nodeWidth / 2, nodeHeight / 2, ux, uy) + 1;
          const to = capsuleEdge(nodeWidth / 2, nodeHeight / 2, -ux, -uy) + 7;
          const label = link.label || `${source.label} to ${target.label}`;
          const middleX = (source.cx + target.cx) / 2;
          const middleY = (source.cy + target.cy) / 2;
          return (
            <g key={`${link.source}-${link.target}-${index}`} tabIndex={0} role="img" aria-label={label}>
              <title>{label}</title>
              <line
                x1={source.cx + ux * from}
                y1={source.cy + uy * from}
                x2={target.cx - ux * to}
                y2={target.cy - uy * to}
                stroke="var(--chart-axis)"
                strokeWidth={1.4}
                markerEnd={`url(#${markerId})`}
              />
              {link.label ? (
                <text
                  x={middleX}
                  y={middleY - 5}
                  textAnchor="middle"
                  fill="var(--muted-foreground)"
                  fontSize={8}
                >
                  {link.label}
                </text>
              ) : null}
            </g>
          );
        })}
        {result.data.steps.map((step, index) => {
          const label = `${step.label}, process step`;
          const color = step.color || colorAt(index);
          return (
            <g
              key={step.id}
              transform={`translate(${step.cx},${step.cy})`}
              tabIndex={0}
              role="img"
              aria-label={label}
            >
              <title>{label}</title>
              <rect
                x={-nodeWidth / 2}
                y={-nodeHeight / 2}
                width={nodeWidth}
                height={nodeHeight}
                rx={nodeHeight / 2}
                fill={color}
                fillOpacity={0.22}
                stroke={color}
              />
              <text
                textAnchor="middle"
                dominantBaseline="central"
                fill="var(--foreground)"
                fontSize={10}
                fontWeight={500}
              >
                {step.label.length > 13 ? `${step.label.slice(0, 12)}…` : step.label}
              </text>
            </g>
          );
        })}
      </AccessibleSvg>
    </Shell>
  );
}

export function Flowchart(props: ProcessFlowProps = {}) {
  return <ProcessFlow title="Flowchart" {...props} />;
}

function validateJourney(stages: readonly JourneyDatum[]) {
  if (stages.length === 0) return "Add at least one journey stage.";
  const ids = new Set<string>();
  for (const [index, stage] of stages.entries()) {
    const id = stage.id?.trim() || stage.stage?.trim();
    if (!stage.stage?.trim()) return `Journey stage ${index + 1} needs a label.`;
    if (!id || ids.has(id)) return `Journey stage id ${JSON.stringify(id)} is duplicated.`;
    if (!Number.isFinite(stage.score) || stage.score < 0 || stage.score > 100) {
      return `Journey stage ${JSON.stringify(stage.stage)} needs a score from 0 to 100.`;
    }
    ids.add(id);
  }
  return null;
}

export function JourneyMap({
  stages = defaultJourney,
  title = "Journey map",
  description,
  className,
}: JourneyMapProps = {}) {
  const error = React.useMemo(() => validateJourney(stages), [stages]);
  if (error) return <ChartState title={title} message={error} className={className} />;
  const width = 400;
  const height = 180;
  const padding = 34;
  const radius = 6;
  const x = d3
    .scalePoint<number>()
    .domain(stages.map((_, index) => index))
    .range([padding, width - padding]);
  const y = d3.scaleLinear().domain([0, 100]).range([height - 42, 24]);
  const points = stages.map((stage, index) => ({
    stage,
    x: x(index)!,
    y: y(stage.score),
  }));

  return (
    <Shell className={className}>
      <AccessibleSvg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        title={title}
        description={description ?? `${stages.length} journey stages scored from zero to one hundred.`}
      >
        {points.slice(0, -1).map((point, index) => {
          const next = points[index + 1]!;
          const dx = next.x - point.x;
          const dy = next.y - point.y;
          const length = Math.hypot(dx, dy) || 1;
          return (
            <line
              key={`${point.stage.id ?? point.stage.stage}-${next.stage.id ?? next.stage.stage}`}
              x1={point.x + (dx / length) * radius}
              y1={point.y + (dy / length) * radius}
              x2={next.x - (dx / length) * radius}
              y2={next.y - (dy / length) * radius}
              stroke={CHART_COLORS[0]}
              strokeWidth={2}
            />
          );
        })}
        {points.map((point, index) => {
          const label = `${point.stage.stage}: ${formatValue(point.stage.score)} out of 100`;
          return (
            <g key={point.stage.id ?? point.stage.stage} tabIndex={0} role="img" aria-label={label}>
              <title>{label}</title>
              <circle cx={point.x} cy={point.y} r={radius} fill={colorAt(index)} />
              <text
                x={point.x}
                y={point.y + 20}
                textAnchor="middle"
                fill="var(--foreground)"
                fontSize={8}
              >
                {point.stage.stage}
              </text>
            </g>
          );
        })}
      </AccessibleSvg>
    </Shell>
  );
}

function weightedHierarchy(data: TreeDatum) {
  return d3
    .hierarchy(data, (datum) => datum.children)
    .sum((datum) => datum.value ?? (datum.children?.length ? 0 : 1))
    .sort((a, b) => (b.value ?? 0) - (a.value ?? 0));
}

function hierarchyNodeKey(node: d3.HierarchyNode<TreeDatum>, index: number) {
  return (
    node.data.id ||
    `${node.ancestors().map((ancestor) => ancestor.data.name).reverse().join("/")}-${index}`
  );
}

export function SunburstChart({
  data = defaultTree,
  title = "Sunburst chart",
  description,
  className,
}: SunburstChartProps = {}) {
  const validation = React.useMemo(() => validateTreeInput(data), [data]);
  const root = React.useMemo(() => {
    if (!validation.ok) return null;
    return weightedHierarchy(validation.data);
  }, [validation]);
  if (!validation.ok || !root || !root.value) {
    return (
      <ChartState
        title={title}
        message={validation.ok ? "Hierarchy values must total more than zero." : validation.message}
        className={className}
      />
    );
  }
  const width = 400;
  const height = 240;
  const radius = Math.min(width, height) / 2 - 10;
  // Uniform gutters: angular padAngle + radial ring inset. Stroke-as-gap looked
  // thicker where two edges met and thinner on the outer rim.
  const ANGULAR_PAD = 0.014; // ~0.8°
  const RADIAL_GAP = 1.5;
  d3.partition<TreeDatum>().size([2 * Math.PI, radius])(root);
  const nodes = root
    .descendants()
    .filter((node) => node.depth) as d3.HierarchyRectangularNode<TreeDatum>[];
  const arc = d3
    .arc<d3.HierarchyRectangularNode<TreeDatum>>()
    .startAngle((node) => node.x0)
    .endAngle((node) => node.x1)
    // Cap pad so tiny slices aren't eaten; keeps the white ring width constant
    // across large siblings like the image's Marketing / SMB wedges.
    .padAngle((node) => Math.min(ANGULAR_PAD, Math.max(0, (node.x1 - node.x0) * 0.2)))
    .padRadius((node) => (node.y0 + node.y1) / 2)
    .innerRadius((node) => Math.max(0, node.y0 + (node.y0 > 0 ? RADIAL_GAP / 2 : 0)))
    .outerRadius((node) => Math.max(node.y0 + RADIAL_GAP, node.y1 - RADIAL_GAP / 2))
    .cornerRadius(1.25);
  return (
    <Shell className={className}>
      <AccessibleSvg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        title={title}
        description={
          description ??
          `${nodes.length} weighted hierarchy segments totaling ${formatValue(root.value)}.`
        }
      >
        <g transform={`translate(${width / 2},${height / 2})`}>
          {nodes.map((node, index) => {
            const label = `${node.data.name}: ${formatValue(node.value ?? 0)}`;
            const centroid = arc.centroid(node);
            const angular = node.x1 - node.x0;
            const radial = node.y1 - node.y0;
            const showLabel = angular > 0.28 && radial > 16;
            return (
              <g key={hierarchyNodeKey(node, index)} tabIndex={0} role="img" aria-label={label}>
                <title>{label}</title>
                <path
                  d={roundSvgPath(arc(node) ?? "")}
                  fill={colorAt(index)}
                  fillOpacity={0.42 + Math.min(node.depth, 3) * 0.12}
                />
                {showLabel ? (
                  <text
                    x={roundSvgNumber(centroid[0] ?? 0)}
                    y={roundSvgNumber(centroid[1] ?? 0)}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="var(--foreground)"
                    fontSize={11}
                    fontWeight={500}
                    letterSpacing="-0.01em"
                    pointerEvents="none"
                    style={{
                      fontFamily:
                        'var(--font-manrope), "Manrope", ui-sans-serif, system-ui, sans-serif',
                    }}
                  >
                    {node.data.name.length > 10
                      ? `${node.data.name.slice(0, 9)}…`
                      : node.data.name}
                  </text>
                ) : null}
              </g>
            );
          })}
        </g>
      </AccessibleSvg>
    </Shell>
  );
}

export function IcicleChart({
  data = defaultTree,
  title = "Icicle chart",
  description,
  className,
}: IcicleChartProps = {}) {
  const validation = React.useMemo(() => validateTreeInput(data), [data]);
  const root = React.useMemo(() => {
    if (!validation.ok) return null;
    return weightedHierarchy(validation.data);
  }, [validation]);
  if (!validation.ok || !root || !root.value) {
    return (
      <ChartState
        title={title}
        message={validation.ok ? "Hierarchy values must total more than zero." : validation.message}
        className={className}
      />
    );
  }
  const width = 400;
  const height = 230;
  d3.partition<TreeDatum>().size([width, height]).padding(1.5)(root);
  const nodes = root.descendants() as d3.HierarchyRectangularNode<TreeDatum>[];
  return (
    <Shell className={className}>
      <AccessibleSvg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        title={title}
        description={description ?? `${nodes.length} weighted hierarchy rectangles totaling ${formatValue(root.value)}.`}
      >
        {nodes.map((node, index) => {
          const rectWidth = Math.max(0, node.x1 - node.x0);
          const rectHeight = Math.max(0, node.y1 - node.y0);
          const label = `${node.data.name}: ${formatValue(node.value ?? 0)}`;
          return (
            <g key={hierarchyNodeKey(node, index)} tabIndex={0} role="img" aria-label={label}>
              <title>{label}</title>
              <rect
                x={node.x0}
                y={node.y0}
                width={rectWidth}
                height={rectHeight}
                fill={colorAt(index)}
                fillOpacity={0.25 + Math.min(node.depth, 4) * 0.11}
                stroke="var(--background)"
                strokeWidth={0.75}
                rx={2}
              />
              {rectWidth > 42 && rectHeight > 18 ? (
                <text
                  x={node.x0 + 5}
                  y={(node.y0 + node.y1) / 2}
                  dominantBaseline="central"
                  fill="var(--foreground)"
                  fontSize={8}
                  pointerEvents="none"
                >
                  {node.data.name.length > 13 ? `${node.data.name.slice(0, 12)}…` : node.data.name}
                </text>
              ) : null}
            </g>
          );
        })}
      </AccessibleSvg>
    </Shell>
  );
}

export function CirclePacking({
  data = defaultTree,
  title = "Circle packing chart",
  description,
  className,
}: CirclePackingProps = {}) {
  const validation = React.useMemo(() => validateTreeInput(data), [data]);
  const packed = React.useMemo(() => {
    if (!validation.ok) return null;
    const root = weightedHierarchy(validation.data);
    if (!root.value) return null;
    // Extra padding keeps sibling circles from kissing labels into each other.
    return d3.pack<TreeDatum>().size([420, 260]).padding(8)(root);
  }, [validation]);
  if (!validation.ok || !packed || !packed.value) {
    return (
      <ChartState
        title={title}
        message={
          validation.ok
            ? "Hierarchy values must total more than zero."
            : validation.message
        }
        className={className}
      />
    );
  }
  const nodes = packed.descendants();
  const chartFont =
    'var(--font-manrope), "Manrope", ui-sans-serif, system-ui, sans-serif';

  return (
    <Shell className={className}>
      <AccessibleSvg
        viewBox="0 0 420 260"
        preserveAspectRatio="xMidYMid meet"
        title={title}
        description={
          description ??
          `${nodes.length} weighted packed circles totaling ${formatValue(packed.value)}.`
        }
        style={{ fontFamily: chartFont }}
      >
        {/* Circles first (parents behind leaves via depth order from pack). */}
        {nodes.map((node, index) => {
          const label = `${node.data.name}: ${formatValue(node.value ?? 0)}`;
          const isLeaf = !node.children?.length;
          return (
            <g key={hierarchyNodeKey(node, index)} tabIndex={0} role="img" aria-label={label}>
              <title>{label}</title>
              <circle
                cx={node.x}
                cy={node.y}
                r={node.r}
                fill={colorAt(index)}
                fillOpacity={
                  isLeaf
                    ? 0.55 + Math.min(node.depth, 3) * 0.08
                    : 0.1 + Math.min(node.depth, 3) * 0.06
                }
                stroke={colorAt(index)}
                strokeWidth={isLeaf ? 1.25 : 1}
                strokeOpacity={isLeaf ? 0.95 : 0.55}
              />
            </g>
          );
        })}

        {/*
          Labels in a second pass so type sits above all fills.
          - Leaves: centered when the circle is wide enough for the name.
          - Internal nodes: parked at the top of the ring (above children), never
            centered — that was stacking Platform/Engineering/Product/CEO into one mess.
        */}
        {nodes.map((node, index) => {
          const isLeaf = !node.children?.length;
          const name = node.data.name;
          if (isLeaf) {
            // ~0.55em per character at this size; need diameter headroom.
            const fontSize = Math.min(12, Math.max(9.5, node.r * 0.32));
            const maxChars = Math.max(3, Math.floor((node.r * 1.7) / (fontSize * 0.52)));
            if (node.r < 15 || maxChars < 3) return null;
            const text =
              name.length > maxChars ? `${name.slice(0, Math.max(2, maxChars - 1))}…` : name;
            return (
              <text
                key={`label-${hierarchyNodeKey(node, index)}`}
                x={node.x}
                y={node.y}
                textAnchor="middle"
                dominantBaseline="central"
                fill="var(--foreground)"
                fontSize={fontSize}
                fontWeight={600}
                letterSpacing="-0.01em"
                pointerEvents="none"
              >
                {text}
              </text>
            );
          }

          // Parent / root: only label when the ring band above children is roomy.
          if (node.depth === 0) return null;
          const fontSize = 11;
          // Children fill most of the parent; park the name in the outer band.
          const childMaxR = node.children
            ? Math.max(...node.children.map((child) => child.r + Math.hypot(child.x - node.x, child.y - node.y)))
            : 0;
          const band = node.r - childMaxR;
          if (band < 12 || node.r < 36) return null;
          const maxChars = Math.max(4, Math.floor((node.r * 1.1) / (fontSize * 0.52)));
          const text =
            name.length > maxChars ? `${name.slice(0, Math.max(3, maxChars - 1))}…` : name;
          return (
            <text
              key={`label-${hierarchyNodeKey(node, index)}`}
              x={node.x}
              y={node.y - node.r + Math.min(14, band * 0.55)}
              textAnchor="middle"
              dominantBaseline="central"
              fill="var(--secondary-foreground)"
              fontSize={fontSize}
              fontWeight={600}
              letterSpacing="-0.01em"
              pointerEvents="none"
            >
              {text}
            </text>
          );
        })}
      </AccessibleSvg>
    </Shell>
  );
}

const defaultBundleLinks = [
  { source: "platform", target: "enterprise", value: 3 },
  { source: "product", target: "smb", value: 2 },
  { source: "marketing", target: "enterprise", value: 1 },
] satisfies readonly HierarchicalEdgeLinkDatum[];

const noBundleLinks: readonly HierarchicalEdgeLinkDatum[] = [];

export function HierarchicalEdgeBundling(props: HierarchicalEdgeBundlingProps = {}) {
  const data = props.data ?? defaultTree;
  const links = props.links ?? (props.data === undefined ? defaultBundleLinks : noBundleLinks);
  const title = props.title ?? "Hierarchical edge bundling";
  const validation = React.useMemo(() => validateTreeInput(data), [data]);
  const layout = React.useMemo(() => {
    if (!validation.ok) return null;
    const root = d3
      .cluster<TreeDatum>()
      .size([2 * Math.PI, 88])(d3.hierarchy(validation.data, (datum) => datum.children));
    const leaves = root.leaves();
    const leafMap = new Map<string, d3.HierarchyPointNode<TreeDatum>>();
    for (const leaf of leaves) {
      const id = leaf.data.id?.trim() || leaf.data.name.trim();
      if (leafMap.has(id)) {
        return { error: `Hierarchy leaf key ${JSON.stringify(id)} is duplicated.` } as const;
      }
      leafMap.set(id, leaf);
    }
    const resolved = [] as Array<{
      input: HierarchicalEdgeLinkDatum;
      source: d3.HierarchyPointNode<TreeDatum>;
      target: d3.HierarchyPointNode<TreeDatum>;
      path: d3.HierarchyPointNode<TreeDatum>[];
    }>;
    for (const [index, link] of links.entries()) {
      const source = leafMap.get(link.source);
      const target = leafMap.get(link.target);
      if (!source) return { error: `Bundled link ${index + 1} has an unresolved source ${JSON.stringify(link.source)}.` } as const;
      if (!target) return { error: `Bundled link ${index + 1} has an unresolved target ${JSON.stringify(link.target)}.` } as const;
      if (source === target) return { error: `Bundled link ${index + 1} cannot target itself.` } as const;
      if (link.value !== undefined && (!Number.isFinite(link.value) || link.value <= 0)) {
        return { error: `Bundled link ${index + 1} has an invalid value.` } as const;
      }
      resolved.push({
        input: link,
        source,
        target,
        path: source.path(target) as d3.HierarchyPointNode<TreeDatum>[],
      });
    }
    return { root, leaves, resolved } as const;
  }, [links, validation]);

  if (!validation.ok || !layout) {
    return (
      <ChartState
        title={title}
        message={!validation.ok ? validation.message : "No hierarchy layout to display."}
        className={props.className}
      />
    );
  }
  if ("error" in layout) {
    return (
      <ChartState
        title={title}
        message={layout.error ?? "Invalid bundled hierarchy input."}
        className={props.className}
      />
    );
  }

  const width = 400;
  const height = 240;
  const line = d3
    .lineRadial<d3.HierarchyPointNode<TreeDatum>>()
    .curve(d3.curveBundle.beta(0.85))
    .radius((node) => node.y)
    .angle((node) => node.x);
  return (
    <Shell className={props.className}>
      <AccessibleSvg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        title={title}
        description={
          props.description ??
          `${layout.leaves.length} hierarchy leaves connected by ${layout.resolved.length} validated bundled links.`
        }
      >
        <g transform={`translate(${width / 2},${height / 2})`}>
          {layout.resolved.map(({ input, source, target, path }, index) => {
            const label = input.label || `${source.data.name} to ${target.data.name}`;
            return (
              <path
                key={`${input.source}-${input.target}-${index}`}
                d={line(path) ?? ""}
                fill="none"
                stroke={colorAt(index)}
                strokeOpacity={0.42}
                strokeWidth={Math.min(4, 0.8 + Math.sqrt(input.value ?? 1))}
                tabIndex={0}
                role="img"
                aria-label={label}
              >
                <title>{label}</title>
              </path>
            );
          })}
          {layout.leaves.map((leaf, index) => {
            const label = `${leaf.data.name}, hierarchy leaf`;
            const angleDegrees = (leaf.x * 180) / Math.PI - 90;
            const onLeft = leaf.x >= Math.PI;
            return (
              <g
                key={leaf.data.id || `${leaf.data.name}-${index}`}
                transform={`rotate(${angleDegrees}) translate(${leaf.y},0)`}
                tabIndex={0}
                role="img"
                aria-label={label}
              >
                <title>{label}</title>
                <circle r={3.5} fill={colorAt(index)} />
                <text
                  x={onLeft ? -8 : 8}
                  transform={onLeft ? "rotate(180)" : undefined}
                  textAnchor={onLeft ? "end" : "start"}
                  dominantBaseline="central"
                  fill="var(--foreground)"
                  fontSize={7.5}
                >
                  {leaf.data.name}
                </text>
              </g>
            );
          })}
        </g>
      </AccessibleSvg>
    </Shell>
  );
}
