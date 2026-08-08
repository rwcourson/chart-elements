"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  overlayPanelClass,
  Portal,
  useAnchoredLayer,
  useOutsideDismiss,
} from "./anchored-layer";
import { Calendar, fromIso, toIso, type IsoDate } from "./calendar";

const PANEL_WIDTH = 264;

export type DateFieldProps = {
  value?: IsoDate;
  onChange: (value: IsoDate) => void;
  placeholder?: string;
  disabled?: boolean;
  /** `sm` matches compact rows; `default` matches `Input`. */
  size?: "default" | "sm";
  min?: IsoDate;
  max?: IsoDate;
  /** Shades the span already set by a sibling field in a range. */
  range?: { start?: IsoDate; end?: IsoDate };
  /** Fixed reference for "today", so demos and SSR stay deterministic. */
  today?: Date;
  /** How the chosen date reads in the trigger. */
  displayFormat?: string;
  className?: string;
  id?: string;
  "aria-label"?: string;
};

/**
 * Date input with a themed calendar popover.
 *
 * Replaces `<input type="date">`, whose picker is drawn by the browser: a white
 * panel with the OS accent colour and its own type and metrics, which ignores the
 * theme and does not follow dark mode.
 */
export function DateField({
  value,
  onChange,
  placeholder = "Pick a date",
  disabled,
  size = "default",
  min,
  max,
  range,
  today,
  displayFormat = "MMM d, yyyy",
  className,
  id,
  "aria-label": ariaLabel,
}: DateFieldProps) {
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const [open, setOpen] = React.useState(false);
  const dialogId = React.useId();
  const { style, place, clear } = useAnchoredLayer(triggerRef, {
    maxHeight: 340,
    width: PANEL_WIDTH,
  });

  const close = React.useCallback(
    (restoreFocus = false) => {
      setOpen(false);
      clear();
      if (restoreFocus) triggerRef.current?.focus();
    },
    [clear],
  );

  useOutsideDismiss(
    open,
    [triggerRef, panelRef],
    React.useCallback(() => close(), [close]),
  );

  const parsed = fromIso(value);

  return (
    <>
      <button
        ref={triggerRef}
        id={id}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? dialogId : undefined}
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={() => {
          if (open) return close();
          place();
          setOpen(true);
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" && !open) {
            e.preventDefault();
            place();
            setOpen(true);
          }
        }}
        className={cn(
          "flex w-full items-center justify-between gap-2 rounded-[var(--radius)] border bg-card px-3 text-left text-sm transition-colors focus-visible:border-ring focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50",
          size === "sm" ? "h-9" : "h-11",
          open ? "border-[var(--border-strong)]" : "border-border",
          className,
        )}
      >
        <span
          className={cn(
            "min-w-0 truncate tabular-nums",
            parsed ? "text-foreground" : "text-muted-foreground",
          )}
        >
          {parsed ? format(parsed, displayFormat) : placeholder}
        </span>
        <CalendarDays
          aria-hidden="true"
          className="size-4 shrink-0 text-muted-foreground"
        />
      </button>

      {open && style ? (
        <Portal>
          <div
            ref={panelRef}
            id={dialogId}
            role="dialog"
            aria-modal="false"
            aria-label={ariaLabel ?? "Choose a date"}
            style={style}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                e.stopPropagation();
                close(true);
              }
            }}
            className={cn("z-50 overflow-auto p-2", overlayPanelClass)}
          >
            <Calendar
              autoFocus
              value={value}
              range={range}
              min={min}
              max={max}
              today={today}
              onSelect={(next) => {
                onChange(next);
                close(true);
              }}
            />
            <div className="mt-1.5 flex items-center justify-between border-t border-border pt-1.5">
              <button
                type="button"
                onClick={() => {
                  onChange("");
                  close(true);
                }}
                className="rounded-[var(--radius-sm)] px-2 py-1 text-[12px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => {
                  onChange(toIso(today ?? new Date()));
                  close(true);
                }}
                className="rounded-[var(--radius-sm)] px-2 py-1 text-[12px] font-medium text-accent transition-colors hover:bg-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Today
              </button>
            </div>
          </div>
        </Portal>
      ) : null}
    </>
  );
}
