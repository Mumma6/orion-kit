---
title: API Application
description: Backend REST API with authentication, database, and payments
---

The API application (`apps/api`) is the backend server that handles all business logic, database operations, and external service integrations.

**Purpose**: REST API server for the main application  
**Framework**: Serverless Next.js 15 with App Router  
**Port**: `3002` (development)  
**Database**: Neon PostgreSQL with Drizzle ORM  
**Authentication**: Clerk server-side integration

## Structure

```
apps/api/
├── app/
│   ├── billing-portal/route.ts    # Stripe Customer Portal
│   ├── checkout/route.ts          # Stripe Checkout Sessions
│   ├── health/route.ts            # Health check endpoint
│   ├── preferences/route.ts       # User preferences CRUD
│   ├── subscription/route.ts      # Subscription management
│   ├── tasks/[id]/route.ts        # Task CRUD operations
│   ├── tasks/route.ts             # Task list operations
│   └── webhooks/stripe/route.ts   # Stripe webhook handler
├── lib/
│   └── validation.ts              # Zod error formatting
├── middleware.ts                  # Request middleware
└── package.json                   # Dependencies and scripts
```

## API Endpoints

### **Health Check**

```http
GET /health
```

Returns `200 OK` for health monitoring.

### **Tasks**

```http
GET    /tasks           # List user's tasks
POST   /tasks           # Create new task
PATCH  /tasks/[id]      # Update task
DELETE /tasks/[id]      # Delete task
```

**Example Request:**

```typescript
// GET /tasks
const response = await fetch("/api/tasks", {
  headers: { Authorization: `Bearer ${token}` },
});

// POST /tasks
const response = await fetch("/api/tasks", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    title: "Complete project",
    description: "Finish the Orion Kit documentation",
    status: "todo",
  }),
});
```

### **User Preferences**

```http
GET    /preferences     # Get user preferences
PATCH  /preferences     # Update user preferences
```

**Example Response:**

```json
{
  "success": true,
  "data": {
    "plan": "pro",
    "defaultStatus": "todo",
    "emailNotifications": true,
    "taskReminders": false,
    "weeklyDigest": true,
    "stripeCustomerId": "cus_1234567890",
    "stripeSubscriptionId": "sub_1234567890",
    "stripeSubscriptionStatus": "active"
  }
}
```

### **Billing & Payments**

```http
POST   /checkout        # Create Stripe Checkout Session
POST   /billing-portal  # Create Stripe Customer Portal Session
GET    /subscription    # Get subscription details
DELETE /subscription    # Cancel subscription
```

**Example Checkout:**

```typescript
// POST /checkout
const response = await fetch("/api/checkout", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    priceId: "price_1234567890",
  }),
});

// Returns: { success: true, data: { url: "https://checkout.stripe.com/..." } }
```

### **Webhooks**

```http
POST   /webhooks/stripe # Stripe webhook handler
```

Handles Stripe events:

- `checkout.session.completed` - New subscription
- `customer.subscription.updated` - Plan changes
- `customer.subscription.deleted` - Cancellation
- `invoice.payment_succeeded` - Successful payment
- `invoice.payment_failed` - Failed payment

## Authentication

All endpoints require authentication via Clerk:

```typescript
import { auth } from "@workspace/auth/server";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  // Authenticated logic here
}
```

## Database Operations

Uses Drizzle ORM with type-safe queries:

```typescript
import { db, tasks, userPreferences } from "@workspace/database";
import { eq } from "drizzle-orm";

// Get user's tasks
const userTasks = await db
  .select()
  .from(tasks)
  .where(eq(tasks.clerkUserId, userId));

// Update user preferences
await db
  .update(userPreferences)
  .set({ plan: "pro" })
  .where(eq(userPreferences.clerkUserId, userId));
```

## Validation

All requests are validated with Zod schemas:

```typescript
import { createTaskInputSchema } from "@workspace/types";
import { validationErrorResponse } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = createTaskInputSchema.parse(body);

    // Process validated data
  } catch (error) {
    if (error instanceof ZodError) {
      return validationErrorResponse(error.errors);
    }
    throw error;
  }
}
```

## Error Handling

Consistent error responses:

```typescript
// Validation error
{
  "success": false,
  "error": "Validation failed",
  "details": [
    "Title is required - title",
    "Status must be one of: todo, in-progress, completed - status"
  ]
}

// Authentication error
{
  "success": false,
  "error": "Unauthorized"
}

// Server error
{
  "success": false,
  "error": "Internal server error"
}
```

## Environment Variables

```bash
# apps/api/.env.local
CLERK_SECRET_KEY=sk_test_...
DATABASE_URL=postgresql://...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
AXIOM_TOKEN=...
AXIOM_DATASET=orion-kit
TRIGGER_API_KEY=tr_...
```

## Development

### **Start Development Server**

```bash
cd apps/api
pnpm dev
```

Server runs on `http://localhost:3002`

### **API Testing**

```bash
# Health check
curl http://localhost:3002/health

# Get tasks (requires auth)
curl -H "Authorization: Bearer $TOKEN" http://localhost:3002/tasks
```

### **Database Studio**

```bash
# Open Drizzle Studio
pnpm db:studio
```

### **Environment Variables**

Set production environment variables in Vercel dashboard:

- `CLERK_SECRET_KEY` - Clerk server key
- `DATABASE_URL` - Production database URL
- `STRIPE_SECRET_KEY` - Stripe live key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook secret
- `AXIOM_TOKEN` - Axiom logging token
- `TRIGGER_API_KEY` - Trigger.dev API key

### **Webhook Configuration**

Configure Stripe webhook endpoint:

```
https://api.orion-kit.dev/webhooks/stripe
```

Events to listen for:

- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

## Monitoring

### **Health Checks**

Monitor API health:

```bash
# Basic health check
curl https://api.orion-kit.dev/health

# Should return: OK
```

### **Logging**

Logs are sent to Axiom for monitoring:

```typescript
import { logger } from "@workspace/observability";

logger.info("Task created", { userId, taskId });
logger.error("Payment failed", { userId, error: error.message });
```

### **Analytics**

Track API usage with PostHog:

```typescript
import { track } from "@workspace/analytics";

track("task_created", { userId, taskId });
track("subscription_upgraded", { userId, plan: "pro" });
```

## Related

- [Database Package](/packages/database)
- [Auth Package](/packages/auth)
- [Payment Package](/packages/payment)
- [Types Package](/packages/types)
- [Observability Package](/packages/observability)
