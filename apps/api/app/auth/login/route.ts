import { NextResponse } from "next/server";
import { db } from "@workspace/database";
import { users, eq } from "@workspace/database";
import { createToken } from "@workspace/auth/server";
import type {
  LoginResponse,
  ApiErrorResponse,
  AuthUser,
} from "@workspace/types";
// @ts-ignore
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  if (!email || !password) {
    const errorResponse: ApiErrorResponse = {
      success: false,
      error: "Missing credentials",
    };
    return NextResponse.json(errorResponse, { status: 400 });
  }

  const row = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  const user = row[0];
  if (!user || !user.password) {
    const errorResponse: ApiErrorResponse = {
      success: false,
      error: "Invalid credentials",
    };
    return NextResponse.json(errorResponse, { status: 401 });
  }

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    const errorResponse: ApiErrorResponse = {
      success: false,
      error: "Invalid credentials",
    };
    return NextResponse.json(errorResponse, { status: 401 });
  }

  const authUser: AuthUser = {
    id: user.id,
    email: user.email,
    name: user.name || "",
    image: user.image || undefined,
    emailVerified: user.emailVerified || undefined,
  };

  const token = await createToken(authUser);

  const response: LoginResponse = {
    success: true,
    message: "Login successful",
    token,
    user: authUser,
  };

  const res = NextResponse.json(response);
  res.cookies.set("auth", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
