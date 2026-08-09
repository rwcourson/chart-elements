"use client";

import * as React from "react";

/**
 * Shared motion + hover-interaction layer for every chart in the pack.
 * One easing and one duration everywhere, so the whole gallery moves the same
 * way. Reduced-motion users get instant renders.
 */
export const CHART_ANIMATION = {
  duration: 550,
  easing: "ease-out",
} as const;

/** Opacity for the non-hovered series while one series is hovered. */
export const DIM_OPACITY = 0.32;

export type ChartAnimationProps = {
  isAnimationActive: boolean;
  animationDuration: number;
  animationEasing: "ease-out";
};

/** Reactive `prefers-reduced-motion` — SSR-safe, no setState-in-effect. */
function usePrefersReducedMotion(): boolean {
  return React.useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}

/**
 * Entry-animation props to spread onto Recharts series components
 * (`<Bar {...anim} />`, `<Line {...anim} />`, `<Pie {...anim} />`, …).
 * Disabled entirely when the user prefers reduced motion.
 */
export function useChartAnimation(): ChartAnimationProps {
  const reduce = usePrefersReducedMotion();

  return {
    isAnimationActive: !reduce,
    animationDuration: CHART_ANIMATION.duration,
    animationEasing: CHART_ANIMATION.easing,
  };
}

export type SeriesHover = {
  /** Currently hovered series key, or null when nothing is hovered. */
  active: string | null;
  setActive: (key: string | null) => void;
  /** Spread onto a Recharts series: marks it active while hovered. */
  bind: (key: string) => {
    onMouseEnter: () => void;
    onMouseLeave: () => void;
  };
  /** 1 for the active series (or when idle), DIM_OPACITY for the rest. */
  opacityFor: (key: string) => number;
  /** Recharts Legend handlers that drive the same state from legend hover. */
  legendHandlers: {
    onMouseEnter: (entry: { dataKey?: unknown }) => void;
    onMouseLeave: () => void;
  };
};

/**
 * Hover isolation: hovering a series (or its legend item) dims every other
 * series, so one story stands out without a filter. The fade itself is a CSS
 * transition on the SVG elements (see globals.css), so these opacity changes
 * stay cheap attribute writes.
 */
export function useSeriesHover(): SeriesHover {
  const [active, setActive] = React.useState<string | null>(null);

  const bind = React.useCallback(
    (key: string) => ({
      onMouseEnter: () => setActive(key),
      onMouseLeave: () => setActive(null),
    }),
    [],
  );

  const opacityFor = React.useCallback(
    (key: string) => (active === null || active === key ? 1 : DIM_OPACITY),
    [active],
  );

  const legendHandlers = React.useMemo(
    () => ({
      onMouseEnter: (entry: { dataKey?: unknown }) => {
        if (entry?.dataKey != null) setActive(String(entry.dataKey));
      },
      onMouseLeave: () => setActive(null),
    }),
    [],
  );

  return { active, setActive, bind, opacityFor, legendHandlers };
}

/**
 * requestAnimationFrame count-up for KPI numbers. Returns the value to render
 * this frame; eases out so the figure settles rather than ramps linearly.
 * Jumps straight to the target under reduced motion.
 */
export function useCountUp(target: number, duration = 650): number {
  const [display, setDisplay] = React.useState(target);
  const previous = React.useRef(target);

  React.useEffect(() => {
    const from = previous.current;
    previous.current = target;
    if (
      from === target ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setDisplay(target);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(from + (target - from) * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return display;
}
