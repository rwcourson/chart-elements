"use client";

import * as React from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  overlayPanelClass,
  Portal,
  useAnchoredLayer,
  useLayerPresence,
  useOutsideDismiss,
} from "./anchored-layer";
import { Badge } from "./badge";

export type SelectOption = {
  label: string;
  value: string;
  disabled?: boolean;
  count?: number;
};

export type SelectProps = {
  options: SelectOption[];
  /** Always an array so single- and multi-select share one shape. */
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  /** Keeps the menu open and toggles options instead of replacing the value. */
  multiple?: boolean;
  disabled?: boolean;
  /**
   * Adds a leading row that clears the selection, e.g. "All". Single-select only —
   * a multi-select clears by unticking. Without it the only way back to an empty
   * value is re-clicking the chosen row, which nothing on screen advertises.
   */
  clearLabel?: string;
  /** `sm` matches compact rows such as a date hierarchy; `default` matches `Input`. */
  size?: "default" | "sm";
  className?: string;
  id?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  maxMenuHeight?: number;
};

/**
 * Select-only combobox (WAI-ARIA pattern): focus stays on the trigger and the
 * active option is tracked with `aria-activedescendant`.
 *
 * Replaces a native `<select>`, whose popup is drawn by the OS and so ignores the
 * theme entirely — a grey system menu with a blue highlight in the middle of a
 * light dashboard.
 */
export function Select({
  options,
  value,
  onChange,
  placeholder = "Select…",
  multiple = false,
  disabled,
  clearLabel,
  size = "default",
  className,
  id,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledby,
  maxMenuHeight = 260,
}: SelectProps) {
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const typeahead = React.useRef({ query: "", at: 0 });
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState(-1);
  const listboxId = React.useId();
  const optionId = (i: number) => `${listboxId}-opt-${i}`;
  const {
    style: menuStyle,
    side,
    place,
  } = useAnchoredLayer(triggerRef, { maxHeight: maxMenuHeight });
  // Stays true for one beat after close so the menu can animate out.
  const presence = useLayerPresence(open);

  // The clear row is part of the list so that keyboard walking, typeahead and
  // `aria-activedescendant` indices all line up with what is drawn.
  const rows = React.useMemo<(SelectOption & { clear?: boolean })[]>(
    () =>
      clearLabel && !multiple
        ? [{ label: clearLabel, value: "", clear: true }, ...options]
        : options,
    [clearLabel, multiple, options],
  );

  const enabled = React.useMemo(
    () =>
      rows.reduce<number[]>((acc, o, i) => {
        if (!o.disabled) acc.push(i);
        return acc;
      }, []),
    [rows],
  );

  const label = React.useMemo(() => {
    const chosen = options.filter((o) => value.includes(o.value));
    if (!chosen.length) return null;
    if (chosen.length === 1) return chosen[0]!.label;
    return `${chosen.length} selected`;
  }, [options, value]);

  const openMenu = React.useCallback(
    (start: "first" | "last" | "selected") => {
      if (disabled) return;
      place();
      setOpen(true);
      setActive(() => {
        if (start === "last") return enabled.at(-1) ?? -1;
        if (start === "selected") {
          const i = rows.findIndex((o) => value.includes(o.value) && !o.disabled);
          if (i >= 0) return i;
        }
        return enabled[0] ?? -1;
      });
    },
    [disabled, enabled, rows, value, place],
  );

  // Deliberately no clear() of the anchored style: the panel stays mounted
  // through its exit animation, and the next open re-places it anyway.
  const close = React.useCallback(() => {
    setOpen(false);
    setActive(-1);
  }, []);

  const commit = React.useCallback(
    (index: number) => {
      const row = rows[index];
      if (!row || row.disabled) return;
      if (multiple) {
        onChange(
          value.includes(row.value)
            ? value.filter((v) => v !== row.value)
            : [...value, row.value],
        );
        return;
      }
      onChange(row.clear || value.includes(row.value) ? [] : [row.value]);
      close();
      triggerRef.current?.focus();
    },
    [close, multiple, onChange, rows, value],
  );

  const step = React.useCallback(
    (delta: number) => {
      if (!enabled.length) return;
      setActive((prev) => {
        const at = enabled.indexOf(prev);
        if (at === -1) return enabled[delta > 0 ? 0 : enabled.length - 1]!;
        const next = Math.min(Math.max(at + delta, 0), enabled.length - 1);
        return enabled[next]!;
      });
    },
    [enabled],
  );

  useOutsideDismiss(open, [triggerRef, menuRef], close);

  React.useEffect(() => {
    if (!open || active < 0) return;
    menuRef.current
      ?.querySelector(`[data-index="${active}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (!open) openMenu("selected");
        else step(1);
        return;
      case "ArrowUp":
        e.preventDefault();
        if (!open) openMenu("last");
        else step(-1);
        return;
      case "Home":
        if (!open) return;
        e.preventDefault();
        setActive(enabled[0] ?? -1);
        return;
      case "End":
        if (!open) return;
        e.preventDefault();
        setActive(enabled.at(-1) ?? -1);
        return;
      case "Enter":
      case " ":
        e.preventDefault();
        if (!open) openMenu("selected");
        else if (active >= 0) commit(active);
        return;
      case "Escape":
        if (!open) return;
        e.preventDefault();
        close();
        return;
      case "Tab":
        if (open) close();
        return;
      default:
        break;
    }

    // Typeahead. The buffer expires on elapsed time rather than a timer, so
    // there is nothing to clean up if the control unmounts mid-word.
    if (e.key.length !== 1 || e.metaKey || e.ctrlKey || e.altKey) return;
    const now = Date.now();
    const query =
      (now - typeahead.current.at < 700 ? typeahead.current.query : "") +
      e.key.toLowerCase();
    typeahead.current = { query, at: now };
    const match = rows.findIndex(
      (o) => !o.disabled && o.label.toLowerCase().startsWith(query),
    );
    if (match === -1) return;
    e.preventDefault();
    if (!open) {
      place();
      setOpen(true);
    }
    setActive(match);
  };

  const menu =
    presence.mounted && menuStyle ? (
      <div
        ref={menuRef}
        id={listboxId}
        role="listbox"
        aria-multiselectable={multiple || undefined}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        style={menuStyle}
        data-state={presence.closing ? "closed" : "open"}
        data-side={side}
        className={cn(
          "ce-layer z-50 overflow-y-auto overscroll-contain p-1",
          overlayPanelClass,
        )}
      >
        {rows.length ? (
          rows.map((option, i) => {
            const selected = option.clear
              ? value.length === 0
              : value.includes(option.value);
            return (
              <div
                key={option.value || "__clear__"}
                id={optionId(i)}
                data-index={i}
                role="option"
                aria-selected={selected}
                aria-disabled={option.disabled || undefined}
                onPointerEnter={() => !option.disabled && setActive(i)}
                onClick={() => commit(i)}
                className={cn(
                  "flex cursor-default items-center gap-2 rounded-[var(--radius-sm)] px-2 py-1.5 text-sm",
                  // Selected uses the same accent wash as the list slicers'
                  // option rows. The active row needs to read clearly in both
                  // themes for keyboard walking, which `bg-muted` does not do on
                  // the dark card, so it gets the soft-accent tint instead.
                  selected ? "font-medium text-accent" : "text-foreground",
                  selected && (active === i ? "bg-accent/20" : "bg-accent/10"),
                  !selected && active === i && "bg-[var(--accent-soft)]",
                  option.disabled && "pointer-events-none opacity-50",
                )}
              >
                {/* Fixed slot, so labels align whether or not a row is ticked. */}
                <span className="flex size-3.5 shrink-0 items-center justify-center">
                  {selected ? <Check className="size-3.5" /> : null}
                </span>
                <span className="min-w-0 flex-1 truncate">{option.label}</span>
                {option.count != null ? (
                  <Badge variant="secondary" className="shrink-0">
                    {option.count}
                  </Badge>
                ) : null}
              </div>
            );
          })
        ) : (
          <p className="px-2 py-1.5 text-sm text-muted-foreground">No options</p>
        )}
      </div>
    ) : null;

  return (
    <>
      <button
        ref={triggerRef}
        id={id}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        aria-activedescendant={open && active >= 0 ? optionId(active) : undefined}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        disabled={disabled}
        onClick={() => (open ? close() : openMenu("selected"))}
        onKeyDown={onKeyDown}
        className={cn(
          "flex w-full items-center justify-between gap-2 rounded-[var(--radius)] border bg-card px-3 text-left text-sm transition-colors focus-visible:border-ring focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50",
          size === "sm" ? "h-9" : "h-11",
          open ? "border-[var(--border-strong)]" : "border-border",
          className,
        )}
      >
        {/* With a clear row, the empty state is a real value ("All"), not an
            absence, so it reads as foreground text rather than placeholder grey. */}
        <span
          className={cn(
            "min-w-0 truncate",
            label || clearLabel ? "text-foreground" : "text-muted-foreground",
          )}
        >
          {label ?? clearLabel ?? placeholder}
        </span>
        <ChevronDown
          aria-hidden="true"
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
        />
      </button>
      {menu ? <Portal>{menu}</Portal> : null}
    </>
  );
}
