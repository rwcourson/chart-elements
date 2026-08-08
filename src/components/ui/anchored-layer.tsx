"use client";

import * as React from "react";
import { createPortal } from "react-dom";

/**
 * Renders into `document.body`.
 *
 * Overlays are portalled rather than left in the flow because these controls get
 * dropped inside cards and panels that clip their overflow — an in-flow menu is
 * cut off at the card edge.
 */
export function Portal({ children }: { children: React.ReactNode }) {
  if (typeof document === "undefined") return null;
  return createPortal(children, document.body);
}

export type AnchorOptions = {
  maxHeight?: number;
  /** `"anchor"` matches the trigger's width; a number is a fixed panel width. */
  width?: "anchor" | number;
};

/**
 * Positions an overlay against a trigger with fixed coordinates, flipping it
 * above when there is not enough room below.
 */
export function useAnchoredLayer(
  anchor: React.RefObject<HTMLElement | null>,
  { maxHeight = 260, width = "anchor" }: AnchorOptions = {},
) {
  const [style, setStyle] = React.useState<React.CSSProperties | null>(null);

  // Measured from the event that opens the layer rather than from an effect, so
  // its first paint is already in the right place.
  const place = React.useCallback(() => {
    const el = anchor.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const gap = 6;
    const edge = 8;
    const below = window.innerHeight - rect.bottom - gap - edge;
    const above = rect.top - gap - edge;
    const flip = below < Math.min(maxHeight, 180) && above > below;

    setStyle({
      position: "fixed",
      // A fixed-width panel is nudged back inside the viewport if the trigger
      // sits close to the right edge.
      left:
        width === "anchor"
          ? rect.left
          : Math.max(edge, Math.min(rect.left, window.innerWidth - width - edge)),
      width: width === "anchor" ? rect.width : width,
      maxHeight: Math.max(96, Math.min(maxHeight, flip ? above : below)),
      ...(flip
        ? { bottom: window.innerHeight - rect.top + gap }
        : { top: rect.bottom + gap }),
    });
  }, [anchor, maxHeight, width]);

  const clear = React.useCallback(() => setStyle(null), []);
  const anchored = style !== null;

  React.useEffect(() => {
    if (!anchored) return;
    // Captured so scrolling any ancestor scroll container repositions the layer,
    // not just the window.
    window.addEventListener("scroll", place, true);
    window.addEventListener("resize", place);
    return () => {
      window.removeEventListener("scroll", place, true);
      window.removeEventListener("resize", place);
    };
  }, [anchored, place]);

  return { style, place, clear };
}

/** Closes an open overlay on a pointer press outside every given element. */
export function useOutsideDismiss(
  open: boolean,
  refs: React.RefObject<HTMLElement | null>[],
  onDismiss: () => void,
) {
  React.useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (refs.some((ref) => ref.current?.contains(target))) return;
      onDismiss();
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open, onDismiss, refs]);
}

/** Shared chrome for menus and popovers so every overlay reads as one family. */
export const overlayPanelClass =
  "rounded-[var(--radius)] border border-border bg-card shadow-[var(--overlay-shadow)]";
