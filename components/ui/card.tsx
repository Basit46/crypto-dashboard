import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * The single surface primitive. Structure comes from a hairline border, not a
 * shadow — elevation is reserved for things that actually float (menus,
 * dialogs).
 */
const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex flex-col rounded-xl border border-line bg-surface",
        className
      )}
      {...props}
    />
  )
);
Card.displayName = "Card";

interface CardHeaderProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: React.ReactNode;
  /** Sits to the right of the title: search, links, segmented controls. */
  action?: React.ReactNode;
  eyebrow?: React.ReactNode;
}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, title, action, eyebrow, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex min-h-[52px] shrink-0 items-center justify-between gap-3 border-b border-line px-4",
        className
      )}
      {...props}
    >
      <div className="min-w-0">
        {eyebrow ? (
          <p className="text-2xs font-medium uppercase tracking-wider text-ink-subtle">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="truncate text-base font-semibold text-ink">{title}</h2>
      </div>
      {action ? (
        <div className="flex shrink-0 items-center gap-2">{action}</div>
      ) : null}
    </div>
  )
);
CardHeader.displayName = "CardHeader";

const CardBody = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("min-h-0 flex-1 p-4", className)} {...props} />
  )
);
CardBody.displayName = "CardBody";

export { Card, CardHeader, CardBody };
