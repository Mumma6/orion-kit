import { db, userPreferences, eq } from "@workspace/database";
import { createBillingPortalSession } from "@workspace/payment/server";
import type {
  CreatePortalSessionResponse,
  ApiErrorResponse,
} from "@workspace/types";
import { withAxiom, logger } from "@workspace/observability";
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@workspace/auth/server";

export const POST = withAxiom(
  async (
    req
  ): Promise<NextResponse<CreatePortalSessionResponse | ApiErrorResponse>> => {
    const startTime = Date.now();

    const user = await getCurrentUser(req);

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    const userId = user.id;

    const preferences = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, userId))
      .limit(1);

    const userPref = preferences[0];

    if (!userPref) {
      logger.warn("User preferences not found", { userId });
      return NextResponse.json(
        {
          success: false,
          error: "User preferences not found. Please contact support.",
          code: "NO_PREFERENCES",
        },
        { status: 404 }
      );
    }

    if (!userPref.stripeCustomerId) {
      logger.warn("No Stripe customer ID found", { userId });
      return NextResponse.json(
        {
          success: false,
          error:
            "No active subscription found. Please subscribe to a plan first.",
          code: "NO_STRIPE_CUSTOMER",
        },
        { status: 400 }
      );
    }

    const session = await createBillingPortalSession(userPref.stripeCustomerId);

    const duration = Date.now() - startTime;
    logger.info("Billing portal session created", {
      userId,
      customerId: userPref.stripeCustomerId,
      duration,
    });

    const response: CreatePortalSessionResponse = {
      success: true,
      data: {
        url: session.url,
      },
    };

    return NextResponse.json(response);
  }
);
