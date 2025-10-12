"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { AnalyticsProvider } from "@workspace/analytics/src/provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AnalyticsProvider>
      <NextThemesProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        enableColorScheme
      >
        {children}
      </NextThemesProvider>
    </AnalyticsProvider>
  );
}
