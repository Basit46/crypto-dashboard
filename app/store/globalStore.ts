import { create } from "zustand";
import { persist } from "zustand/middleware";

type GlobalStore = {
  avatar: string;
  setAvatar: (v: string) => void;
  isAvatarModalOpen: boolean;
  setIsAvatarModalOpen: (v: boolean) => void;
};

export const useGlobalStore = create<GlobalStore>()(
  persist(
    (set) => ({
      avatar: "/avatar1.jpg",
      setAvatar: (v) => set(() => ({ avatar: v })),
      isAvatarModalOpen: false,
      setIsAvatarModalOpen: (v) => set(() => ({ isAvatarModalOpen: v })),
    }),
    {
      name: "global-store",
      partialize: (state) => ({ avatar: state.avatar }),
    }
  )
);
