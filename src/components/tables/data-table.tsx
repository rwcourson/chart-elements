"use client";

import { cn, formatCompact } from "@/lib/utils";
import { ArrowDownRight, ArrowUpRight, ExternalLink, Minus } from "lucide-react";

export type TableColumn = {
  key: string;
  label: string;
  numeric?: boolean;
  format?: "number" | "percent" | "text";
};

export type DataTableProps = {
  columns: TableColumn[];
  rows: Record<string, string | number | null | undefined>[];
  showTotals?: boolean;
  conditionalBackground?: boolean;
  conditionalFont?: boolean;
  showIcons?: boolean;
  showDataBars?: boolean;
  linkKeys?: string[];
  imageKeys?: string[];
  sparklineKey?: string;
  /** Rendered as a visually hidden <caption> and used as the table's accessible name. */
  caption?: string;
};

function Spark({ values }: { values: number[] }) {
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const w = 64;
  const h = 20;
  const pts = values
    .map((v, i) => {
      const x = (i / Math.max(values.length - 1, 1)) * w;
      const y = h - ((v - min) / (max - min || 1)) * h;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg width={w} height={h} className="overflow-visible">
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
  showTotals,
  conditionalBackground,
  conditionalFont,
  showIcons,
  showDataBars,
  linkKeys = [],
  imageKeys = [],
  sparklineKey,
  caption,
}: DataTableProps) {
  const numericCols = columns.filter((c) => c.numeric);
  const maxByCol = Object.fromEntries(
    numericCols.map((c) => [
      c.key,
      Math.max(...rows.map((r) => Number(r[c.key] ?? 0)), 1),
    ]),
  );

  const totals = Object.fromEntries(
    numericCols.map((c) => [
      c.key,
      rows.reduce((s, r) => s + Number(r[c.key] ?? 0), 0),
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
        ...rows.map((r) => formatCompact(Number(r[c.key] ?? 0)).length),
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
  return (
    <div className="max-h-full overflow-auto rounded-[var(--radius)] border border-border">
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
            const last = ri === rows.length - 1 && !showTotals;
            return (
            <tr key={ri} className="hover:bg-muted/40">
              {columns.map((col) => {
                const raw = row[col.key];
                const num = Number(raw ?? 0);
                const intensity = col.numeric ? num / (maxByCol[col.key] || 1) : 0;
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
                        (num > (maxByCol[col.key] || 0) * 0.7
                          ? "text-[var(--chart-positive)]"
                          : num < (maxByCol[col.key] || 0) * 0.35
                            ? "text-[var(--chart-negative)]"
                            : ""),
                    )}
                    style={
                      conditionalBackground && col.numeric
                        ? {
                            background: `color-mix(in oklab, var(--chart-1) ${Math.round(intensity * 35)}%, transparent)`,
                          }
                        : undefined
                    }
                  >
                    {showDataBars && col.numeric ? (
                      /*
                        Bar and value get separate lanes. The bar used to be laid
                        across the whole cell underneath a right-aligned number,
                        so the fill ended at an arbitrary point relative to the
                        digits — one row's value sat inside its bar, the next
                        row's sat outside it. Now every bar starts and ends within
                        the same track, which is what makes the lengths comparable.
                      */
                      <span className="relative flex h-5 items-center overflow-hidden rounded-[3px] bg-[var(--chart-1)]/10">
                        <span
                          className="absolute inset-y-0 left-0 bg-[var(--chart-1)]/45"
                          style={{ width: `${Math.max(intensity * 100, 1.5)}%` }}
                        />
                        {/*
                          The value is a label on the track, not a sibling column:
                          giving each its own lane needed ~150px per column, which
                          pushed the last two columns out of the card. Anchoring it
                          to the track's right edge keeps the figures aligned and
                          leaves the full cell width for the bar.
                        */}
                        <span className="relative ml-auto pr-1.5 tabular-nums">
                          {formatCompact(num)}
                        </span>
                      </span>
                    ) : (
                    <span
                      className={cn(
                        "relative inline-flex items-center gap-1.5",
                        isImage && "justify-center",
                      )}
                    >
                      {showIcons && col.numeric ? (
                        num > (maxByCol[col.key] || 0) * 0.55 ? (
                          <ArrowUpRight className="h-3.5 w-3.5 text-[var(--chart-positive)]" />
                        ) : num < (maxByCol[col.key] || 0) * 0.4 ? (
                          <ArrowDownRight className="h-3.5 w-3.5 text-[var(--chart-negative)]" />
                        ) : (
                          <Minus className="h-3.5 w-3.5 text-muted-foreground" />
                        )
                      ) : null}
                      {isImage && typeof raw === "string" ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={raw}
                          alt=""
                          className="size-7 rounded-[var(--radius-sm)] object-cover"
                        />
                      ) : isLink && typeof raw === "string" ? (
                        <a
                          href={raw}
                          className="inline-flex items-center gap-1 text-accent hover:underline"
                          target="_blank"
                          rel="noreferrer"
                        >
                          Open <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : col.numeric ? (
                        <span
                          className="text-right tabular-nums"
                          style={{ minWidth: `${widthByCol[col.key]}ch` }}
                        >
                          {formatCompact(num)}
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
                        ? (row[sparklineKey] as unknown as number[])
                        : numericCols.map((c) => Number(row[c.key] ?? 0))
                    }
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
                      ? formatCompact(Number(totals[col.key] ?? 0))
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

export function MatrixTable({
  rows,
  rowKey,
  columns,
  showSubtotals,
  showGrandTotal,
  caption,
}: {
  rows: Record<string, string | number>[];
  rowKey: string;
  columns: string[];
  showSubtotals?: boolean;
  showGrandTotal?: boolean;
  /** Rendered as a visually hidden <caption> and used as the table's accessible name. */
  caption?: string;
}) {
  const tableCols: TableColumn[] = [
    { key: rowKey, label: "Group" },
    ...columns.map((c) => ({ key: c, label: c.toUpperCase(), numeric: true as const })),
  ];
  return (
    <DataTable
      columns={tableCols}
      rows={rows}
      showTotals={showGrandTotal || showSubtotals}
      conditionalBackground
      caption={caption ?? "Matrix table"}
    />
  );
}
