import { NextRequest, NextResponse } from "next/server";
import { db } from "@workspace/database";
import { users, eq } from "@workspace/database";
import { createToken } from "@workspace/auth/server";
import type {
  LoginResponse,
  ApiErrorResponse,
  AuthUser,
} from "@workspace/types";
import { LoginInputSchema } from "@workspace/types";
import { withAxiom, logger } from "@workspace/observability";
import { formatZodError } from "@/lib/validation";

// @ts-ignore
import bcrypt from "bcryptjs";

export const POST = withAxiom(
  async (
    req: NextRequest
  ): Promise<NextResponse<LoginResponse | ApiErrorResponse>> => {
    const startTime = Date.now();

    const body = await req.json();

    const validation = LoginInputSchema.safeParse(body);

    if (!validation.success) {
      const errorResponse: ApiErrorResponse = {
        success: false,
        error: "Validation failed",
        details: formatZodError(validation.error.issues),
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const { email, password } = validation.data;

    const rows = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    const user = rows[0];
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

    const duration = Date.now() - startTime;
    logger.info("User logged in", {
      userId: user.id,
      email,
      duration,
    });

    const response: LoginResponse = {
      success: true,
      message: "Login successful",
      token,
      user: authUser,
    };

    // Return response without setting cookies - client will store token in localStorage
    return NextResponse.json(response);
  }
);
