"use client";

import * as React from "react";
import { ResponsiveContainer } from "recharts";

/**
 * Recharts 3 `ResponsiveContainer` defaults to `initialDimension: {-1,-1}` and
 * may leave an empty wrapper when percentage height measurement races layout.
 * We measure the parent box ourselves and pass integer pixel sizes so BarChart /
 * LineChart / etc. always receive a positive width and height on first paint.
 */
export type ChartResponsiveContainerProps = {
  children: React.ReactNode;
  className?: string;
  minWidth?: number | string;
  minHeight?: number | string;
  debounce?: number;
  /** Drop-in compat with Recharts ResponsiveContainer; ignored (we measure). */
  width?: number | string;
  /** Drop-in compat with Recharts ResponsiveContainer; ignored (we measure). */
  height?: number | string;
  initialDimension?: { width: number; height: number };
};

export function ChartResponsiveContainer({
  children,
  className,
  minWidth = 0,
  minHeight = 0,
  debounce = 0,
}: ChartResponsiveContainerProps) {
  const hostRef = React.useRef<HTMLDivElement>(null);
  const [size, setSize] = React.useState<{ width: number; height: number } | null>(null);

  React.useLayoutEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const publish = (width: number, height: number) => {
      const w = Math.round(width);
      const h = Math.round(height);
      if (w <= 0 || h <= 0) return;
      setSize((prev) => (prev && prev.width === w && prev.height === h ? prev : { width: w, height: h }));
    };

    const rect = host.getBoundingClientRect();
    publish(rect.width, rect.height);

    if (typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      publish(entry.contentRect.width, entry.contentRect.height);
    });
    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={hostRef} className={className ? `h-full w-full min-w-0 ${className}` : "h-full w-full min-w-0"}>
      {size ? (
        <ResponsiveContainer
          width={size.width}
          height={size.height}
          minWidth={minWidth}
          minHeight={minHeight}
          debounce={debounce}
        >
          {children}
        </ResponsiveContainer>
      ) : null}
    </div>
  );
}
