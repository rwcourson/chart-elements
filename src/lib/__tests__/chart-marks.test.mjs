import assert from "node:assert/strict";
import test from "node:test";

import {
  ACTIVE_DOT,
  BAR_RADIUS_COLUMN,
  CHART_TOOLTIP_CLASS,
  MAX_BAR_SIZE,
  PLOT_MARGIN,
  SERIES_STROKE_WIDTH,
} from "../chart-marks.ts";

test("shared plot margin is a stable cartesian inset", () => {
  assert.equal(PLOT_MARGIN.top, 12);
  assert.equal(PLOT_MARGIN.right, 16);
  assert.equal(PLOT_MARGIN.left, 4);
  assert.equal(PLOT_MARGIN.bottom, 8);
});

test("series stroke and bar geometry stay refined-neutral defaults", () => {
  assert.equal(SERIES_STROKE_WIDTH, 2.25);
  assert.equal(MAX_BAR_SIZE, 36);
  assert.deepEqual(BAR_RADIUS_COLUMN, [4, 4, 0, 0]);
  assert.equal(ACTIVE_DOT.r, 4);
  assert.equal(ACTIVE_DOT.strokeWidth, 0);
});

test("chart tooltip class is token-driven (no raw shadow-lg)", () => {
  assert.match(CHART_TOOLTIP_CLASS, /--chart-tooltip-bg/);
  assert.match(CHART_TOOLTIP_CLASS, /--overlay-shadow/);
  assert.equal(CHART_TOOLTIP_CLASS.includes("shadow-lg"), false);
});
