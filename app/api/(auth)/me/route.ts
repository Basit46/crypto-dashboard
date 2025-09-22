import { NextResponse } from "next/server";
import User from "@/models/User";
import { verifyToken } from "@/utils/jwt";
import { connectDB } from "@/utils/mongodb";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const payload = verifyToken(token) as { sub: string };

    await connectDB();

    const user = await User.findById(payload.sub).select("-password").lean();
    if (!user) return NextResponse.json({ user: null }, { status: 404 });

    return NextResponse.json({ user });
  } catch (err) {
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
