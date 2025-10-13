import { auth } from "@workspace/auth/server";
import { db, userPreferences, eq } from "@workspace/database";
import { createBillingPortalSession } from "@workspace/payment/server";
import { withAxiom, logger } from "@workspace/observability";
import { NextResponse } from "next/server";

export const POST = withAxiom(async () => {
  const startTime = Date.now();

  try {
    const { userId } = await auth();

    if (!userId) {
      logger.warn("Unauthorized access to POST /billing-portal");
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const preferences = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.clerkUserId, userId))
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

    return NextResponse.json({
      success: true,
      url: session.url,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    const duration = Date.now() - startTime;

    logger.error("Failed to create billing portal session", {
      error: error as Error,
      duration,
    });

    if (errorMessage.includes("customer portal")) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Stripe Customer Portal is not activated. Please enable it in your Stripe Dashboard.",
          code: "PORTAL_NOT_ACTIVATED",
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create billing portal session. Please try again.",
        code: "PORTAL_ERROR",
      },
      { status: 500 }
    );
  }
});
