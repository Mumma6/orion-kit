import { createCheckoutSession } from "@workspace/payment/server";
import { createCheckoutSessionInputSchema } from "@workspace/types";
import type {
  CreateCheckoutSessionResponse,
  ApiErrorResponse,
} from "@workspace/types";
import { withAxiom, logger } from "@workspace/observability";
import { NextResponse } from "next/server";
import { validationErrorResponse } from "@/lib/validation";
import { getCurrentUser } from "@workspace/auth/server";

export const POST = withAxiom(async (req) => {
  const startTime = Date.now();

  try {
    const user = await getCurrentUser(req);

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validation = createCheckoutSessionInputSchema.safeParse(body);

    if (!validation.success) {
      return validationErrorResponse(validation.error.issues);
    }

    const { priceId, successUrl, cancelUrl } = validation.data;

    const session = await createCheckoutSession(user.id, user.email, priceId, {
      successUrl,
      cancelUrl,
    });

    const duration = Date.now() - startTime;
    logger.info("Checkout session created", {
      userId: user.id,
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
