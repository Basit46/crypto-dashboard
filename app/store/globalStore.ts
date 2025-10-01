import { create } from "zustand";
import { persist } from "zustand/middleware";

type Chat = {
  id: string;
  text: string;
  role: "ai" | "user";
};

type GlobalStore = {
  avatar: string;
  setAvatar: (v: string) => void;
  isAvatarModalOpen: boolean;
  setIsAvatarModalOpen: (v: boolean) => void;

  isAddToPortfolioOpen: boolean;
  setIsAddToPortfolioOpen: (v: boolean) => void;
  addToPortfolioId: string;
  setAddToPortfolioId: (v: string) => void;

  prompt: string;
  setPrompt: (v: string) => void;

  chats: Chat[];
  addChat: (v: Chat) => void;
  clearChats: () => void;
};

export const useGlobalStore = create<GlobalStore>()(
  persist(
    (set) => ({
      avatar: "/avatar1.jpg",
      setAvatar: (v) => set(() => ({ avatar: v })),
      isAvatarModalOpen: false,
      setIsAvatarModalOpen: (v) => set(() => ({ isAvatarModalOpen: v })),

      isAddToPortfolioOpen: false,
      setIsAddToPortfolioOpen: (v) => set({ isAddToPortfolioOpen: v }),
      addToPortfolioId: "",
      setAddToPortfolioId: (v) => set((state) => ({ addToPortfolioId: v })),

      prompt: "",
      setPrompt: (v) => set((state) => ({ prompt: v })),

      chats: [],
      addChat: (v) => set((state) => ({ chats: [...state.chats, v] })),
      clearChats: () => set(() => ({ chats: [] })),
    }),
    {
      name: "global-store",
      partialize: (state) => ({ avatar: state.avatar }),
    }
  )
);
