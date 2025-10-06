import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import Image from "next/image";

export default function FeaturesSection() {
  return (
    <section className="relative px-6 pt-12 pb-24 lg:pt-8">
      {/* Decorative illustrations removed for a calmer, minimal look */}
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            What you get
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Boilerplate foundation and a minimal demo product to showcase the
            flow.
          </p>
        </div>

        {/* Demo product essentials */}
        <div className="mb-10 grid gap-2 sm:grid-cols-3">
          <Card className="border-border/60 bg-card/70 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className="text-xl leading-none">👤</div>
                <CardTitle className="text-sm font-semibold">
                  Accounts
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-xs text-muted-foreground">
                Auth, profiles, settings. Ready to extend.
              </CardDescription>
            </CardContent>
          </Card>
          <Card className="border-border/60 bg-card/70 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className="text-xl leading-none">👥</div>
                <CardTitle className="text-sm font-semibold">Teams</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-xs text-muted-foreground">
                Team membership, roles, invites.
              </CardDescription>
            </CardContent>
          </Card>
          <Card className="border-border/60 bg-card/70 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className="text-xl leading-none">✅</div>
                <CardTitle className="text-sm font-semibold">Tasks</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-xs text-muted-foreground">
                Basic CRUD with comments and status.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <Card className="group relative overflow-hidden border-border/60 bg-card/70 backdrop-blur-sm transition-all hover:border-violet-400/50 dark:hover:border-cyan-400/50 hover:shadow-lg hover:shadow-violet-400/10 dark:hover:shadow-cyan-400/10">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-violet-500/10 to-cyan-500/10">
                  <span className="text-lg">⚛️</span>
                </div>
                <CardTitle className="text-sm font-semibold">
                  Next.js 15
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="leading-relaxed text-xs text-muted-foreground">
                App Router, React 19 & Server Actions for modern full-stack
                development.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden border-border/60 bg-card/70 backdrop-blur-sm transition-all hover:border-violet-400/50 dark:hover:border-cyan-400/50 hover:shadow-lg hover:shadow-violet-400/10 dark:hover:shadow-cyan-400/10">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-violet-500/10 to-cyan-500/10">
                  <span className="text-lg">🔷</span>
                </div>
                <CardTitle className="text-sm font-semibold">
                  TypeScript
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="leading-relaxed text-xs text-muted-foreground">
                End-to-end type safety across your entire application stack.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden border-border/60 bg-card/70 backdrop-blur-sm transition-all hover:border-violet-400/50 dark:hover:border-cyan-400/50 hover:shadow-lg hover:shadow-violet-400/10 dark:hover:shadow-cyan-400/10">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-violet-500/10 to-cyan-500/10">
                  <span className="text-lg">🎨</span>
                </div>
                <CardTitle className="text-sm font-semibold">
                  TailwindCSS v4
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="leading-relaxed text-xs text-muted-foreground">
                Modern design tokens and utility-first CSS framework.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden border-border/60 bg-card/70 backdrop-blur-sm transition-all hover:border-violet-400/50 dark:hover:border-cyan-400/50 hover:shadow-lg hover:shadow-violet-400/10 dark:hover:shadow-cyan-400/10">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-violet-500/10 to-cyan-500/10">
                  <span className="text-lg">🧩</span>
                </div>
                <CardTitle className="text-sm font-semibold">
                  Shadcn/UI
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="leading-relaxed text-xs text-muted-foreground">
                Reusable component system with copy-paste components.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden border-border/60 bg-card/70 backdrop-blur-sm transition-all hover:border-violet-400/50 dark:hover:border-cyan-400/50 hover:shadow-lg hover:shadow-violet-400/10 dark:hover:shadow-cyan-400/10">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-violet-500/10 to-cyan-500/10">
                  <span className="text-lg">🗄️</span>
                </div>
                <CardTitle className="text-sm font-semibold">
                  Drizzle ORM
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="leading-relaxed text-xs text-muted-foreground">
                Type-safe SQL for Postgres with excellent DX.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden border-border/60 bg-card/70 backdrop-blur-sm transition-all hover:border-violet-400/50 dark:hover:border-cyan-400/50 hover:shadow-lg hover:shadow-violet-400/10 dark:hover:shadow-cyan-400/10">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-violet-500/10 to-cyan-500/10">
                  <span className="text-lg">☁️</span>
                </div>
                <CardTitle className="text-sm font-semibold">Neon</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="leading-relaxed text-xs text-muted-foreground">
                Serverless Postgres database with instant scaling.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden border-border/60 bg-card/70 backdrop-blur-sm transition-all hover:border-violet-400/50 dark:hover:border-cyan-400/50 hover:shadow-lg hover:shadow-violet-400/10 dark:hover:shadow-cyan-400/10">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-violet-500/10 to-cyan-500/10">
                  <span className="text-lg">🔐</span>
                </div>
                <CardTitle className="text-sm font-semibold">Clerk</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="leading-relaxed text-xs text-muted-foreground">
                Authentication & organizations with beautiful UI.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden border-border/60 bg-card/70 backdrop-blur-sm transition-all hover:border-violet-400/50 dark:hover:border-cyan-400/50 hover:shadow-lg hover:shadow-violet-400/10 dark:hover:shadow-cyan-400/10">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-violet-500/10 to-cyan-500/10">
                  <span className="text-lg">💳</span>
                </div>
                <CardTitle className="text-sm font-semibold">Stripe</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="leading-relaxed text-xs text-muted-foreground">
                Payments & subscriptions with webhooks and billing.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden border-border/60 bg-card/70 backdrop-blur-sm transition-all hover:border-violet-400/50 dark:hover:border-cyan-400/50 hover:shadow-lg hover:shadow-violet-400/10 dark:hover:shadow-cyan-400/10">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-violet-500/10 to-cyan-500/10">
                  <span className="text-lg">⚡</span>
                </div>
                <CardTitle className="text-sm font-semibold">
                  Trigger.dev
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="leading-relaxed text-xs text-muted-foreground">
                Background jobs & automation with TypeScript.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden border-border/60 bg-card/70 backdrop-blur-sm transition-all hover:border-violet-400/50 dark:hover:border-cyan-400/50 hover:shadow-lg hover:shadow-violet-400/10 dark:hover:shadow-cyan-400/10">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-violet-500/10 to-cyan-500/10">
                  <span className="text-lg">▲</span>
                </div>
                <CardTitle className="text-sm font-semibold">Vercel</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="leading-relaxed text-xs text-muted-foreground">
                Deployment & edge runtime with zero config.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden border-border/60 bg-card/70 backdrop-blur-sm transition-all hover:border-violet-400/50 dark:hover:border-cyan-400/50 hover:shadow-lg hover:shadow-violet-400/10 dark:hover:shadow-cyan-400/10">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-violet-500/10 to-cyan-500/10">
                  <span className="text-lg">📊</span>
                </div>
                <CardTitle className="text-sm font-semibold">Posthog</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="leading-relaxed text-xs text-muted-foreground">
                Product analytics with feature flags & funnels.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden border-border/60 bg-card/70 backdrop-blur-sm transition-all hover:border-violet-400/50 dark:hover:border-cyan-400/50 hover:shadow-lg hover:shadow-violet-400/10 dark:hover:shadow-cyan-400/10">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-violet-500/10 to-cyan-500/10">
                  <span className="text-lg">🚨</span>
                </div>
                <CardTitle className="text-sm font-semibold">Sentry</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="leading-relaxed text-xs text-muted-foreground">
                Monitoring & error tracking for production apps.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden border-border/60 bg-card/70 backdrop-blur-sm transition-all hover:border-violet-400/50 dark:hover:border-cyan-400/50 hover:shadow-lg hover:shadow-violet-400/10 dark:hover:shadow-cyan-400/10">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-violet-500/10 to-cyan-500/10">
                  <span className="text-lg">📧</span>
                </div>
                <CardTitle className="text-sm font-semibold">Resend</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="leading-relaxed text-xs text-muted-foreground">
                Transactional emails with React components.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden border-border/60 bg-card/70 backdrop-blur-sm transition-all hover:border-violet-400/50 dark:hover:border-cyan-400/50 hover:shadow-lg hover:shadow-violet-400/10 dark:hover:shadow-cyan-400/10">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-violet-500/10 to-cyan-500/10">
                  <span className="text-lg">🔌</span>
                </div>
                <CardTitle className="text-sm font-semibold">
                  Serverless APIs
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="leading-relaxed text-xs text-muted-foreground">
                Built-in via Next.js routes with type safety.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden border-border/60 bg-card/70 backdrop-blur-sm transition-all hover:border-violet-400/50 dark:hover:border-cyan-400/50 hover:shadow-lg hover:shadow-violet-400/10 dark:hover:shadow-cyan-400/10">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-violet-500/10 to-cyan-500/10">
                  <span className="text-lg">🤖</span>
                </div>
                <CardTitle className="text-sm font-semibold">
                  AI-Ready
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="leading-relaxed text-xs text-muted-foreground">
                Foundation for easy LLM integrations later.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
