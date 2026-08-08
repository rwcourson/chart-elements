"use client";

import * as React from "react";
import {
  addDays,
  addMonths,
  endOfWeek,
  format,
  isAfter,
  isBefore,
  isSameDay,
  isSameMonth,
  parseISO,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/** `yyyy-MM-dd` — the wire format the native date input used, kept for parity. */
export type IsoDate = string;

export function toIso(date: Date): IsoDate {
  return format(date, "yyyy-MM-dd");
}

export function fromIso(value?: IsoDate | null): Date | undefined {
  if (!value) return undefined;
  const parsed = parseISO(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

export type CalendarProps = {
  /** The selected day. */
  value?: IsoDate;
  onSelect: (value: IsoDate) => void;
  /**
   * Shades the days between two dates. Used by the range slicer so each of its
   * two fields shows the span the other end has already set.
   */
  range?: { start?: IsoDate; end?: IsoDate };
  /** Inclusive bounds; days outside them are shown but not selectable. */
  min?: IsoDate;
  max?: IsoDate;
  /**
   * Reference for the "today" marker. Pass a fixed date to keep server and
   * client markup identical when the calendar is rendered inline.
   */
  today?: Date;
  weekStartsOn?: 0 | 1;
  /** Moves focus into the grid on mount, for use inside a popover. */
  autoFocus?: boolean;
  className?: string;
};

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export function Calendar({
  value,
  onSelect,
  range,
  min,
  max,
  today,
  weekStartsOn = 0,
  autoFocus = false,
  className,
}: CalendarProps) {
  const selected = fromIso(value);
  const now = today ?? new Date();
  const lowerBound = fromIso(min);
  const upperBound = fromIso(max);
  const rangeStart = fromIso(range?.start);
  const rangeEnd = fromIso(range?.end);

  const [month, setMonth] = React.useState(() =>
    startOfMonth(selected ?? rangeStart ?? now),
  );
  const [focused, setFocused] = React.useState(() => selected ?? now);

  const gridRef = React.useRef<HTMLDivElement>(null);
  const pendingFocus = React.useRef(autoFocus);

  const days = React.useMemo(() => {
    const first = startOfWeek(startOfMonth(month), { weekStartsOn });
    // Always six weeks: a month that spans five rows would otherwise resize the
    // popover as you page through it.
    return Array.from({ length: 42 }, (_, i) => addDays(first, i));
  }, [month, weekStartsOn]);

  const outOfBounds = (day: Date) =>
    Boolean(
      (lowerBound && isBefore(day, lowerBound)) ||
        (upperBound && isAfter(day, upperBound)),
    );

  React.useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    // Only pull focus when the grid already owns it (a keyboard walk) or when
    // the calendar has just been opened from a trigger.
    if (!pendingFocus.current && !grid.contains(document.activeElement)) return;
    pendingFocus.current = false;
    grid
      .querySelector<HTMLButtonElement>('[data-focused="true"]')
      ?.focus({ preventScroll: true });
  }, [focused, month]);

  const moveFocus = (next: Date) => {
    setFocused(next);
    if (!isSameMonth(next, month)) setMonth(startOfMonth(next));
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const keys: Record<string, () => Date> = {
      ArrowLeft: () => addDays(focused, -1),
      ArrowRight: () => addDays(focused, 1),
      ArrowUp: () => addDays(focused, -7),
      ArrowDown: () => addDays(focused, 7),
      Home: () => startOfWeek(focused, { weekStartsOn }),
      End: () => endOfWeek(focused, { weekStartsOn }),
      PageUp: () => addMonths(focused, -1),
      PageDown: () => addMonths(focused, 1),
    };
    const step = keys[e.key];
    if (step) {
      e.preventDefault();
      // Paging to another month replaces the day the browser had focused, so the
      // effect below has to be told to put focus back rather than inferring it
      // from an `activeElement` that is already gone.
      pendingFocus.current = true;
      moveFocus(step());
      return;
    }
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (!outOfBounds(focused)) onSelect(toIso(focused));
    }
  };

  const shiftMonth = (delta: number) => {
    const next = addMonths(month, delta);
    setMonth(next);
    // Keep the focused day inside the visible month so the roving tab stop does
    // not disappear from the grid.
    if (!isSameMonth(focused, next)) {
      setFocused(
        isSameMonth(selected ?? now, next)
          ? (selected ?? now)
          : startOfMonth(next),
      );
    }
  };

  return (
    <div className={cn("w-full select-none", className)}>
      <div className="mb-1.5 flex items-center justify-between gap-1">
        <button
          type="button"
          onClick={() => shiftMonth(-1)}
          aria-label="Previous month"
          className="grid size-7 place-items-center rounded-[var(--radius-sm)] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ChevronLeft className="size-4" />
        </button>
        {/* aria-live so a screen reader hears the month change without the
            focused day having to move. */}
        <span aria-live="polite" className="text-[13px] font-semibold">
          {format(month, "MMMM yyyy")}
        </span>
        <button
          type="button"
          onClick={() => shiftMonth(1)}
          aria-label="Next month"
          className="grid size-7 place-items-center rounded-[var(--radius-sm)] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>

      <div className="grid grid-cols-7">
        {Array.from({ length: 7 }, (_, i) => (
          <span
            key={i}
            aria-hidden="true"
            className="grid h-6 place-items-center text-[11px] font-medium text-muted-foreground"
          >
            {WEEKDAYS[(i + weekStartsOn) % 7]}
          </span>
        ))}
      </div>

      <div
        ref={gridRef}
        role="grid"
        aria-label={format(month, "MMMM yyyy")}
        onKeyDown={onKeyDown}
        className="grid grid-cols-7 gap-y-0.5"
      >
        {days.map((day, i) => {
          const iso = toIso(day);
          const isSelected = Boolean(selected && isSameDay(day, selected));
          const isToday = isSameDay(day, now);
          const outside = !isSameMonth(day, month);
          const disabled = outOfBounds(day);
          const inRange = Boolean(
            rangeStart &&
              rangeEnd &&
              !isBefore(day, rangeStart) &&
              !isAfter(day, rangeEnd),
          );
          const isRangeEdge = Boolean(
            (rangeStart && isSameDay(day, rangeStart)) ||
              (rangeEnd && isSameDay(day, rangeEnd)),
          );

          return (
            <button
              // Keyed by cell position, not by date: the grid is a fixed 6×7
              // lattice, and reusing the nodes across months keeps whichever cell
              // holds focus from being unmounted mid-interaction.
              key={i}
              type="button"
              role="gridcell"
              // Roving tab stop: the grid is one stop and arrows walk the days.
              tabIndex={isSameDay(day, focused) ? 0 : -1}
              data-focused={isSameDay(day, focused)}
              aria-selected={isSelected}
              aria-current={isToday ? "date" : undefined}
              aria-disabled={disabled || undefined}
              aria-label={format(day, "EEEE, d MMMM yyyy")}
              onClick={() => {
                if (disabled) return;
                setFocused(day);
                onSelect(iso);
              }}
              className={cn(
                "relative grid h-8 place-items-center text-[13px] tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                // Square middles with rounded ends read as one continuous band.
                inRange && !isSelected && "bg-accent/10 text-accent",
                inRange && isRangeEdge && "rounded-[var(--radius-sm)]",
                !inRange && "rounded-[var(--radius-sm)]",
                isSelected
                  ? "bg-accent font-semibold text-accent-foreground"
                  : outside
                    ? "text-muted-foreground/55 hover:bg-muted"
                    : "text-foreground hover:bg-muted",
                disabled && "pointer-events-none opacity-40",
              )}
            >
              {day.getDate()}
              {isToday && !isSelected ? (
                <span
                  aria-hidden="true"
                  className="absolute bottom-1 size-1 rounded-full bg-accent"
                />
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
