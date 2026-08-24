import { Groq } from "groq-sdk";
import { NextResponse } from "next/server";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const MAX_PROMPT_CHARS = 2000;
const MAX_LIST_ITEMS = 15;

interface PortfolioItem {
  symbol: string;
  amount: number;
  value?: number;
}

interface WatchlistItem {
  symbol: string;
  price?: number;
}

function summarizePortfolio(portfolio: PortfolioItem[] = []) {
  return portfolio
    .slice(0, MAX_LIST_ITEMS)
    .map((p) => `${p.symbol}:${p.amount}${p.value ? `@$${p.value}` : ""}`)
    .join(", ");
}

function summarizeWatchlist(watchlist: WatchlistItem[] = []) {
  return watchlist
    .slice(0, MAX_LIST_ITEMS)
    .map((w) => `${w.symbol}${w.price ? `@$${w.price}` : ""}`)
    .join(", ");
}

export async function POST(req: Request) {
  const { prompt, watchlist, portfolio } = await req.json();

  if (!prompt || typeof prompt !== "string") {
    return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
  }

  const trimmedPrompt = prompt.slice(0, MAX_PROMPT_CHARS);
  const portfolioSummary = summarizePortfolio(portfolio);
  const watchlistSummary = summarizeWatchlist(watchlist);

  const systemContent = [
    "You are a crypto analyst named CoinVista AI.",
    portfolioSummary ? `Portfolio: ${portfolioSummary}` : "",
    watchlistSummary ? `Watchlist: ${watchlistSummary}` : "",
    "Use this data only if relevant to the user's query.",
  ]
    .filter(Boolean)
    .join(" ");

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemContent },
        { role: "user", content: trimmedPrompt },
      ],
      model: "openai/gpt-oss-20b",
      temperature: 1,
      max_completion_tokens: 1024,
      top_p: 1,
      stream: false,
      reasoning_effort: "medium",
    });

    return NextResponse.json({
      data: chatCompletion.choices[0]?.message?.content || "",
    });
  } catch (err) {
    if (err instanceof Groq.APIError && err.status === 413) {
      return NextResponse.json(
        {
          error:
            "Request too large. Try a shorter question or a smaller portfolio.",
        },
        { status: 413 },
      );
    }
    throw err;
  }
}
