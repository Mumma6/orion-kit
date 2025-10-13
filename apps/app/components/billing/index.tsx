/**
 * Billing Content Component
 * Main billing page with subscription management
 */

"use client";

import { useState } from "react";
import { CreditCard } from "lucide-react";
import { PLANS } from "@workspace/payment/config";
import {
  useSubscription,
  useCheckout,
  useBillingPortal,
} from "@/hooks/use-billing";
import { BillingLoading } from "./billing-loading";
import { BillingError } from "./billing-error";
import { CurrentPlanCard } from "./current-plan-card";
import { PricingCards } from "./pricing-cards";

export function BillingContent() {
  const {
    data: subscriptionData,
    isLoading,
    error,
    refetch,
  } = useSubscription();
  const checkout = useCheckout();
  const billingPortal = useBillingPortal();
  const [selectedPriceId, setSelectedPriceId] = useState<string | null>(null);

  console.log("subscriptionData", subscriptionData);
  console.log("PLANS", PLANS);
  console.log("selectedPriceId", selectedPriceId);
  console.log("checkout.isPending", checkout.isPending);
  console.log("billingPortal.isPending", billingPortal.isPending);

  console.log("error", error);
  console.log("isLoading", isLoading);

  const handleUpgrade = async (priceId: string) => {
    setSelectedPriceId(priceId);
    await checkout.mutateAsync(priceId);
  };

  const handleManageBilling = async () => {
    await billingPortal.mutateAsync();
  };

  if (isLoading) {
    return <BillingLoading />;
  }

  if (error) {
    return <BillingError error={error} onRetry={refetch} />;
  }

  const currentPlan = subscriptionData?.plan || "free";
  const subscription = subscriptionData?.subscription;

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="rounded-2xl bg-primary p-3">
          <CreditCard className="h-8 w-8 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Billing</h1>
          <p className="text-muted-foreground">
            Manage your subscription and billing settings
          </p>
        </div>
      </div>

      {/* Current Plan */}
      <CurrentPlanCard
        currentPlan={currentPlan}
        subscription={subscription}
        onManageBilling={handleManageBilling}
        loading={billingPortal.isPending}
      />

      {/* Pricing Cards */}
      <div>
        <h2 className="mb-4 text-2xl font-bold">Available Plans</h2>
        <PricingCards
          plans={PLANS}
          currentPlan={currentPlan}
          onUpgrade={handleUpgrade}
          loading={checkout.isPending}
          selectedPriceId={selectedPriceId}
        />
      </div>
    </div>
  );
}
