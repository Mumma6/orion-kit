"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { CheckCircle2, Calendar, Loader2 } from "lucide-react";
import { getPlanById } from "@workspace/payment/config";
import type { StripeSubscription } from "@workspace/payment";

interface CurrentPlanCardProps {
  readonly currentPlan: string;
  readonly subscription: StripeSubscription | null | undefined;
  readonly onManageBilling: () => void;
  readonly loading: boolean;
}

export function CurrentPlanCard({
  currentPlan,
  subscription,
  onManageBilling,
  loading,
}: CurrentPlanCardProps) {
  const plan = getPlanById(currentPlan);

  if (!plan) {
    return null;
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              Current Plan
            </CardTitle>
            <CardDescription>Your active subscription</CardDescription>
          </div>
          {subscription && (
            <Button
              variant="outline"
              size="sm"
              onClick={onManageBilling}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                "Manage Billing"
              )}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-start justify-between">
          <div className="space-y-4">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <h3 className="text-2xl font-bold">{plan.name}</h3>
                {plan.popular && <Badge variant="default">Popular</Badge>}
              </div>
              <p className="text-3xl font-bold">
                ${plan.price}
                <span className="text-base font-normal text-muted-foreground">
                  /month
                </span>
              </p>
            </div>

            {subscription && subscription.status === "active" && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>
                  {subscription.cancelAtPeriodEnd
                    ? `Cancels on ${formatDate(subscription.currentPeriodEnd)}`
                    : `Renews on ${formatDate(subscription.currentPeriodEnd)}`}
                </span>
              </div>
            )}

            {subscription?.status && subscription.status !== "active" && (
              <div className="text-sm">
                <Badge
                  variant={
                    subscription.status === "trialing"
                      ? "default"
                      : "destructive"
                  }
                >
                  {subscription.status}
                </Badge>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
