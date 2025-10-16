import { NextRequest, NextResponse } from "next/server";
import { db } from "@workspace/database";
import { users, eq } from "@workspace/database";
import type {
  RegisterResponse,
  AuthUser,
  ApiErrorResponse,
} from "@workspace/types";
import { RegisterInputSchema } from "@workspace/types";
import { withAxiom, logger } from "@workspace/observability";
import { createToken } from "@workspace/auth/server";
import { formatZodError } from "@/lib/validation";

// @ts-ignore
import bcrypt from "bcryptjs";

export const POST = withAxiom(
  async (
    req: NextRequest
  ): Promise<NextResponse<RegisterResponse | ApiErrorResponse>> => {
    const startTime = Date.now();

    const body = await req.json();

    const validation = RegisterInputSchema.safeParse(body);

    if (!validation.success) {
      const errorResponse: ApiErrorResponse = {
        success: false,
        error: "Validation failed",
        details: formatZodError(validation.error.issues),
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const { name, email, password } = validation.data;

    // Check if user already exists
    const existingUsers = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUsers.length > 0) {
      const errorResponse: ApiErrorResponse = {
        success: false,
        error: "User already exists",
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const hash = await bcrypt.hash(password, 12);
    const newUsers = await db
      .insert(users)
      .values({ email, name, password: hash, id: crypto.randomUUID() })
      .returning();

    const newUser = newUsers[0];

    if (!newUser) {
      const errorResponse: ApiErrorResponse = {
        success: false,
        error: "Failed to create user",
      };
      return NextResponse.json(errorResponse, { status: 500 });
    }

    const authUser: AuthUser = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name || "",
      image: newUser.image || undefined,
      emailVerified: newUser.emailVerified || undefined,
    };

    const token = await createToken(authUser);

    const duration = Date.now() - startTime;
    logger.info("User registered", {
      userId: newUser.id,
      email,
      duration,
    });

    const response: RegisterResponse = {
      success: true,
      message: "Registration successful",
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
);
