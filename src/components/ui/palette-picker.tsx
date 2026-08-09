"use client";

import * as React from "react";
import { Check, ChevronDown } from "lucide-react";
import {
  applyPalette,
  DEFAULT_PALETTE,
  PALETTES,
  type PaletteId,
  paletteById,
  readStoredPalette,
  storePalette,
} from "@/lib/palettes";
import { cn } from "@/lib/utils";
import {
  overlayPanelClass,
  Portal,
  useAnchoredLayer,
  useLayerPresence,
  useOutsideDismiss,
} from "./anchored-layer";

function subscribePalette(onChange: () => void) {
  window.addEventListener("storage", onChange);
  // Same-tab updates: a tiny custom event dispatched by storePalette().
  window.addEventListener("ce-palette-change", onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener("ce-palette-change", onChange);
  };
}

/**
 * Active palette id, reactive to same-tab picks and other-tab storage writes.
 * SSR snapshot is the default so server and first client render agree.
 */
function useStoredPalette(): PaletteId {
  return React.useSyncExternalStore(
    subscribePalette,
    readStoredPalette,
    () => DEFAULT_PALETTE,
  );
}

/** True after hydration — lets the trigger render stored values mismatch-free. */
function useMounted(): boolean {
  return React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

function Swatches({ colors, size = "md" }: { colors: readonly string[]; size?: "sm" | "md" }) {
  const dim = size === "sm" ? "h-2.5 w-2.5" : "h-3 w-3";
  return (
    <span className="flex items-center gap-0.5" aria-hidden>
      {colors.map((c) => (
        <span
          key={c}
          className={cn(dim, "rounded-full ring-1 ring-black/10 dark:ring-white/15")}
          style={{ backgroundColor: c }}
        />
      ))}
    </span>
  );
}

/**
 * Header control that swaps the demo site's accent + chart CSS variables.
 * Persists to localStorage so a refresh keeps the preview palette.
 */
export function PalettePicker({ className }: { className?: string }) {
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const [open, setOpen] = React.useState(false);
  const palette = useStoredPalette();
  const mounted = useMounted();
  const {
    style: menuStyle,
    side,
    place,
  } = useAnchoredLayer(triggerRef, { maxHeight: 360, width: 260 });
  // Stays true for one beat after close so the menu can animate out.
  const presence = useLayerPresence(open);

  // Sync the <html> attribute with the stored palette — on mount and whenever
  // it changes (including a pick in another tab). External-system sync only.
  React.useLayoutEffect(() => {
    applyPalette(palette);
  }, [palette]);

  // Deliberately no clear() of the anchored style: the panel stays mounted
  // through its exit animation, and the next open re-places it anyway.
  const close = React.useCallback(() => {
    setOpen(false);
  }, []);

  useOutsideDismiss(open, [triggerRef, menuRef], close);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  const current = paletteById(palette);

  const select = (id: PaletteId) => {
    // storePalette dispatches `ce-palette-change`, which updates the hook —
    // the layout effect above then applies the attribute.
    storePalette(id);
    close();
  };

  return (
    <div className={cn("relative", className)}>
      <button
        ref={triggerRef}
        type="button"
        aria-label={`Color palette: ${current.label}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          "inline-flex h-[38px] items-center gap-2 rounded-[var(--radius)] border border-border bg-card px-2.5 text-[13px] font-semibold tracking-[-0.01em]",
          "hover:bg-[var(--sidebar-hover)] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring",
        )}
        onClick={() => {
          if (open) {
            close();
            return;
          }
          place();
          setOpen(true);
        }}
      >
        <Swatches colors={mounted ? current.swatches : PALETTES[0]!.swatches} size="sm" />
        <span className="hidden max-w-[7.5rem] truncate sm:inline">{current.label}</span>
        <ChevronDown className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>

      {presence.mounted && menuStyle ? (
        <Portal>
          <div
            ref={menuRef}
            role="listbox"
            aria-label="Color palettes"
            className={cn("ce-layer", overlayPanelClass, "z-50 overflow-auto p-1.5 shadow-[var(--overlay-shadow)]")}
            style={menuStyle}
            data-state={presence.closing ? "closed" : "open"}
            data-side={side}
          >
            <div className="px-2.5 pb-1.5 pt-1 text-[11px] font-bold uppercase tracking-[0.06em] text-muted-foreground">
              Chart palette
            </div>
            {PALETTES.map((p) => {
              const active = p.id === palette;
              return (
                <button
                  key={p.id}
                  type="button"
                  role="option"
                  aria-selected={active}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-[8px] px-2.5 py-2 text-left transition-colors",
                    active
                      ? "bg-[var(--sidebar-active)]"
                      : "hover:bg-[var(--sidebar-hover)]",
                  )}
                  onClick={() => select(p.id)}
                >
                  <Swatches colors={p.swatches} />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[13px] font-semibold leading-tight tracking-[-0.01em]">
                      {p.label}
                    </span>
                    <span className="block text-[11px] text-muted-foreground">{p.blurb}</span>
                  </span>
                  {active ? <Check className="h-3.5 w-3.5 shrink-0 text-accent" /> : null}
                </button>
              );
            })}
          </div>
        </Portal>
      ) : null}
    </div>
  );
}

/** Live label for copy that should name the active palette. */
export function useActivePalette() {
  return paletteById(useStoredPalette());
}
