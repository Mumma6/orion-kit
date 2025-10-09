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
    description: "End-to-end type safety across your entire application stack.",
  },
  {
    emoji: "🎨",
    title: "TailwindCSS v4",
    description: "Modern design tokens and utility-first CSS framework.",
  },
  {
    emoji: "🧩",
    title: "Shadcn/UI",
    description: "Reusable component system with copy-paste components.",
  },
  {
    emoji: "🗄️",
    title: "Drizzle ORM",
    description: "Type-safe SQL for Postgres with excellent DX.",
  },
  {
    emoji: "☁️",
    title: "Neon",
    description: "Serverless Postgres database with instant scaling.",
  },
  {
    emoji: "🔐",
    title: "Clerk",
    description: "Authentication & organizations with beautiful UI.",
  },
  {
    emoji: "💳",
    title: "Stripe",
    description: "Payments & subscriptions with webhooks and billing.",
  },
  {
    emoji: "⚡",
    title: "Trigger.dev",
    description: "Background jobs & automation with TypeScript.",
  },
  {
    emoji: "▲",
    title: "Vercel",
    description: "Deployment & edge runtime with zero config.",
  },
  {
    emoji: "📊",
    title: "Posthog",
    description: "Product analytics with feature flags & funnels.",
  },
  {
    emoji: "🚨",
    title: "Sentry",
    description: "Monitoring & error tracking for production apps.",
  },
  {
    emoji: "📧",
    title: "Resend",
    description: "Transactional emails with React components.",
  },
  {
    emoji: "🔌",
    title: "Serverless APIs",
    description: "Built-in via Next.js routes with type safety.",
  },
  {
    emoji: "🤖",
    title: "AI-Ready",
    description: "Foundation for easy LLM integrations later.",
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
              <CardHeader className="pb-2">
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
