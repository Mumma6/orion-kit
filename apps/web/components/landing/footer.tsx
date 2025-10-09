export function Footer() {
  const links = [
    { label: "Docs", href: "#" },
    { label: "GitHub", href: "#" },
    { label: "License", href: "#" },
  ];

  return (
    <footer className="relative border-t border-border/50 py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © 2025 Orion Kit. Open source under MIT License.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
