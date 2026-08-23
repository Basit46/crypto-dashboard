"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React from "react";
import { useGlobalStore } from "../store/globalStore";
import Image from "next/image";
import { LucideCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const images = [
  "/avatar1.jpg",
  "/avatar2.png",
  "/avatar3.png",
  "/avatar4.png",
  "/avatar5.png",
  "/avatar6.jpg",
];

const ChangeAvatar = () => {
  const { isAvatarModalOpen, setIsAvatarModalOpen, avatar, setAvatar } =
    useGlobalStore();

  return (
    <Dialog open={isAvatarModalOpen} onOpenChange={setIsAvatarModalOpen}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Change avatar</DialogTitle>
          <DialogDescription>
            Pick the image that appears next to your account.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-3">
          {images.map((img) => {
            const selected = img === avatar;

            return (
              <button
                type="button"
                key={img}
                onClick={() => setAvatar(img)}
                aria-pressed={selected}
                aria-label={`Select avatar ${img.replace(/\D/g, "")}`}
                className={cn(
                  "relative aspect-square w-full overflow-hidden rounded-full ring-2 ring-offset-2 ring-offset-surface transition-[box-shadow,transform]",
                  selected
                    ? "ring-accent"
                    : "ring-transparent hover:ring-line-strong"
                )}
              >
                <Image src={img} fill sizes="96px" className="object-cover" alt="" />

                {selected ? (
                  <span className="absolute inset-0 grid place-items-center bg-ink/45">
                    <LucideCheck className="size-5 text-white" strokeWidth={3} />
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChangeAvatar;
