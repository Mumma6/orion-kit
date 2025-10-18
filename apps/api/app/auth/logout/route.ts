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

    // Return response without clearing cookies - client will clear localStorage
    return NextResponse.json(responseData);
  }
);
