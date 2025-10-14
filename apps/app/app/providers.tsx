"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { useState } from "react";
import { AnalyticsProvider } from "@workspace/analytics/src/provider";
import { ClerkProvider } from "@workspace/auth/client";
import { WebVitals } from "@workspace/observability/client";

export function Providers({ children }: { children: React.ReactNode }) {
  // Create a client instance per request
  // This ensures each user gets their own QueryClient
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Stale time: how long data is considered fresh (5 minutes)
            staleTime: 1000 * 60 * 5,
            // Cache time: how long unused data stays in cache (10 minutes)
            gcTime: 1000 * 60 * 10,
            // Retry failed requests 1 time
            retry: 1,
            // Refetch on window focus
            refetchOnWindowFocus: true,
          },
        },
      })
  );

  return (
    <ClerkProvider>
      <QueryClientProvider client={queryClient}>
        <AnalyticsProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <WebVitals />
            {children}
          </ThemeProvider>
        </AnalyticsProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}
