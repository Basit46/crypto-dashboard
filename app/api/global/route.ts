import { NextResponse } from "next/server";

const API_KEY = process.env.COINGECKO_API_KEY;

// Market-wide aggregates: total cap, 24h volume, dominance, coin count.
export async function GET() {
  const response = await fetch("https://api.coingecko.com/api/v3/global", {
    headers: {
      accept: "application/json",
      ...(API_KEY ? { "x-cg-demo-api-key": API_KEY } : {}),
    },
    next: { revalidate: 5 * 60 },
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: "Failed to fetch data from CoinGecko" },
      { status: 502 }
    );
  }

  const { data } = await response.json();

  return NextResponse.json(data);
}
