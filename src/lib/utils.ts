import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(
  value: number,
  options?: Intl.NumberFormatOptions,
): string {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 1,
    ...options,
  }).format(value);
}

export function formatCompact(value: number): string {
  // Compact notation collapses small magnitudes to "0" (0.04 → "0"), which
  // reads as broken in density/probability charts. Keep two significant
  // digits for sub-0.1 values instead.
  if (value !== 0 && Math.abs(value) < 0.1) {
    return new Intl.NumberFormat("en-US", {
      maximumSignificantDigits: 2,
    }).format(value);
  }
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

/**
 * Turns a data key into a presentable series name for legends and tooltips,
 * e.g. `grossMargin` / `gross_margin` / `gross-margin` → "Gross margin".
 * Keys that are already capitalised or contain spaces are left alone.
 */
export function formatSeriesName(key: string): string {
  if (!key) return key;
  if (/\s/.test(key) || /^[A-Z]/.test(key)) return key;
  const spaced = key
    .replace(/[_-]+/g, " ")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .trim();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

export function formatPercent(value: number, digits = 0): string {
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    maximumFractionDigits: digits,
  }).format(value);
}

/**
 * Normalizes floating-point geometry before it reaches SVG attributes. Server
 * and browser engines can otherwise serialize the last ULP differently and
 * trigger hydration warnings for visually identical trigonometric geometry.
 */
export function roundSvgNumber(value: number, digits = 4): number {
  if (!Number.isFinite(value)) return value;
  return Number(value.toFixed(digits));
}

/** Round every numeric token in an SVG path while preserving its commands. */
export function roundSvgPath(path: string, digits = 4): string {
  return path.replace(
    /-?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?/gi,
    (token) => {
      const value = Number(token);
      return Number.isFinite(value) ? String(roundSvgNumber(value, digits)) : token;
    },
  );
}
