import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";

interface Tech {
  emoji: string;
  title: string;
  description: string;
}

const techStack: Tech[] = [
  {
    emoji: "⚛️",
    title: "Next.js 15",
    description:
      "App Router, React 19 & Server Actions for modern full-stack development.",
  },
  {
    emoji: "🔷",
    title: "TypeScript",
    description: "End-to-end type safety with strict mode across entire stack.",
  },
  {
    emoji: "🎨",
    title: "TailwindCSS v4",
    description: "Modern design tokens and utility-first CSS framework.",
  },
  {
    emoji: "🧩",
    title: "Shadcn/UI",
    description: "Beautiful, accessible components built with Radix UI.",
  },
  {
    emoji: "🗄️",
    title: "Drizzle ORM",
    description: "Type-safe SQL with automatic type inference from schema.",
  },
  {
    emoji: "☁️",
    title: "Neon",
    description: "Serverless Postgres with instant scaling and branching.",
  },
  {
    emoji: "🔐",
    title: "JWT Auth",
    description:
      "Custom authentication system with httpOnly cookies and zero vendor lock-in.",
  },
  {
    emoji: "💳",
    title: "Stripe",
    description: "Payment processing for subscriptions and payments.",
  },
  {
    emoji: "✅",
    title: "Zod",
    description: "Runtime validation and type inference for forms & APIs.",
  },
  {
    emoji: "🔄",
    title: "TanStack Query",
    description: "Powerful data fetching, caching, and state management.",
  },
  {
    emoji: "📝",
    title: "React Hook Form",
    description: "Performant forms with Zod resolvers for validation.",
  },
  {
    emoji: "📦",
    title: "Shared Types",
    description: "Centralized types package for consistency across apps.",
  },
  {
    emoji: "⚡",
    title: "Trigger.dev",
    description: "Background jobs & scheduled tasks with TypeScript.",
  },
  {
    emoji: "🎯",
    title: "Playwright",
    description: "End-to-end testing with Playwright.",
  },
  {
    emoji: "🧪",
    title: "Vitest",
    description: "Fast unit testing with modern test runner.",
  },
  {
    emoji: "📊",
    title: "PostHog",
    description: "Product analytics with event tracking and insights.",
  },
  {
    emoji: "📈",
    title: "Axiom",
    description: "Structured logging and observability for production.",
  },
  {
    emoji: "▲",
    title: "Vercel",
    description: "Zero-config deployment with edge runtime support.",
  },
  {
    emoji: "🏗️",
    title: "Turborepo",
    description: "High-performance monorepo build system.",
  },
  {
    emoji: "📚",
    title: "Astro Starlight",
    description: "Fast, accessible documentation site with search.",
  },
  {
    emoji: "🐶",
    title: "Husky",
    description: "Git hooks for linting and formatting.",
  },
];

export function TechStack() {
  return (
    <section className="relative px-6 pt-12 pb-24 lg:pt-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {techStack.map((tech) => (
            <Card
              key={tech.title}
              className="group relative overflow-hidden border-border/60 bg-card/70 backdrop-blur-sm transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10"
            >
              <CardHeader className="pb-0 mb-0">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
                    <span className="text-lg">{tech.emoji}</span>
                  </div>
                  <CardTitle className="text-sm font-semibold">
                    {tech.title}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="leading-relaxed text-xs text-muted-foreground">
                  {tech.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
