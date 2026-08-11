"use client";

import { cn, formatCompact } from "@/lib/utils";
import { ArrowDownRight, ArrowRight, ArrowUpRight, ChevronDown, ExternalLink, Minus } from "lucide-react";
import { useMemo, useState, type Key, type ReactNode } from "react";

export type TableCellValue = string | number | readonly number[] | null | undefined;

export type TableRow = Record<string, TableCellValue>;

export type TableValueFormatter = (
  value: TableCellValue,
  row: TableRow,
) => ReactNode;

export type TableColumn = {
  key: string;
  label: string;
  numeric?: boolean;
  format?: "number" | "percent" | "text" | TableValueFormatter;
  imageAlt?: string | ((row: TableRow) => string);
  linkLabel?: string | ((row: TableRow) => string);
  render?: TableValueFormatter;
};

export type DataTableProps = {
  columns: TableColumn[];
  rows: TableRow[];
  rowId?: string | ((row: TableRow, index: number) => Key);
  locale?: string;
  showTotals?: boolean;
  conditionalBackground?: boolean;
  conditionalFont?: boolean;
  showIcons?: boolean;
  showDataBars?: boolean;
  linkKeys?: string[];
  imageKeys?: string[];
  sparklineKey?: string;
  onRowSelect?: (row: TableRow, index: number) => void;
  selectedRowIds?: ReadonlySet<Key>;
  /** Rendered as a visually hidden <caption> and used as the table's accessible name. */
  caption?: string;
};

function finiteNumber(value: TableCellValue): number | null {
  if (Array.isArray(value)) return null;
  const number = typeof value === "number" ? value : Number(value);
  return Number.isFinite(number) ? number : null;
}

function safeExternalUrl(value: string): string | null {
  try {
    const url = new URL(value, "https://chart-elements.invalid");
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return value;
  } catch {
    return null;
  }
}

function formatValue(
  value: TableCellValue,
  column: TableColumn,
  row: TableRow,
  locale: string,
): ReactNode {
  if (column.render) return column.render(value, row);
  if (typeof column.format === "function") return column.format(value, row);
  if (column.format === "text" || !column.numeric) return String(value ?? "");

  const number = finiteNumber(value);
  if (number === null) return "—";
  if (column.format === "percent") {
    return new Intl.NumberFormat(locale, {
      style: "percent",
      maximumFractionDigits: 1,
    }).format(number);
  }
  return formatCompact(number);
}

function Spark({ values, label }: { values: readonly number[]; label: string }) {
  const finiteValues = values.filter(Number.isFinite);
  if (finiteValues.length === 0) return <span className="text-muted-foreground">—</span>;
  const max = Math.max(...finiteValues, 1);
  const min = Math.min(...finiteValues, 0);
  const w = 64;
  const h = 20;
  const pts = finiteValues
    .map((v, i) => {
      const x = (i / Math.max(finiteValues.length - 1, 1)) * w;
      const y = h - ((v - min) / (max - min || 1)) * h;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg width={w} height={h} className="overflow-visible" role="img" aria-label={label}>
      <polyline
        fill="none"
        stroke="var(--chart-1)"
        strokeWidth="1.5"
        points={pts}
      />
    </svg>
  );
}

export function DataTable({
  columns,
  rows,
  rowId,
  locale = "en-US",
  showTotals,
  conditionalBackground,
  conditionalFont,
  showIcons,
  showDataBars,
  linkKeys = [],
  imageKeys = [],
  sparklineKey,
  onRowSelect,
  selectedRowIds,
  caption,
}: DataTableProps) {
  const numericCols = columns.filter((c) => c.numeric);
  const extentByCol = Object.fromEntries(
    numericCols.map((column) => {
      const values = rows
        .map((row) => finiteNumber(row[column.key]))
        .filter((value): value is number => value !== null);
      return [
        column.key,
        {
          min: values.length ? Math.min(...values) : 0,
          max: values.length ? Math.max(...values) : 0,
        },
      ];
    }),
  ) as Record<string, { min: number; max: number }>;

  const totals = Object.fromEntries(
    numericCols.map((c) => [
      c.key,
      rows.reduce((sum, row) => sum + (finiteNumber(row[c.key]) ?? 0), 0),
    ]),
  );

  // Widest formatted value per column, in characters. The value sits in a box of
  // this width so that a 2-digit row and a 3-digit row put their trend arrow at
  // the same x — right-aligning the arrow and number together as one group made
  // the arrows step in and out down the column.
  const widthByCol = Object.fromEntries(
    numericCols.map((c) => [
      c.key,
      Math.max(
        ...rows.map((row) => {
          const formatted = formatValue(row[c.key], c, row, locale);
          return typeof formatted === "string" || typeof formatted === "number"
            ? String(formatted).length
            : 1;
        }),
        1,
      ),
    ]),
  );

  /**
   * Columns whose content is a fixed size — a 28px thumbnail, an "Open" link, a
   * sparkline — shrink to fit instead of taking an equal share of the table.
   * `w-0` on an auto-layout table resolves to min-content, and the text columns
   * absorb what is left. Without it a two-column table put a 28px avatar in the
   * middle of a 385px column.
   */
  const hugs = new Set([...imageKeys, ...linkKeys]);
  const images = new Set(imageKeys);
  const hugClass = "w-0 whitespace-nowrap";
  // Shared cell rhythm: header and body use the same vertical pad so a short
  // label row and a 28px avatar row share one baseline height.
  const cellPad = "py-2.5";
  // Image columns are only as wide as the thumbnail; less horizontal pad keeps
  // the centered glyph under its header instead of floating in empty gutter.
  const cellX = (key: string) => (images.has(key) ? "px-2" : "px-3");

  // max-h rather than h: a short table hugs its rows instead of framing a
  // block of empty space, while a long one still scrolls inside the card.
  if (!rows.length) {
    return (
      <div
        className="flex h-full min-h-[120px] flex-col items-center justify-center gap-1 rounded-[var(--radius)] border border-dashed border-border bg-muted/40 px-4 py-8 text-center"
        role="status"
        aria-live="polite"
      >
        <span className="text-sm font-medium text-foreground">No rows</span>
        <span className="text-[13px] text-muted-foreground">
          {caption ? `${caption} has no data to show.` : "This table has no data to show."}
        </span>
      </div>
    );
  }

  return (
    <div
      className="max-h-full overflow-auto rounded-[var(--radius)] border border-border"
      tabIndex={0}
      aria-label={caption ? `Scrollable ${caption}` : "Scrollable data table"}
    >
      <table
        className="w-full border-collapse text-sm"
        aria-label={caption ? undefined : "Data table"}
      >
        {caption ? <caption className="sr-only">{caption}</caption> : null}
        {/*
          Opaque, and deliberately not `backdrop-blur`: a backdrop-filtered layer
          is not clipped by an ancestor's border-radius in Chromium, so the
          header's square corner cut through the wrapper's rounded corner. An
          opaque header also stops rows from ghosting through as they scroll under.
        */}
        <thead className="sticky top-0 bg-muted">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className={cn(
                  cellPad,
                  cellX(col.key),
                  "border-b border-border text-xs font-medium text-muted-foreground",
                  images.has(col.key) ? "text-center" : "text-left",
                  col.numeric && "text-right",
                  hugs.has(col.key) && hugClass,
                )}
              >
                {col.label}
              </th>
            ))}
            {sparklineKey ? (
              <th
                scope="col"
                className={cn(
                  cellPad,
                  "px-3",
                  "border-b border-border text-center text-xs font-medium text-muted-foreground",
                  hugClass,
                )}
              >
                Trend
              </th>
            ) : null}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => {
            const resolvedRowId =
              typeof rowId === "function"
                ? rowId(row, ri)
                : rowId
                  ? String(row[rowId] ?? ri)
                  : ri;
            const selected = selectedRowIds?.has(resolvedRowId) ?? false;
            const last = ri === rows.length - 1 && !showTotals;
            return (
            <tr
              key={resolvedRowId}
              className={cn("hover:bg-muted/40", selected && "bg-muted/60", onRowSelect && "cursor-pointer")}
              aria-selected={onRowSelect ? selected : undefined}
              tabIndex={onRowSelect ? 0 : undefined}
              onClick={onRowSelect ? () => onRowSelect(row, ri) : undefined}
              onKeyDown={
                onRowSelect
                  ? (event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        onRowSelect(row, ri);
                      }
                    }
                  : undefined
              }
            >
              {columns.map((col) => {
                const raw = row[col.key];
                const num = finiteNumber(raw);
                const extent = extentByCol[col.key] ?? { min: 0, max: 0 };
                const span = Math.max(extent.max - extent.min, 1);
                const intensity = col.numeric && num !== null ? (num - extent.min) / span : 0;
                const magnitude = num === null
                  ? 0
                  : Math.abs(num) / Math.max(Math.abs(extent.min), Math.abs(extent.max), 1);
                const isLink = linkKeys.includes(col.key);
                const isImage = images.has(col.key);

                return (
                  <td
                    key={col.key}
                    className={cn(
                      "relative align-middle",
                      cellPad,
                      cellX(col.key),
                      // The wrapper already draws the outer edge; a border on the
                      // last row stacks a second hairline against it.
                      !last && "border-b border-border",
                      isImage ? "text-center" : col.numeric ? "text-right tabular-nums" : "text-left",
                      hugs.has(col.key) && hugClass,
                      conditionalFont &&
                        col.numeric &&
                        num !== null &&
                        (num > extent.min + span * 0.7
                          ? "text-[var(--chart-positive)]"
                          : num < extent.min + span * 0.35
                            ? "text-[var(--chart-negative)]"
                            : ""),
                    )}
                    style={
                      conditionalBackground && col.numeric
                        ? {
                            background: `color-mix(in oklab, var(--chart-1) ${Math.round(Math.max(0, Math.min(1, intensity)) * 35)}%, transparent)`,
                          }
                        : undefined
                    }
                  >
                    {showDataBars && col.numeric && num !== null ? (
                      /*
                        Bar and value get separate lanes. The bar used to be laid
                        across the whole cell underneath a right-aligned number,
                        so the fill ended at an arbitrary point relative to the
                        digits — one row's value sat inside its bar, the next
                        row's sat outside it. Now every bar starts and ends within
                        the same track, which is what makes the lengths comparable.
                      */
                      <span className="relative flex h-5 items-center overflow-hidden rounded-[3px] bg-[var(--chart-1)]/10">
                        {extent.min < 0 && extent.max > 0 ? (
                          <span
                            className="absolute inset-y-0 w-px bg-foreground/40"
                            style={{ left: `${(-extent.min / span) * 100}%` }}
                            aria-hidden="true"
                          />
                        ) : null}
                        <span
                          className={cn(
                            "absolute inset-y-0",
                            num < 0 ? "bg-[var(--chart-negative)]/45" : "bg-[var(--chart-1)]/45",
                          )}
                          style={
                            extent.min < 0 && extent.max > 0
                              ? num < 0
                                ? { right: `${(extent.max / span) * 100}%`, width: `${magnitude * 100}%` }
                                : { left: `${(-extent.min / span) * 100}%`, width: `${magnitude * 100}%` }
                              : { left: 0, width: `${Math.max(magnitude * 100, 1.5)}%` }
                          }
                        />
                        {/*
                          The value is a label on the track, not a sibling column:
                          giving each its own lane needed ~150px per column, which
                          pushed the last two columns out of the card. Anchoring it
                          to the track's right edge keeps the figures aligned and
                          leaves the full cell width for the bar.
                        */}
                        <span className="relative ml-auto pr-1.5 tabular-nums">
                          {formatValue(raw, col, row, locale)}
                        </span>
                      </span>
                    ) : (
                    <span
                      className={cn(
                        "relative inline-flex items-center gap-1.5",
                        isImage && "justify-center",
                      )}
                    >
                      {showIcons && col.numeric && num !== null ? (
                        num > extent.min + span * 0.55 ? (
                          <ArrowUpRight className="h-3.5 w-3.5 text-[var(--chart-positive)]" />
                        ) : num < extent.min + span * 0.4 ? (
                          <ArrowDownRight className="h-3.5 w-3.5 text-[var(--chart-negative)]" />
                        ) : (
                          <Minus className="h-3.5 w-3.5 text-muted-foreground" />
                        )
                      ) : null}
                      {isImage && typeof raw === "string" ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={raw}
                          alt={
                            typeof col.imageAlt === "function"
                              ? col.imageAlt(row)
                              : col.imageAlt ?? ""
                          }
                          className="size-7 rounded-[var(--radius-sm)] object-cover"
                        />
                      ) : isLink && typeof raw === "string" && safeExternalUrl(raw) ? (
                        <a
                          href={raw}
                          className="inline-flex items-center gap-1 text-accent hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {typeof col.linkLabel === "function"
                            ? col.linkLabel(row)
                            : col.linkLabel ?? "Open"}{" "}
                          <ExternalLink className="h-3 w-3" aria-hidden="true" />
                        </a>
                      ) : isLink && typeof raw === "string" ? (
                        <span className="text-muted-foreground" title="Only HTTP and HTTPS links are supported">
                          Invalid link
                        </span>
                      ) : col.numeric ? (
                        <span
                          className="text-right tabular-nums"
                          style={{ minWidth: `${widthByCol[col.key]}ch` }}
                        >
                          {formatValue(raw, col, row, locale)}
                        </span>
                      ) : (
                        String(raw ?? "")
                      )}
                    </span>
                    )}
                  </td>
                );
              })}
              {sparklineKey ? (
                <td
                  className={cn(
                    "align-middle px-3 text-center",
                    cellPad,
                    !last && "border-b border-border",
                    hugClass,
                  )}
                >
                  <Spark
                    values={
                      Array.isArray(row[sparklineKey])
                        ? (row[sparklineKey] as readonly number[])
                        : numericCols
                            .map((column) => finiteNumber(row[column.key]))
                            .filter((value): value is number => value !== null)
                    }
                    label={`${caption ?? "Data table"}, row ${ri + 1} trend`}
                  />
                </td>
              ) : null}
            </tr>
            );
          })}
          {showTotals ? (
            <tr className="bg-muted/50 font-semibold">
              {columns.map((col, i) => (
                <td
                  key={col.key}
                  className={cn(
                    "align-middle",
                    cellPad,
                    cellX(col.key),
                    images.has(col.key) ? "text-center" : col.numeric ? "text-right tabular-nums" : "text-left",
                    hugs.has(col.key) && hugClass,
                  )}
                >
                  {i === 0
                    ? "Total"
                    : col.numeric
                      ? formatValue(totals[col.key], col, rows[0] ?? {}, locale)
                      : ""}
                </td>
              ))}
              {sparklineKey ? <td className={cn(cellPad, "px-3")} /> : null}
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}

export type MatrixRow = {
  id?: string;
  children?: MatrixRow[];
  [key: string]: string | number | MatrixRow[] | null | undefined;
};

export type MatrixTableProps = {
  rows: MatrixRow[];
  rowKey: string;
  columns: string[];
  showSubtotals?: boolean;
  showGrandTotal?: boolean;
  caption?: string;
  expandedIds?: ReadonlySet<string>;
  defaultExpandedIds?: Iterable<string>;
  onExpandedChange?: (expandedIds: ReadonlySet<string>) => void;
};

function matrixLeafRows(rows: readonly MatrixRow[]): MatrixRow[] {
  return rows.flatMap((row) =>
    row.children?.length ? matrixLeafRows(row.children) : [row],
  );
}

export function MatrixTable({
  rows,
  rowKey,
  columns,
  showSubtotals,
  showGrandTotal,
  caption,
  expandedIds,
  defaultExpandedIds,
  onExpandedChange,
}: MatrixTableProps) {
  const [uncontrolledExpanded, setUncontrolledExpanded] = useState<Set<string>>(
    () => new Set(defaultExpandedIds),
  );
  const expanded = expandedIds ?? uncontrolledExpanded;

  const toggleExpanded = (id: string) => {
    const next = new Set(expanded);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    if (!expandedIds) setUncontrolledExpanded(next);
    onExpandedChange?.(next);
  };

  const flattenedRows = useMemo(() => {
    const flattened: TableRow[] = [];
    const walk = (items: readonly MatrixRow[], depth: number, parentPath: string) => {
      items.forEach((row, index) => {
        const label = String(row[rowKey] ?? "");
        const id = row.id ?? `${parentPath}/${label || index}`;
        const children = row.children ?? [];
        const leaves = children.length ? matrixLeafRows(children) : [row];
        const values = Object.fromEntries(
          columns.map((column) => {
            const explicit = finiteNumber(row[column] as TableCellValue);
            const aggregate = leaves.reduce(
              (sum, leaf) => sum + (finiteNumber(leaf[column] as TableCellValue) ?? 0),
              0,
            );
            return [column, explicit ?? aggregate];
          }),
        );
        flattened.push({
          ...values,
          [rowKey]: label,
          __matrixId: id,
          __matrixDepth: depth,
          __matrixHasChildren: children.length ? 1 : 0,
          __matrixExpanded: expanded.has(id) ? 1 : 0,
          __matrixKind: children.length ? "group" : "value",
        });
        if (children.length && expanded.has(id)) {
          walk(children, depth + 1, id);
          if (showSubtotals) {
            flattened.push({
              ...Object.fromEntries(
                columns.map((column) => [
                  column,
                  leaves.reduce(
                    (sum, leaf) => sum + (finiteNumber(leaf[column] as TableCellValue) ?? 0),
                    0,
                  ),
                ]),
              ),
              [rowKey]: `${label} subtotal`,
              __matrixId: `${id}/subtotal`,
              __matrixDepth: depth + 1,
              __matrixHasChildren: 0,
              __matrixExpanded: 0,
              __matrixKind: "subtotal",
            });
          }
        }
      });
    };
    walk(rows, 0, "matrix");

    if (showGrandTotal) {
      const leaves = matrixLeafRows(rows);
      flattened.push({
        ...Object.fromEntries(
          columns.map((column) => [
            column,
            leaves.reduce(
              (sum, leaf) => sum + (finiteNumber(leaf[column] as TableCellValue) ?? 0),
              0,
            ),
          ]),
        ),
        [rowKey]: "Grand total",
        __matrixId: "matrix/grand-total",
        __matrixDepth: 0,
        __matrixHasChildren: 0,
        __matrixExpanded: 0,
        __matrixKind: "grand-total",
      });
    }
    return flattened;
  }, [columns, expanded, rowKey, rows, showGrandTotal, showSubtotals]);

  const tableCols: TableColumn[] = [
    {
      key: rowKey,
      label: "Group",
      render: (value, row) => {
        const id = String(row.__matrixId ?? "");
        const depth = finiteNumber(row.__matrixDepth) ?? 0;
        const hasChildren = finiteNumber(row.__matrixHasChildren) === 1;
        const isExpanded = finiteNumber(row.__matrixExpanded) === 1;
        const kind = String(row.__matrixKind ?? "value");
        return (
          <span
            className={cn(
              "inline-flex min-h-7 items-center gap-1",
              (kind === "subtotal" || kind === "grand-total") && "font-semibold",
            )}
            style={{ paddingInlineStart: `${depth * 16}px` }}
          >
            {hasChildren ? (
              <button
                type="button"
                className="inline-flex size-7 items-center justify-center rounded-sm hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                aria-label={`${isExpanded ? "Collapse" : "Expand"} ${String(value ?? "group")}`}
                aria-expanded={isExpanded}
                onClick={() => toggleExpanded(id)}
              >
                {isExpanded ? <ChevronDown className="size-4" /> : <ArrowRight className="size-4" />}
              </button>
            ) : (
              <span className="inline-block size-7" aria-hidden="true" />
            )}
            {String(value ?? "")}
          </span>
        );
      },
    },
    ...columns.map((c) => ({ key: c, label: c.toUpperCase(), numeric: true as const })),
  ];
  return (
    <DataTable
      columns={tableCols}
      rows={flattenedRows}
      rowId="__matrixId"
      conditionalBackground
      caption={caption ?? "Matrix table"}
    />
  );
}
