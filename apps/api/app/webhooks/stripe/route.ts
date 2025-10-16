import { db, userPreferences, eq } from "@workspace/database";
import {
  verifyWebhookSignature,
  handleWebhookEvent,
  type WebhookDatabaseAdapter,
} from "@workspace/payment/webhooks";
import { logger } from "@workspace/observability/server";
import { NextResponse } from "next/server";
import type { ApiResponse, ApiErrorResponse } from "@workspace/types";

export const runtime = "nodejs";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

if (!webhookSecret) {
  throw new Error("STRIPE_WEBHOOK_SECRET is not defined");
}

const dbAdapter: WebhookDatabaseAdapter = {
  updateUserSubscription: async (data) => {
    const existing = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, data.userId))
      .limit(1);

    if (existing.length === 0) {
      await db.insert(userPreferences).values({
        userId: data.userId,
        plan: data.plan,
        stripeCustomerId: data.stripeCustomerId,
        stripeSubscriptionId: data.stripeSubscriptionId,
        stripeSubscriptionStatus: data.stripeSubscriptionStatus,
        stripePriceId: data.stripePriceId,
        stripeCurrentPeriodEnd: data.stripeCurrentPeriodEnd,
      });

      logger.info("User preferences created with subscription", {
        userId: data.userId,
        plan: data.plan,
        status: data.stripeSubscriptionStatus,
      });
    } else {
      await db
        .update(userPreferences)
        .set({
          plan: data.plan,
          stripeCustomerId: data.stripeCustomerId,
          stripeSubscriptionId: data.stripeSubscriptionId,
          stripeSubscriptionStatus: data.stripeSubscriptionStatus,
          stripePriceId: data.stripePriceId,
          stripeCurrentPeriodEnd: data.stripeCurrentPeriodEnd,
          updatedAt: new Date(),
        })
        .where(eq(userPreferences.userId, data.userId));

      logger.info("Subscription updated in database", {
        userId: data.userId,
        plan: data.plan,
        status: data.stripeSubscriptionStatus,
      });
    }
  },

  cancelUserSubscription: async (userId) => {
    await db
      .update(userPreferences)
      .set({
        plan: "free",
        stripeSubscriptionStatus: "canceled",
        updatedAt: new Date(),
      })
      .where(eq(userPreferences.userId, userId));

    logger.info("Subscription canceled in database", { userId });
  },
};

export async function POST(req: Request) {
  const startTime = Date.now();

  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      logger.warn("Missing stripe-signature header");
      const errorResponse: ApiErrorResponse = {
        success: false,
        error: "Missing signature",
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const event = verifyWebhookSignature(body, signature, webhookSecret);

    logger.info("Stripe webhook received", {
      eventId: event.id,
      eventType: event.type,
    });

    await handleWebhookEvent(event, dbAdapter);

    const duration = Date.now() - startTime;
    logger.info("Webhook processed successfully", {
      eventId: event.id,
      eventType: event.type,
      duration,
    });

    const response: ApiResponse<{ received: boolean }> = {
      success: true,
      data: { received: true },
      message: "Webhook processed successfully",
    };

    return NextResponse.json(response);
  } catch (error) {
    const duration = Date.now() - startTime;
    logger.error("Webhook processing failed", {
      error: error as Error,
      duration,
    });

    const errorResponse: ApiErrorResponse = {
      success: false,
      error: "Webhook handler failed",
      details: error instanceof Error ? error.message : "Unknown error",
    };

    return NextResponse.json(errorResponse, { status: 400 });
  }
}
