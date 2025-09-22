import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import { signToken } from "@/utils/jwt";
import { connectDB } from "@/utils/mongodb";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password)
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    await connectDB();

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user)
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 400 }
      );

    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 400 }
      );

    const token = signToken({ sub: user._id?.toString(), email: user.email });

    return NextResponse.json({
      message: "Signed in",
      token,
      user: { id: user._id?.toString(), email: user.email },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
