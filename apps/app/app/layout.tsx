import "@workspace/ui/globals.css";
import { ClerkProvider } from "@workspace/auth/client";
import { Providers } from "@/components/providers";
import { Toaster } from "sonner";

export const metadata = {
  title: "Orion Kit",
  description: "Dashboard for Orion Kit",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className="min-h-screen bg-background font-sans antialiased">
          <Providers>{children}</Providers>
          <Toaster richColors position="top-right" />
        </body>
      </html>
    </ClerkProvider>
  );
}
