---
title: Jobs Package
description: Background jobs with Trigger.dev
---

Background job processing with **Trigger.dev v3**: scheduled tasks, retries, monitoring, and real-time execution tracking.

## Setup

### 1. Get API Key

1. Create account at [trigger.dev](https://trigger.dev)
2. Create new project
3. Copy API key from dashboard

### 2. Configure Environment

```bash
# Add to apps/api/.env.local
TRIGGER_SECRET_KEY=tr_dev_...
```

### 3. Start Development Server

```bash
# Run Trigger.dev CLI in watch mode
pnpm jobs

# Or with full filter
pnpm --filter @workspace/jobs jobs
```

This starts the Trigger.dev dev server which:

- ✅ Watches for job changes
- ✅ Auto-reloads on file save
- ✅ Connects to Trigger.dev dashboard
- ✅ Enables local job testing

## Structure

```
packages/jobs/
├── trigger/
│   ├── example.ts      # Example job with wait
│   └── schedule.ts     # Scheduled/cron jobs
├── trigger.config.ts   # Trigger.dev configuration
└── package.json
```

## Define Jobs

### One-Time Tasks

**Example: Send Email**

```typescript
// packages/jobs/trigger/send-email.ts
import { task, logger } from "@trigger.dev/sdk/v3";

export const sendEmail = task({
  id: "send-email",
  run: async (payload: { email: string; subject: string; body: string }) => {
    logger.info("Sending email", { to: payload.email });

    // Your email sending logic here
    // e.g., using Resend, SendGrid, etc.

    return {
      success: true,
      sentAt: new Date(),
    };
  },
});
```

**With wait and retries:**

```typescript
import { task, wait } from "@trigger.dev/sdk/v3";

export const processOrder = task({
  id: "process-order",
  retry: {
    maxAttempts: 3,
    factor: 2,
  },
  run: async (payload: { orderId: string }) => {
    // Step 1: Validate order
    await validateOrder(payload.orderId);

    // Wait 2 seconds before payment
    await wait.for({ seconds: 2 });

    // Step 2: Process payment
    const payment = await processPayment(payload.orderId);

    // Wait 5 seconds before fulfillment
    await wait.for({ seconds: 5 });

    // Step 3: Create fulfillment
    await createFulfillment(payload.orderId);

    return { status: "completed", orderId: payload.orderId };
  },
});
```

### Scheduled Tasks

**Example: Daily cleanup**

```typescript
// packages/jobs/trigger/cleanup.ts
import { schedules, logger } from "@trigger.dev/sdk/v3";

export const dailyCleanup = schedules.task({
  id: "daily-cleanup",
  cron: "0 2 * * *", // Every day at 2 AM UTC
  run: async (payload) => {
    logger.info("Running daily cleanup", {
      scheduledFor: payload.timestamp,
      timezone: payload.timezone,
    });

    // Cleanup old records
    const deleted = await cleanupOldRecords();

    return {
      recordsDeleted: deleted,
      completedAt: new Date(),
    };
  },
});
```

**Common cron patterns:**

- `0 * * * *` - Every hour at minute 0
- `0 0 * * *` - Every day at midnight
- `0 9 * * 1-5` - Weekdays at 9 AM
- `*/15 * * * *` - Every 15 minutes

**Tool:** [crontab.guru](https://crontab.guru) - Visual cron editor

## Trigger Jobs

### From Your Code

```typescript
// In API routes, webhooks, or other backend code
import { sendEmail } from "@workspace/jobs/trigger/send-email";

export async function POST(request: Request) {
  const { email, subject, body } = await request.json();

  // Trigger job asynchronously
  const handle = await sendEmail.trigger({
    email,
    subject,
    body,
  });

  return Response.json({
    message: "Email queued",
    runId: handle.id,
  });
}
```

**Batch triggering:**

```typescript
import { sendEmail } from "@workspace/jobs/trigger/send-email";

// Trigger multiple jobs
const handles = await sendEmail.batchTrigger([
  { email: "user1@example.com", subject: "Welcome!" },
  { email: "user2@example.com", subject: "Welcome!" },
  { email: "user3@example.com", subject: "Welcome!" },
]);
```

### From Trigger.dev Dashboard

1. Go to [cloud.trigger.dev](https://cloud.trigger.dev)
2. Select your project
3. Navigate to **"Tasks"** tab
4. Click on any task (e.g., "send-email")
5. Click **"Test"** button
6. Enter payload JSON:
   ```json
   {
     "email": "test@example.com",
     "subject": "Test Email",
     "body": "This is a test"
   }
   ```
7. Click **"Run test"**
8. Watch execution in real-time with logs

### Monitor Runs

View all job executions in the dashboard:

- ✅ **Real-time logs** - See `logger.info()` output live
- ✅ **Execution timeline** - Visual breakdown of each step
- ✅ **Retry history** - See failed attempts and retries
- ✅ **Performance metrics** - Duration, memory usage
- ✅ **Payload & output** - Inspect input/output data

## CLI Commands

### Development

```bash
# Start dev server (watches for changes)
pnpm jobs

# Equivalent to:
npx trigger.dev@latest dev
```

### Deployment

```bash
# Deploy to production
npx trigger.dev@latest deploy

# Deploy with environment
npx trigger.dev@latest deploy --env production
```

### List Tasks

```bash
# See all registered tasks
npx trigger.dev@latest list
```

### Whoami

```bash
# Check current project and auth
npx trigger.dev@latest whoami
```

## Configuration

**`trigger.config.ts`:**

```typescript
import type { TriggerConfig } from "@trigger.dev/sdk/v3";

export const config: TriggerConfig = {
  project: "proj_xxxxx", // Your project ID
  logLevel: "log",
  maxDuration: 300, // Max 5 minutes per job
  retries: {
    enabledInDev: true,
    default: {
      maxAttempts: 3,
      minTimeoutInMs: 1000,
      maxTimeoutInMs: 10000,
      factor: 2, // Exponential backoff
      randomize: true,
    },
  },
};
```

## Best Practices

### ✅ Make Jobs Idempotent

Jobs should be safe to run multiple times:

```typescript
export const createInvoice = task({
  id: "create-invoice",
  run: async (payload: { orderId: string }) => {
    // Check if invoice already exists
    const existing = await db.query.invoices.findFirst({
      where: eq(invoices.orderId, payload.orderId),
    });

    if (existing) {
      logger.info("Invoice already exists", { invoiceId: existing.id });
      return existing;
    }

    // Create new invoice
    const invoice = await db.insert(invoices).values({
      orderId: payload.orderId,
      // ... other fields
    });

    return invoice;
  },
});
```

### ✅ Use Structured Logging

```typescript
// ❌ Bad - unstructured
logger.info(`Processing order ${orderId} for user ${userId}`);

// ✅ Good - structured
logger.info("Processing order", { orderId, userId, status: "started" });
```

### ✅ Handle Errors Gracefully

```typescript
export const sendEmail = task({
  id: "send-email",
  retry: {
    maxAttempts: 3,
  },
  run: async (payload) => {
    try {
      await emailProvider.send(payload);
      return { success: true };
    } catch (error) {
      logger.error("Email send failed", { error, payload });
      throw error; // Trigger will retry
    }
  },
});
```

### ✅ Keep Jobs Focused

One job = one responsibility:

```typescript
// ❌ Bad - does too much
export const onUserSignup = task({
  run: async (payload) => {
    await sendWelcomeEmail(payload.email);
    await createStripeCustomer(payload.userId);
    await sendSlackNotification(payload);
    await updateAnalytics(payload);
  },
});

// ✅ Good - separate jobs
export const sendWelcomeEmail = task({ ... });
export const createStripeCustomer = task({ ... });
export const sendSlackNotification = task({ ... });

// Chain them if needed
await sendWelcomeEmail.trigger({ email });
await createStripeCustomer.trigger({ userId });
```

## Pricing

- **Free tier:** 100,000 runs/month
- **Pro:** $29/month for 1M runs
- **Enterprise:** Custom pricing

See [trigger.dev/pricing](https://trigger.dev/pricing) for details.

## Further Reading

- [Trigger.dev Documentation](https://trigger.dev/docs)
- [Task Configuration](https://trigger.dev/docs/tasks)
- [Scheduled Tasks](https://trigger.dev/docs/tasks-scheduled)
- [CLI Reference](https://trigger.dev/docs/cli)
