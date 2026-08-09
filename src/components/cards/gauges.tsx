"use client";

import { cn, formatCompact, formatPercent } from "@/lib/utils";

function clamp(n: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, n));
}

const DEG = Math.PI / 180;

function polar(cx: number, cy: number, r: number, deg: number) {
  return { x: cx + r * Math.cos(deg * DEG), y: cy + r * Math.sin(deg * DEG) };
}

/*
  Gauge sweeps are explicit arc paths, never a full <circle> with a dash gap
  plus a rotate(). A rotated circle measures as its whole square bounding box
  inflated by √2 — 76 user units of radius for a 54-unit ring — so the browser
  lays out art far below the viewBox and clips the gauge. An arc path measures
  only the degrees it actually draws.

  Angles are degrees with 0° at 3 o'clock, increasing clockwise (SVG's y-down
  convention), so a sweep is always drawn with sweep-flag 1.
*/
function arc(cx: number, cy: number, r: number, from: number, to: number) {
  const a = polar(cx, cy, r, from);
  const b = polar(cx, cy, r, to);
  const large = to - from > 180 ? 1 : 0;
  return `M${a.x.toFixed(3)} ${a.y.toFixed(3)} A${r} ${r} 0 ${large} 1 ${b.x.toFixed(3)} ${b.y.toFixed(3)}`;
}

const RADIAL = { cx: 66, cy: 66, r: 54, from: 135, sweep: 270, band: 14 };

export function RadialGauge({
  value,
  min = 0,
  max = 100,
  label = "Gauge",
  ranges,
}: {
  value: number;
  min?: number;
  max?: number;
  label?: string;
  ranges?: { to: number; color: string }[];
}) {
  const span = max - min || 1;
  const pct = clamp((value - min) / span);
  const { cx, cy, r, from, sweep, band } = RADIAL;
  const angle = (fraction: number) => from + sweep * fraction;
  const hasRanges = (ranges?.length ?? 0) > 0;
  /* Range segments must butt against each other, so a ranged band ends square.
     Rounding the track or the value arc under it would leave their caps poking
     out past the band. Without ranges the ring reads better fully rounded. */
  const cap = hasRanges ? "butt" : "round";
  const capY = polar(cx, cy, r, angle(0)).y;

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <svg
        viewBox="0 0 132 132"
        className="h-auto w-full max-w-[264px]"
        role="img"
        aria-label={`${label}: ${formatCompact(value)} of ${formatCompact(max)}`}
      >
        <path
          d={arc(cx, cy, r, from, angle(1))}
          fill="none"
          stroke="var(--muted)"
          strokeWidth={band}
          strokeLinecap={cap}
        />
        {(ranges ?? []).map((range, i, all) => {
          const start = clamp(((i === 0 ? min : all[i - 1]!.to) - min) / span);
          const end = clamp((range.to - min) / span);
          if (end <= start) return null;
          return (
            <path
              key={i}
              d={arc(cx, cy, r, angle(start), angle(end))}
              fill="none"
              stroke={range.color}
              strokeWidth={band}
              strokeOpacity={0.32}
            />
          );
        })}
        {pct > 0 ? (
          <path
            d={arc(cx, cy, r, from, angle(pct))}
            fill="none"
            stroke="var(--chart-1)"
            /* Ranges own the full band, so the value rides a narrower arc
               centred in it and the range tint stays readable either side. */
            strokeWidth={hasRanges ? band - 6 : band}
            strokeLinecap={cap}
          />
        ) : null}
        <text
          x={cx}
          y={64}
          textAnchor="middle"
          fontSize={26}
          fontWeight={600}
          fill="var(--foreground)"
          className="tabular-nums"
        >
          {formatCompact(value)}
        </text>
        <text x={cx} y={85} textAnchor="middle" fontSize={11} fill="var(--muted-foreground)">
          {label}
        </text>
        {/* Scale ends sit under the arc caps, clear of the stroke and the frame. */}
        <text
          x={polar(cx, cy, r, angle(0)).x}
          y={capY + 20}
          textAnchor="middle"
          fontSize={10}
          fill="var(--muted-foreground)"
          className="tabular-nums"
        >
          {formatCompact(min)}
        </text>
        <text
          x={polar(cx, cy, r, angle(1)).x}
          y={capY + 20}
          textAnchor="middle"
          fontSize={10}
          fill="var(--muted-foreground)"
          className="tabular-nums"
        >
          {formatCompact(max)}
        </text>
      </svg>
    </div>
  );
}

export function LinearGauge({
  value,
  min = 0,
  max = 100,
  label,
}: {
  value: number;
  min?: number;
  max?: number;
  label?: string;
}) {
  const pct = clamp((value - min) / (max - min || 1));
  return (
    <div className="flex h-full flex-col justify-center gap-3 px-2">
      {label ? (
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{label}</span>
          <span className="font-semibold tabular-nums">{formatCompact(value)}</span>
        </div>
      ) : null}
      <div className="relative h-3 rounded-full bg-muted">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-[var(--chart-1)] transition-all"
          style={{ width: `${pct * 100}%` }}
        />
        {/* The knob travels between its own half-widths rather than 0–100%,
            otherwise it hangs 8px outside the track at both extremes. */}
        <div
          className="absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-card bg-[var(--chart-1)] shadow transition-all"
          style={{ left: `calc(${pct} * (100% - 16px))` }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-muted-foreground">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}

export function BulletChart({
  value,
  target,
  max = 100,
  label,
  ranges,
}: {
  value: number;
  target: number;
  max?: number;
  label?: string;
  /**
   * Qualitative range boundaries in data units, ascending — the "poor /
   * satisfactory / good" backdrop. Defaults to the usual reading of a bullet
   * graph, where the bands are judged against the target.
   */
  ranges?: [number, number];
}) {
  // Previously the bands were hardcoded at 45% and 70% of the track, so they
  // described nothing: they stayed put when max changed and could sit past the
  // target. Deriving them from the data keeps the backdrop meaningful.
  const [poor, satisfactory] = ranges ?? [target * 0.6, target * 0.9];
  const pctOf = (n: number) => clamp(n / (max || 1)) * 100;

  return (
    <div className="flex h-full flex-col justify-center gap-2 px-2">
      {label ? <div className="text-xs text-muted-foreground">{label}</div> : null}
      {/* Three ascending alpha steps of one ink. `muted` against `muted/80` for
          the middle band was a difference of about one percent of luminance, so
          only one of the two boundaries was actually visible. */}
      <div className="relative h-8 overflow-hidden rounded-md bg-foreground/[0.04]">
        <div
          className="absolute inset-y-0 left-0 bg-foreground/[0.08]"
          style={{ width: `${pctOf(satisfactory)}%` }}
        />
        <div
          className="absolute inset-y-0 left-0 bg-foreground/[0.15]"
          style={{ width: `${pctOf(poor)}%` }}
        />
        <div
          className="absolute top-1/2 h-3 -translate-y-1/2 rounded-sm bg-[var(--chart-1)] transition-all"
          style={{ width: `${pctOf(value)}%` }}
        />
        {/* Nudged back by its own width at the top of the scale so a target of
            max stays visible instead of sitting on the clip edge. */}
        <div
          className="absolute bottom-1 top-1 w-0.5 bg-foreground"
          style={{ left: `calc(${pctOf(target)}% - ${target >= max ? 2 : 0}px)` }}
        />
      </div>
      <div className="flex justify-between text-xs tabular-nums">
        <span>{formatCompact(value)}</span>
        <span className="text-muted-foreground">Target {formatCompact(target)}</span>
      </div>
    </div>
  );
}

export function ProgressRing({
  value,
  label,
}: {
  value: number;
  label?: string;
}) {
  const pct = clamp(value);
  const r = 42;
  const c = 2 * Math.PI * r;
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2">
      <svg viewBox="0 0 100 100" className="h-36 w-36">
        <circle cx="50" cy="50" r={r} fill="none" stroke="var(--muted)" strokeWidth="10" />
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke="var(--chart-1)"
          strokeWidth="10"
          strokeDasharray={`${c * pct} ${c}`}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
        />
        <text
          x="50"
          y="54"
          textAnchor="middle"
          className="fill-foreground font-semibold"
          style={{ fontSize: 18 }}
        >
          {formatPercent(pct)}
        </text>
      </svg>
      {label ? <div className="text-sm text-muted-foreground">{label}</div> : null}
    </div>
  );
}

export function ProgressBar({
  value,
  label,
  className,
}: {
  value: number;
  label?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex h-full flex-col justify-center gap-2 px-2", className)}>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium tabular-nums">{formatPercent(clamp(value))}</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-[var(--chart-1)] transition-all"
          style={{ width: `${clamp(value) * 100}%` }}
        />
      </div>
    </div>
  );
}

export function ThermometerGauge({
  value,
  max = 100,
  label,
}: {
  value: number;
  max?: number;
  label?: string;
}) {
  const pct = clamp(value / max);
  return (
    <div className="flex h-full items-center justify-center gap-5">
      {/*
        The bulb is a flow child with a negative top margin, not an absolutely
        positioned box hung off the tube's bottom edge. Flexbox folds that
        margin into the column's height, so the bulb can no longer spill past
        the card surface and get sheared off.
      */}
      <div className="flex h-[72%] max-h-[232px] flex-col items-center">
        {/* Domed top, square bottom: a rounded bottom would clip the mercury
            into the tube's corners and leave pale notches either side of the
            bulb, which is narrower than the tube where the two meet. */}
        <div className="relative w-9 flex-1 overflow-hidden rounded-t-full bg-muted">
          <div
            className="absolute inset-x-0 bottom-0 bg-[var(--chart-negative)] transition-all"
            style={{ height: `${pct * 100}%` }}
          />
          {[0.25, 0.5, 0.75].map((fraction) => (
            <div
              key={fraction}
              className="absolute inset-x-0 h-px bg-[var(--border-strong)]"
              style={{ bottom: `${fraction * 100}%` }}
            />
          ))}
        </div>
        <div className="-mt-3 h-11 w-11 shrink-0 rounded-full bg-[var(--chart-negative)]" />
      </div>
      <div>
        <div className="text-[32px] font-semibold leading-none tracking-[-0.02em] tabular-nums">
          {formatCompact(value)}
        </div>
        <div className="mt-2 text-[11px] leading-none text-muted-foreground">
          {label ?? `of ${formatCompact(max)}`}
        </div>
      </div>
    </div>
  );
}

const DIAL = { cx: 74, cy: 74, r: 62, from: 180, sweep: 180, band: 12 };
const DIAL_TICKS = [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1];

export function DialGauge({
  value,
  min = 0,
  max = 100,
  label,
}: {
  value: number;
  min?: number;
  max?: number;
  label?: string;
}) {
  const span = max - min || 1;
  const pct = clamp((value - min) / span);
  const { cx, cy, r, from, sweep, band } = DIAL;
  const angle = (fraction: number) => from + sweep * fraction;
  /*
    The pointer tracks the arc it sits on: 180° of travel starting at 9 o'clock.
    It used to sweep 240° starting 120° above 3 o'clock, so at high values it
    swung below the pivot and out through the bottom of the viewBox.
  */
  const needle = angle(pct);
  const capY = polar(cx, cy, r, angle(0)).y;

  return (
    <div className="flex h-full flex-col items-center justify-center gap-3">
      {/* Decorative: the numeric readout below carries the value for AT. */}
      <svg viewBox="0 0 148 100" className="h-auto w-full max-w-[290px]" aria-hidden="true">
        <path
          d={arc(cx, cy, r, from, angle(1))}
          fill="none"
          stroke="var(--muted)"
          strokeWidth={band}
          strokeLinecap="round"
        />
        {pct > 0 ? (
          <path
            d={arc(cx, cy, r, from, needle)}
            fill="none"
            stroke="var(--chart-1)"
            strokeWidth={band}
            strokeLinecap="round"
          />
        ) : null}
        {/* Ticks stop 3 units short of the band's inner edge (r 56). */}
        {DIAL_TICKS.map((fraction, i) => {
          const major = i % 2 === 0;
          const a = polar(cx, cy, major ? 45 : 49, angle(fraction));
          const b = polar(cx, cy, 53, angle(fraction));
          return (
            <line
              key={fraction}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke="var(--chart-axis)"
              strokeWidth={major ? 1.6 : 1}
              strokeLinecap="round"
            />
          );
        })}
        <g transform={`translate(${cx},${cy}) rotate(${needle})`}>
          <polygon points="0,-4.6 40,-1 40,1 0,4.6" fill="var(--foreground)" />
        </g>
        <circle cx={cx} cy={cy} r={6} fill="var(--foreground)" />
        <circle cx={cx} cy={cy} r={2.6} fill="var(--card)" />
        {/* Scale ends tuck under the arc caps, inset so they clear the frame. */}
        <text
          x={polar(cx, cy, r, angle(0)).x + 8}
          y={capY + 18}
          textAnchor="middle"
          fontSize={10}
          fill="var(--muted-foreground)"
          className="tabular-nums"
        >
          {formatCompact(min)}
        </text>
        <text
          x={polar(cx, cy, r, angle(1)).x - 8}
          y={capY + 18}
          textAnchor="middle"
          fontSize={10}
          fill="var(--muted-foreground)"
          className="tabular-nums"
        >
          {formatCompact(max)}
        </text>
      </svg>
      <div className="text-center">
        <div className="text-[26px] font-semibold leading-none tracking-[-0.02em] tabular-nums">
          {formatCompact(value)}
        </div>
        {label ? (
          <div className="mt-1.5 text-[11px] leading-none text-muted-foreground">{label}</div>
        ) : null}
      </div>
    </div>
  );
}
