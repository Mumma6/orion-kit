/**
 * Billing Domain
 * Combines: Payment package types + API responses
 */

import type {
  CheckoutSession,
  SubscriptionData,
  PortalSession,
} from "@workspace/payment";
import type { ApiResponse } from "./api";

// ============================================
// DOMAIN TYPES (from payment package)
// ============================================
export type { CheckoutSession, SubscriptionData, PortalSession };

// ============================================
// API RESPONSE TYPES (composed with generics)
// ============================================
export type CreateCheckoutSessionResponse = ApiResponse<CheckoutSession>;
export type SubscriptionResponse = ApiResponse<SubscriptionData>;
export type CreatePortalSessionResponse = ApiResponse<PortalSession>;
