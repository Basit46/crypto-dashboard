import { NextResponse } from "next/server";
import Portfolio from "@/models/Portfolio";
import { connectDB } from "@/utils/mongodb";

// // UPDATE asset (only allowed fields)
// export async function PUT(req: Request, { params }: { params: { id: string } }) {
//   await dbConnect();
//   const assetId = params.id;
//   const body = await req.json();

//   // Only allow these fields to be updated
//   const updates: Record<string, any> = {};
//   if (body.amountBought !== undefined) updates["assets.$.amountBought"] = body.amountBought;
//   if (body.boughtPrice !== undefined) updates["assets.$.boughtPrice"] = body.boughtPrice;
//   if (body.coinPrice !== undefined) updates["assets.$.coinPrice"] = body.coinPrice;

//   if (Object.keys(updates).length === 0) {
//     return NextResponse.json({ error: "No updatable fields provided" }, { status: 400 });
//   }

//   const updatedPortfolio = await Portfolio.findOneAndUpdate(
//     { "assets._id": assetId },
//     { $set: updates },
//     { new: true }
//   );

//   if (!updatedPortfolio) {
//     return NextResponse.json({ error: "Asset not found" }, { status: 404 });
//   }

//   const updatedAsset = updatedPortfolio.assets.id(assetId);
//   return NextResponse.json({ asset: updatedAsset });
// }

// DELETE asset by asset _id
export async function DELETE(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    await connectDB();
    const userId = params.userId;
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

export async function GET() {
  console.log("Here");
}
