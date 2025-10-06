import "@workspace/ui/globals.css";

export const metadata = {
  title: "App",
  description: "Minimal Next app in Turborepo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
