import { Button } from "@workspace/ui/components/button";
import Image from "next/image";

export default function FinalCtaSection() {
  return (
    <section className="relative px-6 py-24">
      {/* Subtle stars background */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-40 [mask-image:radial-gradient(60%_60%_at_50%_50%,black,transparent)]">
        <Image
          src="/assets/undraw_counting-stars_onv6.svg"
          alt="Stars"
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto my-16 h-px w-2/3 bg-gradient-to-r from-transparent via-violet-600/30 to-transparent" />

        <div className="text-center">
          <h2 className="mb-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            Build with quiet confidence
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-muted-foreground text-lg">
            Start from a sane foundation. Orion Kit is minimal, type-safe, and
            practical.
          </p>
          <div className="flex items-center justify-center gap-3">
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
      </div>
    </section>
  );
}
