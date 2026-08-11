import {
  createReportPageSpec,
  type ReportPaginationOptions,
  type ReportPageSpec,
} from "./pagination";

export type PaginatedReportVariant =
  | "page-measurement"
  | "explicit-page-breaks"
  | "repeated-table-headers"
  | "group-headers"
  | "nested-groups"
  | "group-subtotals"
  | "grand-total"
  | "running-totals"
  | "page-numbers"
  | "first-last-page-sections"
  | "keep-groups-together"
  | "orphan-control"
  | "nested-data-regions"
  | "subreport-region"
  | "chart-data-region"
  | "table-data-region"
  | "matrix-data-region"
  | "list-data-region"
  | "two-column-flow"
  | "letter-landscape"
  | "legal-portrait"
  | "custom-page-size"
  | "print-margin-guide"
  | "report-header-footer"
  | "conditional-group-breaks"
  | "deterministic-sort-group"
  | "parameter-filter-summary"
  | "document-map"
  | "drillthrough-links"
  | "monochrome-print-style"
  | "pdf-export-layout-preview"
  | "accessible-reading-order";

export type ReportBodyPresentation = "table" | "list";

export type ReportVariantPresentation = {
  body: ReportBodyPresentation;
  showPageNumbers?: boolean;
  showMeasurement?: boolean;
  showMarginGuides?: boolean;
  showDocumentMap?: boolean;
  showDrillthrough?: boolean;
  emphasizeReadingOrder?: boolean;
  firstLastSections?: boolean;
  detailedHeaderFooter?: boolean;
  monochrome?: boolean;
  exportLayoutPreview?: boolean;
};

export type PaginatedReportVariantDefinition = {
  variant: PaginatedReportVariant;
  title: string;
  description: string;
  page: ReportPageSpec;
  pagination: Omit<ReportPaginationOptions, "page">;
  presentation: ReportVariantPresentation;
};

const compactLetter = createReportPageSpec("letter-portrait", {
  height: 540,
  name: "Compact letter preview",
});

const paginatedReportVariants = [
  {
    variant: "page-measurement",
    title: "Page measurement",
    description: "Shows physical page dimensions, printable body size, and point-to-inch measurement.",
    page: createReportPageSpec(),
    pagination: { showColumnHeaders: true, showGrandTotal: true },
    presentation: { body: "table", showMeasurement: true, showMarginGuides: true },
  },
  {
    variant: "explicit-page-breaks",
    title: "Explicit page breaks",
    description: "Starts specified detail rows in a fresh flow frame without changing source order.",
    page: compactLetter,
    pagination: { showColumnHeaders: true, repeatColumnHeaders: true, breakBeforeRowIds: ["central-enterprise-2"] },
    presentation: { body: "table", showPageNumbers: true },
  },
  {
    variant: "repeated-table-headers",
    title: "Repeated table headers",
    description: "Repeats the detail-column header at the top of every continuation frame.",
    page: compactLetter,
    pagination: { showColumnHeaders: true, repeatColumnHeaders: true },
    presentation: { body: "table", showPageNumbers: true },
  },
  {
    variant: "group-headers",
    title: "Group headers",
    description: "Creates a named report section before each geographic group.",
    page: createReportPageSpec(),
    pagination: { showColumnHeaders: true, showGroupHeaders: true },
    presentation: { body: "table" },
  },
  {
    variant: "nested-groups",
    title: "Nested groups",
    description: "Nests team headers beneath geographic group headers with deterministic ordering.",
    page: createReportPageSpec(),
    pagination: { showColumnHeaders: true, showGroupHeaders: true, showSubgroupHeaders: true, sortMode: "group-label" },
    presentation: { body: "table" },
  },
  {
    variant: "group-subtotals",
    title: "Group subtotals",
    description: "Calculates quantity and amount subtotal rows independently for each group.",
    page: createReportPageSpec(),
    pagination: { showColumnHeaders: true, showGroupHeaders: true, showSubtotals: true },
    presentation: { body: "table" },
  },
  {
    variant: "grand-total",
    title: "Grand total",
    description: "Adds one report-level quantity and amount total after every detail row.",
    page: createReportPageSpec(),
    pagination: { showColumnHeaders: true, showGrandTotal: true },
    presentation: { body: "table" },
  },
  {
    variant: "running-totals",
    title: "Running totals",
    description: "Displays a cumulative amount derived from the filtered and sorted row stream.",
    page: createReportPageSpec(),
    pagination: { showColumnHeaders: true, showRunningTotals: true, sortMode: "group-label" },
    presentation: { body: "table" },
  },
  {
    variant: "page-numbers",
    title: "Page numbers",
    description: "Labels each generated page as page n of the deterministic total page count.",
    page: compactLetter,
    pagination: { showColumnHeaders: true, repeatColumnHeaders: true },
    presentation: { body: "table", showPageNumbers: true },
  },
  {
    variant: "first-last-page-sections",
    title: "First and last page sections",
    description: "Uses distinct first-page report context and last-page completion messaging.",
    page: compactLetter,
    pagination: { showColumnHeaders: true, repeatColumnHeaders: true, showGrandTotal: true },
    presentation: { body: "table", firstLastSections: true, showPageNumbers: true },
  },
  {
    variant: "keep-groups-together",
    title: "Keep groups together",
    description: "Moves a group to a fresh frame when the entire group fits there but not in the remaining space.",
    page: compactLetter,
    pagination: { showColumnHeaders: true, showGroupHeaders: true, showSubtotals: true, keepGroupsTogether: true },
    presentation: { body: "table", showPageNumbers: true },
  },
  {
    variant: "orphan-control",
    title: "Orphan control",
    description: "Requires at least three detail rows to remain with a newly placed group header.",
    page: compactLetter,
    pagination: { showColumnHeaders: true, showGroupHeaders: true, minimumRowsAfterGroupHeader: 3 },
    presentation: { body: "table", showPageNumbers: true },
  },
  {
    variant: "nested-data-regions",
    title: "Nested data regions",
    description: "Places a compact matrix summary before the paginated detail table.",
    page: createReportPageSpec(),
    pagination: { showColumnHeaders: true, supplements: [{ id: "nested-matrix", kind: "matrix", title: "Regional matrix", description: "Amount totals by region and team", height: 104 }] },
    presentation: { body: "table" },
  },
  {
    variant: "subreport-region",
    title: "Subreport region",
    description: "Reserves measured flow space for an independently labeled subreport summary.",
    page: createReportPageSpec(),
    pagination: { showColumnHeaders: true, supplements: [{ id: "pipeline-subreport", kind: "subreport", title: "Pipeline subreport", description: "Open pipeline supplied as a nested report region", height: 96 }] },
    presentation: { body: "table" },
  },
  {
    variant: "chart-data-region",
    title: "Chart data region",
    description: "Renders a source-backed bar summary as a measured report block above detail rows.",
    page: createReportPageSpec(),
    pagination: { showColumnHeaders: true, supplements: [{ id: "amount-chart", kind: "chart", title: "Amount by region", description: "Aggregated from the same report rows", height: 118 }] },
    presentation: { body: "table" },
  },
  {
    variant: "table-data-region",
    title: "Table data region",
    description: "Uses a fixed-column detail table as the primary paginated data region.",
    page: createReportPageSpec(),
    pagination: { showColumnHeaders: true, repeatColumnHeaders: true },
    presentation: { body: "table" },
  },
  {
    variant: "matrix-data-region",
    title: "Matrix data region",
    description: "Builds a cross-group matrix summary with row and column totals from report data.",
    page: createReportPageSpec(),
    pagination: { showColumnHeaders: false, includeDetailRows: false, supplements: [{ id: "report-matrix", kind: "matrix", title: "Region by team matrix", description: "Cross-tabulated amount values", height: 180 }] },
    presentation: { body: "table" },
  },
  {
    variant: "list-data-region",
    title: "List data region",
    description: "Flows detail records as labeled list cards while retaining measured row heights.",
    page: createReportPageSpec(),
    pagination: { showColumnHeaders: false },
    presentation: { body: "list" },
  },
  {
    variant: "two-column-flow",
    title: "Two-column flow",
    description: "Flows report frames into two physical columns before creating another page.",
    page: createReportPageSpec("letter-landscape"),
    pagination: { showColumnHeaders: true, repeatColumnHeaders: true, columnsPerPage: 2 },
    presentation: { body: "table", showPageNumbers: true },
  },
  {
    variant: "letter-landscape",
    title: "Letter landscape",
    description: "Measures the report against a 792 by 612 point US Letter landscape page.",
    page: createReportPageSpec("letter-landscape"),
    pagination: { showColumnHeaders: true },
    presentation: { body: "table", showMeasurement: true },
  },
  {
    variant: "legal-portrait",
    title: "Legal portrait",
    description: "Measures the report against a 612 by 1008 point US Legal portrait page.",
    page: createReportPageSpec("legal-portrait"),
    pagination: { showColumnHeaders: true },
    presentation: { body: "table", showMeasurement: true },
  },
  {
    variant: "custom-page-size",
    title: "Custom page size",
    description: "Uses an explicit 420 by 595 point custom page with independently configured margins.",
    page: createReportPageSpec("letter-portrait", { name: "Custom 420 × 595 pt", width: 420, height: 595, margins: { top: 28, right: 24, bottom: 28, left: 24 } }),
    pagination: { showColumnHeaders: true, repeatColumnHeaders: true },
    presentation: { body: "table", showMeasurement: true, showPageNumbers: true },
  },
  {
    variant: "print-margin-guide",
    title: "Print margin guide",
    description: "Displays the configured printable boundary separately from paper edges and report content.",
    page: createReportPageSpec(),
    pagination: { showColumnHeaders: true },
    presentation: { body: "table", showMarginGuides: true, showMeasurement: true },
  },
  {
    variant: "report-header-footer",
    title: "Report header and footer",
    description: "Uses reserved, non-flowing page header and footer bands around each body frame.",
    page: createReportPageSpec(),
    pagination: { showColumnHeaders: true },
    presentation: { body: "table", detailedHeaderFooter: true, showPageNumbers: true },
  },
  {
    variant: "conditional-group-breaks",
    title: "Conditional group page breaks",
    description: "Starts selected named groups on fresh pages while allowing other groups to continue naturally.",
    page: compactLetter,
    pagination: { showColumnHeaders: true, showGroupHeaders: true, breakBeforeGroups: ["South", "West"] },
    presentation: { body: "table", showPageNumbers: true },
  },
  {
    variant: "deterministic-sort-group",
    title: "Deterministic sort and group",
    description: "Sorts by group, subgroup, and label with original-position tie breaking before pagination.",
    page: createReportPageSpec(),
    pagination: { showColumnHeaders: true, showGroupHeaders: true, showSubgroupHeaders: true, sortMode: "group-label" },
    presentation: { body: "table" },
  },
  {
    variant: "parameter-filter-summary",
    title: "Parameter and filter summary",
    description: "Filters lower-value rows and records the active rule in a measured report summary block.",
    page: createReportPageSpec(),
    pagination: { showColumnHeaders: true, filter: (row) => row.amount >= 36_000, supplements: [{ id: "filters", kind: "filter-summary", title: "Active report parameters", description: "Amount at least $36,000 · all regions · current fixture period", height: 72 }] },
    presentation: { body: "table" },
  },
  {
    variant: "document-map",
    title: "Document map",
    description: "Builds a navigable group outline targeting stable report section anchors.",
    page: createReportPageSpec(),
    pagination: { showColumnHeaders: true, showGroupHeaders: true },
    presentation: { body: "table", showDocumentMap: true },
  },
  {
    variant: "drillthrough-links",
    title: "Drillthrough links",
    description: "Uses caller-supplied row destinations as explicit detail links without inventing navigation targets.",
    page: createReportPageSpec(),
    pagination: { showColumnHeaders: true },
    presentation: { body: "table", showDrillthrough: true },
  },
  {
    variant: "monochrome-print-style",
    title: "Monochrome print style",
    description: "Applies a high-contrast monochrome presentation while retaining the same pagination result.",
    page: createReportPageSpec(),
    pagination: { showColumnHeaders: true, showGroupHeaders: true, showSubtotals: true },
    presentation: { body: "table", monochrome: true },
  },
  {
    variant: "pdf-export-layout-preview",
    title: "PDF export layout preview",
    description: "Previews fixed page boxes and reserved bands only; it does not claim a rendered-PDF baseline.",
    page: createReportPageSpec(),
    pagination: { showColumnHeaders: true, repeatColumnHeaders: true, showGrandTotal: true },
    presentation: { body: "table", exportLayoutPreview: true, showMarginGuides: true, showPageNumbers: true },
  },
  {
    variant: "accessible-reading-order",
    title: "Accessible reading order",
    description: "Exposes pages, groups, column headers, detail rows, and totals in deterministic DOM reading order.",
    page: createReportPageSpec(),
    pagination: { showColumnHeaders: true, showGroupHeaders: true, showSubtotals: true, showGrandTotal: true },
    presentation: { body: "table", emphasizeReadingOrder: true },
  },
] as const satisfies readonly PaginatedReportVariantDefinition[] & { readonly length: 32 };

export const PAGINATED_REPORT_VARIANTS: readonly PaginatedReportVariantDefinition[] =
  paginatedReportVariants;

export function getPaginatedReportVariant(
  variant: PaginatedReportVariant,
): PaginatedReportVariantDefinition | undefined {
  return PAGINATED_REPORT_VARIANTS.find((definition) => definition.variant === variant);
}
