"use client";

import type { PricingPlan } from "./config";

export interface PricingCardProps {
  readonly plan: PricingPlan;
  readonly current?: boolean;
  readonly onSelect?: (priceId: string) => void | Promise<void>;
  readonly loading?: boolean;
}

export function PricingCard({
  plan,
  current = false,
  onSelect,
  loading = false,
}: PricingCardProps) {
  const handleClick = () => {
    if (onSelect && plan.priceId) {
      onSelect(plan.priceId);
    }
  };

  return (
    <div
      className={`relative rounded-lg border p-8 ${
        plan.popular
          ? "border-primary shadow-lg ring-2 ring-primary/20"
          : "border-border"
      }`}
    >
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
            Most Popular
          </span>
        </div>
      )}

      <div className="mb-4">
        <h3 className="text-2xl font-bold">{plan.name}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
      </div>

      <div className="mb-6">
        <div className="flex items-baseline">
          <span className="text-4xl font-bold">${plan.price}</span>
          <span className="ml-2 text-muted-foreground">/month</span>
        </div>
      </div>

      <ul className="mb-6 space-y-3">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2">
            <svg
              className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="text-sm">{feature}</span>
          </li>
        ))}
      </ul>

      {current ? (
        <button
          disabled
          className="w-full rounded-md bg-muted px-4 py-2 text-sm font-medium text-muted-foreground cursor-not-allowed"
        >
          Current Plan
        </button>
      ) : (
        <button
          onClick={handleClick}
          disabled={loading || !plan.priceId}
          className={`w-full rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            plan.popular
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {loading
            ? "Loading..."
            : plan.price === 0
              ? "Get Started"
              : "Upgrade to " + plan.name}
        </button>
      )}
    </div>
  );
}

export interface SubscriptionBadgeProps {
  readonly status: string;
}

export function SubscriptionBadge({ status }: SubscriptionBadgeProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "trialing":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "past_due":
      case "unpaid":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "canceled":
      case "incomplete_expired":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Active";
      case "trialing":
        return "Trial";
      case "past_due":
        return "Past Due";
      case "canceled":
        return "Canceled";
      case "incomplete":
        return "Incomplete";
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getStatusColor(status)}`}
    >
      {getStatusLabel(status)}
    </span>
  );
}
