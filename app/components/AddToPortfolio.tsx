import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGlobalStore } from "../store/globalStore";
import { useGetAllCoins } from "../lib/query";
import { useEffect, useState } from "react";
import useUser from "../hooks/useUser";
import { useAddToPortfolio } from "../lib/mutations";

export function AddToPortfolioModal() {
  const { isAddToPortfolioOpen, setIsAddToPortfolioOpen, addToPortfolioId } =
    useGlobalStore();
  const { data: user } = useUser();

  const { data: coins } = useGetAllCoins();

  const [formData, setFormData] = useState({
    userId: user?._id,
    coinId: "",
    boughtPrice: 0,
    amountBought: 1,
  });

  //Update user ID
  useEffect(() => {
    setFormData((prev) => ({ ...prev, userId: user?._id as string }));
  }, [isAddToPortfolioOpen, user]);

  //Update coin ID and bought price
  useEffect(() => {
    const coin = coins?.find((coin) => coin.id == addToPortfolioId);
    setFormData((prev) => ({
      ...prev,
      coinId: coin?.id as string,
      boughtPrice: coin?.current_price || 0,
    }));
  }, [isAddToPortfolioOpen, addToPortfolioId]);

  const coin = coins?.find((coin) => coin.id == addToPortfolioId);

  //Add To Portfolio
  const {
    mutate: addToPortfolioMutate,
    isPending,
    isSuccess,
  } = useAddToPortfolio();
  const handleAdd = () => {
    addToPortfolioMutate(formData);
  };
  useEffect(() => {
    if (isSuccess) {
      setIsAddToPortfolioOpen(false);
    }
  }, [isSuccess]);

  return (
    <Dialog open={isAddToPortfolioOpen} onOpenChange={setIsAddToPortfolioOpen}>
      <form>
        <DialogContent
          onOpenAutoFocus={(e) => e.preventDefault()}
          className="sm:max-w-[425px]"
        >
          <DialogHeader>
            <DialogTitle>Add to Portfolio</DialogTitle>
            <DialogDescription>
              Add{" "}
              <span className="font-medium text-indigo-600">{coin?.name}</span>{" "}
              to your portfolio. Click add when you&apos;re done.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={formData.boughtPrice.toString()}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    boughtPrice: parseFloat(e.target.value),
                  }))
                }
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="amount-1">
                Amount bought (${coin?.symbol?.toUpperCase()})
              </Label>
              <Input
                id="amount-1"
                name="amount"
                type="number"
                value={formData.amountBought.toString()}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    amountBought: parseFloat(e.target.value),
                  }))
                }
              />
            </div>
          </div>

          <DialogFooter className="w-full">
            <DialogClose asChild>
              <Button className="w-full h-[40px]" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button
              onClick={handleAdd}
              disabled={isPending}
              className="w-full h-[40px]"
              type="submit"
            >
              {isPending ? "Loading..." : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
