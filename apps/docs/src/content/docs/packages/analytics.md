---
title: Analytics Package
description: PostHog and Vercel Analytics
---

# @workspace/analytics

Product analytics with **PostHog** (events, funnels, feature flags) and **Vercel Analytics** (performance).

## Setup

```bash
# Get key from posthog.com
# Add to apps/web/.env.local and apps/app/.env.local
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

## Usage

```typescript
import { AnalyticsProvider } from "@workspace/analytics/src/provider";

// Wrap app
<AnalyticsProvider>{children}</AnalyticsProvider>
```

**Auto-tracks:** Page views, clicks, form submissions, session recordings, Web Vitals

**Custom events:**

```typescript
import posthog from "posthog-js";

posthog.capture("task_created", { taskId, status });
posthog.identify(userId, { email, name });
```

**Dashboard:** [posthog.com](https://posthog.com) for events, Vercel Analytics tab for performance

[PostHog docs](https://posthog.com/docs) · [Vercel Analytics](https://vercel.com/docs/analytics)
