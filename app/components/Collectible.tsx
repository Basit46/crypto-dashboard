"use client";

import axiosCoingeckoApi from "@/lib/axiosCoingecko";
import { useQuery } from "@tanstack/react-query";
import { LucideArrowUpRight } from "lucide-react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { Delta } from "./Delta";

const Collectible = ({ item }: { item: { id: string } }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["collectibles", item.id],
    queryFn: async () => {
      const res = await axiosCoingeckoApi(`/nfts/${item.id}`);
      return res.data;
    },
    staleTime: 1000 * 60 * 60 * 12,
  });

  if (isLoading) {
    return (
      <div className="w-[184px] shrink-0 rounded-xl border border-line p-2">
        <Skeleton className="aspect-[4/3] w-full rounded-lg" />
        <Skeleton className="mt-3 h-4 w-3/4" />
        <Skeleton className="mt-2 h-3 w-1/2" />
      </div>
    );
  }

  if (!data) return null;

  const homepage: string | undefined = data?.links?.homepage;
  const floor: number | undefined = data?.floor_price?.native_currency;
  const unit: string = data?.native_currency_symbol?.toUpperCase() || "ETH";
  const change: number | undefined =
    data?.floor_price_in_usd_24h_percentage_change;

  const Wrapper = homepage ? "a" : "div";

  return (
    <Wrapper
      {...(homepage
        ? { href: homepage, target: "_blank", rel: "noopener noreferrer" }
        : {})}
      className="group block w-[184px] shrink-0 overflow-hidden rounded-xl border border-line bg-surface transition-colors hover:border-line-strong"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface-hover">
        <Image
          src={data?.image?.small_2x || data?.image?.small || "/pudgy.png"}
          fill
          sizes="184px"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          alt=""
        />
      </div>

      <div className="p-3">
        <div className="flex items-start justify-between gap-1.5">
          <p className="truncate text-base font-medium text-ink">{data?.name}</p>
          {homepage ? (
            <LucideArrowUpRight className="mt-0.5 size-3.5 shrink-0 text-ink-subtle transition-colors group-hover:text-ink" />
          ) : null}
        </div>
        <p className="truncate text-xs uppercase tracking-wide text-ink-subtle">
          {data?.symbol}
        </p>

        <div className="mt-3 flex items-center justify-between gap-2 border-t border-line pt-2.5">
          <span className="font-mono text-base tabular-nums text-ink">
            {floor != null ? `${floor.toLocaleString("en-US")} ${unit}` : "—"}
          </span>
          {change != null ? <Delta value={change} plain className="text-xs" /> : null}
        </div>
      </div>
    </Wrapper>
  );
};

export default Collectible;
