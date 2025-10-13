---
title: Observability Package
description: Logging with Axiom
---

# @workspace/observability

Structured logging, error tracking, and Web Vitals monitoring with **Axiom**.

## Setup

```bash
# Get token from axiom.co
# Add to apps/api/.env.local
AXIOM_TOKEN=xaat-...
AXIOM_DATASET=orion-logs
```

## Usage

**API routes:**

```typescript
import { withAxiom, logger } from "@workspace/observability";

export const GET = withAxiom(async (req) => {
  logger.info("Fetching data", { userId, count: 10 });
  // Auto-logs request/response + duration
  return NextResponse.json({ data });
});
```

**Client-side performance:**

```typescript
import { WebVitals } from "@workspace/observability/client";

// In app/layout.tsx
<WebVitals /> // Tracks LCP, FID, CLS, TTFB
```

## Structured Logging

```typescript
// ✅ Good - structured
logger.info("Task created", { userId, taskId, status });

// ❌ Bad - unstructured
logger.info(`User ${userId} created task ${taskId}`);
```

**Levels:** `debug`, `info`, `warn`, `error`

## Axiom Queries

View logs at [axiom.co](https://axiom.co):

```apl
['orion-logs']
| where level == "error"
| where _time > ago(1h)
```

**Set up alerts** for high error rates or slow requests.

[Axiom docs](https://axiom.co/docs) · [Web Vitals](https://web.dev/vitals)
