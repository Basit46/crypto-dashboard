import Portfolio from "@/models/Portfolio";
import { connectDB } from "@/utils/mongodb";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ msg: "User id missing" }, { status: 400 });
    }

    await connectDB();
    const portfolio = await Portfolio.findOne({ user: userId });
    if (!portfolio) {
      const createdPortfolio = await Portfolio.create({
        user: userId,
        assets: [],
      });

      return NextResponse.json({ assets: createdPortfolio.assets });
    }

    return NextResponse.json({ assets: portfolio.assets });
  } catch {
    return NextResponse.json({ msg: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const {
      userId,
      coinId,
      boughtPrice = 0,
      amountBought = 0,
    } = await req.json();

    if (!userId || !coinId) {
      return NextResponse.json(
        { error: "Missing required fields (userId, coinId)" },
        { status: 400 }
      );
    }

    await connectDB();

    const portfolio = await Portfolio.findOne({ user: userId });

    if (!portfolio) {
      const created = await Portfolio.create({
        user: userId,
        assets: [{ coinId, boughtPrice, amountBought }],
      });
      return NextResponse.json({ assets: created.assets }, { status: 201 });
    }

    // Prevent duplicate coin (by coinId) in same user's portfolio
    const exists = portfolio.assets.find((a: any) => a.coinId === coinId);
    if (exists) {
      return NextResponse.json(
        { error: "Coin already in portfolio" },
        { status: 400 }
      );
    }

    portfolio.assets.push({
      coinId,
      boughtPrice,
      amountBought,
    });
    await portfolio.save();

    return NextResponse.json({ assets: portfolio.assets }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ msg: "Server error", err }, { status: 500 });
  }
}
