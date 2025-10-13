import { auth, currentUser } from "@workspace/auth/server";
import { createCheckoutSession } from "@workspace/payment/server";
import { createCheckoutSessionInputSchema } from "@workspace/payment";
import type { CreateCheckoutSessionResponse } from "@workspace/types";
import { withAxiom, logger } from "@workspace/observability";
import { NextResponse } from "next/server";
import { validationErrorResponse } from "@/lib/validation";

export const POST = withAxiom(async (req) => {
  const startTime = Date.now();

  try {
    const { userId } = await auth();

    if (!userId) {
      logger.warn("Unauthorized access to POST /checkout");
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await currentUser();
    const userEmail = user?.emailAddresses[0]?.emailAddress;

    if (!userEmail) {
      return NextResponse.json(
        { success: false, error: "User email not found" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const validation = createCheckoutSessionInputSchema.safeParse(body);

    if (!validation.success) {
      return validationErrorResponse(validation.error.issues);
    }

    const { priceId, successUrl, cancelUrl } = validation.data;

    const session = await createCheckoutSession(userId, userEmail, priceId, {
      successUrl,
      cancelUrl,
    });

    const duration = Date.now() - startTime;
    logger.info("Checkout session created", {
      userId,
      priceId,
      sessionId: session.id,
      duration,
    });

    const response: CreateCheckoutSessionResponse = {
      success: true,
      data: {
        url: session.url ?? "",
        sessionId: session.id,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    logger.error("Failed to create checkout session", error as Error);
    return NextResponse.json(
      { success: false, error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
});
