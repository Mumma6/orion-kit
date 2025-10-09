import Image from "next/image";

export function Showcase() {
  return (
    <section className="relative px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="relative mx-auto max-w-5xl">
          {/* Browser mockup */}
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-cyan-500/20 via-violet-600/10 to-transparent shadow-lg shadow-violet-500/10">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 border-b border-border bg-card/50 px-4 py-3 backdrop-blur-sm">
              <div className="flex gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500/50" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/50" />
                <div className="h-3 w-3 rounded-full bg-green-500/50" />
              </div>
              <div className="ml-4 flex-1 rounded bg-muted/50 px-3 py-1 text-xs text-muted-foreground">
                orion-kit-saas.vercel.app
              </div>
            </div>

            {/* Content */}
            <div className="flex h-full items-center justify-center p-8">
              <div className="relative h-full w-full">
                <Image
                  src="/assets/undraw_counting-stars_onv6.svg"
                  alt="Dashboard Preview"
                  fill
                  sizes="(max-width: 1024px) 100vw, 80vw"
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mt-12 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            A realistic SaaS foundation
          </h2>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Built with modern patterns and best practices. Orion Kit gives you a
            solid foundation with authentication, payments, database, and
            analytics—so you can focus on building your unique features instead
            of reinventing the wheel.
          </p>
        </div>
      </div>
    </section>
  );
}
