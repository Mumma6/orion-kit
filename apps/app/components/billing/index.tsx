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
import { PricingCard } from "@workspace/payment/client";
import { WebhookStatus } from "./webhook-status";

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
  const [showWebhookWarning, setShowWebhookWarning] = useState(true);

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

  const currentPlan = subscriptionData?.data.plan ?? "free";
  const subscription = subscriptionData?.data.subscription;

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {showWebhookWarning && process.env.NODE_ENV === "development" && (
        <WebhookStatus onDismiss={() => setShowWebhookWarning(false)} />
      )}

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

      <CurrentPlanCard
        currentPlan={currentPlan}
        subscription={subscription}
        onManageBilling={handleManageBilling}
        loading={billingPortal.isPending}
      />

      <div>
        <h2 className="mb-4 text-2xl font-bold">Available Plans</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {PLANS.map((plan) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              current={currentPlan === plan.id}
              onSelect={plan.priceId ? handleUpgrade : undefined}
              loading={checkout.isPending && selectedPriceId === plan.priceId}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
