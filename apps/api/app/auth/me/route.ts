import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { db } from "@workspace/database";
import { users, eq } from "@workspace/database";

const getSecret = () => {
  const secret = process.env.AUTH_JWT_SECRET || "123";
  if (!secret) throw new Error("AUTH_JWT_SECRET is not set");
  return new TextEncoder().encode(secret);
};

export async function GET(req: Request) {
  // Try to get token from Authorization header first
  const authHeader = req.headers.get("authorization");
  let token = authHeader?.replace("Bearer ", "");

  // Fallback to cookie if no Authorization header
  if (!token) {
    const cookieHeader = (req as any).headers.get("cookie") || "";
    token = cookieHeader
      .split(";")
      .map((c: string) => c.trim())
      .find((c: string) => c.startsWith("auth="))
      ?.split("=")[1];
  }

  if (!token) {
    return NextResponse.json({ user: null });
  }

  try {
    const { payload } = await jwtVerify(token, getSecret(), {
      issuer: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001",
      audience: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002",
    });

    const userId = payload.sub as string | undefined;
    if (!userId) return NextResponse.json({ user: null });

    const row = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);
    const user = row[0];
    if (!user) return NextResponse.json({ user: null });

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        emailVerified: user.emailVerified,
      },
    });
  } catch {
    return NextResponse.json({ user: null });
  }
}
