---
title: Analytics Package
description: Product analytics with PostHog and Vercel Analytics
---

# @workspace/analytics

Product analytics package integrating PostHog and Vercel Analytics for comprehensive user insights.

## Features

- ✅ **PostHog** - Event tracking, funnels, feature flags
- ✅ **Vercel Analytics** - Performance monitoring and web vitals
- ✅ **Type-safe** - TypeScript support throughout
- ✅ **Privacy-focused** - GDPR compliant
- ✅ **Easy integration** - Single provider component

## Installation

This package is already included in the workspace. To use it in your app:

```json
{
  "dependencies": {
    "@workspace/analytics": "workspace:*"
  }
}
```

## Environment Variables

Add to your `.env.local` file:

```bash
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

Get your keys from:

- PostHog: [posthog.com/settings/project](https://posthog.com/settings/project)
- Vercel Analytics: Automatically enabled on Vercel

## Usage

### 1. Wrap your app with AnalyticsProvider

```typescript
import { AnalyticsProvider } from "@workspace/analytics/src/provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AnalyticsProvider>
      {children}
    </AnalyticsProvider>
  );
}
```

### 2. Track Events (PostHog)

PostHog automatically tracks:

- Page views
- Button clicks
- Form submissions
- Session recordings

### 3. Monitor Performance (Vercel Analytics)

Vercel Analytics automatically tracks:

- Core Web Vitals
- Page load times
- Route changes
- Real user metrics

## Features

### PostHog Capabilities

**Event Tracking**

- Automatic page view tracking
- Custom event tracking
- User identification
- Session recordings

**Analytics**

- Funnels and conversion rates
- User cohorts
- Retention analysis
- Path analysis

**Feature Flags**

- A/B testing
- Gradual rollouts
- User targeting

**Insights**

- Dashboards
- Custom queries
- Trends and patterns

### Vercel Analytics

**Performance Metrics**

- Largest Contentful Paint (LCP)
- First Input Delay (FID)
- Cumulative Layout Shift (CLS)
- Time to First Byte (TTFB)

**Visitor Analytics**

- Unique visitors
- Page views
- Bounce rate
- Geographic data

## Configuration

### PostHog Options

The provider initializes PostHog with:

```typescript
posthog.init(POSTHOG_KEY, {
  api_host: POSTHOG_HOST,
  person_profiles: "always",
  defaults: "2025-05-24",
});
```

Customize in `packages/analytics/src/provider.tsx`.

## Custom Event Tracking

To track custom events:

```typescript
import posthog from "posthog-js";

// Track custom event
posthog.capture("button_clicked", {
  button_name: "Sign Up",
  location: "navbar",
});

// Identify user
posthog.identify(userId, {
  email: user.email,
  name: user.name,
});
```

## Privacy & GDPR

PostHog is GDPR compliant by default:

- User data stored in EU or US (configurable)
- Cookie consent integration available
- Data deletion on request
- No personal data required

To disable tracking for a user:

```typescript
posthog.opt_out_capturing();
```

## Dashboard Views

### PostHog Dashboard

1. Go to [PostHog Dashboard](https://posthog.com)
2. View real-time events
3. Create insights and funnels
4. Set up feature flags

### Vercel Analytics

1. Go to your Vercel project
2. Click **Analytics** tab
3. View visitor stats and performance metrics

## Best Practices

### 1. Track Meaningful Events

```typescript
// ✅ Good - specific and actionable
posthog.capture("task_created", {
  task_status: "todo",
  has_due_date: false,
});

// ❌ Bad - too generic
posthog.capture("button_click");
```

### 2. Identify Users

```typescript
// After authentication
const { user } = useUser();

useEffect(() => {
  if (user) {
    posthog.identify(user.id, {
      email: user.primaryEmailAddress?.emailAddress,
      name: user.fullName,
    });
  }
}, [user]);
```

### 3. Respect User Privacy

- Only track necessary data
- Provide opt-out options
- Don't track sensitive information
- Follow GDPR/privacy regulations

## Troubleshooting

### Events Not Appearing

1. Check browser console for errors
2. Verify environment variables are set
3. Wait 5-10 seconds for events to sync
4. Check ad blockers aren't blocking PostHog

### Performance Impact

PostHog and Vercel Analytics are lightweight:

- < 30KB gzipped
- Async loading
- No blocking requests
- Minimal performance impact

## Learn More

- [PostHog Documentation](https://posthog.com/docs)
- [Vercel Analytics Documentation](https://vercel.com/docs/analytics)
- [PostHog Feature Flags](https://posthog.com/docs/feature-flags)
- [Web Vitals](https://web.dev/vitals/)
