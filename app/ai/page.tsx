"use client";

import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  LucideArrowUp,
  LucideLoaderCircle,
  LucideSparkles,
  LucideTrash2,
} from "lucide-react";
import { v4 } from "uuid";
import ReactMarkdown from "react-markdown";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import remarkGfm from "remark-gfm";
import { useGetPortfolio, useGetWatchlist } from "../lib/query";
import { useGlobalStore } from "../store/globalStore";
import PageHeader from "../components/PageHeader";
import useUser from "../hooks/useUser";

const suggestions = [
  {
    title: "Analyse my portfolio",
    detail: "Concentration, risk and overall exposure",
  },
  {
    title: "Best and worst performers",
    detail: "What is carrying the portfolio, and what is dragging",
  },
  {
    title: "Break down my allocation",
    detail: "The share of net worth held in each asset",
  },
  {
    title: "Suggest a rebalance",
    detail: "Where to trim and where to add",
  },
];

const CoinVistaAI = () => {
  const { data: watchlist } = useGetWatchlist();
  const { assets: portfolio } = useGetPortfolio();
  const { data: user } = useUser();
  const { prompt, setPrompt, chats, addChat, clearChats } = useGlobalStore();

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const { mutate, isPending } = useMutation({
    mutationFn: async (value: string) => {
      const res = await axiosInstance.post("/ai", {
        prompt: value,
        watchlist,
        portfolio,
      });
      return res.data.data;
    },
    onSuccess: (data) => addChat({ id: v4(), text: data, role: "ai" }),
    onError: () =>
      addChat({
        id: v4(),
        text: "I could not reach the analysis service. Please try again in a moment.",
        role: "ai",
      }),
  });

  // Follow the conversation as it grows, including while a reply streams in.
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [chats.length, isPending]);

  const handleSend = (value: string) => {
    const text = value.trim();
    if (!text || isPending) return;

    addChat({ id: v4(), text, role: "user" });
    mutate(text);
    setPrompt("");
  };

  const empty = chats.length === 0;

  return (
    <>
      <PageHeader
        title="CoinVista AI"
        caption="Grounded in your portfolio and watchlist"
        actions={
          chats.length > 0 ? (
            <Button variant="ghost" size="sm" onClick={clearChats}>
              <LucideTrash2 className="size-3.5" />
              <span className="hidden vsm:inline">Clear</span>
            </Button>
          ) : null
        }
      />

      <div className="flex min-h-0 flex-1 flex-col items-center overflow-hidden px-4 vsm:px-6">
        <div className="flex min-h-0 w-full max-w-[760px] flex-1 flex-col">
          <div
            ref={scrollRef}
            className="scrollbar-hide flex min-h-0 flex-1 flex-col overflow-y-auto scroll-smooth py-6"
          >
            {empty ? (
              <div className="m-auto w-full">
                <div className="mb-6 text-center">
                  <div className="mx-auto grid size-10 place-items-center rounded-xl border border-line bg-surface text-accent">
                    <LucideSparkles className="size-[18px]" />
                  </div>
                  <h2 className="mt-3 text-xl font-semibold tracking-[-0.01em] text-ink">
                    Ask about your holdings
                  </h2>
                  <p className="mt-1 text-sm text-ink-muted">
                    {user?._id
                      ? "Your portfolio and watchlist are sent along with each question."
                      : "Sign in to ground answers in your own portfolio."}
                  </p>
                </div>

                <div className="grid gap-2 sm:grid-cols-2">
                  {suggestions.map((item) => (
                    <button
                      key={item.title}
                      type="button"
                      onClick={() => handleSend(item.title)}
                      className="rounded-xl border border-line bg-surface p-3 text-left transition-colors hover:border-line-strong hover:bg-surface-hover"
                    >
                      <p className="text-base font-medium text-ink">
                        {item.title}
                      </p>
                      <p className="mt-0.5 text-xs text-ink-subtle">
                        {item.detail}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                {chats.map((chat) =>
                  chat.role === "user" ? (
                    <div key={chat.id} className="flex justify-end">
                      <p className="max-w-[85%] whitespace-pre-wrap break-words rounded-xl rounded-br-sm bg-accent px-3 py-2 text-base text-accent-ink">
                        {chat.text}
                      </p>
                    </div>
                  ) : (
                    <div key={chat.id} className="flex gap-3">
                      <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg border border-line bg-surface text-accent">
                        <LucideSparkles className="size-3.5" />
                      </span>
                      <div className="answer min-w-0 flex-1">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {chat.text}
                        </ReactMarkdown>
                      </div>
                    </div>
                  )
                )}

                {isPending ? (
                  <div className="flex gap-3">
                    <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg border border-line bg-surface text-accent">
                      <LucideSparkles className="size-3.5" />
                    </span>
                    <p className="flex items-center gap-2 pt-1 text-sm text-ink-subtle">
                      <LucideLoaderCircle className="size-3.5 animate-spin" />
                      Analysing your positions…
                    </p>
                  </div>
                ) : null}
              </div>
            )}
          </div>

          {/* Composer */}
          <div className="shrink-0 pb-5">
            <div className="flex items-end gap-2 rounded-xl border border-line bg-surface p-2 transition-colors focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20">
              <textarea
                ref={inputRef}
                value={prompt}
                rows={1}
                onChange={(e) => {
                  setPrompt(e.target.value);
                  // Grow with the content, up to a sensible ceiling.
                  e.target.style.height = "auto";
                  e.target.style.height = `${Math.min(e.target.scrollHeight, 160)}px`;
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend(prompt);
                    if (inputRef.current) inputRef.current.style.height = "auto";
                  }
                }}
                placeholder="Ask about your portfolio, an asset, or the market…"
                aria-label="Message CoinVista AI"
                className="max-h-40 min-h-[36px] w-full resize-none bg-transparent px-2 py-2 text-base text-ink outline-none placeholder:text-ink-subtle"
              />

              <Button
                size="icon"
                disabled={isPending || !prompt.trim()}
                onClick={() => handleSend(prompt)}
                aria-label="Send message"
                className="shrink-0"
              >
                {isPending ? (
                  <LucideLoaderCircle className="animate-spin" />
                ) : (
                  <LucideArrowUp />
                )}
              </Button>
            </div>

            <p className="mt-2 text-center text-2xs text-ink-subtle">
              Analysis is generated and may be inaccurate. Not financial advice.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default CoinVistaAI;
