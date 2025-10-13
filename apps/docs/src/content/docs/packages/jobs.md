---
title: Jobs Package
description: Background job processing with Trigger.dev
---

# @workspace/jobs

Background job and scheduled task processing using Trigger.dev.

## Features

- ✅ **Trigger.dev** - Reliable background job execution
- ✅ **TypeScript-first** - Full type safety
- ✅ **Scheduled tasks** - Cron-based scheduling
- ✅ **Retries** - Automatic retry logic
- ✅ **Monitoring** - Job execution dashboard
- ✅ **Local development** - Test jobs locally

## Installation

This package is already included in the workspace:

```json
{
  "dependencies": {
    "@workspace/jobs": "workspace:*"
  }
}
```

## Environment Variables

Add to your `.env` file in `packages/jobs/`:

```bash
TRIGGER_API_KEY=tr_dev_...
TRIGGER_API_URL=https://api.trigger.dev
```

Get your API key from [Trigger.dev Dashboard](https://trigger.dev).

## Project Structure

```
packages/jobs/
├── trigger/
│   ├── example.ts      # Example job
│   └── schedule.ts     # Scheduled tasks
├── trigger.config.ts   # Trigger.dev configuration
├── package.json
└── tsconfig.json
```

## Usage

### 1. Define a Job

Create a new file in `packages/jobs/trigger/`:

```typescript
// packages/jobs/trigger/send-welcome-email.ts
import { task } from "@trigger.dev/sdk/v3";

export const sendWelcomeEmail = task({
  id: "send-welcome-email",
  run: async (payload: { userId: string; email: string }) => {
    console.log(`Sending welcome email to ${payload.email}`);

    // Your email sending logic here
    // await sendEmail({
    //   to: payload.email,
    //   subject: "Welcome to Orion Kit!",
    //   template: "welcome",
    // });

    return {
      success: true,
      emailSent: true,
    };
  },
});
```

### 2. Trigger a Job

From your API or application:

```typescript
import { sendWelcomeEmail } from "@workspace/jobs/trigger/send-welcome-email";

// Trigger the job
const handle = await sendWelcomeEmail.trigger({
  userId: "user_123",
  email: "user@example.com",
});

console.log("Job triggered:", handle.id);
```

### 3. Scheduled Tasks

Create recurring jobs with cron syntax:

```typescript
// packages/jobs/trigger/schedule.ts
import { schedules } from "@trigger.dev/sdk/v3";

export const dailyDigest = schedules.task({
  id: "daily-digest",
  cron: "0 9 * * *", // Every day at 9 AM
  run: async (payload) => {
    console.log("Running daily digest job");

    // Send digest emails
    // Clean up old data
    // Generate reports

    return {
      success: true,
      emailsSent: 100,
    };
  },
});
```

## Example Jobs

### Example 1: Simple Task

```typescript
import { task } from "@trigger.dev/sdk/v3";

export const processData = task({
  id: "process-data",
  run: async (payload: { data: string[] }) => {
    const processed = payload.data.map((item) => item.toUpperCase());

    return {
      success: true,
      processedCount: processed.length,
    };
  },
});
```

### Example 2: Task with Retries

```typescript
import { task } from "@trigger.dev/sdk/v3";

export const fetchExternalAPI = task({
  id: "fetch-external-api",
  retry: {
    maxAttempts: 3,
    minTimeoutInMs: 1000,
    maxTimeoutInMs: 10000,
    factor: 2,
  },
  run: async (payload: { url: string }) => {
    const response = await fetch(payload.url);

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    return await response.json();
  },
});
```

### Example 3: Scheduled Cleanup

```typescript
import { schedules } from "@trigger.dev/sdk/v3";
import { db, tasks, lt } from "@workspace/database";

export const cleanupOldTasks = schedules.task({
  id: "cleanup-old-tasks",
  cron: "0 2 * * *", // Every day at 2 AM
  run: async () => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const deleted = await db
      .delete(tasks)
      .where(
        and(eq(tasks.status, "completed"), lt(tasks.completedAt, thirtyDaysAgo))
      )
      .returning();

    return {
      success: true,
      deletedCount: deleted.length,
    };
  },
});
```

## Development

### Run Trigger.dev Locally

```bash
# Start Trigger.dev development server
pnpm --filter jobs dev
```

This connects to Trigger.dev cloud and allows you to:

- Test jobs locally
- View logs in real-time
- Debug job execution

### Test a Job

Trigger jobs from your API or using the Trigger.dev dashboard:

```typescript
// In your API route
import { myJob } from "@workspace/jobs/trigger/my-job";

export async function POST(req: Request) {
  const handle = await myJob.trigger({ data: "test" });

  return NextResponse.json({
    jobId: handle.id,
    status: "triggered",
  });
}
```

## Configuration

### trigger.config.ts

```typescript
import { defineConfig } from "@trigger.dev/sdk/v3";

export default defineConfig({
  project: "proj_...",
  runtime: "node",
  logLevel: "info",
  retries: {
    enabledInDev: true,
    default: {
      maxAttempts: 3,
      minTimeoutInMs: 1000,
      maxTimeoutInMs: 10000,
      factor: 2,
    },
  },
});
```

## Cron Syntax

Common cron patterns:

```typescript
"* * * * *"; // Every minute
"0 * * * *"; // Every hour
"0 0 * * *"; // Every day at midnight
"0 9 * * *"; // Every day at 9 AM
"0 0 * * 0"; // Every Sunday at midnight
"0 0 1 * *"; // First day of every month
"*/15 * * * *"; // Every 15 minutes
```

Use [crontab.guru](https://crontab.guru/) to build and test cron expressions.

## Monitoring

### Trigger.dev Dashboard

View job execution:

1. Go to [Trigger.dev Dashboard](https://trigger.dev)
2. Select your project
3. View:
   - Recent runs
   - Success/failure rates
   - Execution times
   - Error logs

### Axiom Integration

Jobs automatically log to Axiom:

```typescript
logger.info("Job started", { jobId, payload });
logger.info("Job completed", { jobId, result, duration });
logger.error("Job failed", error, { jobId, attempt });
```

## Common Use Cases

### 1. Welcome Email

Send email when user signs up:

```typescript
export const sendWelcomeEmail = task({
  id: "send-welcome-email",
  run: async (payload: { userId: string }) => {
    const user = await getUser(payload.userId);
    await sendEmail({
      to: user.email,
      template: "welcome",
    });
  },
});
```

### 2. Data Export

Generate and send reports:

```typescript
export const generateReport = task({
  id: "generate-report",
  run: async (payload: { userId: string }) => {
    const tasks = await getUserTasks(payload.userId);
    const csv = generateCSV(tasks);
    await emailCSV(payload.userId, csv);
  },
});
```

### 3. Scheduled Cleanup

Delete old data:

```typescript
export const cleanupLogs = schedules.task({
  id: "cleanup-logs",
  cron: "0 3 * * *", // 3 AM daily
  run: async () => {
    await db.delete(logs).where(lt(logs.createdAt, sevenDaysAgo));
  },
});
```

### 4. Webhook Processing

Process webhooks asynchronously:

```typescript
export const processWebhook = task({
  id: "process-webhook",
  run: async (payload: { event: string; data: any }) => {
    // Process Stripe webhook
    // Update database
    // Send notifications
  },
});
```

## Error Handling

### Automatic Retries

Jobs automatically retry on failure:

```typescript
export const unreliableTask = task({
  id: "unreliable-task",
  retry: {
    maxAttempts: 5,
    minTimeoutInMs: 1000,
    maxTimeoutInMs: 60000,
    factor: 2, // Exponential backoff
  },
  run: async (payload) => {
    // This will retry up to 5 times with exponential backoff
    const result = await unreliableAPI(payload);
    return result;
  },
});
```

### Manual Error Handling

```typescript
export const robustTask = task({
  id: "robust-task",
  run: async (payload) => {
    try {
      return await riskyOperation(payload);
    } catch (error) {
      logger.error("Task failed", error as Error, { payload });

      // Send alert
      await notifyTeam(error);

      // Return partial result
      return { success: false, error: error.message };
    }
  },
});
```

## Best Practices

### 1. Make Jobs Idempotent

```typescript
// ✅ Good - can run multiple times safely
export const sendEmail = task({
  id: "send-email",
  run: async (payload: { emailId: string }) => {
    const sent = await checkIfEmailSent(payload.emailId);
    if (sent) {
      return { alreadySent: true };
    }

    await actualSendEmail(payload.emailId);
    await markEmailAsSent(payload.emailId);
  },
});
```

### 2. Keep Jobs Small

```typescript
// ✅ Good - focused job
export const processOrder = task({
  id: "process-order",
  run: async (payload: { orderId: string }) => {
    await validateOrder(payload.orderId);
    await chargeCard(payload.orderId);
    await sendConfirmation(payload.orderId);
  },
});

// ❌ Bad - too many responsibilities
export const processEverything = task({
  id: "process-everything",
  run: async () => {
    await processOrders();
    await sendEmails();
    await generateReports();
    await cleanupData();
  },
});
```

### 3. Log Execution Details

```typescript
export const myJob = task({
  id: "my-job",
  run: async (payload) => {
    const startTime = Date.now();

    logger.info("Job started", { payload });

    try {
      const result = await doWork(payload);

      logger.info("Job completed", {
        duration: Date.now() - startTime,
        result,
      });

      return result;
    } catch (error) {
      logger.error("Job failed", error as Error, {
        duration: Date.now() - startTime,
        payload,
      });
      throw error;
    }
  },
});
```

## Production Deployment

### Environment Variables

Set in your deployment platform:

```bash
TRIGGER_API_KEY=tr_prod_...  # Use production key!
TRIGGER_API_URL=https://api.trigger.dev
```

### Deploy Jobs

```bash
# Build and deploy
pnpm build

# Trigger.dev will automatically detect and deploy jobs
```

Jobs are automatically registered with Trigger.dev when your app starts.

## Pricing

**Free Tier:**

- 100k task runs/month
- 1 concurrent job
- All features included

**Pro:**

- $29/month for 1M runs
- Unlimited concurrent jobs
- Priority support

See [trigger.dev/pricing](https://trigger.dev/pricing) for details.

## Learn More

- [Trigger.dev Documentation](https://trigger.dev/docs)
- [Trigger.dev Examples](https://trigger.dev/docs/examples)
- [Cron Expression Guide](https://crontab.guru/)
