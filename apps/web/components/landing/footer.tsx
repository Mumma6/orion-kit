export default function LandingFooter() {
  return (
    <footer className="relative border-t border-border px-6 py-12">
      <div className="mx-auto max-w-7xl text-center">
        <p className="mb-4 text-sm text-muted-foreground">
          © 2025 Orion Kit. Minimal, open-source SaaS boilerplate.
        </p>
        <div className="flex flex-wrap justify-center gap-6 text-sm">
          <a
            href="#"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Docs
          </a>
          <a
            href="#"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            GitHub
          </a>
          <a
            href="#"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Demo
          </a>
        </div>
      </div>
    </footer>
  );
}
