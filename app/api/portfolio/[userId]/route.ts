import { NextResponse } from "next/server";
import Portfolio from "@/models/Portfolio";
import { connectDB } from "@/utils/mongodb";

// DELETE asset by asset _id
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    await connectDB();
    const { userId } = await params;
    const { coinId } = await req.json();

    if (!userId || !coinId) {
      return NextResponse.json(
        { error: "UserId or coinId not provided" },
        { status: 400 }
      );
    }

    const portfolio = await Portfolio.findOneAndUpdate(
      { user: userId },
      { $pull: { assets: { coinId } } },
      { new: true }
    );

    if (!portfolio) {
      return NextResponse.json(
        { error: "Portfolio not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Asset removed",
      portfolio,
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
