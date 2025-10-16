import { NextResponse } from "next/server";
import { db } from "@workspace/database";
import { users, eq } from "@workspace/database";
// @ts-ignore
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";

const getSecret = () => {
  const secret = process.env.AUTH_JWT_SECRET || "123";
  if (!secret) throw new Error("AUTH_JWT_SECRET is not set");
  return new TextEncoder().encode(secret);
};

export async function POST(req: Request) {
  const { email, password } = await req.json();
  if (!email || !password) {
    return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
  }

  const row = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  const u = row[0];
  if (!u || !u.password) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const ok = await bcrypt.compare(password, u.password);
  if (!ok) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = await new SignJWT({ email: u.email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(u.id)
    .setIssuer(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001")
    .setAudience(process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002")
    .setExpirationTime("7d")
    .sign(getSecret());

  const res = NextResponse.json({ token, userId: u.id });
  res.cookies.set("auth", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
