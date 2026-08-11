import assert from "node:assert/strict";
import test from "node:test";

import {
  createReportPageSpec,
  paginateReport,
} from "../pagination.ts";

const rows = [
  { id: "north-1", group: "North", subgroup: "Enterprise", label: "Alpha", quantity: 2, amount: 100 },
  { id: "north-2", group: "North", subgroup: "Field", label: "Beta", quantity: 3, amount: 200 },
  { id: "north-3", group: "North", subgroup: "Field", label: "Gamma", quantity: 4, amount: 300 },
  { id: "south-1", group: "South", subgroup: "Enterprise", label: "Delta", quantity: 5, amount: 400 },
  { id: "south-2", group: "South", subgroup: "Field", label: "Epsilon", quantity: 6, amount: 500 },
  { id: "south-3", group: "South", subgroup: "Field", label: "Zeta", quantity: 7, amount: 600 },
];

const compactPage = createReportPageSpec("letter-portrait", {
  name: "Pagination test page",
  height: 260,
  margins: { top: 12, right: 12, bottom: 12, left: 12 },
  headerHeight: 16,
  footerHeight: 16,
  columnHeaderHeight: 20,
  rowHeight: 40,
  groupHeaderHeight: 20,
  subtotalHeight: 20,
});

function rowIds(column) {
  return column.blocks.filter((block) => block.kind === "row").map((block) => block.row.id);
}

test("paginates deterministically and repeats continuation headers", () => {
  const options = { page: compactPage, showColumnHeaders: true, repeatColumnHeaders: true };
  const first = paginateReport(rows, options);
  const second = paginateReport(rows, options);
  assert.equal(first.ok, true);
  assert.deepEqual(first, second);
  assert.ok(first.data.pages.length > 1);
  for (const page of first.data.pages) {
    assert.equal(page.columns[0].blocks[0].kind, "column-header");
  }
  assert.equal(first.data.pages[1].columns[0].blocks[0].repeated, true);
});

test("honors explicit row and conditional group page breaks", () => {
  const rowBreak = paginateReport(rows, {
    page: compactPage,
    showColumnHeaders: true,
    breakBeforeRowIds: ["north-3"],
  });
  assert.equal(rowBreak.ok, true);
  const rowFrame = rowBreak.data.pages.flatMap((page) => page.columns).find((column) => rowIds(column)[0] === "north-3");
  assert.ok(rowFrame);

  const groupBreak = paginateReport(rows, {
    page: compactPage,
    showColumnHeaders: true,
    showGroupHeaders: true,
    breakBeforeGroups: ["South"],
  });
  assert.equal(groupBreak.ok, true);
  const southFrame = groupBreak.data.pages.flatMap((page) => page.columns).find((column) => rowIds(column)[0] === "south-1");
  assert.ok(southFrame);
  assert.ok(southFrame.blocks.some((block) => block.kind === "group-header" && block.label === "South"));
});

test("keeps fitting groups together and enforces opening-row orphan control", () => {
  const result = paginateReport(rows, {
    page: createReportPageSpec("letter-portrait", {
      ...compactPage,
      name: "Group test page",
      height: 360,
    }),
    showColumnHeaders: true,
    showGroupHeaders: true,
    showSubtotals: true,
    keepGroupsTogether: true,
    minimumRowsAfterGroupHeader: 2,
  });
  assert.equal(result.ok, true);
  const columns = result.data.pages.flatMap((page) => page.columns);
  for (const group of ["North", "South"]) {
    const containing = columns.filter((column) => rowIds(column).some((id) => id.startsWith(group.toLowerCase())));
    assert.equal(containing.length, 1);
  }
});

test("calculates subtotals, grand totals, and running totals from the ordered stream", () => {
  const result = paginateReport(rows, {
    page: createReportPageSpec(),
    showColumnHeaders: true,
    showGroupHeaders: true,
    showSubtotals: true,
    showGrandTotal: true,
    showRunningTotals: true,
    sortMode: "group-label",
  });
  assert.equal(result.ok, true);
  const blocks = result.data.pages.flatMap((page) => page.columns).flatMap((column) => column.blocks);
  const dataRows = blocks.filter((block) => block.kind === "row");
  assert.deepEqual(dataRows.map((block) => block.runningTotal), [100, 300, 600, 1000, 1500, 2100]);
  assert.equal(blocks.filter((block) => block.kind === "subtotal").length, 2);
  const grand = blocks.find((block) => block.kind === "grand-total");
  assert.equal(grand.amount, 2100);
  assert.equal(grand.quantity, 27);
});

test("packs flow frames into two physical columns", () => {
  const single = paginateReport(rows, { page: compactPage, showColumnHeaders: true });
  const double = paginateReport(rows, { page: compactPage, showColumnHeaders: true, columnsPerPage: 2 });
  assert.equal(single.ok, true);
  assert.equal(double.ok, true);
  assert.ok(double.data.pages.length < single.data.pages.length);
  assert.equal(double.data.pages[0].columns.length, 2);
});

test("fails invalid ids, measurements, values, and empty filter results", () => {
  assert.equal(paginateReport(rows, { page: compactPage, breakBeforeRowIds: ["missing"] }).ok, false);
  assert.equal(paginateReport(rows, { page: compactPage, breakBeforeGroups: ["missing"] }).ok, false);
  assert.equal(paginateReport(rows.map((row) => ({ ...row, group: "One" })), { page: compactPage, showGroupHeaders: true, minimumRowsAfterGroupHeader: 6 }).ok, false);
  assert.equal(paginateReport(rows, { page: compactPage, includeDetailRows: false }).ok, false);
  assert.equal(paginateReport([{ ...rows[0], amount: Number.NaN }], { page: compactPage }).ok, false);
  assert.equal(paginateReport(rows, { page: { ...compactPage, height: 0 } }).ok, false);
  assert.equal(paginateReport(rows, { page: compactPage, filter: () => false }).ok, false);
});
