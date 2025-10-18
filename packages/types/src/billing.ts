import { z } from "zod";
import type { ApiResponse } from "./api";

export const createCheckoutSessionInputSchema = z.object({
  priceId: z.string().min(1, "Price ID is required"),
  successUrl: z.string().url().optional(),
  cancelUrl: z.string().url().optional(),
});

export type CreateCheckoutSessionInput = z.infer<
  typeof createCheckoutSessionInputSchema
>;

export type {
  CheckoutSession,
  SubscriptionData,
  PortalSession,
  StripeSubscription,
  PricingPlan,
} from "@workspace/payment";

export {
  PLANS,
  getPlanById,
  getPlanByPriceId,
  isFreePlan,
  canUpgrade,
} from "@workspace/payment/config";

export type CreateCheckoutSessionResponse = ApiResponse<{
  url: string;
  sessionId: string;
}>;
export type SubscriptionResponse = ApiResponse<{
  subscription: any | null;
  plan: string;
}>;
export type CreatePortalSessionResponse = ApiResponse<{
  url: string;
}>;
export type DeleteSubscriptionResponse = ApiResponse<{
  deleted: boolean;
}>;
