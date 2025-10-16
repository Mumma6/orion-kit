import { db, userPreferences, eq } from "@workspace/database";
import { getSubscription, cancelSubscription } from "@workspace/payment/server";
import type { SubscriptionResponse, ApiErrorResponse } from "@workspace/types";
import { withAxiom, logger } from "@workspace/observability";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@workspace/auth/server";

export const GET = withAxiom(async (req) => {
  const startTime = Date.now();

  try {
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

    if (!userPref?.stripeSubscriptionId) {
      const duration = Date.now() - startTime;
      logger.info("User has no subscription", { userId, duration });

      const response: SubscriptionResponse = {
        success: true,
        data: {
          subscription: null,
          plan: "free",
        },
      };

      return NextResponse.json(response);
    }

    const subscription = await getSubscription(userPref.stripeSubscriptionId);

    if (!subscription) {
      const response: SubscriptionResponse = {
        success: true,
        data: {
          subscription: null,
          plan: userPref.plan || "free",
        },
      };

      return NextResponse.json(response);
    }

    const duration = Date.now() - startTime;
    logger.info("Subscription fetched", {
      userId,
      subscriptionId: subscription.id,
      plan: subscription.plan,
      duration,
    });

    const response: SubscriptionResponse = {
      success: true,
      data: {
        subscription,
        plan: subscription.plan,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    logger.error("Failed to fetch subscription", error as Error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch subscription" },
      { status: 500 }
    );
  }
});

export const DELETE = withAxiom(async (req) => {
  const startTime = Date.now();

  try {
    const user = await getCurrentUser(req);

    if (!user) {
      logger.warn("Unauthorized access to DELETE /subscription");
      const errorResponse: ApiErrorResponse = {
        success: false,
        error: "Unauthorized",
      };
      return NextResponse.json(errorResponse, { status: 401 });
    }

    const userId = user.id;

    const preferences = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, userId))
      .limit(1);

    const userPref = preferences[0];

    if (!userPref?.stripeSubscriptionId) {
      return NextResponse.json(
        { success: false, error: "No active subscription" },
        { status: 400 }
      );
    }

    await cancelSubscription(userPref.stripeSubscriptionId);

    await db
      .update(userPreferences)
      .set({
        stripeSubscriptionStatus: "canceled",
        updatedAt: new Date(),
      })
      .where(eq(userPreferences.userId, userId));

    const duration = Date.now() - startTime;
    logger.info("Subscription canceled", {
      userId,
      subscriptionId: userPref.stripeSubscriptionId,
      duration,
    });

    return NextResponse.json({
      success: true,
      message: "Subscription canceled successfully",
    });
  } catch (error) {
    logger.error("Failed to cancel subscription", error as Error);
    return NextResponse.json(
      { success: false, error: "Failed to cancel subscription" },
      { status: 500 }
    );
  }
});
