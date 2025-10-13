import { Button } from "@workspace/ui/components/button";
import { Github } from "lucide-react";

export function CTA() {
  return (
    <section className="relative py-24">
      <div className="absolute inset-0 hidden items-center justify-center opacity-30 dark:flex">
        <div className="h-[400px] w-[800px] rounded-full bg-primary/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-3xl px-6 text-center lg:px-8">
        <h2 className="mb-6 text-4xl font-bold tracking-tight text-balance sm:text-5xl">
          Focus on your idea — Orion Kit handles the rest
        </h2>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button size="lg">Get Started</Button>
          <Button size="lg" variant="outline" className="gap-2">
            <Github className="h-5 w-5" />
            View on GitHub
          </Button>
        </div>
      </div>
    </section>
  );
}
