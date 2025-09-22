import { Document, model, Model, models, Schema } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  watchlist: string[];
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: { type: String, required: true },
    watchlist: { type: [String], default: ["bitcoin", "ethereum"] },
  },
  { timestamps: true }
);

const User: Model<IUser> = models.User || model<IUser>("User", UserSchema);

export default User;
