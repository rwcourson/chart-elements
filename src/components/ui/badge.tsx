import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-[var(--radius-sm)] border px-2 py-0.5 text-[12px] font-semibold tracking-[-0.01em] transition-colors",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[var(--accent-soft)] text-accent",
        secondary:
          "border-transparent bg-muted text-muted-foreground",
        outline: "border-border text-foreground",
        success:
          "border-transparent bg-[var(--success-soft)] text-[var(--success)]",
        danger:
          "border-transparent bg-[var(--destructive-soft)] text-destructive",
        warning:
          "border-transparent bg-[var(--warning-soft)] text-[var(--warning)]",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export function Badge({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
