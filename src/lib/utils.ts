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
