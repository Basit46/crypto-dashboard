import mongoose, { Schema, Document, Types } from "mongoose";

export interface IAsset {
  _id?: Types.ObjectId;
  coinId: string;
  boughtPrice: number;
  amountBought: number;
}

export interface IPortfolio extends Document {
  user: Types.ObjectId;
  assets: IAsset[];
}

const AssetSchema = new Schema<IAsset>({
  coinId: { type: String, required: true },
  boughtPrice: { type: Number, required: true, default: 0 },
  amountBought: { type: Number, required: true, default: 0 },
});

const PortfolioSchema = new Schema<IPortfolio>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    assets: { type: [AssetSchema], default: [] },
  },
  { timestamps: true }
);

const Portfolio =
  mongoose.models.Portfolio ||
  mongoose.model<IPortfolio>("Portfolio", PortfolioSchema);

export default Portfolio;
