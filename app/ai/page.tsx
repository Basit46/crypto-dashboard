"use client";

import React, { useRef, useState } from "react";
import UserProfile from "../components/UserProfile";
import { Button } from "@/components/ui/button";
import {
  LucideLoaderCircle,
  LucideSendHorizonal,
  LucideSparkles,
} from "lucide-react";
import { v4 } from "uuid";
import ReactMarkdown from "react-markdown";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import remarkGfm from "remark-gfm";

const prompts = [
  "Analyse my portfolio",
  "Show me my best and worst performing assets",
  "What percentage of my portfolio is in each coin?",
  "Suggest ways to rebalance my portfolio",
];

type Chat = {
  id: string;
  text: string;
  role: "ai" | "user";
};

const CoinVistaAI = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [prompt, setPrompt] = useState("");
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const handlePromptClick = (text: string) => {
    handleSend(text);
  };

  const scrollToTop = () => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
    }, 100);
  };

  const handleSend = (value: string) => {
    if (!value) return;

    mutate(value);
    setChats((prevChats) => [
      ...prevChats,
      { id: v4(), text: value, role: "user" },
    ]);
    scrollToTop();
    setPrompt("");
  };

  const { mutate, isPending } = useMutation({
    mutationFn: async (value: string) => {
      const res = await axiosInstance.post("/ai", { prompt: value });
      return res.data.data;
    },
    onSuccess: (data) => {
      setChats((prevChats) => [
        ...prevChats,
        { id: v4(), text: data, role: "ai" },
      ]);
      scrollToTop();
    },
  });

  return (
    <div className="h-full w-full flex flex-col">
      <div className="w-full px-[30px] py-[20px] border-b border-b-grey-200 flex items-center justify-between">
        <h1 className="text-[24px] font-medium text-grey-900">CoinVista AI</h1>

        <UserProfile />
      </div>

      <div className="flex-1 w-full px-[30px] py-[20px] overflow-y-auto flex justify-center items-end">
        <div className="w-[70%] h-full flex flex-col gap-y-[40px]">
          <div
            ref={scrollRef}
            className="scrollbar-hide flex-1 overflow-auto flex flex-col scroll-smooth"
          >
            {chats?.length < 1 ? (
              <div className="mt-auto flex justify-between gap-[20px]">
                {prompts.map((prompt, i) => (
                  <div
                    key={i}
                    onClick={() => handlePromptClick(prompt)}
                    role="button"
                    className="w-full h-[150px] p-[10px] border border-gray-400 rounded-[12px] flex flex-col justify-between"
                  >
                    <p className="text-gray-900">{prompt}</p>
                    <LucideSparkles className="text-gray-400" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 space-y-[16px]">
                {chats?.map((chat) =>
                  chat.role === "user" ? (
                    <div
                      key={chat.id}
                      className="ml-auto w-fit h-fit text-wrap max-w-[80%] px-[10px] py-[4px] bg-gray-200 rounded-[8px] break-words"
                    >
                      {chat.text}
                    </div>
                  ) : (
                    <div
                      key={chat.id}
                      className="mr-auto w-fit h-fit max-w-[80%] px-[10px] py-[4px] bg-gray-200 rounded-[8px] break-words prose prose-sm overflow-y-auto"
                    >
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {chat.text}
                      </ReactMarkdown>
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          <div className="shrink-0 w-full h-[80px] p-[8px] border border-gray-400 rounded-[12px] flex overflow-hidden">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault(); // stop new line
                  handleSend(prompt);
                }
              }}
              className="w-full h-full border-none outline-none resize-none"
            ></textarea>
            <Button
              disabled={isPending}
              onClick={() => handleSend(prompt)}
              className="self-end"
            >
              {!isPending ? (
                <>
                  <LucideSendHorizonal />
                  Send
                </>
              ) : (
                <LucideLoaderCircle className="animate-spin" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoinVistaAI;
