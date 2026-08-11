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

function subscribeReducedMotion(onChange: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

/** Reactive `prefers-reduced-motion` — SSR-safe, no setState-in-effect. */
export function usePrefersReducedMotion(): boolean {
  return React.useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}

function subscribeDocumentVisibility(onChange: () => void) {
  document.addEventListener("visibilitychange", onChange);
  return () => document.removeEventListener("visibilitychange", onChange);
}

/** Stops decorative work while the page is backgrounded. */
export function useDocumentVisible(): boolean {
  return React.useSyncExternalStore(
    subscribeDocumentVisibility,
    () => document.visibilityState !== "hidden",
    () => true,
  );
}

/** Shared gate for animation, autoplay, and other decorative motion. */
export function useMotionEnabled(enabled = true): boolean {
  const reduce = usePrefersReducedMotion();
  const visible = useDocumentVisible();
  return enabled && !reduce && visible;
}

export type ElementVisibilityOptions = {
  /** Extra area considered visible, useful for suspending work just offscreen. */
  rootMargin?: string;
  threshold?: number | readonly number[];
};

/**
 * Observes a component's own viewport visibility. Document visibility alone is
 * insufficient on long dashboards: a chart can be hundreds of rows offscreen
 * while its tab remains active. Browsers without IntersectionObserver retain
 * the safe, functional visible state.
 */
export function useElementVisible<T extends Element>({
  rootMargin = "160px 0px",
  threshold = 0,
}: ElementVisibilityOptions = {}) {
  const [element, setElement] = React.useState<T | null>(null);
  const [visible, setVisible] = React.useState(true);
  const thresholdKey = Array.isArray(threshold) ? threshold.join(",") : threshold;
  const observe = React.useCallback((node: T | null) => setElement(node), []);

  React.useEffect(() => {
    if (!element || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry?.isIntersecting ?? false),
      { rootMargin, threshold: typeof threshold === "number" ? threshold : [...threshold] },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [element, rootMargin, threshold, thresholdKey]);

  return [observe, visible] as const;
}

export type MotionIntervalOptions = {
  enabled?: boolean;
  /** Set false only for work that must continue in a background tab. */
  pauseWhenHidden?: boolean;
  /** Set false only when the interval is functional rather than visual motion. */
  respectReducedMotion?: boolean;
};

/**
 * Motion-aware interval for races, carousels, tickers, and animated timelines.
 * It pauses for reduced-motion users and background tabs by default.
 */
export function useMotionInterval(
  callback: () => void,
  delay: number | null,
  {
    enabled = true,
    pauseWhenHidden = true,
    respectReducedMotion = true,
  }: MotionIntervalOptions = {},
) {
  const reduce = usePrefersReducedMotion();
  const visible = useDocumentVisible();
  const callbackRef = React.useRef(callback);

  React.useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const active =
    enabled &&
    delay != null &&
    (!respectReducedMotion || !reduce) &&
    (!pauseWhenHidden || visible);

  React.useEffect(() => {
    if (!active || delay == null) return;
    const id = window.setInterval(() => callbackRef.current(), delay);
    return () => window.clearInterval(id);
  }, [active, delay]);
}

/**
 * Entry-animation props to spread onto Recharts series components
 * (`<Bar {...anim} />`, `<Line {...anim} />`, `<Pie {...anim} />`, …).
 * Disabled entirely when the user prefers reduced motion.
 */
export function useChartAnimation(enabled = true): ChartAnimationProps {
  const motion = useMotionEnabled(enabled);

  return {
    isAnimationActive: motion,
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
    onFocus: () => void;
    onBlur: () => void;
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
      onFocus: () => setActive(key),
      onBlur: () => setActive(null),
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
  const motion = useMotionEnabled();

  React.useEffect(() => {
    const from = previous.current;
    previous.current = target;
    if (
      from === target ||
      !motion
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
  }, [target, duration, motion]);

  return display;
}
