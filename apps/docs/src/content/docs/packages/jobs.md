---
title: Jobs Package
description: Background jobs with Trigger.dev
---

# @workspace/jobs

Background job processing with **Trigger.dev**: scheduled tasks, retries, monitoring.

## Setup

```bash
# Get API key from trigger.dev
# Add to packages/jobs/.env
TRIGGER_API_KEY=tr_dev_...

# Start dev server
pnpm --filter jobs dev
```

## Structure

```
packages/jobs/trigger/
├── example.ts   # Example job
└── schedule.ts  # Cron jobs
```

## Define Jobs

**One-time task:**

```typescript
import { task } from "@trigger.dev/sdk/v3";

export const sendEmail = task({
  id: "send-email",
  run: async (payload: { email: string; subject: string }) => {
    // Send email logic
    return { success: true };
  },
});
```

**Scheduled task:**

```typescript
import { schedules } from "@trigger.dev/sdk/v3";

export const dailyCleanup = schedules.task({
  id: "daily-cleanup",
  cron: "0 2 * * *", // 2 AM daily
  run: async () => {
    // Cleanup logic
  },
});
```

**Cron patterns:** [crontab.guru](https://crontab.guru)

## Trigger Jobs

```typescript
import { sendEmail } from "@workspace/jobs/trigger/send-email";

const handle = await sendEmail.trigger({
  email: "user@example.com",
  subject: "Welcome!",
});
```

## Best Practices

- ✅ Make jobs idempotent (safe to run multiple times)
- ✅ Keep jobs focused (single responsibility)
- ✅ Log execution details
- ✅ Add retry logic for unreliable operations

**Pricing:** Free 100k runs/mo, then $29/mo for 1M runs

[Trigger.dev docs](https://trigger.dev/docs)
