"use client";

import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { TOKEN } from "../utils/constant";
import useUser from "../hooks/useUser";
import { useGlobalStore } from "../store/globalStore";

const UserProfile = () => {
  const [open, setOpen] = useState(false);
  const { setIsAvatarModalOpen, avatar } = useGlobalStore();

  const { data: user } = useUser();

  //User profile dropdown
  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger>
          <div className="relative size-[40px] border border-grey-200 bg-grey-25 rounded-full overflow-hidden">
            <Image
              src={avatar}
              fill
              priority
              alt="avatar"
              className="object-cover"
              sizes="44px"
            />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem className="focus:bg-transparent">
            <p>{user?.email}</p>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setIsAvatarModalOpen(true)}
            className="cursor-pointer"
          >
            Change avatar
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setOpen(true)}
            className="cursor-pointer text-red-600"
          >
            Logout
          </DropdownMenuItem>
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

  //Logout
  const handleLogout = () => {
    localStorage.removeItem(TOKEN);
    router.replace("/auth/signin");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Logout</DialogTitle>
          <DialogDescription>
            Are you sure you want to logout?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-[20px] flex">
          <DialogClose asChild>
            <Button className="w-full h-[40px]" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={handleLogout}
            variant="destructive"
            className="w-full h-[40px]"
          >
            Logout
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
