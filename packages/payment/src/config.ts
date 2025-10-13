export interface PricingPlan {
  readonly id: "free" | "pro" | "enterprise";
  readonly name: string;
  readonly description: string;
  readonly price: number;
  readonly priceId?: string;
  readonly features: readonly string[];
  readonly popular?: boolean;
  readonly maxTasks: number;
  readonly maxUsers: number;
}

export const PLANS: readonly PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    description: "Perfect for getting started",
    price: 0,
    maxTasks: 10,
    maxUsers: 1,
    features: [
      "Up to 10 tasks",
      "Basic analytics",
      "Community support",
      "Mobile app access",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    description: "For professionals and small teams",
    price: 19,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO,
    maxTasks: -1,
    maxUsers: 5,
    popular: true,
    features: [
      "Unlimited tasks",
      "Advanced analytics",
      "Priority support",
      "Custom integrations",
      "API access",
      "Team collaboration (up to 5 users)",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "For large organizations",
    price: 99,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_ENTERPRISE,
    maxTasks: -1,
    maxUsers: -1,
    features: [
      "Everything in Pro",
      "Unlimited team members",
      "Advanced security",
      "SLA guarantee",
      "Dedicated account manager",
      "Custom contract",
      "SSO (SAML)",
    ],
  },
] as const;

export const getPlanById = (planId: string): PricingPlan | undefined => {
  return PLANS.find((plan) => plan.id === planId);
};

export const getPlanByPriceId = (priceId: string): PricingPlan | undefined => {
  return PLANS.find((plan) => plan.priceId === priceId);
};

export const isFreePlan = (planId: string): boolean => {
  return planId === "free";
};

export const canUpgrade = (
  currentPlan: string,
  targetPlan: string
): boolean => {
  const plans = ["free", "pro", "enterprise"];
  const currentIndex = plans.indexOf(currentPlan);
  const targetIndex = plans.indexOf(targetPlan);
  return targetIndex > currentIndex;
};
