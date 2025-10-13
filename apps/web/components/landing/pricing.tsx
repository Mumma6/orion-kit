import { Button } from "@workspace/ui/components/button";
import { Card } from "@workspace/ui/components/card";
import { Check } from "lucide-react";
import Link from "next/link";

interface PricingPlan {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly price: number;
  readonly features: readonly string[];
  readonly popular?: boolean;
}

const plans: readonly PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    description: "Perfect for getting started",
    price: 0,
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
];

export function Pricing() {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Choose the plan that fits your needs. All plans include 14-day free
            trial.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative flex flex-col p-8 ${
                plan.popular
                  ? "border-primary shadow-lg ring-2 ring-primary/20"
                  : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Plan Header */}
              <div className="mb-6">
                <h3 className="text-2xl font-bold">{plan.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {plan.description}
                </p>
              </div>

              {/* Price */}
              <div className="mb-8">
                <div className="flex items-baseline">
                  <span className="text-5xl font-bold">${plan.price}</span>
                  <span className="ml-2 text-muted-foreground">/month</span>
                </div>
              </div>

              {/* Features */}
              <ul className="mb-8 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <Link href="http://localhost:3001/sign-up">
                <Button
                  variant={plan.popular ? "default" : "outline"}
                  className="w-full"
                  size="lg"
                >
                  {plan.price === 0 ? "Get Started" : "Start Free Trial"}
                </Button>
              </Link>
            </Card>
          ))}
        </div>

        {/* FAQ or Additional Info */}
        <div className="mx-auto mt-16 max-w-2xl text-center">
          <p className="text-sm text-muted-foreground">
            All plans include 14-day free trial. No credit card required. Cancel
            anytime.
          </p>
        </div>
      </div>
    </section>
  );
}
