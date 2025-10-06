import { Github, Sparkles, Shield, Layers, BookOpen } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Card } from "@workspace/ui/components/card";
import ShowcaseSection from "./landing/showcase-section";
import FeaturesSection from "./landing/features-section";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-white to-slate-50 text-foreground dark:from-slate-950 dark:via-slate-950 dark:to-black">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Cosmic glow effect */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-[600px] w-[600px] rounded-full bg-gradient-to-r from-violet-600/20 via-purple-600/20 to-cyan-600/20 blur-3xl" />
        </div>

        {/* Subtle stars */}
        <div className="absolute inset-0 opacity-20 dark:opacity-30">
          <div className="absolute top-20 left-[10%] h-1 w-1 rounded-full bg-slate-300 dark:bg-white" />
          <div className="absolute top-40 left-[20%] h-0.5 w-0.5 rounded-full bg-slate-300 dark:bg-white" />
          <div className="absolute top-32 right-[15%] h-1 w-1 rounded-full bg-slate-300 dark:bg-white" />
          <div className="absolute top-60 right-[25%] h-0.5 w-0.5 rounded-full bg-slate-300 dark:bg-white" />
          <div className="absolute bottom-40 left-[30%] h-0.5 w-0.5 rounded-full bg-slate-300 dark:bg-white" />
          <div className="absolute bottom-60 right-[20%] h-1 w-1 rounded-full bg-slate-300 dark:bg-white" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-sm text-violet-700 dark:text-violet-300">
              <Sparkles className="h-4 w-4" />
              <span>Open Source SaaS Boilerplate</span>
            </div>

            <h1 className="mb-6 text-balance font-bold tracking-tight">
              <span className="block font-mono text-6xl sm:text-6xl lg:text-7xl text-violet-600 dark:text-violet-400">
                Orion Kit
              </span>
              <span className="mt-4 block text-2xl sm:text-3xl font-medium text-foreground">
                Build SaaS faster — production‑ready, type‑safe, and beautiful
                from day one
              </span>
            </h1>

            <p className="mb-10 text-lg leading-relaxed text-muted-foreground sm:text-xl">
              An open‑source boilerplate for TypeScript and Next.js with
              authentication, payments, background jobs, and deployment ready
              out of the box.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                className="bg-gradient-to-r from-violet-600 to-cyan-600 text-white hover:from-violet-700 hover:to-cyan-700"
              >
                Get Started
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="gap-2 border-muted-foreground/20 hover:border-muted-foreground/40 bg-transparent"
              >
                <Github className="h-5 w-5" />
                View on GitHub
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Built With Section */}
      <FeaturesSection />

      {/* Demo Preview Section */}
      <ShowcaseSection />

      {/* Features Section */}
      <section className="relative py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="border-border/50 bg-card/50 p-8 backdrop-blur-sm">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600/20 to-cyan-600/20">
                <Shield className="h-6 w-6 text-violet-400" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-pretty">
                Type-Safe Everything
              </h3>
              <p className="leading-relaxed text-muted-foreground">
                End-to-end type safety with TypeScript, Drizzle ORM, and tRPC
                for bulletproof code.
              </p>
            </Card>

            <Card className="border-border/50 bg-card/50 p-8 backdrop-blur-sm">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600/20 to-cyan-600/20">
                <Sparkles className="h-6 w-6 text-cyan-400" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-pretty">
                Production Ready Setup
              </h3>
              <p className="leading-relaxed text-muted-foreground">
                Authentication, payments, background jobs, and deployment
                configured out of the box.
              </p>
            </Card>

            <Card className="border-border/50 bg-card/50 p-8 backdrop-blur-sm">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600/20 to-cyan-600/20">
                <Layers className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-pretty">
                Shared Design System
              </h3>
              <p className="leading-relaxed text-muted-foreground">
                Beautiful UI components built with Tailwind CSS and shadcn/ui
                for consistent design.
              </p>
            </Card>

            <Card className="border-border/50 bg-card/50 p-8 backdrop-blur-sm">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600/20 to-cyan-600/20">
                <BookOpen className="h-6 w-6 text-violet-400" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-pretty">
                Learn by Example
              </h3>
              <p className="leading-relaxed text-muted-foreground">
                Real-world examples with teams and tasks to understand patterns
                and best practices.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-24">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-[400px] w-[800px] rounded-full bg-gradient-to-r from-violet-600/10 via-purple-600/10 to-cyan-600/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-3xl px-6 text-center lg:px-8">
          <h2 className="mb-6 text-4xl font-bold tracking-tight text-balance sm:text-5xl">
            Focus on your idea — Orion Kit handles the rest
          </h2>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="bg-gradient-to-r from-violet-600 to-cyan-600 text-white hover:from-violet-700 hover:to-cyan-700"
            >
              Get Started
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="gap-2 border-muted-foreground/20 hover:border-muted-foreground/40 bg-transparent"
            >
              <Github className="h-5 w-5" />
              View on GitHub
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-border/50 py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-muted-foreground">
              © 2025 Orion Kit. Open source under MIT License.
            </p>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">
                Docs
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                GitHub
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                License
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
