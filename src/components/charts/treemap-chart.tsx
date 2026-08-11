"use client";

import * as React from "react";
import * as d3 from "d3";
import { CHART_COLORS, foregroundAt } from "@/lib/chart-colors";
import { cn, formatCompact } from "@/lib/utils";
import { ChartEmpty, ScreenReaderTable } from "./chart-frame";

export type TreemapNode = {
  id?: string;
  name: string;
  value?: number;
  /** `size` is retained as a source-copy compatibility alias for `value`. */
  size?: number;
  children?: readonly TreemapNode[];
};

export type TreemapSelectionEvent = {
  id: string;
  node: TreemapNode;
  path: readonly string[];
  value: number;
};

export type TreemapChartProps = {
  data: readonly TreemapNode[];
  className?: string;
  ariaLabel?: string;
  activeId?: string | null;
  defaultActiveId?: string | null;
  onActiveChange?: (id: string | null) => void;
  selectedId?: string | null;
  defaultSelectedId?: string | null;
  onSelectionChange?: (event: TreemapSelectionEvent | null) => void;
  valueFormatter?: (value: number) => string;
  palette?: readonly string[];
};

type NormalizedTreemapNode = {
  id: string;
  name: string;
  value: number;
  source: TreemapNode;
  path: readonly string[];
  children?: NormalizedTreemapNode[];
};

function slug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "node";
}

function normalizeTreemapNodes(nodes: readonly TreemapNode[]) {
  const ids = new Set<string>();
  const ancestors = new WeakSet<object>();
  let invalid = 0;

  const walk = (
    node: TreemapNode,
    parentId: string,
    parentPath: readonly string[],
    index: number,
  ): NormalizedTreemapNode | null => {
    if (!node || typeof node !== "object" || !node.name?.trim() || ancestors.has(node)) {
      invalid += 1;
      return null;
    }
    ancestors.add(node);
    const baseId = node.id?.trim() || `${parentId}/${slug(node.name)}-${index + 1}`;
    let id = baseId;
    let suffix = 2;
    while (ids.has(id)) id = `${baseId}-${suffix++}`;
    if (id !== baseId) invalid += 1;
    ids.add(id);
    const path = [...parentPath, node.name];
    const children = (node.children ?? [])
      .map((child, childIndex) => walk(child, id, path, childIndex))
      .filter((child): child is NormalizedTreemapNode => child != null);
    ancestors.delete(node);
    const explicit = node.value ?? node.size;
    const childTotal = d3.sum(children, (child) => child.value);
    const value = children.length
      ? childTotal
      : Number.isFinite(explicit) && Number(explicit) > 0
        ? Number(explicit)
        : 0;
    if (value <= 0) {
      invalid += 1;
      return null;
    }
    return { id, name: node.name.trim(), value, source: node, path, ...(children.length ? { children } : {}) };
  };

  const values = nodes
    .map((node, index) => walk(node, "root", [], index))
    .filter((node): node is NormalizedTreemapNode => node != null);
  return { values, invalid };
}

function findTreemapNode(
  nodes: readonly NormalizedTreemapNode[],
  id: string | null | undefined,
): NormalizedTreemapNode | null {
  if (!id) return null;
  for (const node of nodes) {
    if (node.id === id) return node;
    const nested = findTreemapNode(node.children ?? [], id);
    if (nested) return nested;
  }
  return null;
}

function useControllableTreemapId({
  value,
  defaultValue,
  onChange,
}: {
  value?: string | null;
  defaultValue?: string | null;
  onChange?: (value: string | null) => void;
}) {
  const [internal, setInternal] = React.useState<string | null>(defaultValue ?? null);
  const current = value === undefined ? internal : value;
  const setCurrent = React.useCallback((next: string | null) => {
    if (value === undefined) setInternal(next);
    if (next !== current) onChange?.(next);
  }, [current, onChange, value]);
  return [current, setCurrent] as const;
}

export function TreemapChart({
  data,
  className,
  ariaLabel = "Hierarchical treemap",
  activeId,
  defaultActiveId,
  onActiveChange,
  selectedId,
  defaultSelectedId,
  onSelectionChange,
  valueFormatter = formatCompact,
  palette = CHART_COLORS,
}: TreemapChartProps) {
  const normalized = React.useMemo(() => normalizeTreemapNodes(data), [data]);
  const [currentActiveId, setActiveId] = useControllableTreemapId({ value: activeId, defaultValue: defaultActiveId, onChange: onActiveChange });
  const [currentSelectedId, setSelectedId] = useControllableTreemapId({
    value: selectedId,
    defaultValue: defaultSelectedId,
    onChange: (id) => {
      const node = findTreemapNode(normalized.values, id);
      onSelectionChange?.(node ? { id: node.id, node: node.source, path: node.path, value: node.value } : null);
    },
  });

  if (!normalized.values.length) return <ChartEmpty label="No valid treemap values" />;

  const active = findTreemapNode(normalized.values, currentActiveId);
  const visible = active?.children?.length ? active.children : normalized.values;
  const ancestors: NormalizedTreemapNode[] = [];
  if (active) {
    for (let depth = 1; depth <= active.path.length; depth += 1) {
      const name = active.path[depth - 1];
      const node = findTreemapNode(normalized.values, depth === active.path.length ? active.id : null) ??
        (() => {
          const scan = (items: readonly NormalizedTreemapNode[]): NormalizedTreemapNode | null => {
            for (const item of items) {
              if (item.path.length === depth && item.path.every((part, index) => part === active.path[index])) return item;
              const child = scan(item.children ?? []);
              if (child) return child;
            }
            return null;
          };
          return scan(normalized.values);
        })();
      if (node && node.name === name) ancestors.push(node);
    }
  }

  const width = 560;
  const height = 260;
  const hierarchy = d3
    .hierarchy<NormalizedTreemapNode>({
      id: "view",
      name: active?.name ?? "All",
      value: d3.sum(visible, (node) => node.value),
      source: active?.source ?? { name: "All" },
      path: active?.path ?? [],
      children: [...visible],
    })
    .sum((node) => node.children?.length ? 0 : node.value)
    .sort((a, b) => (b.value ?? 0) - (a.value ?? 0));
  const layout = d3.treemap<NormalizedTreemapNode>().size([width, height]).paddingInner(3).paddingOuter(1).round(true)(hierarchy);
  const cells = layout.children ?? [];
  const colors = palette.length ? palette : CHART_COLORS;

  const activate = (node: NormalizedTreemapNode) => {
    if (node.children?.length) setActiveId(node.id);
    else setSelectedId(currentSelectedId === node.id ? null : node.id);
  };

  return (
    <section className={cn("flex h-full min-h-0 w-full flex-col", className)} aria-label={ariaLabel}>
      <nav aria-label="Treemap breadcrumb" className="flex min-h-11 items-center gap-1 overflow-x-auto px-1 text-xs">
        <button type="button" onClick={() => setActiveId(null)} aria-current={!active ? "location" : undefined} className="min-h-9 shrink-0 rounded-md px-2 font-medium text-muted-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">All</button>
        {ancestors.map((node) => (
          <React.Fragment key={node.id}>
            <span aria-hidden="true" className="text-muted-foreground">/</span>
            <button type="button" onClick={() => setActiveId(node.children?.length ? node.id : currentActiveId)} aria-current={currentActiveId === node.id ? "location" : undefined} className="min-h-9 shrink-0 rounded-md px-2 font-medium text-muted-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{node.name}</button>
          </React.Fragment>
        ))}
      </nav>
      <svg viewBox={`0 0 ${width} ${height}`} className="min-h-0 w-full flex-1" preserveAspectRatio="xMidYMid meet" role="group" aria-label={`${ariaLabel}: ${active?.name ?? "all categories"}`}>
        <title>{ariaLabel}</title>
        <desc>{active ? `Showing the children of ${active.name}.` : "Showing top-level categories."} Select a group to drill into it.</desc>
        {cells.map((cell, index) => {
          const node = cell.data;
          const cellWidth = cell.x1 - cell.x0;
          const cellHeight = cell.y1 - cell.y0;
          const fill = colors[index % colors.length] ?? CHART_COLORS[0];
          const labelColor = foregroundAt(index % colors.length);
          const selected = currentSelectedId === node.id;
          const label = `${node.path.join(" / ")}: ${valueFormatter(node.value)}${node.children?.length ? ", group" : ""}`;
          return (
            <g
              key={node.id}
              role="button"
              tabIndex={0}
              aria-label={label}
              aria-pressed={!node.children?.length ? selected : undefined}
              onClick={() => activate(node)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  activate(node);
                }
              }}
              className="cursor-pointer focus:outline-none"
            >
              <title>{label}</title>
              <rect x={cell.x0} y={cell.y0} width={cellWidth} height={cellHeight} rx={5} fill={fill} stroke={selected ? "var(--ring)" : "var(--card)"} strokeWidth={selected ? 4 : 2} />
              {cellWidth >= 58 && cellHeight >= 34 ? (
                <>
                  <text x={cell.x0 + 9} y={cell.y0 + 17} fill={labelColor} fontSize={12} fontWeight={650}>{node.name.length > Math.max(5, Math.floor(cellWidth / 7)) ? `${node.name.slice(0, Math.max(4, Math.floor(cellWidth / 7) - 1))}…` : node.name}</text>
                  {cellHeight >= 54 ? <text x={cell.x0 + 9} y={cell.y0 + 35} fill={labelColor} fillOpacity={0.82} fontSize={11}>{valueFormatter(node.value)}{node.children?.length ? " · open" : ""}</text> : null}
                </>
              ) : null}
            </g>
          );
        })}
      </svg>
      {normalized.invalid ? <p role="status" className="px-2 text-[11px] text-muted-foreground">{normalized.invalid} invalid, duplicate, cyclic, or non-positive node{normalized.invalid === 1 ? " was" : "s were"} omitted.</p> : null}
      <ScreenReaderTable>
        <caption>{active ? `${active.name} children` : "Top-level treemap categories"}</caption>
        <thead><tr><th scope="col">Path</th><th scope="col">Value</th><th scope="col">Kind</th></tr></thead>
        <tbody>{visible.map((node) => <tr key={node.id}><th scope="row">{node.path.join(" / ")}</th><td>{valueFormatter(node.value)}</td><td>{node.children?.length ? "Group" : "Leaf"}</td></tr>)}</tbody>
      </ScreenReaderTable>
    </section>
  );
}
