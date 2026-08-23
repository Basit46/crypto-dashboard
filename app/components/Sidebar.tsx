"use client";

import {
  LucideChartCandlestick,
  LucideLayoutDashboard,
  LucidePieChart,
  LucideSparkles,
  LucideStar,
  LucideX,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useGlobalStore } from "../store/globalStore";
import useUser from "../hooks/useUser";
import { useGetPortfolio } from "../lib/query";
import { formatUsd } from "../utils";

const sections = [
  {
    label: "Overview",
    items: [
      { href: "/", label: "Dashboard", icon: LucideLayoutDashboard },
      { href: "/markets", label: "Markets", icon: LucideChartCandlestick },
    ],
  },
  {
    label: "Holdings",
    items: [
      { href: "/portfolio", label: "Portfolio", icon: LucidePieChart },
      { href: "/watchlist", label: "Watchlist", icon: LucideStar },
    ],
  },
  {
    label: "Research",
    items: [{ href: "/ai", label: "CoinVista AI", icon: LucideSparkles }],
  },
];

const isActive = (pathname: string, href: string) =>
  href === "/" ? pathname === "/" : pathname.startsWith(href);

const Sidebar = () => {
  const { showSideBar, setShowSideBar } = useGlobalStore();
  const pathname = usePathname();
  const { data: user } = useUser();
  const { assets } = useGetPortfolio();

  const hideSidebar = pathname.startsWith("/auth");

  // Escape closes the mobile drawer.
  useEffect(() => {
    if (!showSideBar) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setShowSideBar(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showSideBar, setShowSideBar]);

  if (hideSidebar) return null;

  const totalValue = assets.reduce((acc, asset) => acc + (asset.value || 0), 0);

  return (
    <>
      {/* Drawer scrim — desktop keeps the rail permanently in the layout. */}
      {showSideBar ? (
        <div
          role="presentation"
          onClick={() => setShowSideBar(false)}
          className="fixed inset-0 z-30 animate-fade-in bg-ink/40 backdrop-blur-[2px] xl:hidden"
        />
      ) : null}

      <aside
        className={`${
          showSideBar
            ? "translate-x-0 animate-slide-in-left"
            : "-translate-x-full xl:translate-x-0"
        } fixed inset-y-0 left-0 z-40 flex w-[248px] shrink-0 flex-col border-r border-line bg-surface-sunken transition-transform duration-200 xl:static xl:z-auto xl:translate-x-0`}
      >
        <div className="flex h-16 shrink-0 items-center gap-2.5 border-b border-line px-4">
          <Image
            src="/logo.png"
            width={26}
            height={26}
            priority
            alt=""
            className="rounded-md"
          />
          <div className="min-w-0 flex-1">
            <p className="text-base font-semibold tracking-[-0.01em] text-ink">
              CoinVista
            </p>
            <p className="text-2xs uppercase tracking-wider text-ink-subtle">
              Market terminal
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowSideBar(false)}
            aria-label="Close navigation"
            className="grid size-8 place-items-center rounded-md text-ink-subtle transition-colors hover:bg-surface-hover hover:text-ink xl:hidden"
          >
            <LucideX className="size-4" />
          </button>
        </div>

        <nav className="flex-1 space-y-5 overflow-y-auto px-4 py-5">
          {sections.map((section) => (
            <div key={section.label} className="space-y-1">
              <p className="px-2.5 pb-1 text-2xs font-medium uppercase tracking-wider text-ink-subtle">
                {section.label}
              </p>
              {section.items.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setShowSideBar(false)}
                  data-active={isActive(pathname, href)}
                  className="nav-item"
                >
                  <Icon strokeWidth={1.75} />
                  <span>{label}</span>
                </Link>
              ))}
            </div>
          ))}
        </nav>

        {/* Portfolio value belongs in the chrome — it is the number a holder
            checks most, on whichever page they happen to be. */}
        <div className="shrink-0 border-t border-line p-4">
          {user?._id ? (
            <Link
              href="/portfolio"
              onClick={() => setShowSideBar(false)}
              className="block rounded-lg border border-line bg-surface p-3 transition-colors hover:border-line-strong"
            >
              <p className="text-2xs font-medium uppercase tracking-wider text-ink-subtle">
                Portfolio value
              </p>
              <p className="mt-0.5 font-mono text-lg font-medium tabular-nums text-ink">
                {formatUsd(totalValue)}
              </p>
            </Link>
          ) : (
            <div className="rounded-lg border border-line bg-surface p-3">
              <p className="text-sm font-medium text-ink">Track your holdings</p>
              <p className="mt-0.5 text-xs text-ink-muted">
                Sign in to sync your portfolio and watchlist.
              </p>
              <Link
                href="/auth/signin"
                onClick={() => setShowSideBar(false)}
                className="mt-2 inline-block text-sm font-medium text-accent underline-offset-4 hover:underline"
              >
                Sign in
              </Link>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
