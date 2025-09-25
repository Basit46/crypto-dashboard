// import { NextResponse } from "next/server";
// import dbConnect from "@/lib/dbConnect";
// import Portfolio from "@/models/Portfolio";

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

// // DELETE asset by asset _id
// export async function DELETE(_: Request, { params }: { params: { id: string } }) {
//   await dbConnect();
//   const assetId = params.id;

//   const after = await Portfolio.findOneAndUpdate(
//     { "assets._id": assetId },
//     { $pull: { assets: { _id: assetId } } },
//     { new: true }
//   );

//   if (!after) {
//     return NextResponse.json({ error: "Asset not found" }, { status: 404 });
//   }

//   return NextResponse.json({ message: "Asset removed", assets: after.assets });
// }
