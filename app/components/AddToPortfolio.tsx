"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGlobalStore } from "../store/globalStore";
import { useGetAllCoins } from "../lib/query";
import { useEffect, useState } from "react";
import Image from "next/image";
import useUser from "../hooks/useUser";
import { useAddToPortfolio } from "../lib/mutations";
import { formatPrice, formatUsd } from "../utils";
import { LucideLoaderCircle } from "lucide-react";

export function AddToPortfolioModal() {
  const { isAddToPortfolioOpen, setIsAddToPortfolioOpen, addToPortfolioId } =
    useGlobalStore();
  const { data: user } = useUser();
  const { data: coins } = useGetAllCoins();

  const coin = coins?.find((c) => c.id === addToPortfolioId);

  const [boughtPrice, setBoughtPrice] = useState("");
  const [amountBought, setAmountBought] = useState("1");

  // Seed the form from the live price each time the dialog opens for an asset.
  useEffect(() => {
    if (!isAddToPortfolioOpen) return;
    setBoughtPrice(coin?.current_price != null ? String(coin.current_price) : "");
    setAmountBought("1");
  }, [isAddToPortfolioOpen, coin?.current_price]);

  const { mutate, isPending, isSuccess } = useAddToPortfolio();

  useEffect(() => {
    if (isSuccess) setIsAddToPortfolioOpen(false);
  }, [isSuccess, setIsAddToPortfolioOpen]);

  const price = parseFloat(boughtPrice);
  const amount = parseFloat(amountBought);
  const valid = Number.isFinite(price) && price > 0 && Number.isFinite(amount) && amount > 0;
  const total = valid ? price * amount : 0;

  return (
    <Dialog open={isAddToPortfolioOpen} onOpenChange={setIsAddToPortfolioOpen}>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="sm:max-w-[420px]"
      >
        <DialogHeader>
          <DialogTitle>Add to portfolio</DialogTitle>
          <DialogDescription>
            Record what you paid so CoinVista can track this position&apos;s
            profit and loss.
          </DialogDescription>
        </DialogHeader>

        {coin ? (
          <div className="flex items-center gap-3 rounded-lg border border-line bg-surface-sunken p-3">
            <span className="relative size-8 shrink-0 overflow-hidden rounded-full bg-surface-hover">
              <Image
                src={coin.image}
                fill
                sizes="32px"
                alt=""
                className="object-cover"
              />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-base font-medium text-ink">
                {coin.name}
              </p>
              <p className="text-xs uppercase tracking-wide text-ink-subtle">
                {coin.symbol}
              </p>
            </div>
            <div className="text-right">
              <p className="font-mono text-base tabular-nums text-ink">
                {formatPrice(coin.current_price)}
              </p>
              <p className="text-2xs text-ink-subtle">Live price</p>
            </div>
          </div>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="bought-price">Price paid (USD)</Label>
            <Input
              id="bought-price"
              type="number"
              min="0"
              step="any"
              inputMode="decimal"
              value={boughtPrice}
              onChange={(e) => setBoughtPrice(e.target.value)}
              className="font-mono tabular-nums"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="amount-bought">
              Amount ({coin?.symbol?.toUpperCase() || "units"})
            </Label>
            <Input
              id="amount-bought"
              type="number"
              min="0"
              step="any"
              inputMode="decimal"
              value={amountBought}
              onChange={(e) => setAmountBought(e.target.value)}
              className="font-mono tabular-nums"
            />
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-line pt-3">
          <span className="text-sm text-ink-muted">Total cost</span>
          <span className="font-mono text-lg font-medium tabular-nums text-ink">
            {valid ? formatUsd(total) : "—"}
          </span>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button className="w-full" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={() =>
              mutate({
                coinId: addToPortfolioId,
                boughtPrice: price,
                amountBought: amount,
              })
            }
            disabled={isPending || !valid || !user?._id}
            className="w-full"
          >
            {isPending ? (
              <>
                <LucideLoaderCircle className="animate-spin" />
                Adding…
              </>
            ) : (
              "Add position"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
