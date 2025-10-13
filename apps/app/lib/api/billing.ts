import { api } from "./client";
import type {
  CreateCheckoutSessionResponse,
  SubscriptionResponse,
  CreatePortalSessionResponse,
  ApiSuccessResponse,
} from "@workspace/types";

export async function getSubscription(): Promise<SubscriptionResponse> {
  return api.get<SubscriptionResponse>("/subscription");
}

export async function createCheckout(
  priceId: string
): Promise<CreateCheckoutSessionResponse> {
  return api.post<CreateCheckoutSessionResponse>("/checkout", { priceId });
}

export async function cancelSubscription(): Promise<ApiSuccessResponse<never>> {
  return api.delete<ApiSuccessResponse<never>>("/subscription");
}

export async function createBillingPortal(): Promise<CreatePortalSessionResponse> {
  return api.post<CreatePortalSessionResponse>("/billing-portal");
}
