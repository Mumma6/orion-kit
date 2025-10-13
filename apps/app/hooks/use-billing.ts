import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getSubscription,
  createCheckout,
  cancelSubscription,
  createBillingPortal,
} from "@/lib/api/billing";
import type { SubscriptionResponse } from "@workspace/types";
import { showSuccessToast, showErrorToast } from "@/lib/errors";

export const billingKeys = {
  all: ["billing"] as const,
  subscription: () => [...billingKeys.all, "subscription"] as const,
};

export function useSubscription() {
  return useQuery<SubscriptionResponse>({
    queryKey: billingKeys.subscription(),
    queryFn: getSubscription,
  });
}

export function useCheckout() {
  return useMutation({
    mutationFn: (priceId: string) => createCheckout(priceId),
    onSuccess: (response) => {
      window.location.href = response.data.url;
    },
    onError: (error) => {
      showErrorToast(error, "Failed to start checkout");
    },
  });
}

export function useCancelSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelSubscription,
    onSuccess: () => {
      showSuccessToast(
        "Subscription canceled",
        "Your subscription will end at the end of the billing period"
      );

      queryClient.invalidateQueries({ queryKey: billingKeys.subscription() });
    },
    onError: (error) => {
      showErrorToast(error, "Failed to cancel subscription");
    },
  });
}

export function useBillingPortal() {
  return useMutation({
    mutationFn: createBillingPortal,
    onSuccess: (response) => {
      window.location.href = response.data.url;
    },
    onError: (error: Error & { code?: string }) => {
      const errorCode = error?.code;
      const errorMessage = error?.message || "Failed to open billing portal";

      if (errorCode === "NO_PREFERENCES") {
        showErrorToast(new Error(errorMessage), "Account Setup Required");
      } else if (errorCode === "NO_STRIPE_CUSTOMER") {
        showErrorToast(
          new Error("Please subscribe to a plan first to manage your billing."),
          "No Active Subscription"
        );
      } else if (errorCode === "PORTAL_NOT_ACTIVATED") {
        showErrorToast(
          new Error(
            "Billing portal is not available yet. Please contact support."
          ),
          "Portal Not Available"
        );
      } else {
        showErrorToast(error, "Failed to open billing portal");
      }
    },
  });
}
