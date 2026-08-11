import assert from "node:assert/strict";
import test from "node:test";

import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import {
  ChordDiagram,
  NetworkPlot,
  NightingaleRose,
  RibbonChart,
  SunburstChart,
  WordCloud,
} from "../dist/charts.js";
import { HierarchicalSlicer } from "../dist/slicers.js";
import { PaginatedReport } from "../dist/reports.js";

function render(component, props = {}) {
  return renderToStaticMarkup(React.createElement(component, props));
}

test("floating-point SVG components render deterministically on the server", () => {
  const cases = [
    [NetworkPlot, {}],
    [ChordDiagram, {}],
    [SunburstChart, {}],
    [NightingaleRose, {}],
    [WordCloud, {}],
    [RibbonChart, {
      data: [
        { period: "Q1", alpha: 40, beta: 20 },
        { period: "Q2", alpha: 10, beta: 50 },
      ],
      categoryKey: "period",
      seriesKeys: ["alpha", "beta"],
    }],
  ];

  for (const [component, props] of cases) {
    assert.equal(render(component, props), render(component, props));
  }
});

test("ribbon charts expose one focusable region and a structured equivalent", () => {
  const markup = render(RibbonChart, {
    data: [
      { period: "Q1", alpha: 40, beta: 20 },
      { period: "Q2", alpha: 10, beta: 50 },
    ],
    categoryKey: "period",
    seriesKeys: ["alpha", "beta"],
  });

  assert.match(markup, /tabindex="0"/);
  assert.match(markup, /<table>/);
  assert.doesNotMatch(markup, /<path[^>]*><title>/);
});

test("word clouds and ribbon charts reject malformed public inputs safely", () => {
  const cloud = render(WordCloud, {
    data: [
      { text: "Valid", value: 10 },
      { text: "Invalid", value: Number.NaN },
    ],
  });
  assert.match(cloud, />Valid</);
  assert.doesNotMatch(cloud, /NaN|Infinity|>Invalid</);

  const ribbon = render(RibbonChart, {
    data: [{ period: "Q1", alpha: 10 }, { period: "Q2", alpha: 20 }],
    categoryKey: "period",
    seriesKeys: ["alpha", "alpha"],
  });
  assert.match(ribbon, /series keys must be unique/i);
  assert.doesNotMatch(ribbon, /NaN|Infinity/);
});

test("hierarchy slicers do not nest form controls inside buttons", () => {
  const markup = render(HierarchicalSlicer);
  // Checkbox chrome may wrap <input> in a span for the painted box; still require
  // the control to live under a <label>, never under a <button>.
  assert.match(markup, /<label\b[\s\S]*?<input\b/);
  assert.doesNotMatch(markup, /<button\b(?:(?!<\/button>)[\s\S])*<input\b/);
});

test("paginated report supplements remain valid table rows", () => {
  const markup = render(PaginatedReport, { variant: "nested-data-regions" });
  assert.match(markup, /role="table"/);
  assert.match(markup, /role="row" aria-label="[^"]+"><div class="h-full" role="cell">/);
});
