import { Card } from "@workspace/ui/components/card";
import {
  Shield,
  Sparkles,
  Layers,
  BookOpen,
  type LucideIcon,
} from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: Shield,
    title: "Type-Safe Everything",
    description:
      "End-to-end type safety with TypeScript, Drizzle ORM, and tRPC for bulletproof code.",
  },
  {
    icon: Sparkles,
    title: "Production Ready Setup",
    description:
      "Authentication, payments, background jobs, and deployment configured out of the box.",
  },
  {
    icon: Layers,
    title: "Shared Design System",
    description:
      "Beautiful UI components built with Tailwind CSS and shadcn/ui for consistent design.",
  },
  {
    icon: BookOpen,
    title: "Learn by Example",
    description:
      "Real-world examples with teams and tasks to understand patterns and best practices.",
  },
];

export function Features() {
  return (
    <section className="relative bg-muted/30 py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Card key={feature.title} className="p-8">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-pretty">
                {feature.title}
              </h3>
              <p className="leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
