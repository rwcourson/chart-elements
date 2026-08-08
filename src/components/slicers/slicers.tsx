"use client";

import * as React from "react";
import {
  format,
  subDays,
  subMonths,
  subMinutes,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
} from "date-fns";
import { ChevronDown, ChevronRight, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DateField } from "@/components/ui/date-field";
import { Select } from "@/components/ui/select";

// ─── Types & hooks ───────────────────────────────────────────────────────────

/** Fixed reference date so SSR + client defaults match (no hydration drift). */
const DEMO_TODAY = new Date("2026-06-15T12:00:00.000Z");

export type SlicerOption = {
  label: string;
  value: string;
  disabled?: boolean;
  count?: number;
  icon?: React.ReactNode;
  image?: string;
};

export type HierarchicalOption = SlicerOption & {
  children?: HierarchicalOption[];
};

export type DateRange = { start: string; end: string };
export type NumericRange = { min: number | null; max: number | null };
export type NumericFilter = { operator: "eq" | "gt" | "lt" | "between"; value: number | NumericRange };

type BaseProps = {
  className?: string;
  label?: string;
  disabled?: boolean;
};

function useControllableState<T>({
  value,
  defaultValue,
  onChange,
}: {
  value?: T;
  defaultValue?: T;
  onChange?: (value: T) => void;
}) {
  const [internal, setInternal] = React.useState<T | undefined>(defaultValue);
  const isControlled = value !== undefined;
  const state = isControlled ? value : internal;

  const setState = React.useCallback(
    (next: T | ((prev: T | undefined) => T)) => {
      const resolved =
        typeof next === "function"
          ? (next as (prev: T | undefined) => T)(state)
          : next;
      if (!isControlled) setInternal(resolved);
      onChange?.(resolved);
    },
    [isControlled, onChange, state],
  );

  return [state, setState] as const;
}

function useMultiSelect(
  value: string[] | undefined,
  defaultValue: string[] | undefined,
  onChange: ((value: string[]) => void) | undefined,
) {
  return useControllableState<string[]>({
    value,
    defaultValue: defaultValue ?? [],
    onChange,
  });
}

// ─── Shared primitives ─────────────────────────────────────────────────────────

/**
 * Slicer bodies are capped rather than stretched. A slicer is a compact filter
 * control, but the visual holding it can be any width, and at 900px a row puts its
 * label at one end of the screen and its count or value at the other.
 *
 * `field` is one single-line control; `fields` (the default) covers option lists,
 * tile and button layouts, and rows of two or more inputs.
 */
const FIELD_WIDTH = {
  field: "max-w-[320px]",
  fields: "max-w-[440px]",
} as const;

function SlicerShell({
  label,
  className,
  children,
  controlId,
  width = "fields",
}: BaseProps & {
  children: React.ReactNode;
  controlId?: string;
  width?: keyof typeof FIELD_WIDTH;
}) {
  return (
    // The consumer's className comes last so an explicit width still wins.
    <div className={cn("space-y-2", FIELD_WIDTH[width], className)}>
      {label ? (
        controlId ? (
          <label
            htmlFor={controlId}
            className="block text-xs font-medium text-muted-foreground"
          >
            {label}
          </label>
        ) : (
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
        )
      ) : null}
      {children}
    </div>
  );
}

const optionItemClass = (selected: boolean, disabled?: boolean) =>
  cn(
    "flex w-full items-center gap-2 rounded-[var(--radius-sm)] px-2 py-1.5 text-left text-sm transition-colors",
    selected
      ? "bg-accent/10 text-accent"
      : "text-foreground hover:bg-muted",
    disabled && "pointer-events-none opacity-50",
  );

function OptionCheckbox({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
}) {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      disabled={disabled}
      aria-hidden="true"
      tabIndex={-1}
      className="size-3.5 shrink-0 rounded border-border accent-accent"
    />
  );
}

function OptionRadio({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
}) {
  return (
    <input
      type="radio"
      checked={checked}
      onChange={onChange}
      disabled={disabled}
      aria-hidden="true"
      tabIndex={-1}
      className="size-3.5 shrink-0 accent-accent"
    />
  );
}

function OptionRow({
  option,
  selected,
  multiple,
  onSelect,
}: {
  option: SlicerOption;
  selected: boolean;
  multiple?: boolean;
  onSelect: () => void;
}) {
  const Control = multiple ? OptionCheckbox : OptionRadio;
  return (
    <button
      type="button"
      role={multiple ? "checkbox" : "radio"}
      aria-checked={selected}
      disabled={option.disabled}
      onClick={onSelect}
      className={optionItemClass(selected, option.disabled)}
    >
      <Control checked={selected} onChange={onSelect} disabled={option.disabled} />
      {option.icon ? <span className="shrink-0">{option.icon}</span> : null}
      {option.image ? (
        // Plain <img>: consumers pass arbitrary URLs, and next/image would
        // require them to register remote patterns and couple this to Next.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={option.image} alt="" className="size-5 rounded object-cover" />
      ) : null}
      <span className="min-w-0 flex-1 truncate">{option.label}</span>
      {option.count != null ? (
        <Badge variant="secondary" className="ml-auto shrink-0">
          {option.count}
        </Badge>
      ) : null}
    </button>
  );
}

function OptionsList({
  options,
  value,
  multiple,
  onChange,
  className,
  maxHeight = 200,
}: {
  options: SlicerOption[];
  value: string[];
  multiple?: boolean;
  onChange: (value: string[]) => void;
  className?: string;
  maxHeight?: number;
}) {
  const toggle = (v: string) => {
    if (multiple) {
      onChange(
        value.includes(v) ? value.filter((x) => x !== v) : [...value, v],
      );
    } else {
      onChange([v]);
    }
  };

  return (
    <div
      className={cn("overflow-y-auto rounded-[var(--radius)] border border-border", className)}
      style={{ maxHeight }}
    >
      <div className="p-1" role={multiple ? "group" : "radiogroup"}>
        {options.map((opt) => (
          <OptionRow
            key={opt.value}
            option={opt}
            selected={value.includes(opt.value)}
            multiple={multiple}
            onSelect={() => toggle(opt.value)}
          />
        ))}
      </div>
    </div>
  );
}

function SearchBox({
  value,
  onChange,
  placeholder = "Search…",
  className,
  ariaLabel = "Search",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
  ariaLabel?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className="pl-8"
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          title="Clear search"
          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          <X className="size-3.5" />
        </button>
      ) : null}
    </div>
  );
}

function filterOptions(options: SlicerOption[], query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return options;
  return options.filter(
    (o) =>
      o.label.toLowerCase().includes(q) || o.value.toLowerCase().includes(q),
  );
}

function ButtonOption({
  option,
  selected,
  onClick,
  size = "sm",
}: {
  option: SlicerOption;
  selected: boolean;
  onClick: () => void;
  size?: "sm" | "default";
}) {
  return (
    <Button
      type="button"
      size={size}
      variant={selected ? "default" : "outline"}
      disabled={option.disabled}
      onClick={onClick}
      className="gap-1.5"
    >
      {option.icon}
      {option.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={option.image} alt="" className="size-4 rounded object-cover" />
      ) : null}
      {option.label}
      {option.count != null ? (
        <Badge variant="secondary" className="ml-0.5">
          {option.count}
        </Badge>
      ) : null}
    </Button>
  );
}

// ─── Hierarchy helpers ───────────────────────────────────────────────────────

function flattenHierarchy(
  nodes: HierarchicalOption[],
  prefix = "",
): SlicerOption[] {
  const result: SlicerOption[] = [];
  for (const node of nodes) {
    const path = prefix ? `${prefix}/${node.value}` : node.value;
    result.push({ ...node, value: path });
    if (node.children?.length) {
      result.push(...flattenHierarchy(node.children, path));
    }
  }
  return result;
}

function HierarchyNode({
  node,
  path,
  depth,
  value,
  multiple,
  onChange,
  expanded,
  onToggleExpand,
}: {
  node: HierarchicalOption;
  path: string;
  depth: number;
  value: string[];
  multiple?: boolean;
  onChange: (v: string[]) => void;
  expanded: Set<string>;
  onToggleExpand: (p: string) => void;
}) {
  const hasChildren = Boolean(node.children?.length);
  const isExpanded = expanded.has(path);
  const selected = value.includes(path);

  const select = () => {
    if (multiple) {
      onChange(
        selected ? value.filter((v) => v !== path) : [...value, path],
      );
    } else {
      onChange([path]);
    }
  };

  return (
    <div>
      <div
        className="flex items-center"
        style={{ paddingLeft: depth * 12 }}
      >
        {hasChildren ? (
          <button
            type="button"
            onClick={() => onToggleExpand(path)}
            aria-label={`${isExpanded ? "Collapse" : "Expand"} ${node.label}`}
            aria-expanded={isExpanded}
            className="mr-0.5 rounded p-0.5 text-muted-foreground hover:bg-muted"
          >
            {isExpanded ? (
              <ChevronDown className="size-3.5" />
            ) : (
              <ChevronRight className="size-3.5" />
            )}
          </button>
        ) : (
          <span className="w-5" />
        )}
        <button
          type="button"
          role={multiple ? "checkbox" : "radio"}
          aria-checked={selected}
          disabled={node.disabled}
          onClick={select}
          className={cn(optionItemClass(selected, node.disabled), "flex-1")}
        >
          {multiple ? (
            <OptionCheckbox checked={selected} onChange={select} disabled={node.disabled} />
          ) : (
            <OptionRadio checked={selected} onChange={select} disabled={node.disabled} />
          )}
          <span className="truncate">{node.label}</span>
        </button>
      </div>
      {hasChildren && isExpanded
        ? node.children!.map((child) => (
            <HierarchyNode
              key={`${path}/${child.value}`}
              node={child}
              path={`${path}/${child.value}`}
              depth={depth + 1}
              value={value}
              multiple={multiple}
              onChange={onChange}
              expanded={expanded}
              onToggleExpand={onToggleExpand}
            />
          ))
        : null}
    </div>
  );
}

function HierarchyTree({
  options,
  value,
  multiple,
  onChange,
  className,
  maxHeight = 220,
}: {
  options: HierarchicalOption[];
  value: string[];
  multiple?: boolean;
  onChange: (v: string[]) => void;
  className?: string;
  maxHeight?: number;
}) {
  const [expanded, setExpanded] = React.useState<Set<string>>(new Set());

  const toggleExpand = (path: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  };

  return (
    <div
      className={cn("overflow-y-auto rounded-[var(--radius)] border border-border p-1", className)}
      style={{ maxHeight }}
      role={multiple ? "group" : "radiogroup"}
    >
      {options.map((node) => (
        <HierarchyNode
          key={node.value}
          node={node}
          path={node.value}
          depth={0}
          value={value}
          multiple={multiple}
          onChange={onChange}
          expanded={expanded}
          onToggleExpand={toggleExpand}
        />
      ))}
    </div>
  );
}

// ─── Standard slicers ────────────────────────────────────────────────────────

export const DEFAULT_SLICER_OPTIONS: SlicerOption[] = [
  { label: "North", value: "north", count: 42 },
  { label: "South", value: "south", count: 28 },
  { label: "East", value: "east", count: 35 },
  { label: "West", value: "west", count: 19 },
  { label: "Central", value: "central", count: 31 },
];

export const DEFAULT_HIERARCHY_OPTIONS: HierarchicalOption[] = [
  {
    label: "Americas",
    value: "americas",
    children: [
      { label: "USA", value: "usa" },
      { label: "Canada", value: "canada" },
    ],
  },
  {
    label: "EMEA",
    value: "emea",
    children: [
      { label: "UK", value: "uk" },
      { label: "Germany", value: "de" },
    ],
  },
  {
    label: "APAC",
    value: "apac",
    children: [
      { label: "Japan", value: "jp" },
      { label: "Australia", value: "au" },
    ],
  },
];

export type OptionsSlicerProps = BaseProps & {
  options?: SlicerOption[];
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
  multiple?: boolean;
  maxHeight?: number;
};

export function StandardSlicer({
  options = DEFAULT_SLICER_OPTIONS,
  value,
  defaultValue,
  onChange,
  multiple = true,
  label,
  className,
  maxHeight,
  disabled,
}: OptionsSlicerProps) {
  const [selected, setSelected] = useMultiSelect(value, defaultValue, onChange);
  return (
    <SlicerShell label={label} className={className}>
      <fieldset disabled={disabled}>
        <OptionsList
          options={options}
          value={selected ?? []}
          multiple={multiple}
          onChange={setSelected}
          maxHeight={maxHeight}
        />
      </fieldset>
    </SlicerShell>
  );
}

export function VerticalListSlicer(props: OptionsSlicerProps) {
  return <StandardSlicer {...props} multiple={props.multiple ?? false} />;
}

export function DropdownSlicer({
  options = DEFAULT_SLICER_OPTIONS,
  value,
  defaultValue,
  onChange,
  label,
  className,
  disabled,
  multiple,
}: OptionsSlicerProps) {
  const [selected, setSelected] = useMultiSelect(value, defaultValue, onChange);
  const current = selected ?? [];
  const controlId = React.useId();

  return (
    <SlicerShell
      label={label}
      className={className}
      controlId={controlId}
      width="field"
    >
      <Select
        id={controlId}
        aria-label={label ? undefined : "Select value"}
        disabled={disabled}
        multiple={multiple}
        clearLabel="All"
        options={options}
        value={current}
        onChange={setSelected}
      />
    </SlicerShell>
  );
}

export function TileSlicer({
  options = DEFAULT_SLICER_OPTIONS,
  value,
  defaultValue,
  onChange,
  multiple = true,
  label,
  className,
  disabled,
  columns = 3,
}: OptionsSlicerProps & { columns?: number }) {
  const [selected, setSelected] = useMultiSelect(value, defaultValue, onChange);
  const current = selected ?? [];

  const toggle = (v: string) => {
    if (multiple) {
      setSelected(
        current.includes(v)
          ? current.filter((x) => x !== v)
          : [...current, v],
      );
    } else {
      setSelected([v]);
    }
  };

  return (
    <SlicerShell label={label} className={className}>
      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {options.map((opt) => {
          const isSelected = current.includes(opt.value);
          return (
            <button
              key={opt.value}
              type="button"
              disabled={disabled || opt.disabled}
              onClick={() => toggle(opt.value)}
              className={cn(
                "flex flex-col items-center gap-1.5 rounded-[var(--radius)] border p-3 text-center text-xs transition-colors",
                isSelected
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border bg-card hover:bg-muted",
              )}
            >
              {opt.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={opt.image} alt="" className="size-8 rounded object-cover" />
              ) : opt.icon ? (
                <span className="text-muted-foreground">{opt.icon}</span>
              ) : null}
              <span className="font-medium">{opt.label}</span>
              {opt.count != null ? (
                <Badge variant="secondary">{opt.count}</Badge>
              ) : null}
            </button>
          );
        })}
      </div>
    </SlicerShell>
  );
}

export function HierarchicalSlicer({
  options = DEFAULT_HIERARCHY_OPTIONS,
  value,
  defaultValue,
  onChange,
  multiple = true,
  label,
  className,
  disabled,
  maxHeight,
}: BaseProps & {
  options?: HierarchicalOption[];
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
  multiple?: boolean;
  maxHeight?: number;
}) {
  const [selected, setSelected] = useMultiSelect(value, defaultValue, onChange);
  return (
    <SlicerShell label={label} className={className}>
      <fieldset disabled={disabled}>
        <HierarchyTree
          options={options}
          value={selected ?? []}
          multiple={multiple}
          onChange={setSelected}
          maxHeight={maxHeight}
        />
      </fieldset>
    </SlicerShell>
  );
}

export function SearchableSlicer({
  options = DEFAULT_SLICER_OPTIONS,
  value,
  defaultValue,
  onChange,
  multiple = true,
  label,
  className,
  disabled,
  placeholder,
  maxHeight,
}: OptionsSlicerProps & { placeholder?: string }) {
  const [selected, setSelected] = useMultiSelect(value, defaultValue, onChange);
  const [query, setQuery] = React.useState("");
  const filtered = filterOptions(options, query);

  return (
    <SlicerShell label={label} className={className}>
      <SearchBox
        value={query}
        onChange={setQuery}
        placeholder={placeholder}
        ariaLabel={label ? `Search ${label}` : "Search"}
      />
      <fieldset disabled={disabled}>
        <OptionsList
          options={filtered}
          value={selected ?? []}
          multiple={multiple}
          onChange={setSelected}
          maxHeight={maxHeight}
        />
      </fieldset>
    </SlicerShell>
  );
}

// ─── Numeric slicers ───────────────────────────────────────────────────────────

export type NumericSlicerProps = BaseProps & {
  value?: number | null;
  defaultValue?: number | null;
  onChange?: (value: number | null) => void;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
};

export function NumericSlicer({
  value,
  defaultValue,
  onChange,
  min,
  max,
  step = 1,
  placeholder = "Enter value",
  label,
  className,
  disabled,
}: NumericSlicerProps) {
  const [num, setNum] = useControllableState<number | null>({
    value,
    defaultValue: defaultValue ?? null,
    onChange,
  });
  const controlId = React.useId();

  return (
    <SlicerShell
      label={label}
      className={className}
      controlId={controlId}
      width="field"
    >
      <Input
        id={controlId}
        aria-label={label ? undefined : placeholder}
        type="number"
        disabled={disabled}
        min={min}
        max={max}
        step={step}
        placeholder={placeholder}
        value={num ?? ""}
        onChange={(e) => {
          const v = e.target.value;
          setNum(v === "" ? null : Number(v));
        }}
      />
    </SlicerShell>
  );
}

export type NumericRangeSlicerProps = BaseProps & {
  value?: NumericRange;
  defaultValue?: NumericRange;
  onChange?: (value: NumericRange) => void;
  min?: number;
  max?: number;
  step?: number;
};

export function NumericRangeSlicer({
  value,
  defaultValue,
  onChange,
  min,
  max,
  step = 1,
  label,
  className,
  disabled,
}: NumericRangeSlicerProps) {
  const [range, setRange] = useControllableState<NumericRange>({
    value,
    defaultValue: defaultValue ?? { min: null, max: null },
    onChange,
  });

  const update = (key: "min" | "max", raw: string) => {
    setRange({ ...range!, [key]: raw === "" ? null : Number(raw) });
  };

  return (
    <SlicerShell label={label} className={className}>
      <div className="flex items-center gap-2">
        <Input
          type="number"
          aria-label={label ? `${label} minimum` : "Minimum"}
          disabled={disabled}
          min={min}
          max={max}
          step={step}
          placeholder="Min"
          value={range?.min ?? ""}
          onChange={(e) => update("min", e.target.value)}
        />
        <span className="text-xs text-muted-foreground">to</span>
        <Input
          type="number"
          aria-label={label ? `${label} maximum` : "Maximum"}
          disabled={disabled}
          min={min}
          max={max}
          step={step}
          placeholder="Max"
          value={range?.max ?? ""}
          onChange={(e) => update("max", e.target.value)}
        />
      </div>
    </SlicerShell>
  );
}

export function BetweenSlicer(props: Omit<NumericRangeSlicerProps, "label"> & { label?: string }) {
  return <NumericRangeSlicer {...props} label={props.label ?? "Between"} />;
}

type ComparisonSlicerProps = Omit<NumericSlicerProps, "label"> & { label?: string };

export function GreaterThanSlicer({
  label = "Greater than",
  placeholder = "Min value",
  ...props
}: ComparisonSlicerProps) {
  return <NumericSlicer {...props} label={label} placeholder={placeholder} />;
}

export function LessThanSlicer({
  label = "Less than",
  placeholder = "Max value",
  ...props
}: ComparisonSlicerProps) {
  return <NumericSlicer {...props} label={label} placeholder={placeholder} />;
}

// ─── Date slicers ──────────────────────────────────────────────────────────────

export type DateRangeSlicerProps = BaseProps & {
  value?: DateRange;
  defaultValue?: DateRange;
  onChange?: (value: DateRange) => void;
};

export function DateRangeSlicer({
  value,
  defaultValue,
  onChange,
  label = "Date range",
  className,
  disabled,
}: DateRangeSlicerProps) {
  const [range, setRange] = useControllableState<DateRange>({
    value,
    defaultValue: defaultValue ?? { start: "", end: "" },
    onChange,
  });

  return (
    <SlicerShell label={label} className={className}>
      <div className="flex items-center gap-2">
        {/* Each field bounds the other and shades the span already chosen, so the
            two halves read as one range rather than two unrelated dates. */}
        <DateField
          aria-label={label ? `${label} start` : "Start date"}
          disabled={disabled}
          placeholder="Start"
          today={DEMO_TODAY}
          max={range?.end || undefined}
          range={range}
          value={range?.start ?? ""}
          onChange={(start) => setRange({ ...range!, start })}
        />
        <span className="shrink-0 text-xs text-muted-foreground">to</span>
        <DateField
          aria-label={label ? `${label} end` : "End date"}
          disabled={disabled}
          placeholder="End"
          today={DEMO_TODAY}
          min={range?.start || undefined}
          range={range}
          value={range?.end ?? ""}
          onChange={(end) => setRange({ ...range!, end })}
        />
      </div>
    </SlicerShell>
  );
}

const DATE_HIERARCHY_LEVELS = ["year", "quarter", "month", "day"] as const;

export function DateHierarchySlicer({
  value,
  defaultValue,
  onChange,
  label = "Date hierarchy",
  className,
  disabled,
  levels = DATE_HIERARCHY_LEVELS,
}: BaseProps & {
  value?: Record<string, string>;
  defaultValue?: Record<string, string>;
  onChange?: (value: Record<string, string>) => void;
  levels?: readonly string[];
}) {
  const [selection, setSelection] = useControllableState<Record<string, string>>({
    value,
    defaultValue: defaultValue ?? {},
    onChange,
  });
  const levelIdPrefix = React.useId();

  const yearOptions = Array.from({ length: 5 }, (_, i) => {
    const y = String(DEMO_TODAY.getUTCFullYear() - i);
    return { label: y, value: y };
  });
  const quarterOptions = ["Q1", "Q2", "Q3", "Q4"].map((q) => ({
    label: q,
    value: q,
  }));
  const monthOptions = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ].map((label, i) => ({
    label,
    value: String(i + 1).padStart(2, "0"),
  }));

  const levelOptions: Record<string, SlicerOption[]> = {
    year: yearOptions,
    quarter: quarterOptions,
    month: monthOptions,
    day: Array.from({ length: 31 }, (_, i) => ({
      label: String(i + 1),
      value: String(i + 1).padStart(2, "0"),
    })),
  };

  return (
    <SlicerShell label={label} className={className}>
      {/* Equal columns that only wrap once a level would be narrower than 76px.
          Flex with a 100px floor dropped the last level onto its own full-width
          row inside a normal-width card. */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(76px,1fr))] gap-2">
        {levels.map((level) => (
          <div key={level} className="min-w-0">
            <label
              htmlFor={`${levelIdPrefix}-${level}`}
              className="mb-1 block text-[10px] uppercase tracking-wide text-muted-foreground"
            >
              {level}
            </label>
            <Select
              id={`${levelIdPrefix}-${level}`}
              aria-label={label ? `${label} ${level}` : level}
              disabled={disabled}
              size="sm"
              placeholder="All"
              clearLabel="All"
              options={levelOptions[level] ?? []}
              value={selection?.[level] ? [selection[level]!] : []}
              onChange={(v) =>
                setSelection({ ...selection!, [level]: v[0] ?? "" })
              }
            />
          </div>
        ))}
      </div>
    </SlicerShell>
  );
}

export type RelativeDatePreset = {
  label: string;
  value: string;
  getRange: () => DateRange;
};

const DEFAULT_RELATIVE_DATE_PRESETS: RelativeDatePreset[] = [
  {
    label: "Today",
    value: "today",
    getRange: () => {
      const d = format(DEMO_TODAY, "yyyy-MM-dd");
      return { start: d, end: d };
    },
  },
  {
    label: "Yesterday",
    value: "yesterday",
    getRange: () => {
      const d = format(subDays(DEMO_TODAY, 1), "yyyy-MM-dd");
      return { start: d, end: d };
    },
  },
  {
    label: "Last 7 days",
    value: "last7",
    getRange: () => ({
      start: format(subDays(DEMO_TODAY, 6), "yyyy-MM-dd"),
      end: format(DEMO_TODAY, "yyyy-MM-dd"),
    }),
  },
  {
    label: "Last 30 days",
    value: "last30",
    getRange: () => ({
      start: format(subDays(DEMO_TODAY, 29), "yyyy-MM-dd"),
      end: format(DEMO_TODAY, "yyyy-MM-dd"),
    }),
  },
  {
    label: "This month",
    value: "thisMonth",
    getRange: () => ({
      start: format(startOfMonth(DEMO_TODAY), "yyyy-MM-dd"),
      end: format(endOfMonth(DEMO_TODAY), "yyyy-MM-dd"),
    }),
  },
  {
    label: "Last month",
    value: "lastMonth",
    getRange: () => {
      const d = subMonths(DEMO_TODAY, 1);
      return {
        start: format(startOfMonth(d), "yyyy-MM-dd"),
        end: format(endOfMonth(d), "yyyy-MM-dd"),
      };
    },
  },
  {
    label: "This year",
    value: "thisYear",
    getRange: () => ({
      start: format(startOfYear(DEMO_TODAY), "yyyy-MM-dd"),
      end: format(endOfYear(DEMO_TODAY), "yyyy-MM-dd"),
    }),
  },
];

export function RelativeDateSlicer({
  value,
  defaultValue,
  onChange,
  presets = DEFAULT_RELATIVE_DATE_PRESETS,
  label = "Relative date",
  className,
  disabled,
  onRangeChange,
}: BaseProps & {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  presets?: RelativeDatePreset[];
  onRangeChange?: (range: DateRange) => void;
}) {
  const [preset, setPreset] = useControllableState<string>({
    value,
    defaultValue: defaultValue ?? "",
    onChange: (v) => {
      onChange?.(v);
      const match = presets.find((p) => p.value === v);
      if (match) onRangeChange?.(match.getRange());
    },
  });

  return (
    <SlicerShell label={label} className={className}>
      <div className="flex flex-wrap gap-1.5">
        {presets.map((p) => (
          <Button
            key={p.value}
            type="button"
            size="sm"
            variant={preset === p.value ? "default" : "outline"}
            disabled={disabled}
            onClick={() => setPreset(p.value)}
          >
            {p.label}
          </Button>
        ))}
      </div>
    </SlicerShell>
  );
}

const DEFAULT_RELATIVE_TIME_PRESETS = [
  { label: "15 min", value: "15m", minutes: 15 },
  { label: "30 min", value: "30m", minutes: 30 },
  { label: "1 hour", value: "1h", minutes: 60 },
  { label: "4 hours", value: "4h", minutes: 240 },
  { label: "24 hours", value: "24h", minutes: 1440 },
];

export function RelativeTimeSlicer({
  value,
  defaultValue,
  onChange,
  presets = DEFAULT_RELATIVE_TIME_PRESETS,
  label = "Relative time",
  className,
  disabled,
  onTimeChange,
}: BaseProps & {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  presets?: { label: string; value: string; minutes: number }[];
  onTimeChange?: (start: Date, end: Date) => void;
}) {
  const [preset, setPreset] = useControllableState<string>({
    value,
    defaultValue: defaultValue ?? "",
    onChange: (v) => {
      onChange?.(v);
      const match = presets.find((p) => p.value === v);
      if (match) {
        const end = new Date();
        onTimeChange?.(subMinutes(end, match.minutes), end);
      }
    },
  });

  return (
    <SlicerShell label={label} className={className}>
      <div className="flex flex-wrap gap-1.5">
        {presets.map((p) => (
          <Button
            key={p.value}
            type="button"
            size="sm"
            variant={preset === p.value ? "default" : "outline"}
            disabled={disabled}
            onClick={() => setPreset(p.value)}
          >
            {p.label}
          </Button>
        ))}
      </div>
    </SlicerShell>
  );
}

export function DatePickerSlicer({
  value,
  defaultValue,
  onChange,
  label = "Date",
  className,
  disabled,
}: BaseProps & {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
}) {
  const [date, setDate] = useControllableState<string>({
    value,
    defaultValue: defaultValue ?? "",
    onChange,
  });
  const controlId = React.useId();

  return (
    <SlicerShell
      label={label}
      className={className}
      controlId={controlId}
      width="field"
    >
      <DateField
        id={controlId}
        aria-label={label ? undefined : "Date"}
        disabled={disabled}
        today={DEMO_TODAY}
        value={date ?? ""}
        onChange={setDate}
      />
    </SlicerShell>
  );
}

// ─── Button family ─────────────────────────────────────────────────────────────

export type ButtonSlicerProps = OptionsSlicerProps & {
  orientation?: "horizontal" | "vertical";
  size?: "sm" | "default";
};

function ButtonSlicerBase({
  options = DEFAULT_SLICER_OPTIONS,
  value,
  defaultValue,
  onChange,
  multiple = false,
  label,
  className,
  disabled,
  orientation = "horizontal",
  size = "sm",
  layout = "row",
  columns,
}: ButtonSlicerProps & {
  layout?: "row" | "grid" | "list";
  columns?: number;
}) {
  const [selected, setSelected] = useMultiSelect(value, defaultValue, onChange);
  const current = selected ?? [];

  const toggle = (v: string) => {
    if (multiple) {
      setSelected(
        current.includes(v)
          ? current.filter((x) => x !== v)
          : [...current, v],
      );
    } else {
      setSelected([v]);
    }
  };

  const buttons = options.map((opt) => (
    <ButtonOption
      key={opt.value}
      option={opt}
      selected={current.includes(opt.value)}
      onClick={() => toggle(opt.value)}
      size={size}
    />
  ));

  return (
    <SlicerShell label={label} className={className}>
      <fieldset disabled={disabled}>
        {layout === "grid" ? (
          <div
            className="grid gap-2"
            style={{
              gridTemplateColumns: `repeat(${columns ?? 3}, minmax(0, 1fr))`,
            }}
          >
            {buttons}
          </div>
        ) : layout === "list" ? (
          <div className="flex flex-col gap-1">{buttons}</div>
        ) : (
          <div
            className={cn(
              "flex flex-wrap gap-1.5",
              orientation === "vertical" && "flex-col",
            )}
          >
            {buttons}
          </div>
        )}
      </fieldset>
    </SlicerShell>
  );
}

export function ButtonSlicer(props: ButtonSlicerProps) {
  return <ButtonSlicerBase {...props} />;
}

export function SingleSelectButtons(props: ButtonSlicerProps) {
  return <ButtonSlicerBase {...props} multiple={false} />;
}

export function MultiSelectButtons(props: ButtonSlicerProps) {
  return <ButtonSlicerBase {...props} multiple />;
}

export function ButtonGrid({
  columns = 3,
  ...props
}: ButtonSlicerProps & { columns?: number }) {
  return <ButtonSlicerBase {...props} layout="grid" columns={columns} />;
}

export function ButtonList(props: ButtonSlicerProps) {
  return <ButtonSlicerBase {...props} layout="list" orientation="vertical" />;
}

export function ImageButtons(props: OptionsSlicerProps) {
  return <ButtonGrid {...props} columns={props.maxHeight ? 4 : 3} />;
}

export function IconButtons(props: ButtonSlicerProps) {
  const options = props.options ?? DEFAULT_SLICER_OPTIONS;
  const [selected, setSelected] = useMultiSelect(
    props.value,
    props.defaultValue,
    props.onChange,
  );
  const current = selected ?? [];
  const multiple = props.multiple ?? false;

  const toggle = (v: string) => {
    if (multiple) {
      setSelected(
        current.includes(v)
          ? current.filter((x) => x !== v)
          : [...current, v],
      );
    } else {
      setSelected([v]);
    }
  };

  return (
    <SlicerShell label={props.label} className={props.className}>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => (
          <Button
            key={opt.value}
            type="button"
            size="icon"
            variant={current.includes(opt.value) ? "default" : "outline"}
            disabled={props.disabled || opt.disabled}
            onClick={() => toggle(opt.value)}
            title={opt.label}
            aria-label={opt.label}
            aria-pressed={current.includes(opt.value)}
          >
            {opt.icon ?? opt.label.charAt(0)}
          </Button>
        ))}
      </div>
    </SlicerShell>
  );
}

// ─── List family ───────────────────────────────────────────────────────────────

export function ListSlicer(props: OptionsSlicerProps) {
  return <StandardSlicer {...props} />;
}

export function SearchableListSlicer(props: OptionsSlicerProps & { placeholder?: string }) {
  return <SearchableSlicer {...props} />;
}

export function HierarchicalListSlicer(
  props: BaseProps & {
    options?: HierarchicalOption[];
    value?: string[];
    defaultValue?: string[];
    onChange?: (value: string[]) => void;
    multiple?: boolean;
    maxHeight?: number;
  },
) {
  return <HierarchicalSlicer {...props} />;
}

export function ConditionalListSlicer({
  options = DEFAULT_SLICER_OPTIONS,
  condition = (option) => (option.count ?? 0) > 20,
  value,
  defaultValue,
  onChange,
  label,
  className,
  disabled,
  multiple = true,
  maxHeight,
}: OptionsSlicerProps & {
  condition?: (option: SlicerOption) => boolean;
}) {
  const filtered = options.filter(condition);
  return (
    <StandardSlicer
      options={filtered}
      value={value}
      defaultValue={defaultValue}
      onChange={onChange}
      label={label}
      className={className}
      disabled={disabled}
      multiple={multiple}
      maxHeight={maxHeight}
    />
  );
}

// ─── Input family ──────────────────────────────────────────────────────────────

export type TextFilterProps = BaseProps & {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
};

function TextFilterBase({
  value,
  defaultValue,
  onChange,
  label,
  className,
  disabled,
  placeholder,
  type = "text",
}: TextFilterProps & { type?: string }) {
  const [text, setText] = useControllableState<string>({
    value,
    defaultValue: defaultValue ?? "",
    onChange,
  });
  const controlId = React.useId();

  return (
    <SlicerShell
      label={label}
      className={className}
      controlId={controlId}
      width="field"
    >
      <Input
        id={controlId}
        aria-label={label ? undefined : (placeholder ?? "Filter")}
        type={type}
        disabled={disabled}
        placeholder={placeholder}
        value={text ?? ""}
        onChange={(e) => setText(e.target.value)}
      />
    </SlicerShell>
  );
}

export function InputSlicer(props: TextFilterProps) {
  return <TextFilterBase {...props} placeholder={props.placeholder ?? "Filter…"} />;
}

export function ExactTextFilter(props: TextFilterProps) {
  return (
    <TextFilterBase
      {...props}
      label={props.label ?? "Exact match"}
      placeholder={props.placeholder ?? "Exact value…"}
    />
  );
}

export function ContainsFilter(props: TextFilterProps) {
  return (
    <TextFilterBase
      {...props}
      label={props.label ?? "Contains"}
      placeholder={props.placeholder ?? "Contains…"}
    />
  );
}

export function StartsWithFilter(props: TextFilterProps) {
  return (
    <TextFilterBase
      {...props}
      label={props.label ?? "Starts with"}
      placeholder={props.placeholder ?? "Starts with…"}
    />
  );
}

export function NumericInputFilter(props: NumericSlicerProps) {
  return <NumericSlicer {...props} label={props.label ?? "Numeric filter"} />;
}

export function FreeFormInput(props: TextFilterProps) {
  return (
    <TextFilterBase
      {...props}
      label={props.label ?? "Free form"}
      placeholder={props.placeholder ?? "Enter value…"}
    />
  );
}

export function PastedValueFilter({
  value,
  defaultValue,
  onChange,
  label = "Paste values",
  className,
  disabled,
  separator = /[,;\n]+/,
}: BaseProps & {
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
  separator?: RegExp | string;
}) {
  const [values, setValues] = useControllableState<string[]>({
    value,
    defaultValue: defaultValue ?? [],
    onChange,
  });
  const [draft, setDraft] = React.useState("");
  const controlId = React.useId();

  const parse = (raw: string) =>
    raw
      .split(separator)
      .map((s) => s.trim())
      .filter(Boolean);

  const apply = () => {
    const parsed = parse(draft);
    if (parsed.length) setValues(parsed);
    setDraft("");
  };

  return (
    <SlicerShell label={label} className={className} controlId={controlId}>
      <textarea
        id={controlId}
        aria-label={label ? undefined : "Paste values"}
        disabled={disabled}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={apply}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) apply();
        }}
        placeholder="Paste comma or newline separated values…"
        className="min-h-[72px] w-full rounded-[var(--radius)] border border-border bg-card px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
      />
      {values?.length ? (
        <div className="flex flex-wrap gap-1">
          {values.map((v) => (
            <Badge key={v} variant="outline" className="gap-1">
              {v}
              <button
                type="button"
                onClick={() => setValues(values.filter((x) => x !== v))}
                aria-label={`Remove ${v}`}
                title={`Remove ${v}`}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="size-3" />
              </button>
            </Badge>
          ))}
        </div>
      ) : null}
    </SlicerShell>
  );
}

export function InputCollection({
  value,
  defaultValue,
  onChange,
  label = "Values",
  className,
  disabled,
  placeholder = "Add value…",
}: BaseProps & {
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
  placeholder?: string;
}) {
  const [items, setItems] = useControllableState<string[]>({
    value,
    defaultValue: defaultValue ?? [],
    onChange,
  });
  const [draft, setDraft] = React.useState("");
  const controlId = React.useId();

  const add = () => {
    const v = draft.trim();
    if (!v || items?.includes(v)) return;
    setItems([...(items ?? []), v]);
    setDraft("");
  };

  return (
    <SlicerShell label={label} className={className} controlId={controlId}>
      <div className="flex gap-2">
        <Input
          id={controlId}
          aria-label={label ? undefined : placeholder}
          disabled={disabled}
          value={draft}
          placeholder={placeholder}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
        />
        <Button type="button" size="sm" disabled={disabled || !draft.trim()} onClick={add}>
          Add
        </Button>
      </div>
      {items?.length ? (
        <div className="flex flex-wrap gap-1">
          {items.map((v) => (
            <Badge key={v} variant="secondary" className="gap-1">
              {v}
              <button
                type="button"
                onClick={() => setItems(items.filter((x) => x !== v))}
                aria-label={`Remove ${v}`}
                title={`Remove ${v}`}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="size-3" />
              </button>
            </Badge>
          ))}
        </div>
      ) : null}
    </SlicerShell>
  );
}

// ─── Chiclet, Timeline, Advanced ───────────────────────────────────────────────

export function ChicletSlicer({
  options = DEFAULT_SLICER_OPTIONS,
  value,
  defaultValue,
  onChange,
  multiple = true,
  label,
  className,
  disabled,
}: OptionsSlicerProps) {
  const [selected, setSelected] = useMultiSelect(value, defaultValue, onChange);
  const current = selected ?? [];

  const toggle = (v: string) => {
    if (multiple) {
      setSelected(
        current.includes(v)
          ? current.filter((x) => x !== v)
          : [...current, v],
      );
    } else {
      setSelected([v]);
    }
  };

  return (
    <SlicerShell label={label} className={className}>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {options.map((opt) => {
          const isSelected = current.includes(opt.value);
          return (
            <button
              key={opt.value}
              type="button"
              disabled={disabled || opt.disabled}
              onClick={() => toggle(opt.value)}
              className={cn(
                "flex shrink-0 flex-col items-start rounded-[var(--radius)] border px-3 py-2 text-left transition-colors",
                isSelected
                  ? "border-accent bg-accent text-accent-foreground"
                  : "border-border bg-card hover:bg-muted",
              )}
            >
              <span className="text-xs font-semibold">{opt.label}</span>
              {opt.count != null ? (
                <span
                  className={cn(
                    "text-lg font-bold tabular-nums",
                    isSelected ? "text-accent-foreground" : "text-foreground",
                  )}
                >
                  {opt.count}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </SlicerShell>
  );
}

export function TimelineSlicer({
  value,
  defaultValue,
  onChange,
  label = "Timeline",
  className,
  disabled,
  minDate,
  maxDate,
}: BaseProps & {
  value?: DateRange;
  defaultValue?: DateRange;
  onChange?: (value: DateRange) => void;
  minDate?: string;
  maxDate?: string;
}) {
  const defaultMin = minDate ?? format(subMonths(DEMO_TODAY, 12), "yyyy-MM-dd");
  const defaultMax = maxDate ?? format(DEMO_TODAY, "yyyy-MM-dd");

  const [range, setRange] = useControllableState<DateRange>({
    value,
    defaultValue: defaultValue ?? { start: defaultMin, end: defaultMax },
    onChange,
  });

  const toMs = (d: string) => new Date(d).getTime();
  const minMs = toMs(defaultMin);
  const maxMs = toMs(defaultMax);
  const startMs = toMs(range?.start || defaultMin);
  const endMs = toMs(range?.end || defaultMax);

  const pct = (ms: number) => ((ms - minMs) / (maxMs - minMs)) * 100;

  const updateFromSlider = (which: "start" | "end", raw: number) => {
    const ms = minMs + (raw / 100) * (maxMs - minMs);
    const date = format(new Date(ms), "yyyy-MM-dd");
    if (which === "start") {
      setRange({
        start: date,
        end: range!.end < date ? date : range!.end,
      });
    } else {
      setRange({
        start: range!.start > date ? date : range!.start,
        end: date,
      });
    }
  };

  return (
    <SlicerShell label={label} className={className}>
      <div className="space-y-3">
        <div className="relative h-2 rounded-full bg-muted">
          <div
            className="absolute h-full rounded-full bg-accent/30"
            style={{
              left: `${pct(startMs)}%`,
              width: `${pct(endMs) - pct(startMs)}%`,
            }}
          />
        </div>
        <div className="flex gap-2">
          <input
            type="range"
            aria-label={label ? `${label} start` : "Start date"}
            aria-valuetext={range?.start}
            disabled={disabled}
            min={0}
            max={100}
            value={pct(startMs)}
            onChange={(e) => updateFromSlider("start", Number(e.target.value))}
            className="flex-1 accent-accent"
          />
          <input
            type="range"
            aria-label={label ? `${label} end` : "End date"}
            aria-valuetext={range?.end}
            disabled={disabled}
            min={0}
            max={100}
            value={pct(endMs)}
            onChange={(e) => updateFromSlider("end", Number(e.target.value))}
            className="flex-1 accent-accent"
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{range?.start}</span>
          <span>{range?.end}</span>
        </div>
      </div>
    </SlicerShell>
  );
}

export function AdvancedDateSlicer({
  label = "Advanced date",
  className,
  rangeValue,
  rangeDefaultValue,
  onRangeChange,
  relativeValue,
  relativeDefaultValue,
  onRelativeChange,
  dateValue,
  dateDefaultValue,
  onDateChange,
  disabled,
}: BaseProps & {
  rangeValue?: DateRange;
  rangeDefaultValue?: DateRange;
  onRangeChange?: (value: DateRange) => void;
  relativeValue?: string;
  relativeDefaultValue?: string;
  onRelativeChange?: (value: string) => void;
  dateValue?: string;
  dateDefaultValue?: string;
  onDateChange?: (value: string) => void;
}) {
  const [mode, setMode] = React.useState<"relative" | "range" | "single">("relative");

  return (
    /*
      Mode switcher + a wrapping preset row is the tallest slicer body in the
      set, so the chrome is tightened to keep the whole card inside its frame.
    */
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="gap-1 pt-4 pb-1">
        <CardTitle className="text-sm">{label}</CardTitle>
        <div className="flex gap-1">
          {(["relative", "range", "single"] as const).map((m) => (
            <Button
              key={m}
              type="button"
              size="sm"
              variant={mode === m ? "default" : "ghost"}
              disabled={disabled}
              onClick={() => setMode(m)}
              className="capitalize"
            >
              {m}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="pt-0 pb-4">
        {mode === "relative" ? (
          <RelativeDateSlicer
            value={relativeValue}
            defaultValue={relativeDefaultValue}
            onChange={onRelativeChange}
            onRangeChange={onRangeChange}
            disabled={disabled}
          />
        ) : mode === "range" ? (
          <DateRangeSlicer
            value={rangeValue}
            defaultValue={rangeDefaultValue}
            onChange={onRangeChange}
            disabled={disabled}
          />
        ) : (
          <DatePickerSlicer
            value={dateValue}
            defaultValue={dateDefaultValue}
            onChange={onDateChange}
            disabled={disabled}
          />
        )}
      </CardContent>
    </Card>
  );
}

export function AdvancedHierarchySlicer({
  options = DEFAULT_HIERARCHY_OPTIONS,
  value,
  defaultValue,
  onChange,
  label = "Advanced hierarchy",
  className,
  disabled,
  searchPlaceholder = "Search hierarchy…",
  multiple = true,
}: BaseProps & {
  options?: HierarchicalOption[];
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
  searchPlaceholder?: string;
  multiple?: boolean;
}) {
  const [selected, setSelected] = useMultiSelect(value, defaultValue, onChange);
  const [query, setQuery] = React.useState("");
  const flat = React.useMemo(() => flattenHierarchy(options), [options]);
  const filtered = filterOptions(flat, query);

  const displayOptions: HierarchicalOption[] = query
    ? filtered.map((o) => ({ label: o.label, value: o.value }))
    : options;

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">{label}</CardTitle>
        <SearchBox
          value={query}
          onChange={setQuery}
          placeholder={searchPlaceholder}
          ariaLabel={label ? `Search ${label}` : "Search hierarchy"}
        />
        {selected?.length ? (
          <div className="flex flex-wrap gap-1 pt-1">
            {selected.map((v) => {
              const opt = flat.find((o) => o.value === v);
              return (
                <Badge key={v} variant="default" className="gap-1">
                  {opt?.label ?? v}
                  <button
                    type="button"
                    onClick={() =>
                      setSelected(selected.filter((x) => x !== v))
                    }
                    aria-label={`Remove ${opt?.label ?? v}`}
                    title={`Remove ${opt?.label ?? v}`}
                  >
                    <X className="size-3" />
                  </button>
                </Badge>
              );
            })}
          </div>
        ) : null}
      </CardHeader>
      <CardContent>
        <fieldset disabled={disabled}>
          {query ? (
            <OptionsList
              options={filtered}
              value={selected ?? []}
              multiple={multiple}
              onChange={setSelected}
            />
          ) : (
            <HierarchyTree
              options={displayOptions}
              value={selected ?? []}
              multiple={multiple}
              onChange={setSelected}
            />
          )}
        </fieldset>
      </CardContent>
    </Card>
  );
}
