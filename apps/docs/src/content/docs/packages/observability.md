---
title: Observability Package
description: Structured logging and monitoring with Axiom
---

# @workspace/observability

Comprehensive observability package for structured logging, monitoring, and performance tracking using Axiom.

## Features

- ✅ **Axiom Integration** - Structured logging to Axiom cloud
- ✅ **Request Logging** - Automatic HTTP request/response logging
- ✅ **Error Tracking** - Automatic error capture with stack traces
- ✅ **Web Vitals** - Client-side performance monitoring
- ✅ **Type-safe** - Full TypeScript support
- ✅ **Edge Runtime** - Works with Next.js edge functions

## Installation

This package is already included in the workspace. To use it in your app:

```json
{
  "dependencies": {
    "@workspace/observability": "workspace:*"
  }
}
```

## Environment Variables

Add to your `.env.local` file:

```bash
AXIOM_TOKEN=xaat-...
AXIOM_DATASET=orion-logs
```

Get your token from [Axiom Dashboard → Settings → API Tokens](https://axiom.co/settings).

## Usage

### Server-Side Logging (API Routes)

```typescript
import { withAxiom, logger } from "@workspace/observability";

export const GET = withAxiom(async (req) => {
  const startTime = Date.now();

  try {
    // Your logic here
    const data = await fetchData();

    const duration = Date.now() - startTime;
    logger.info("Data fetched successfully", {
      userId,
      count: data.length,
      duration,
    });

    return NextResponse.json({ data });
  } catch (error) {
    logger.error("Failed to fetch data", error as Error);
    throw error;
  }
});
```

### Client-Side Performance (Web Vitals)

```typescript
import { WebVitals } from "@workspace/observability/client";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <WebVitals />
      {children}
    </>
  );
}
```

### Middleware Logging

```typescript
import { transformMiddlewareRequest } from "@axiomhq/nextjs";
import { logger } from "@workspace/observability/server";

export default async function middleware(req: NextRequest) {
  logger.info(...transformMiddlewareRequest(req));

  const response = NextResponse.next();

  // Ensure logs are sent
  event.waitUntil(logger.flush());

  return response;
}
```

## API Reference

### Server (`@workspace/observability/server`)

#### `withAxiom(handler)`

Wraps your API route handler with Axiom logging:

```typescript
export const GET = withAxiom(async (req) => {
  // Your handler code
});
```

Features:

- Automatic request logging
- Error capture
- Performance metrics
- Request/response metadata

#### `logger`

Logger instance for structured logging:

```typescript
logger.info(message, context);
logger.warn(message, context);
logger.error(message, error);
logger.debug(message, context);
```

**Parameters:**

- `message: string` - Log message
- `context?: object` - Additional context data
- `error?: Error` - Error object (for error logs)

**Example:**

```typescript
logger.info("User signed in", {
  userId: "user_123",
  email: "user@example.com",
  timestamp: new Date().toISOString(),
});

logger.error("Database query failed", error as Error);
```

### Client (`@workspace/observability/client`)

#### `<WebVitals />`

Component that tracks Core Web Vitals:

```typescript
import { WebVitals } from "@workspace/observability/client";

<WebVitals />
```

Tracks:

- Largest Contentful Paint (LCP)
- First Input Delay (FID)
- Cumulative Layout Shift (CLS)
- Time to First Byte (TTFB)
- First Contentful Paint (FCP)

## Log Levels

Axiom supports different log levels:

| Level   | Purpose               | Example                     |
| ------- | --------------------- | --------------------------- |
| `debug` | Development debugging | Detailed variable values    |
| `info`  | General information   | User actions, API calls     |
| `warn`  | Warning messages      | Deprecated API usage        |
| `error` | Error conditions      | Failed requests, exceptions |
| `fatal` | Critical errors       | System failures             |

## Structured Logging

Always include relevant context:

```typescript
// ✅ Good - structured and searchable
logger.info("Task created", {
  userId: "user_123",
  taskId: 456,
  status: "todo",
  duration: 123,
});

// ❌ Bad - unstructured string
logger.info(`User user_123 created task 456 with status todo in 123ms`);
```

## Viewing Logs

### Axiom Dashboard

1. Go to [Axiom Dashboard](https://axiom.co)
2. Select your dataset (e.g., `orion-logs`)
3. Use APL (Axiom Processing Language) to query logs

### Example Queries

**All errors in last hour:**

```apl
['orion-logs']
| where level == "error"
| where _time > ago(1h)
```

**Slow API requests:**

```apl
['orion-logs']
| where duration > 1000
| project _time, method, path, duration, userId
```

**User activity:**

```apl
['orion-logs']
| where userId == "user_123"
| where _time > ago(24h)
| project _time, message, context
```

## Performance Monitoring

### API Request Metrics

The `withAxiom` wrapper automatically logs:

```typescript
{
  method: "GET",
  path: "/api/tasks",
  statusCode: 200,
  duration: 145,  // milliseconds
  userId: "user_123",
  timestamp: "2025-10-12T10:30:00.000Z"
}
```

### Web Vitals Tracking

Client-side metrics are automatically sent:

```typescript
{
  metric: "LCP",
  value: 1234.5,
  rating: "good",  // good | needs-improvement | poor
  url: "/dashboard",
  userId: "user_123"
}
```

## Best Practices

### 1. Log Important Operations

```typescript
// ✅ Good - track business logic
logger.info("Task created", { userId, taskId });
logger.info("User preferences updated", { userId, changes });

// ❌ Bad - too verbose
logger.debug("Entering function");
logger.debug("Exiting function");
```

### 2. Include Context

```typescript
// ✅ Good - rich context
logger.error("Payment failed", error as Error, {
  userId,
  amount,
  currency,
  paymentMethod,
});

// ❌ Bad - missing context
logger.error("Payment failed");
```

### 3. Use Appropriate Log Levels

```typescript
logger.debug("Cache hit"); // Development only
logger.info("User signed in"); // Normal operations
logger.warn("API rate limit near"); // Potential issues
logger.error("Database timeout"); // Actual errors
```

### 4. Don't Log Sensitive Data

```typescript
// ❌ Bad - logs passwords
logger.info("User logged in", {
  email: user.email,
  password: user.password, // Never log passwords!
});

// ✅ Good - safe logging
logger.info("User logged in", {
  userId: user.id,
  email: user.email,
});
```

## Monitoring & Alerts

### Set Up Alerts in Axiom

1. Go to Axiom Dashboard → **Monitors**
2. Create a new monitor
3. Set query (e.g., `level == "error"`)
4. Configure notifications (email, Slack, PagerDuty)

### Example Alert Queries

**High Error Rate:**

```apl
['orion-logs']
| where level == "error"
| where _time > ago(5m)
| summarize count() by bin(_time, 1m)
| where count_ > 10
```

**Slow Requests:**

```apl
['orion-logs']
| where duration > 5000
| summarize count() by path
```

## Troubleshooting

### Logs Not Appearing

1. Verify `AXIOM_TOKEN` and `AXIOM_DATASET` are set
2. Check token has "Ingest" permission
3. Ensure `logger.flush()` is called (automatic with `withAxiom`)
4. Wait 10-30 seconds for logs to appear

### Performance Impact

Minimal overhead:

- Async logging (non-blocking)
- Batched requests
- Edge runtime compatible
- < 5ms average latency

### Testing Locally

Logs are sent even in development:

```bash
pnpm --filter api dev
curl http://localhost:3002/health
```

Check Axiom dashboard for the request log.

## Examples

### API Route with Full Logging

```typescript
import { auth } from "@workspace/auth/server";
import { db, tasks } from "@workspace/database";
import { withAxiom, logger } from "@workspace/observability";
import { NextResponse } from "next/server";

export const GET = withAxiom(async (req) => {
  const startTime = Date.now();

  try {
    const { userId } = await auth();

    if (!userId) {
      logger.warn("Unauthorized access to GET /tasks");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userTasks = await db
      .select()
      .from(tasks)
      .where(eq(tasks.clerkUserId, userId));

    const duration = Date.now() - startTime;
    logger.info("Tasks fetched", {
      userId,
      tasksCount: userTasks.length,
      duration,
    });

    return NextResponse.json({ tasks: userTasks });
  } catch (error) {
    logger.error("Failed to fetch tasks", error as Error);
    throw error;
  }
});
```

## Data Retention

Free tier: 30 days  
Paid plans: Up to 2 years

Configure in Axiom Dashboard → Dataset Settings.

## Learn More

- [Axiom Documentation](https://axiom.co/docs)
- [PostHog Documentation](https://posthog.com/docs)
- [Vercel Analytics Documentation](https://vercel.com/docs/analytics)
- [Web Vitals Guide](https://web.dev/vitals/)
