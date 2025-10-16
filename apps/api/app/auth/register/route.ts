import { NextResponse } from "next/server";
import { db } from "@workspace/database";
import { users, eq } from "@workspace/database";
import type {
  RegisterResponse,
  AuthUser,
  ApiErrorResponse,
} from "@workspace/types";

// @ts-ignore
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { email, password, name } = await req.json();
  if (!email || !password || !name) {
    const errorResponse: ApiErrorResponse = {
      success: false,
      error: "Missing fields",
    };
    return NextResponse.json(errorResponse, { status: 400 });
  }

  const exists = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  if (exists[0]) {
    const errorResponse: ApiErrorResponse = {
      success: false,
      error: "User exists",
    };
    return NextResponse.json(errorResponse, { status: 400 });
  }

  const hash = await bcrypt.hash(password, 12);
  const [user] = await db
    .insert(users)
    .values({ email, name, password: hash, id: crypto.randomUUID() })
    .returning();

  if (!user) {
    const errorResponse: ApiErrorResponse = {
      success: false,
      error: "Failed to create user",
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }

  const authUser: AuthUser = {
    id: user.id,
    email: user.email,
    name: user.name || "",
    image: user.image || undefined,
    emailVerified: user.emailVerified || undefined,
  };

  const response: RegisterResponse = {
    success: true,
    message: "Registration successful",
    token: "",
    user: authUser,
  };

  return NextResponse.json(response);
}
