"use client";

import { LucideMoon, LucideSun } from "lucide-react";
import { useTheme } from "../hooks/useTheme";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle, mounted } = useTheme();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      className={cn(
        "grid size-9 place-items-center rounded-lg text-ink-muted transition-colors hover:bg-surface-hover hover:text-ink",
        className
      )}
    >
      {/* Until mounted the icon would guess wrong, so render nothing rather
          than flip it after hydration. */}
      {mounted ? (
        theme === "dark" ? (
          <LucideSun className="size-[17px]" />
        ) : (
          <LucideMoon className="size-[17px]" />
        )
      ) : (
        <span className="size-[17px]" />
      )}
    </button>
  );
}
