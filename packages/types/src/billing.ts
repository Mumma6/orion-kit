import type {
  CheckoutSession,
  SubscriptionData,
  PortalSession,
} from "@workspace/payment";
import type { ApiResponse } from "./api";

export type { CheckoutSession, SubscriptionData, PortalSession };

export type CreateCheckoutSessionResponse = ApiResponse<CheckoutSession>;
export type SubscriptionResponse = ApiResponse<SubscriptionData>;
export type CreatePortalSessionResponse = ApiResponse<PortalSession>;
