/**
 * Pricing Cards Component
 * Display all available pricing plans
 */

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
import { Check, Loader2 } from "lucide-react";
import type { PricingPlan } from "@workspace/payment";

interface PricingCardsProps {
  readonly plans: readonly PricingPlan[];
  readonly currentPlan: string;
  readonly onUpgrade: (priceId: string) => void | Promise<void>;
  readonly loading: boolean;
  readonly selectedPriceId: string | null;
}

export function PricingCards({
  plans,
  currentPlan,
  onUpgrade,
  loading,
  selectedPriceId,
}: PricingCardsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {plans.map((plan) => {
        const isCurrent = currentPlan === plan.id;
        const isLoading = loading && selectedPriceId === plan.priceId;

        return (
          <Card
            key={plan.id}
            className={`relative ${
              plan.popular
                ? "border-primary shadow-lg ring-2 ring-primary/20"
                : ""
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge variant="default">Most Popular</Badge>
              </div>
            )}

            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Price */}
              <div>
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="ml-2 text-muted-foreground">/month</span>
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Action Button */}
              {isCurrent ? (
                <Button variant="outline" className="w-full" disabled>
                  Current Plan
                </Button>
              ) : plan.price === 0 ? (
                <Button variant="outline" className="w-full">
                  Downgrade to Free
                </Button>
              ) : (
                <Button
                  variant={plan.popular ? "default" : "outline"}
                  className="w-full"
                  onClick={() => plan.priceId && onUpgrade(plan.priceId)}
                  disabled={isLoading || !plan.priceId}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    `Upgrade to ${plan.name}`
                  )}
                </Button>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
