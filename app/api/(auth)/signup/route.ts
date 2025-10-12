import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import { connectDB } from "@/utils/mongodb";
import Portfolio from "@/models/Portfolio";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      );
    }

    await connectDB();

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing)
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 409 }
      );

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      email: email.toLowerCase().trim(),
      password: hashed,
    });

    await Portfolio.create({
      user: user._id?.toString(),
      assets: [
        { coinId: "ethereum", boughtPrice: 1500, amountBought: 1 },
        { coinId: "solana", boughtPrice: 220, amountBought: 1 },
        { coinId: "binancecoin", boughtPrice: 1500, amountBought: 1 },
      ],
    });

    return NextResponse.json(
      { user: { id: user._id?.toString(), email: user.email } },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
