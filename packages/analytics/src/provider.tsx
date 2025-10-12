import { Analytics as VercelAnalytics } from "@vercel/analytics/react";

import { useEffect } from "react";

import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY || "";
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || "";

if (!POSTHOG_KEY || !POSTHOG_HOST) {
  throw new Error(
    "NEXT_PUBLIC_POSTHOG_KEY and NEXT_PUBLIC_POSTHOG_HOST must be set"
  );
}

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      person_profiles: "always",
      defaults: "2025-05-24",
    });
  }, []);

  return (
    <PostHogProvider client={posthog}>
      {children}
      <VercelAnalytics />
    </PostHogProvider>
  );
}
