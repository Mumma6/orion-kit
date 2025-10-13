/**
 * Billing & Payment Response Types
 * Composed from generic API responses and payment domain types
 */

import type {
  CheckoutSession,
  SubscriptionData,
  PortalSession,
} from "@workspace/payment";
import type { ApiSuccessResponse } from "./api";

// Billing response types
export type CreateCheckoutSessionResponse = ApiSuccessResponse<CheckoutSession>;
export type SubscriptionResponse = ApiSuccessResponse<SubscriptionData>;
export type CreatePortalSessionResponse = ApiSuccessResponse<PortalSession>;
