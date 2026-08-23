import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-lg border border-line bg-surface px-3 text-base text-ink outline-none transition-[border-color,box-shadow] duration-150",
          "placeholder:text-ink-subtle",
          "hover:border-line-strong",
          "focus:border-accent focus:ring-2 focus:ring-accent/20",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

/** Input with a leading icon slot — used for every search field in the app. */
const SearchInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input"> & { icon: React.ReactNode }
>(({ className, icon, ...props }, ref) => (
  <div className={cn("relative", className)}>
    <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-subtle">
      {icon}
    </span>
    <Input ref={ref} className="pl-8" {...props} />
  </div>
));
SearchInput.displayName = "SearchInput";

export { Input, SearchInput };
