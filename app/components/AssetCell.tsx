import Image from "next/image";
import { LucideStar } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * The asset identity block used as the first column of every table in the app —
 * logo, name, ticker, and an optional watchlist marker.
 */
export function AssetCell({
  image,
  name,
  symbol,
  rank,
  watched = false,
  className,
}: {
  image?: string;
  name?: string;
  symbol?: string;
  rank?: number | null;
  watched?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      {rank != null ? (
        <span className="w-6 shrink-0 font-mono text-xs tabular-nums text-ink-subtle">
          {rank}
        </span>
      ) : null}

      <span className="relative size-7 shrink-0 overflow-hidden rounded-full bg-surface-hover">
        {image ? (
          <Image src={image} fill sizes="28px" alt="" className="object-cover" />
        ) : null}
      </span>

      <span className="min-w-0">
        <span className="flex items-center gap-1.5">
          <span className="truncate text-base font-medium text-ink">{name}</span>
          {watched ? (
            <LucideStar
              className="size-3 shrink-0 text-accent"
              fill="currentColor"
              aria-label="On your watchlist"
            />
          ) : null}
        </span>
        <span className="block text-xs uppercase tracking-wide text-ink-subtle">
          {symbol}
        </span>
      </span>
    </div>
  );
}
