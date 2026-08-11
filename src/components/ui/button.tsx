import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Control chrome matches Input / Select: same height (h-11) and
 * `rounded-[var(--radius)]` (10px). Never use rounded-full on text buttons —
 * that reads as a pill and fights adjacent fields.
 */
const buttonVariants = cva(
  // Inner outline: buttons sit inside ChartFrames that clip overflow, and an
  // outer ring+offset was getting squared off at the corners.
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius)] text-sm font-semibold tracking-[-0.01em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-accent text-accent-foreground hover:bg-[var(--accent-hover)]",
        secondary:
          "bg-[var(--accent-soft)] text-foreground hover:bg-[var(--sidebar-active)]",
        outline:
          "border border-border bg-card hover:bg-[var(--sidebar-hover)]",
        ghost: "hover:bg-[var(--sidebar-hover)]",
        destructive:
          "bg-destructive text-[var(--destructive-foreground)] hover:opacity-90",
        link: "text-accent underline-offset-4 hover:underline",
      },
      size: {
        // Same 44px rail as Input so side-by-side forms share one silhouette.
        default: "h-11 px-4",
        sm: "h-11 px-3 text-[13px]",
        lg: "h-11 px-5",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  ),
);
Button.displayName = "Button";

export { buttonVariants };
