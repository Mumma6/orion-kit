import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";

export default function HeroSection() {
  return (
    <section className="relative px-6 pt-16 pb-20">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-24 -z-10 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,theme(colors.sky.400)/0.08_0%,transparent_65%)] blur-3xl dark:bg-[radial-gradient(ellipse_at_center,theme(colors.amber.400)/0.15_0%,transparent_65%)]" />
      </div>

      <div className="mx-auto max-w-3xl text-center">
        <div className="mb-6 flex items-center justify-center gap-3">
          <Badge
            variant="outline"
            className="border-sky-400/40 text-sky-700 dark:border-amber-400/40 dark:text-amber-200"
          >
            MIT Open Source
          </Badge>
          <Badge
            variant="outline"
            className="border-sky-400/40 text-sky-700 dark:border-amber-400/40 dark:text-amber-200"
          >
            Type-Safe
          </Badge>
        </div>

        <h1 className="mb-4 text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
          <span className="bg-gradient-to-r from-sky-300 to-blue-200 dark:from-amber-300 dark:to-yellow-400 bg-clip-text text-transparent">
            Orion Kit
          </span>
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-muted-foreground text-lg">
          A modern, type-safe SaaS starter for serious developers.
        </p>

        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <Button
            size="lg"
            className="bg-foreground text-background hover:bg-foreground/90"
          >
            Get Started
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-sky-400/50 text-sky-700 hover:bg-sky-500/10 dark:border-amber-400/40 dark:text-amber-200 dark:hover:bg-amber-500/10"
          >
            View GitHub
          </Button>
        </div>
      </div>
    </section>
  );
}
