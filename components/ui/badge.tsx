import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-2xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "border-line bg-surface-hover text-ink-muted",
        accent: "border-accent-border bg-accent-soft text-accent",
        positive: "border-pos-border bg-pos-soft text-pos",
        negative: "border-neg-border bg-neg-soft text-neg",
        outline: "border-line text-ink-muted",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
