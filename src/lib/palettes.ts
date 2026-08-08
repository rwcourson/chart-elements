/**
 * Demo-site chart/accent palettes. Each id maps to CSS overrides on
 * `html[data-palette="…"]` (see `src/app/palettes.css`). Charts already read
 * `var(--chart-*)`, so switching the attribute recolors every visual.
 */
export type PaletteId =
  | "bg-time"
  | "ocean"
  | "sunset"
  | "forest"
  | "slate"
  | "vivid"
  | "berry";

export type Palette = {
  id: PaletteId;
  label: string;
  /** Short line for the gallery subtitle. */
  blurb: string;
  /** Five representative series colors for the picker swatches (light theme). */
  swatches: readonly [string, string, string, string, string];
};

export const DEFAULT_PALETTE: PaletteId = "bg-time";
export const PALETTE_STORAGE_KEY = "ce-palette";

export const PALETTES: readonly Palette[] = [
  {
    id: "bg-time",
    label: "B&G Time",
    blurb: "Navy default",
    swatches: ["#0c2048", "#315fbb", "#1f6b4a", "#8a5010", "#9c343c"],
  },
  {
    id: "ocean",
    label: "Ocean",
    blurb: "Teal & cyan",
    swatches: ["#0e4d60", "#0891b2", "#0d9488", "#0284c7", "#6366f1"],
  },
  {
    id: "sunset",
    label: "Sunset",
    blurb: "Warm coral",
    swatches: ["#9a3412", "#ea580c", "#d97706", "#e11d48", "#a16207"],
  },
  {
    id: "forest",
    label: "Forest",
    blurb: "Moss & pine",
    swatches: ["#14532d", "#15803d", "#4d7c0f", "#0f766e", "#a16207"],
  },
  {
    id: "slate",
    label: "Slate",
    blurb: "Cool neutral",
    swatches: ["#0f172a", "#334155", "#64748b", "#0e7490", "#475569"],
  },
  {
    id: "vivid",
    label: "Vivid",
    blurb: "High-contrast categorical",
    swatches: ["#2563eb", "#16a34a", "#ea580c", "#db2777", "#7c3aed"],
  },
  {
    id: "berry",
    label: "Berry",
    blurb: "Plum & rose",
    swatches: ["#4c1d95", "#7c3aed", "#c026d3", "#db2777", "#e11d48"],
  },
] as const;

export function isPaletteId(value: string | null | undefined): value is PaletteId {
  return !!value && PALETTES.some((p) => p.id === value);
}

export function paletteById(id: PaletteId): Palette {
  return PALETTES.find((p) => p.id === id) ?? PALETTES[0]!;
}

/** Apply (or clear) the palette attribute on `<html>`. */
export function applyPalette(id: PaletteId) {
  if (typeof document === "undefined") return;
  if (id === DEFAULT_PALETTE) {
    document.documentElement.removeAttribute("data-palette");
  } else {
    document.documentElement.setAttribute("data-palette", id);
  }
}

export function readStoredPalette(): PaletteId {
  if (typeof window === "undefined") return DEFAULT_PALETTE;
  try {
    const raw = window.localStorage.getItem(PALETTE_STORAGE_KEY);
    return isPaletteId(raw) ? raw : DEFAULT_PALETTE;
  } catch {
    return DEFAULT_PALETTE;
  }
}

export function storePalette(id: PaletteId) {
  try {
    if (id === DEFAULT_PALETTE) {
      window.localStorage.removeItem(PALETTE_STORAGE_KEY);
    } else {
      window.localStorage.setItem(PALETTE_STORAGE_KEY, id);
    }
  } catch {
    /* private mode / blocked storage — attribute still applies for the session */
  }
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("ce-palette-change"));
  }
}
