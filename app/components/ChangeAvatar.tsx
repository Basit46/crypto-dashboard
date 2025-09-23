import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React from "react";
import { useGlobalStore } from "../store/globalStore";
import Image from "next/image";
import { LucideCheckCircle } from "lucide-react";

const ChangeAvatar = () => {
  const { isAvatarModalOpen, setIsAvatarModalOpen, avatar, setAvatar } =
    useGlobalStore();

  const images = [
    "/avatar1.jpg",
    "/avatar2.png",
    "/avatar3.png",
    "/avatar4.png",
    "/avatar5.png",
    "/avatar6.jpg",
  ];

  return (
    <Dialog open={isAvatarModalOpen} onOpenChange={setIsAvatarModalOpen}>
      <DialogContent aria-describedby={undefined} className="p-0 gap-0">
        <DialogHeader className="border border-b-black/20 px-[24px] py-[20px]">
          <DialogTitle>Change Avatar</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-3 px-[24px] py-[20px] gap-[12px]">
          {images.map((img, i) => (
            <div
              role="button"
              key={i}
              onClick={() => setAvatar(img)}
              className="relative w-full aspect-square bg-grey-200 rounded-full overflow-hidden border border-grey-600"
            >
              <Image src={img} fill className="object-cover" alt="avatar" />

              {img === avatar && (
                <div className="absolute inset-0 w-full h-full bg-green-600 bg-opacity-40 flex items-center justify-center">
                  <LucideCheckCircle className="text-green-600" fill="white" />
                </div>
              )}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChangeAvatar;
