"use client";

import axiosCoingeckoApi from "@/lib/axiosCoingecko";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Collectible from "./Collectible";

const CollectiblesOverview = () => {
  const { data = [], isLoading } = useQuery({
    queryKey: ["collectibles"],
    queryFn: async () => {
      const res = await axiosCoingeckoApi("/nfts/list");
      return res.data.slice(0, 10);
    },
    staleTime: 1000 * 60 * 60 * 12,
  });

  return (
    <Card className="overflow-hidden">
      <div className="flex min-h-[52px] shrink-0 items-center justify-between border-b border-line px-4">
        <h2 className="text-base font-semibold text-ink">NFT collections</h2>
        <p className="text-xs text-ink-subtle">Floor price, ETH-denominated</p>
      </div>

      {/* A horizontal rail: collections are browsed, not compared row by row. */}
      <div className="scrollbar-hide overflow-x-auto">
        <div className="flex gap-3 p-4">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="w-[184px] shrink-0 rounded-xl border border-line p-2"
                >
                  <Skeleton className="aspect-[4/3] w-full rounded-lg" />
                  <Skeleton className="mt-3 h-4 w-3/4" />
                  <Skeleton className="mt-2 h-3 w-1/2" />
                </div>
              ))
            : data.map((item: { id: string }) => (
                <Collectible key={item.id} item={item} />
              ))}
        </div>
      </div>
    </Card>
  );
};

export default CollectiblesOverview;
