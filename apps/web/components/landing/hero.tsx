import { Button } from "@workspace/ui/components/button";
import { Github, Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Subtle glow - only in dark mode, very minimal */}
      <div className="absolute inset-0 hidden items-center justify-center opacity-40 dark:flex">
        <div className="h-[600px] w-[600px] rounded-full bg-primary/30 blur-3xl" />
      </div>

      {/* Tiny stars - only in dark mode */}
      <div className="absolute inset-0 hidden opacity-20 dark:block">
        <div className="absolute top-20 left-[10%] h-0.5 w-0.5 rounded-full bg-white" />
        <div className="absolute top-40 left-[20%] h-0.5 w-0.5 rounded-full bg-white" />
        <div className="absolute top-32 right-[15%] h-0.5 w-0.5 rounded-full bg-white" />
        <div className="absolute top-60 right-[25%] h-0.5 w-0.5 rounded-full bg-white" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border bg-muted px-4 py-2 text-sm">
            <Sparkles className="h-4 w-4" />
            <span>Open Source SaaS Boilerplate</span>
          </div>

          <h1 className="mb-6 text-balance font-bold tracking-tight">
            <span className="block font-mono text-6xl sm:text-6xl lg:text-7xl">
              Orion Kit
            </span>
            <span className="mt-4 block text-2xl sm:text-3xl font-medium text-muted-foreground">
              Build SaaS faster — production‑ready, type‑safe, and beautiful
              from day one
            </span>
          </h1>

          <p className="mb-10 text-lg leading-relaxed text-muted-foreground sm:text-xl">
            An open‑source boilerplate for TypeScript and Next.js with
            authentication, payments, background jobs, and deployment ready out
            of the box.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg">Get Started</Button>
            <Button size="lg" variant="outline" className="gap-2">
              <Github className="h-5 w-5" />
              View on GitHub
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
