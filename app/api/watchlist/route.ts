import User from "@/models/User";
import { connectDB } from "@/utils/mongodb";
import { NextResponse } from "next/server";
//68d18f07a49457e3ff068fa4

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ msg: "User id not added" }, { status: 400 });
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ msg: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ watchlist: user.watchlist });
  } catch {
    return NextResponse.json({ msg: "Server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ msg: "userId is missing" }, { status: 400 });
    }

    const { coinId } = await req.json();
    if (!coinId) {
      return NextResponse.json({ msg: "coinId is missing" }, { status: 400 });
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ msg: "user not found" }, { status: 404 });
    }

    const watchlist = user.watchlist;
    if (watchlist.includes(coinId)) {
      return NextResponse.json({ msg: "coin already added" }, { status: 409 });
    }

    user.watchlist.push(coinId);
    const updatedUser = await user.save();
    return NextResponse.json({ user: updatedUser.watchlist });
  } catch {
    return NextResponse.json({ msg: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ msg: "userId is missing" }, { status: 400 });
    }

    const coinId = searchParams.get("coinId");
    if (!coinId) {
      return NextResponse.json({ msg: "coinId is missing" }, { status: 400 });
    }

    // ✅ Use $pull to remove coinId from the watchlist array
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { watchlist: coinId } },
      { new: true } // return updated doc
    );

    if (!updatedUser) {
      return NextResponse.json({ msg: "user not found" }, { status: 404 });
    }

    return NextResponse.json({ watchlist: updatedUser.watchlist });
  } catch (error) {
    console.error("DELETE /watchlist error:", error);
    return NextResponse.json({ msg: "Server error" }, { status: 500 });
  }
}
