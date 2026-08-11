export type ReportPaperPreset = "letter-portrait" | "letter-landscape" | "legal-portrait";

export type ReportMargins = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

/** Physical measurements are expressed in PDF/PostScript points (72 points per inch). */
export type ReportPageSpec = {
  name: string;
  width: number;
  height: number;
  margins: ReportMargins;
  headerHeight: number;
  footerHeight: number;
  columnHeaderHeight: number;
  rowHeight: number;
  groupHeaderHeight: number;
  subtotalHeight: number;
};

export type PaginatedReportRow = {
  id: string;
  group: string;
  subgroup?: string;
  label: string;
  quantity: number;
  amount: number;
  date?: string;
  href?: string;
};

export type ReportSupplementKind =
  | "chart"
  | "matrix"
  | "subreport"
  | "filter-summary"
  | "document-map"
  | "note";

export type ReportSupplement = {
  id: string;
  kind: ReportSupplementKind;
  title: string;
  description: string;
  height: number;
  values?: readonly number[];
};

export type ReportSortMode = "input" | "group-label" | "amount-desc";

export type ReportPaginationOptions = {
  page: ReportPageSpec;
  repeatColumnHeaders?: boolean;
  showColumnHeaders?: boolean;
  showGroupHeaders?: boolean;
  showSubgroupHeaders?: boolean;
  showSubtotals?: boolean;
  showGrandTotal?: boolean;
  showRunningTotals?: boolean;
  includeDetailRows?: boolean;
  keepGroupsTogether?: boolean;
  breakBetweenGroups?: boolean;
  minimumRowsAfterGroupHeader?: number;
  columnsPerPage?: 1 | 2;
  sortMode?: ReportSortMode;
  breakBeforeRowIds?: readonly string[];
  breakBeforeGroups?: readonly string[];
  supplements?: readonly ReportSupplement[];
  filter?: (row: PaginatedReportRow) => boolean;
};

type ReportBlockBase = {
  id: string;
  height: number;
};

export type ReportColumnHeaderBlock = ReportBlockBase & {
  kind: "column-header";
  repeated: boolean;
};

export type ReportGroupHeaderBlock = ReportBlockBase & {
  kind: "group-header" | "subgroup-header";
  label: string;
  level: 1 | 2;
};

export type ReportDataRowBlock = ReportBlockBase & {
  kind: "row";
  row: PaginatedReportRow;
  runningTotal: number;
};

export type ReportTotalBlock = ReportBlockBase & {
  kind: "subtotal" | "grand-total";
  label: string;
  quantity: number;
  amount: number;
};

export type ReportSupplementBlock = ReportBlockBase & {
  kind: "supplement";
  supplement: ReportSupplement;
};

export type ReportFlowBlock =
  | ReportColumnHeaderBlock
  | ReportGroupHeaderBlock
  | ReportDataRowBlock
  | ReportTotalBlock
  | ReportSupplementBlock;

export type ReportPageColumn = {
  index: number;
  blocks: readonly ReportFlowBlock[];
  usedHeight: number;
  availableHeight: number;
};

export type PaginatedReportPage = {
  index: number;
  columns: readonly ReportPageColumn[];
};

export type PaginatedReportLayout = {
  page: ReportPageSpec;
  pages: readonly PaginatedReportPage[];
  /** Filtered and deterministically ordered detail stream used to build the pages. */
  flowRows: readonly PaginatedReportRow[];
  rowCount: number;
  filteredRowCount: number;
  totalQuantity: number;
  totalAmount: number;
  columnsPerPage: 1 | 2;
};

export type ReportPaginationResult =
  | { ok: true; data: PaginatedReportLayout }
  | { ok: false; message: string };

export const REPORT_PAGE_PRESETS = {
  "letter-portrait": {
    name: "US Letter portrait",
    width: 612,
    height: 792,
    margins: { top: 36, right: 36, bottom: 36, left: 36 },
    headerHeight: 36,
    footerHeight: 28,
    columnHeaderHeight: 24,
    rowHeight: 24,
    groupHeaderHeight: 24,
    subtotalHeight: 24,
  },
  "letter-landscape": {
    name: "US Letter landscape",
    width: 792,
    height: 612,
    margins: { top: 30, right: 36, bottom: 30, left: 36 },
    headerHeight: 34,
    footerHeight: 26,
    columnHeaderHeight: 22,
    rowHeight: 22,
    groupHeaderHeight: 22,
    subtotalHeight: 22,
  },
  "legal-portrait": {
    name: "US Legal portrait",
    width: 612,
    height: 1008,
    margins: { top: 36, right: 36, bottom: 36, left: 36 },
    headerHeight: 36,
    footerHeight: 28,
    columnHeaderHeight: 24,
    rowHeight: 24,
    groupHeaderHeight: 24,
    subtotalHeight: 24,
  },
} as const satisfies Record<ReportPaperPreset, ReportPageSpec>;

export function createReportPageSpec(
  preset: ReportPaperPreset = "letter-portrait",
  overrides: Partial<Omit<ReportPageSpec, "margins">> & { margins?: Partial<ReportMargins> } = {},
): ReportPageSpec {
  const base = REPORT_PAGE_PRESETS[preset];
  return {
    ...base,
    ...overrides,
    margins: { ...base.margins, ...overrides.margins },
  };
}

function isFiniteNonNegative(value: number) {
  return Number.isFinite(value) && value >= 0;
}

function validatePage(page: ReportPageSpec) {
  const measures = [
    page.width,
    page.height,
    page.margins.top,
    page.margins.right,
    page.margins.bottom,
    page.margins.left,
    page.headerHeight,
    page.footerHeight,
    page.columnHeaderHeight,
    page.rowHeight,
    page.groupHeaderHeight,
    page.subtotalHeight,
  ];
  if (!page.name.trim() || !measures.every(isFiniteNonNegative)) {
    return "Page measurements must have a name and finite non-negative values.";
  }
  if (page.width <= 0 || page.height <= 0 || page.rowHeight <= 0) {
    return "Page width, height, and row height must be positive.";
  }
  const bodyHeight =
    page.height -
    page.margins.top -
    page.margins.bottom -
    page.headerHeight -
    page.footerHeight;
  const bodyWidth = page.width - page.margins.left - page.margins.right;
  if (bodyHeight <= page.columnHeaderHeight || bodyWidth <= 0) {
    return "Page margins, header, and footer leave no usable report body.";
  }
  return null;
}

function validateRows(rows: readonly PaginatedReportRow[]) {
  if (rows.length === 0) return "Add at least one report row.";
  const ids = new Set<string>();
  for (const [index, row] of rows.entries()) {
    const id = row.id?.trim();
    if (!id || !row.group?.trim() || !row.label?.trim()) {
      return `Report row ${index + 1} needs an id, group, and label.`;
    }
    if (ids.has(id)) return `Report row id ${JSON.stringify(id)} is duplicated.`;
    if (!Number.isFinite(row.quantity) || !Number.isFinite(row.amount)) {
      return `Report row ${JSON.stringify(id)} needs finite quantity and amount values.`;
    }
    ids.add(id);
  }
  return null;
}

function orderedRows(rows: readonly PaginatedReportRow[], mode: ReportSortMode) {
  const indexed = rows.map((row, index) => ({ row, index }));
  if (mode === "input") return indexed.map(({ row }) => row);
  indexed.sort((left, right) => {
    if (mode === "amount-desc") {
      const amount = right.row.amount - left.row.amount;
      if (amount) return amount;
    } else {
      const group = left.row.group.localeCompare(right.row.group);
      if (group) return group;
      const subgroup = (left.row.subgroup ?? "").localeCompare(right.row.subgroup ?? "");
      if (subgroup) return subgroup;
      const label = left.row.label.localeCompare(right.row.label);
      if (label) return label;
    }
    return left.index - right.index;
  });
  return indexed.map(({ row }) => row);
}

type FlowSegment = {
  id: string;
  blocks: readonly (ReportFlowBlock & { forceBreakBefore?: boolean })[];
  keepTogether: boolean;
  minimumOpeningHeight: number;
  forceBreakBefore: boolean;
};

function sumBlocks(blocks: readonly ReportFlowBlock[]) {
  return blocks.reduce((total, block) => total + block.height, 0);
}

export function paginateReport(
  rows: readonly PaginatedReportRow[],
  options: ReportPaginationOptions,
): ReportPaginationResult {
  const pageError = validatePage(options.page);
  if (pageError) return { ok: false, message: pageError };
  const rowError = validateRows(rows);
  if (rowError) return { ok: false, message: rowError };

  const minimumRows = options.minimumRowsAfterGroupHeader ?? 1;
  if (!Number.isInteger(minimumRows) || minimumRows < 0) {
    return { ok: false, message: "Minimum rows after a group header must be a non-negative integer." };
  }
  const columnsPerPage = options.columnsPerPage ?? 1;
  if (columnsPerPage !== 1 && columnsPerPage !== 2) {
    return { ok: false, message: "Paginated reports support one or two flow columns." };
  }

  let filtered: readonly PaginatedReportRow[];
  try {
    filtered = options.filter ? rows.filter(options.filter) : rows;
  } catch {
    return { ok: false, message: "The report filter threw while evaluating rows." };
  }
  if (filtered.length === 0) {
    return { ok: false, message: "The report filter removed every row." };
  }
  const ordered = orderedRows(filtered, options.sortMode ?? "input");
  const orderedIds = new Set(ordered.map((row) => row.id));
  for (const id of options.breakBeforeRowIds ?? []) {
    if (!orderedIds.has(id)) {
      return { ok: false, message: `Explicit page-break row ${JSON.stringify(id)} does not exist.` };
    }
  }

  const bodyHeight =
    options.page.height -
    options.page.margins.top -
    options.page.margins.bottom -
    options.page.headerHeight -
    options.page.footerHeight;
  const freshHeaderHeight = options.showColumnHeaders === false ? 0 : options.page.columnHeaderHeight;
  const continuationHeaderHeight = options.repeatColumnHeaders === false ? 0 : freshHeaderHeight;
  const maximumBlockHeight = bodyHeight - Math.min(freshHeaderHeight, continuationHeaderHeight);

  const supplements = options.supplements ?? [];
  const supplementIds = new Set<string>();
  for (const [index, supplement] of supplements.entries()) {
    if (!supplement.id?.trim() || !supplement.title?.trim() || !supplement.description?.trim()) {
      return { ok: false, message: `Supplement ${index + 1} needs an id, title, and description.` };
    }
    if (supplementIds.has(supplement.id)) {
      return { ok: false, message: `Supplement id ${JSON.stringify(supplement.id)} is duplicated.` };
    }
    if (!Number.isFinite(supplement.height) || supplement.height <= 0 || supplement.height > maximumBlockHeight) {
      return { ok: false, message: `Supplement ${JSON.stringify(supplement.id)} does not fit a report column.` };
    }
    if (supplement.values?.some((value) => !Number.isFinite(value))) {
      return { ok: false, message: `Supplement ${JSON.stringify(supplement.id)} has a non-finite value.` };
    }
    supplementIds.add(supplement.id);
  }

  let runningTotal = 0;
  const breakIds = new Set(options.breakBeforeRowIds ?? []);
  const needsGroups = Boolean(
    options.showGroupHeaders ||
      options.showSubgroupHeaders ||
      options.showSubtotals ||
      options.keepGroupsTogether ||
      options.breakBetweenGroups ||
      (options.breakBeforeGroups?.length ?? 0) > 0,
  );
  const grouped = new Map<string, PaginatedReportRow[]>();
  if (needsGroups) {
    for (const row of ordered) {
      const bucket = grouped.get(row.group) ?? [];
      bucket.push(row);
      grouped.set(row.group, bucket);
    }
  } else {
    grouped.set("all", [...ordered]);
  }
  const breakGroups = new Set(options.breakBeforeGroups ?? []);
  for (const groupName of breakGroups) {
    if (!grouped.has(groupName)) {
      return { ok: false, message: `Conditional page-break group ${JSON.stringify(groupName)} does not exist.` };
    }
  }

  const segments: FlowSegment[] = [];
  if (supplements.length) {
    segments.push({
      id: "supplements",
      blocks: supplements.map((supplement) => ({
        id: `supplement-${supplement.id}`,
        kind: "supplement",
        height: supplement.height,
        supplement,
      })),
      keepTogether: false,
      minimumOpeningHeight: 0,
      forceBreakBefore: false,
    });
  }

  let groupIndex = 0;
  if (options.includeDetailRows !== false) for (const [groupName, groupRows] of grouped) {
    const blocks: Array<ReportFlowBlock & { forceBreakBefore?: boolean }> = [];
    if (options.showGroupHeaders) {
      blocks.push({
        id: `group-${groupIndex}`,
        kind: "group-header",
        label: groupName,
        level: 1,
        height: options.page.groupHeaderHeight,
      });
    }
    let lastSubgroup: string | undefined;
    for (const row of groupRows) {
      if (options.showSubgroupHeaders && row.subgroup && row.subgroup !== lastSubgroup) {
        lastSubgroup = row.subgroup;
        blocks.push({
          id: `subgroup-${groupIndex}-${row.subgroup}`,
          kind: "subgroup-header",
          label: row.subgroup,
          level: 2,
          height: options.page.groupHeaderHeight,
        });
      }
      runningTotal += row.amount;
      blocks.push({
        id: `row-${row.id}`,
        kind: "row",
        height: options.page.rowHeight,
        row,
        runningTotal,
        forceBreakBefore: breakIds.has(row.id),
      });
    }
    if (options.showSubtotals) {
      blocks.push({
        id: `subtotal-${groupIndex}`,
        kind: "subtotal",
        label: `${needsGroups ? groupName : "Report"} subtotal`,
        quantity: groupRows.reduce((total, row) => total + row.quantity, 0),
        amount: groupRows.reduce((total, row) => total + row.amount, 0),
        height: options.page.subtotalHeight,
      });
    }
    const openingRows = Math.min(minimumRows, groupRows.length);
    const minimumOpeningHeight =
      (options.showGroupHeaders ? options.page.groupHeaderHeight : 0) +
      openingRows * options.page.rowHeight;
    if (minimumOpeningHeight > bodyHeight - continuationHeaderHeight) {
      return {
        ok: false,
        message: `Orphan-control requirement for group ${JSON.stringify(groupName)} cannot fit on a blank continuation frame.`,
      };
    }
    segments.push({
      id: `segment-${groupIndex}`,
      blocks,
      keepTogether: Boolean(options.keepGroupsTogether),
      minimumOpeningHeight,
      forceBreakBefore: Boolean(
        groupIndex > 0 && (options.breakBetweenGroups || breakGroups.has(groupName)),
      ),
    });
    groupIndex += 1;
  }

  const totalQuantity = ordered.reduce((total, row) => total + row.quantity, 0);
  const totalAmount = ordered.reduce((total, row) => total + row.amount, 0);
  if (options.showGrandTotal) {
    segments.push({
      id: "grand-total",
      blocks: [{
        id: "grand-total",
        kind: "grand-total",
        label: "Grand total",
        quantity: totalQuantity,
        amount: totalAmount,
        height: options.page.subtotalHeight,
      }],
      keepTogether: true,
      minimumOpeningHeight: options.page.subtotalHeight,
      forceBreakBefore: false,
    });
  }
  if (segments.length === 0) {
    return { ok: false, message: "The report configuration does not produce any flow content." };
  }

  const frames: Array<{ blocks: ReportFlowBlock[]; remaining: number; availableHeight: number }> = [];
  const newFrame = () => {
    const repeated = frames.length > 0;
    const showHeader =
      options.showColumnHeaders !== false && (!repeated || options.repeatColumnHeaders !== false);
    const headerHeight = showHeader ? options.page.columnHeaderHeight : 0;
    const blocks: ReportFlowBlock[] = showHeader
      ? [{ id: `column-header-${frames.length}`, kind: "column-header", height: headerHeight, repeated }]
      : [];
    const frame = { blocks, remaining: bodyHeight - headerHeight, availableHeight: bodyHeight };
    frames.push(frame);
    return frame;
  };
  let frame = newFrame();
  const hasContent = () => frame.blocks.some((block) => block.kind !== "column-header");

  for (const segment of segments) {
    const segmentHeight = sumBlocks(segment.blocks);
    const freshCapacity = bodyHeight - continuationHeaderHeight;
    const shouldStartFresh =
      hasContent() &&
      (segment.forceBreakBefore ||
        segment.minimumOpeningHeight > frame.remaining ||
        (segment.keepTogether && segmentHeight <= freshCapacity && segmentHeight > frame.remaining));
    if (shouldStartFresh) frame = newFrame();

    for (const block of segment.blocks) {
      if (block.forceBreakBefore && hasContent()) frame = newFrame();
      if (block.height > frame.remaining && hasContent()) frame = newFrame();
      if (block.height > frame.remaining) {
        return { ok: false, message: `Report block ${JSON.stringify(block.id)} cannot fit on a blank page.` };
      }
      frame.blocks.push(block);
      frame.remaining -= block.height;
    }
  }

  const columns: ReportPageColumn[] = frames.map((item, index) => ({
    index,
    blocks: item.blocks,
    usedHeight: item.availableHeight - item.remaining,
    availableHeight: item.availableHeight,
  }));
  const pages: PaginatedReportPage[] = [];
  for (let index = 0; index < columns.length; index += columnsPerPage) {
    pages.push({
      index: pages.length,
      columns: columns.slice(index, index + columnsPerPage),
    });
  }

  return {
    ok: true,
    data: {
      page: options.page,
      pages,
      flowRows: ordered,
      rowCount: rows.length,
      filteredRowCount: ordered.length,
      totalQuantity,
      totalAmount,
      columnsPerPage,
    },
  };
}
