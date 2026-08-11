import assert from "node:assert/strict";
import test from "node:test";

import { roundSvgNumber, roundSvgPath } from "../utils.ts";

test("roundSvgNumber normalizes floating-point geometry without changing invalid sentinels", () => {
  assert.equal(roundSvgNumber(100.00000000000001), 100);
  assert.equal(roundSvgNumber(-12.3456789), -12.3457);
  assert.equal(roundSvgNumber(1.23456, 2), 1.23);
  assert.equal(roundSvgNumber(Number.POSITIVE_INFINITY), Number.POSITIVE_INFINITY);
  assert.ok(Number.isNaN(roundSvgNumber(Number.NaN)));
});

test("roundSvgPath rounds decimal and exponent tokens while preserving commands", () => {
  assert.equal(
    roundSvgPath("M100.00000000000001,-2.345678 C1e-7,4.56789 8,9 Z"),
    "M100,-2.3457 C0,4.5679 8,9 Z",
  );
  assert.equal(roundSvgPath("M0,0L10,10Z"), "M0,0L10,10Z");
});
