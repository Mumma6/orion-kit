import { auth } from "@workspace/auth/server";
import { db, userPreferences, eq } from "@workspace/database";
import { getSubscription, cancelSubscription } from "@workspace/payment/server";
import { withAxiom, logger } from "@workspace/observability";
import { NextResponse } from "next/server";

export const GET = withAxiom(async () => {
  const startTime = Date.now();

  try {
    const { userId } = await auth();

    if (!userId) {
      logger.warn("Unauthorized access to GET /subscription");
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

    if (!userPref?.stripeSubscriptionId) {
      const duration = Date.now() - startTime;
      logger.info("User has no subscription", { userId, duration });

      return NextResponse.json({
        success: true,
        subscription: null,
        plan: "free",
      });
    }

    const subscription = await getSubscription(userPref.stripeSubscriptionId);

    if (!subscription) {
      return NextResponse.json({
        success: true,
        subscription: null,
        plan: userPref.plan || "free",
      });
    }

    const duration = Date.now() - startTime;
    logger.info("Subscription fetched", {
      userId,
      subscriptionId: subscription.id,
      plan: subscription.plan,
      duration,
    });

    return NextResponse.json({
      success: true,
      subscription,
      plan: subscription.plan,
    });
  } catch (error) {
    logger.error("Failed to fetch subscription", error as Error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch subscription" },
      { status: 500 }
    );
  }
});

export const DELETE = withAxiom(async () => {
  const startTime = Date.now();

  try {
    const { userId } = await auth();

    if (!userId) {
      logger.warn("Unauthorized access to DELETE /subscription");
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
      .where(eq(userPreferences.clerkUserId, userId));

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
