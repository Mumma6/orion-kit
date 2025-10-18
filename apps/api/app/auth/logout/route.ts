import { NextRequest, NextResponse } from "next/server";
import type { LogoutResponse, ApiErrorResponse } from "@workspace/types";
import { withAxiom, logger } from "@workspace/observability";

export const POST = withAxiom(
  async (
    req: NextRequest
  ): Promise<NextResponse<LogoutResponse | ApiErrorResponse>> => {
    const startTime = Date.now();

    const duration = Date.now() - startTime;
    logger.info("User logged out", {
      duration,
    });

    const responseData: LogoutResponse = {
      success: true,
      data: { loggedOut: true },
      message: "Logged out successfully",
    };

    const response = NextResponse.json(responseData);

    // Clear the auth cookie for cross-origin requests
    response.cookies.set("auth", "", {
      httpOnly: true,
      sameSite: "none", // Required for cross-origin cookies
      secure: true, // Required when sameSite is "none"
      path: "/",
      maxAge: 0, // Expire immediately
    });

    return response;
  }
);
