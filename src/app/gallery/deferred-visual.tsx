"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Defers mounting a visual until its slot scrolls near the viewport.
 *
 * Two reasons this exists:
 *  1. The gallery's "All" view lists several hundred entries. Mounting every
 *     Recharts `ResponsiveContainer` at once is slow and memory-heavy.
 *  2. Recharts measures its parent on mount. Mounting hundreds of containers
 *     in the same frame makes some of them measure 0x0 and render blank.
 *     Mounting on intersection guarantees the parent already has real layout.
 *
 * The child unmounts again after leaving the overscan window. This keeps the
 * all-visuals page from accumulating hundreds of charts, timers and observers
 * after a long scroll; the fixed skeleton preserves layout and scroll position.
 */
export function DeferredVisual({
  children,
  rootMargin = "400px",
  fallback,
  reserveHeight,
}: {
  children: React.ReactNode;
  rootMargin?: string;
  fallback?: React.ReactNode;
  /**
   * For slots with no fixed-height parent (self-framed visuals size to their
   * own content). Without a reserved box the placeholder collapses to 0px, so
   * every slot sits at the same scroll offset and they all mount at once —
   * exactly what this component exists to prevent.
   */
  reserveHeight?: number;
}) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  // Always false for SSR and first client render, so hydration matches.
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Without IntersectionObserver (jsdom, very old browsers) render rather
    // than leaving a permanently empty slot.
    if (typeof IntersectionObserver === "undefined") {
      queueMicrotask(() => setVisible(true));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        setVisible(entries.some((entry) => entry.isIntersecting));
      },
      { rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin]);

  const placeholder = fallback ?? <VisualSkeleton height={reserveHeight} />;

  return (
    <div ref={ref} className={reserveHeight ? "w-full" : "h-full w-full"}>
      {visible ? (
        <React.Suspense fallback={placeholder}>
          <div className="ce-visual-in h-full w-full">{children}</div>
        </React.Suspense>
      ) : (
        placeholder
      )}
    </div>
  );
}

function VisualSkeleton({ height }: { height?: number }) {
  return (
    <div
      className={cn(
        "w-full rounded-[var(--radius)] bg-[var(--muted)] motion-safe:animate-pulse",
        !height && "h-full",
      )}
      style={height ? { height } : undefined}
      aria-hidden="true"
    />
  );
}
