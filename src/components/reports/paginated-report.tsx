"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  paginateReport,
  type PaginatedReportLayout,
  type PaginatedReportRow,
  type ReportFlowBlock,
  type ReportPageSpec,
  type ReportPaginationOptions,
  type ReportSupplement,
} from "./pagination";
import { DEFAULT_PAGINATED_REPORT_ROWS } from "./report-fixtures";
import {
  getPaginatedReportVariant,
  type PaginatedReportVariant,
  type ReportVariantPresentation,
} from "./report-variants";

export type PaginatedReportProps = {
  className?: string;
  variant?: PaginatedReportVariant;
  rows?: readonly PaginatedReportRow[];
  title?: string;
  description?: string;
  page?: ReportPageSpec;
  pagination?: Partial<Omit<ReportPaginationOptions, "page">>;
  maxPreviewPages?: number;
  locale?: string;
  currency?: string;
};

type ReportFormatters = {
  integer: Intl.NumberFormat;
  currency: Intl.NumberFormat;
};

function createFormatters(locale: string, currency: string): ReportFormatters | undefined {
  try {
    return {
      integer: new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }),
      currency: new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
      }),
    };
  } catch {
    return undefined;
  }
}

function ReportConfigurationState({
  title,
  message,
  className,
}: {
  title: string;
  message: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex min-h-56 w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-[var(--border)] bg-[var(--muted)]/20 px-8 text-center",
        className,
      )}
      role="status"
      tabIndex={0}
    >
      <strong className="text-sm font-semibold text-[var(--foreground)]">{title}</strong>
      <span className="max-w-lg text-xs leading-relaxed text-[var(--muted-foreground)]">
        {message}
      </span>
    </div>
  );
}

function groupTotals(rows: readonly PaginatedReportRow[]) {
  const groups = new Map<string, { quantity: number; amount: number; teams: Map<string, number> }>();
  for (const row of rows) {
    const group = groups.get(row.group) ?? { quantity: 0, amount: 0, teams: new Map<string, number>() };
    group.quantity += row.quantity;
    group.amount += row.amount;
    const team = row.subgroup || "Unassigned";
    group.teams.set(team, (group.teams.get(team) ?? 0) + row.amount);
    groups.set(row.group, group);
  }
  return groups;
}

function SupplementView({
  supplement,
  rows,
  formatters,
}: {
  supplement: ReportSupplement;
  rows: readonly PaginatedReportRow[];
  formatters: ReportFormatters;
}) {
  const totals = groupTotals(rows);
  const entries = [...totals.entries()];
  const maximum = Math.max(...entries.map(([, value]) => value.amount), 1);
  if (supplement.kind === "chart") {
    return (
      <section className="flex h-full flex-col gap-1.5 rounded border border-[var(--border)] bg-[var(--muted)]/15 p-2" aria-label={supplement.title}>
        <div>
          <h4 className="text-[8px] font-bold text-[var(--foreground)]">{supplement.title}</h4>
          <p className="text-[6px] text-[var(--muted-foreground)]">{supplement.description}</p>
        </div>
        <svg viewBox="0 0 300 54" className="min-h-0 flex-1" role="img" aria-label={`${supplement.title}, bar summary`}>
          <title>{supplement.title}</title>
          <desc>{supplement.description}</desc>
          {entries.map(([group, total], index) => {
            const width = (total.amount / maximum) * 212;
            return (
              <g key={group} transform={`translate(68,${4 + index * 13})`}>
                <text x={-4} y={5} textAnchor="end" dominantBaseline="central" fill="var(--foreground)" fontSize={6.5}>
                  {group}
                </text>
                <rect width={212} height={9} rx={2} fill="var(--muted)" />
                <rect width={width} height={9} rx={2} fill={`var(--chart-${(index % 6) + 1})`} />
                <text x={Math.min(width + 4, 210)} y={5} dominantBaseline="central" fill="var(--foreground)" fontSize={6}>
                  {formatters.currency.format(total.amount)}
                </text>
              </g>
            );
          })}
        </svg>
      </section>
    );
  }
  if (supplement.kind === "matrix") {
    const teams = [...new Set(rows.map((row) => row.subgroup || "Unassigned"))];
    return (
      <section className="h-full overflow-hidden rounded border border-[var(--border)]" aria-label={supplement.title}>
        <div className="border-b border-[var(--border)] bg-[var(--muted)]/30 px-2 py-1">
          <h4 className="text-[8px] font-bold text-[var(--foreground)]">{supplement.title}</h4>
          <p className="text-[6px] text-[var(--muted-foreground)]">{supplement.description}</p>
        </div>
        <table className="w-full border-collapse text-[6.5px]" aria-label={supplement.title}>
          <thead>
            <tr className="bg-[var(--muted)]/20">
              <th className="px-1.5 py-1 text-left">Region</th>
              {teams.map((team) => <th key={team} className="px-1.5 py-1 text-right">{team}</th>)}
              <th className="px-1.5 py-1 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {entries.map(([group, total]) => (
              <tr key={group} className="border-t border-[var(--border)]/60">
                <th className="px-1.5 py-1 text-left font-medium">{group}</th>
                {teams.map((team) => <td key={team} className="px-1.5 py-1 text-right">{formatters.currency.format(total.teams.get(team) ?? 0)}</td>)}
                <td className="px-1.5 py-1 text-right font-semibold">{formatters.currency.format(total.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    );
  }
  if (supplement.kind === "subreport") {
    return (
      <section className="flex h-full flex-col justify-between rounded border border-[var(--border)] bg-[var(--card)] p-2" aria-label={supplement.title}>
        <div>
          <span className="text-[6px] font-bold uppercase tracking-[0.14em] text-[var(--muted-foreground)]">Nested subreport</span>
          <h4 className="mt-0.5 text-[9px] font-bold text-[var(--foreground)]">{supplement.title}</h4>
          <p className="text-[6.5px] text-[var(--muted-foreground)]">{supplement.description}</p>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          <MiniMetric label="Rows" value={formatters.integer.format(rows.length)} />
          <MiniMetric label="Quantity" value={formatters.integer.format(rows.reduce((total, row) => total + row.quantity, 0))} />
          <MiniMetric label="Amount" value={formatters.currency.format(rows.reduce((total, row) => total + row.amount, 0))} />
        </div>
      </section>
    );
  }
  return (
    <section className="flex h-full items-center justify-between gap-3 rounded border border-[var(--border)] bg-[var(--muted)]/20 px-3 py-2" aria-label={supplement.title}>
      <div>
        <h4 className="text-[8px] font-bold text-[var(--foreground)]">{supplement.title}</h4>
        <p className="text-[6.5px] leading-relaxed text-[var(--muted-foreground)]">{supplement.description}</p>
      </div>
      <span className="shrink-0 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--card)] px-2 py-1 text-[6px] font-semibold text-[var(--foreground)]">
        {rows.length} rows
      </span>
    </section>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded bg-[var(--muted)]/25 px-2 py-1">
      <div className="text-[5.5px] uppercase tracking-wide text-[var(--muted-foreground)]">{label}</div>
      <div className="truncate text-[8px] font-bold text-[var(--foreground)]">{value}</div>
    </div>
  );
}

function ReportBlockView({
  block,
  bodyHeight,
  rows,
  formatters,
  presentation,
  showRunningTotals,
  instanceId,
}: {
  block: ReportFlowBlock;
  bodyHeight: number;
  rows: readonly PaginatedReportRow[];
  formatters: ReportFormatters;
  presentation: ReportVariantPresentation;
  showRunningTotals: boolean;
  instanceId: string;
}) {
  const style = { height: `${(block.height / bodyHeight) * 100}%` };
  const columns = showRunningTotals ? "grid-cols-[1.4fr_.55fr_.75fr_.8fr]" : "grid-cols-[1.55fr_.55fr_.8fr]";
  if (block.kind === "column-header") {
    return (
      <div
        className={cn("grid items-center border-y border-[var(--border)] bg-[var(--muted)]/30 px-2 text-[6.5px] font-bold uppercase tracking-wide text-[var(--muted-foreground)]", columns)}
        style={style}
        role="row"
        aria-label={block.repeated ? "Repeated detail column header" : "Detail column header"}
      >
        <span role="columnheader">Account</span>
        <span role="columnheader" className="text-right">Qty</span>
        <span role="columnheader" className="text-right">Amount</span>
        {showRunningTotals ? <span role="columnheader" className="text-right">Running</span> : null}
      </div>
    );
  }
  if (block.kind === "group-header" || block.kind === "subgroup-header") {
    return (
      <div
        id={`${instanceId}-${block.id}`}
        className={cn(
          "flex items-center border-b border-[var(--border)] px-2 font-bold text-[var(--foreground)]",
          block.level === 1 ? "bg-[var(--chart-1)]/10 text-[8px]" : "bg-[var(--muted)]/20 pl-4 text-[7px]",
        )}
        style={style}
        role="row"
      >
        <span role="rowheader" aria-label={`${block.level === 1 ? "Group" : "Subgroup"}: ${block.label}`}>
          {block.label}
        </span>
      </div>
    );
  }
  if (block.kind === "row") {
    const content = <span className="truncate font-medium text-[var(--foreground)]">{block.row.label}</span>;
    if (presentation.body === "list") {
      return (
        <article
          id={`${instanceId}-report-row-${block.row.id}`}
          className="mx-1 grid grid-cols-[1fr_auto] items-center gap-2 border-b border-[var(--border)]/70 px-2 text-[7px] target:ring-2 target:ring-[var(--ring)]"
          style={style}
          role="listitem"
          aria-label={`${block.row.label}, quantity ${block.row.quantity}, amount ${formatters.currency.format(block.row.amount)}`}
        >
          <div className="min-w-0">
            {content}
            <div className="truncate text-[5.5px] text-[var(--muted-foreground)]">{block.row.group} · {block.row.subgroup || "Unassigned"}</div>
          </div>
          <strong className="text-[var(--foreground)]">{formatters.currency.format(block.row.amount)}</strong>
        </article>
      );
    }
    return (
      <div
        id={`${instanceId}-report-row-${block.row.id}`}
        className={cn("grid items-center border-b border-[var(--border)]/70 px-2 text-[7px] target:ring-2 target:ring-[var(--ring)]", columns)}
        style={style}
        role="row"
      >
        <span role="cell" className="min-w-0">{content}</span>
        <span role="cell" className="text-right tabular-nums text-[var(--foreground)]">{formatters.integer.format(block.row.quantity)}</span>
        <span role="cell" className="text-right tabular-nums text-[var(--foreground)]">{formatters.currency.format(block.row.amount)}</span>
        {showRunningTotals ? <span role="cell" className="text-right tabular-nums font-semibold text-[var(--foreground)]">{formatters.currency.format(block.runningTotal)}</span> : null}
      </div>
    );
  }
  if (block.kind === "subtotal" || block.kind === "grand-total") {
    return (
      <div
        className={cn(
          "grid items-center border-b border-[var(--border)] px-2 text-[7px] font-bold text-[var(--foreground)]",
          columns,
          block.kind === "grand-total" ? "bg-[var(--foreground)] text-[var(--background)]" : "bg-[var(--muted)]/35",
        )}
        style={style}
        role="row"
      >
        <span role="rowheader">{block.label}</span>
        <span role="cell" className="text-right tabular-nums">{formatters.integer.format(block.quantity)}</span>
        <span role="cell" className="text-right tabular-nums">{formatters.currency.format(block.amount)}</span>
        {showRunningTotals ? <span role="cell" /> : null}
      </div>
    );
  }
  if (block.kind === "supplement") {
    return (
      <div
        className="p-1"
        style={style}
        role={presentation.body === "table" ? "row" : "listitem"}
        aria-label={block.supplement.title}
      >
        <div className="h-full" role={presentation.body === "table" ? "cell" : undefined}>
          <SupplementView supplement={block.supplement} rows={rows} formatters={formatters} />
        </div>
      </div>
    );
  }
  return null;
}

function PageMeasurement({ page }: { page: ReportPageSpec }) {
  return (
    <div className="pointer-events-none absolute inset-1 z-10" aria-hidden="true">
      <div className="absolute left-1/2 top-0 -translate-x-1/2 rounded-b bg-[var(--foreground)] px-1.5 py-0.5 text-[5.5px] font-semibold text-[var(--background)]">
        {page.width} pt · {(page.width / 72).toFixed(2)} in
      </div>
      <div className="absolute left-0 top-1/2 -translate-x-[42%] -translate-y-1/2 -rotate-90 rounded-b bg-[var(--foreground)] px-1.5 py-0.5 text-[5.5px] font-semibold text-[var(--background)]">
        {page.height} pt · {(page.height / 72).toFixed(2)} in
      </div>
    </div>
  );
}

function DocumentMap({ rows, instanceId }: { rows: readonly PaginatedReportRow[]; instanceId: string }) {
  const groups = [...new Set(rows.map((row) => row.group))];
  return (
    <nav className="w-32 shrink-0 rounded-lg border border-[var(--border)] bg-[var(--card)] p-2" aria-label="Report document map">
      <div className="mb-2 text-[7px] font-bold uppercase tracking-[0.12em] text-[var(--muted-foreground)]">Document map</div>
      <ol className="space-y-1">
        {groups.map((group, index) => (
          <li key={group}>
            <a className="block rounded px-1.5 py-1 text-[8px] font-medium text-[var(--foreground)] hover:bg-[var(--muted)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--ring)]" href={`#${instanceId}-group-${index}`}>
              {group}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

function DrillthroughDestinations({
  rows,
  instanceId,
  formatters,
}: {
  rows: readonly PaginatedReportRow[];
  instanceId: string;
  formatters: ReportFormatters;
}) {
  return (
    <section className="mt-3 rounded-lg border border-[var(--border)] bg-[var(--card)] p-2" aria-label="Drillthrough detail destinations">
      <h3 className="mb-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-[var(--muted-foreground)]">Drillthrough destinations</h3>
      <div className="grid max-h-28 grid-cols-2 gap-1 overflow-auto sm:grid-cols-3">
        {rows.map((row) => (
          <a
            key={row.id}
            id={`${instanceId}-drillthrough-${row.id}`}
            href={`#${instanceId}-report-row-${row.id}`}
            className="flex min-h-11 min-w-0 flex-col justify-center rounded border border-[var(--border)] px-2 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
          >
            <div className="truncate text-[8px] font-semibold text-[var(--foreground)]">{row.label}</div>
            <div className="truncate text-[6px] text-[var(--muted-foreground)]">{row.group} · {formatters.currency.format(row.amount)}</div>
          </a>
        ))}
      </div>
    </section>
  );
}

function ReportPageView({
  layout,
  pageIndex,
  rows,
  title,
  description,
  formatters,
  presentation,
  showRunningTotals,
  instanceId,
}: {
  layout: PaginatedReportLayout;
  pageIndex: number;
  rows: readonly PaginatedReportRow[];
  title: string;
  description: string;
  formatters: ReportFormatters;
  presentation: ReportVariantPresentation;
  showRunningTotals: boolean;
  instanceId: string;
}) {
  const reportPage = layout.pages[pageIndex]!;
  const page = layout.page;
  const bodyHeight = page.height - page.margins.top - page.margins.bottom - page.headerHeight - page.footerHeight;
  const printableHeight = page.height - page.margins.top - page.margins.bottom;
  const isFirst = pageIndex === 0;
  const isLast = pageIndex === layout.pages.length - 1;
  const headerText = presentation.firstLastSections && isFirst ? "Report overview" : title;
  const footerText = presentation.firstLastSections && isLast ? "End of report" : presentation.detailedHeaderFooter ? `${layout.filteredRowCount} detail rows · ${formatters.currency.format(layout.totalAmount)}` : "Deterministic report preview";
  const pageStyle = {
    aspectRatio: `${page.width} / ${page.height}`,
    "--foreground": "#0f172a",
    "--muted-foreground": "#475569",
    "--muted": "#e2e8f0",
    "--card": "#ffffff",
    "--border": "#cbd5e1",
    "--ring": "#2563eb",
    "--chart-1": "#2563eb",
    "--chart-2": "#0891b2",
    "--chart-3": "#7c3aed",
    "--chart-4": "#059669",
    "--chart-5": "#d97706",
    "--chart-6": "#dc2626",
  } as React.CSSProperties;
  return (
    <article
      className={cn(
        "relative w-full max-w-[42rem] overflow-hidden border border-black/15 bg-white text-slate-950 shadow-[0_18px_45px_rgba(15,23,42,0.16)] print:break-after-page print:max-w-none print:shadow-none",
        presentation.monochrome && "grayscale",
      )}
      style={pageStyle}
      aria-label={`${title}, page ${pageIndex + 1} of ${layout.pages.length}`}
      data-report-page={pageIndex + 1}
    >
      {presentation.showMeasurement ? <PageMeasurement page={page} /> : null}
      <div
        className={cn("absolute", presentation.showMarginGuides && "outline outline-1 outline-dashed outline-slate-400")}
        style={{
          top: `${(page.margins.top / page.height) * 100}%`,
          right: `${(page.margins.right / page.width) * 100}%`,
          bottom: `${(page.margins.bottom / page.height) * 100}%`,
          left: `${(page.margins.left / page.width) * 100}%`,
        }}
      >
        <header
          className="flex items-center justify-between gap-3 border-b border-slate-300 px-2"
          style={{ height: `${(page.headerHeight / printableHeight) * 100}%` }}
        >
          <div className="min-w-0">
            <h3 className="truncate text-[8.5px] font-bold text-slate-950">{headerText}</h3>
            {presentation.detailedHeaderFooter || isFirst ? <p className="truncate text-[5.5px] text-slate-500">{description}</p> : null}
          </div>
          <span className="shrink-0 text-[5.5px] font-semibold uppercase tracking-[0.1em] text-slate-500">{page.name}</span>
        </header>
        <div
          className="grid min-h-0 gap-2 overflow-hidden"
          style={{
            height: `${(bodyHeight / printableHeight) * 100}%`,
            gridTemplateColumns: `repeat(${layout.columnsPerPage}, minmax(0, 1fr))`,
          }}
          role={presentation.body === "table" ? "table" : "region"}
          aria-label={`${title} detail region`}
        >
          {reportPage.columns.map((column) => (
            <div key={column.index} className="min-h-0 overflow-hidden" role={presentation.body === "table" ? "rowgroup" : "list"} aria-label={`Flow column ${column.index + 1}`}>
              {column.blocks.map((block) => (
                <ReportBlockView
                  key={block.id}
                  block={block}
                  bodyHeight={bodyHeight}
                  rows={rows}
                  formatters={formatters}
                  presentation={presentation}
                  showRunningTotals={showRunningTotals}
                  instanceId={instanceId}
                />
              ))}
            </div>
          ))}
        </div>
        <footer
          className="flex items-center justify-between gap-2 border-t border-slate-300 px-2 text-[5.5px] text-slate-500"
          style={{ height: `${(page.footerHeight / printableHeight) * 100}%` }}
        >
          <span className="truncate">{footerText}</span>
          {presentation.showPageNumbers ? <span className="shrink-0 tabular-nums">Page {pageIndex + 1} of {layout.pages.length}</span> : null}
        </footer>
      </div>
      {presentation.exportLayoutPreview ? (
        <div className="absolute bottom-1 right-1 rounded bg-amber-100 px-1.5 py-0.5 text-[5.5px] font-semibold text-amber-950">
          PDF layout preview · export not validated
        </div>
      ) : null}
    </article>
  );
}

export function PaginatedReport({
  className,
  variant = "table-data-region",
  rows = DEFAULT_PAGINATED_REPORT_ROWS,
  title,
  description,
  page,
  pagination,
  maxPreviewPages = 2,
  locale = "en-US",
  currency = "USD",
}: PaginatedReportProps = {}) {
  const reactId = React.useId().replace(/:/g, "");
  const instanceId = `paginated-report-${reactId}`;
  const definition = getPaginatedReportVariant(variant);
  if (!definition) {
    return <ReportConfigurationState title="Paginated report" message={`Unknown report variant ${JSON.stringify(variant)}.`} className={className} />;
  }
  if (!Number.isInteger(maxPreviewPages) || maxPreviewPages < 1) {
    return <ReportConfigurationState title={title ?? definition.title} message="maxPreviewPages must be a positive integer." className={className} />;
  }
  const formatters = createFormatters(locale, currency);
  if (!formatters) {
    return <ReportConfigurationState title={title ?? definition.title} message="Provide a valid Intl locale and currency code." className={className} />;
  }
  const resolvedTitle = title ?? definition.title;
  const resolvedDescription = description ?? definition.description;
  const options: ReportPaginationOptions = {
    ...definition.pagination,
    ...pagination,
    page: page ?? definition.page,
  };
  const result = paginateReport(rows, options);
  if (!result.ok) {
    return <ReportConfigurationState title={resolvedTitle} message={result.message} className={className} />;
  }
  const visiblePages = result.data.pages.slice(0, maxPreviewPages);
  return (
    <section
      className={cn("flex h-full min-h-0 w-full flex-col overflow-hidden rounded-xl bg-[var(--muted)]/20 p-3", className)}
      aria-labelledby={`${instanceId}-title`}
      aria-describedby={`${instanceId}-description`}
      data-report-variant={variant}
      data-report-page-count={result.data.pages.length}
    >
      <div className="mb-3 flex shrink-0 items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 id={`${instanceId}-title`} className="text-sm font-semibold text-[var(--foreground)]">{resolvedTitle}</h2>
          <p id={`${instanceId}-description`} className="mt-0.5 max-w-2xl text-[11px] leading-relaxed text-[var(--muted-foreground)]">{resolvedDescription}</p>
        </div>
        <div className="shrink-0 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--card)] px-2 py-1 text-[9px] font-semibold tabular-nums text-[var(--foreground)]">
          {result.data.pages.length} page{result.data.pages.length === 1 ? "" : "s"}
        </div>
      </div>
      {definition.presentation.emphasizeReadingOrder ? (
        <p className="sr-only" role="note">Reading order proceeds by page, then flow column, then header, group, detail rows, subtotals, and grand total.</p>
      ) : null}
      <div className="flex min-h-0 flex-1 items-start gap-3">
        {definition.presentation.showDocumentMap ? <DocumentMap rows={result.data.flowRows} instanceId={instanceId} /> : null}
        <div className="min-h-0 max-h-[34rem] min-w-0 flex-1 space-y-4 overflow-auto rounded-lg" tabIndex={0} aria-label="Paginated report page preview">
          {visiblePages.map((reportPage) => (
            <ReportPageView
              key={reportPage.index}
              layout={result.data}
              pageIndex={reportPage.index}
              rows={result.data.flowRows}
              title={resolvedTitle}
              description={resolvedDescription}
              formatters={formatters}
              presentation={definition.presentation}
              showRunningTotals={Boolean(options.showRunningTotals)}
              instanceId={instanceId}
            />
          ))}
          {visiblePages.length < result.data.pages.length ? (
            <div className="rounded-lg border border-dashed border-[var(--border)] bg-[var(--card)] px-3 py-2 text-center text-[10px] text-[var(--muted-foreground)]" role="note">
              Preview shows {visiblePages.length} of {result.data.pages.length} generated pages. Increase <code className="font-mono">maxPreviewPages</code> to inspect more.
            </div>
          ) : null}
        </div>
      </div>
      {definition.presentation.showDrillthrough ? (
        <DrillthroughDestinations
          rows={result.data.flowRows}
          instanceId={instanceId}
          formatters={formatters}
        />
      ) : null}
    </section>
  );
}
