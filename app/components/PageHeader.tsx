"use client";

import { LucidePanelLeft } from "lucide-react";
import UserProfile from "./UserProfile";
import { ThemeToggle } from "./ThemeToggle";
import { useGlobalStore } from "../store/globalStore";

/**
 * Every page shares one header: a mobile drawer trigger, the page title with an
 * optional caption, a slot for page-specific controls, then the global actions.
 */
export default function PageHeader({
  title,
  caption,
  actions,
}: {
  title: React.ReactNode;
  caption?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  const { setShowSideBar } = useGlobalStore();

  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-3 border-b border-line bg-canvas/85 px-4 backdrop-blur-md vsm:px-6">
      <button
        type="button"
        onClick={() => setShowSideBar(true)}
        aria-label="Open navigation"
        className="grid size-9 shrink-0 place-items-center rounded-lg border border-line text-ink-muted transition-colors hover:bg-surface-hover hover:text-ink xl:hidden"
      >
        <LucidePanelLeft className="size-[17px]" />
      </button>

      <div className="min-w-0 flex-1">
        <h1 className="truncate text-lg font-semibold tracking-[-0.01em] text-ink">
          {title}
        </h1>
        {caption ? (
          <p className="truncate text-xs text-ink-subtle">{caption}</p>
        ) : null}
      </div>

      {actions ? (
        <div className="flex shrink-0 items-center gap-2">{actions}</div>
      ) : null}

      <div className="ml-1 flex shrink-0 items-center gap-1 border-l border-line pl-3">
        <ThemeToggle />
        <UserProfile />
      </div>
    </header>
  );
}
