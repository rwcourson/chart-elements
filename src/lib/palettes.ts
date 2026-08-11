/**
 * Demo-site chart/accent palettes. Each id maps to CSS overrides on
 * `html[data-palette="…"]` (see `src/app/palettes.css`). Charts already read
 * `var(--chart-*)`, so switching the attribute recolors every visual.
 *
 * `neutral` lives in the base `:root` / `.dark` tokens in `globals.css` —
 * selecting it clears `data-palette`. Every other id sets the attribute.
 */
export type PaletteId =
  | "neutral"
  | "cobalt"
  | "berry"
  | "ocean"
  | "sunset"
  | "forest"
  | "slate"
  | "vivid";

export type Palette = {
  id: PaletteId;
  label: string;
  /** Short line for the gallery subtitle. */
  blurb: string;
  /** Five representative series colors for the picker swatches (light theme). */
  swatches: readonly [string, string, string, string, string];
};

export const DEFAULT_PALETTE: PaletteId = "neutral";
export const PALETTE_STORAGE_KEY = "ce-palette";

/** Base tokens in globals.css — clear `data-palette` when this is active. */
const BASE_TOKEN_PALETTE: PaletteId = "neutral";

export const PALETTES: readonly Palette[] = [
  {
    id: "neutral",
    label: "Neutral",
    blurb: "Balanced categorical",
    swatches: ["#1d4ed8", "#0f766e", "#7c3aed", "#b45309", "#be123c"],
  },
  {
    id: "cobalt",
    label: "Cobalt",
    blurb: "Deep navy & electric blue",
    swatches: ["#002070", "#0028f0", "#3888ff", "#00143c", "#b0ffff"],
  },
  {
    id: "berry",
    label: "Berry",
    blurb: "Plum & rose",
    swatches: ["#4c1d95", "#7c3aed", "#c026d3", "#db2777", "#e11d48"],
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
  // Neutral is the bare token set in globals.css; every other palette is a
  // data-palette override.
  if (id === BASE_TOKEN_PALETTE) {
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
