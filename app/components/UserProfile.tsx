"use client";

import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LucideImage, LucideLogIn, LucideLogOut } from "lucide-react";
import { TOKEN } from "../utils/constant";
import useUser from "../hooks/useUser";
import { useGlobalStore } from "../store/globalStore";

const UserProfile = () => {
  const router = useRouter();

  const { setIsAvatarModalOpen, avatar } = useGlobalStore();
  const { data: user } = useUser();
  const userId = user?._id;

  const [open, setOpen] = useState(false);

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger
          aria-label="Account menu"
          className="relative size-9 shrink-0 overflow-hidden rounded-full border border-line bg-surface-hover transition-colors hover:border-line-strong"
        >
          <Image
            src={avatar}
            fill
            priority
            alt=""
            className="object-cover"
            sizes="36px"
          />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            {userId ? "Signed in" : "Not signed in"}
          </DropdownMenuLabel>
          {userId ? (
            <div className="px-2 pb-1.5">
              <p className="truncate text-sm text-ink">{user?.email}</p>
            </div>
          ) : null}

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => setIsAvatarModalOpen(true)}
            className="cursor-pointer"
          >
            <LucideImage className="size-4 text-ink-subtle" />
            Change avatar
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {userId ? (
            <DropdownMenuItem
              onClick={() => setOpen(true)}
              className="cursor-pointer text-neg focus:text-neg"
            >
              <LucideLogOut className="size-4" />
              Sign out
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              onClick={() => router.push("/auth/signin")}
              className="cursor-pointer"
            >
              <LucideLogIn className="size-4 text-ink-subtle" />
              Sign in
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <LogoutModal open={open} setOpen={setOpen} />
    </>
  );
};

export default UserProfile;

export function LogoutModal({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem(TOKEN);
    router.replace("/auth/signin");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Sign out</DialogTitle>
          <DialogDescription>
            You will need to sign in again to see your portfolio and watchlist.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-2">
          <DialogClose asChild>
            <Button className="w-full" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={handleLogout} variant="destructive" className="w-full">
            Sign out
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
