---
title: API Application
description: Backend REST API with authentication, database, and payments
---

The API application (`apps/api`) is the backend server that handles all business logic, database operations, and external service integrations.

**Purpose**: REST API server for the main application  
**Framework**: Serverless Next.js 15 with App Router  
**Port**: `3002` (development)  
**Database**: Neon PostgreSQL with Drizzle ORM  
**Authentication**: Custom JWT-based authentication

## Structure

```
apps/api/
├── app/
│   ├── auth/
│   │   ├── login/route.ts         # User login endpoint
│   │   ├── logout/route.ts        # User logout endpoint
│   │   ├── me/route.ts            # Get current user
│   │   └── register/route.ts      # User registration endpoint
│   ├── account/
│   │   └── delete/route.ts        # Delete user account
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

### **Authentication**

```http
POST /auth/register  # Create new user account
POST /auth/login     # Sign in with email/password
GET  /auth/me        # Get current user info
POST /auth/logout    # Sign out (clear cookie)
```

**Example Registration:**

```typescript
// POST /auth/register
const response = await fetch("/api/auth/register", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "John Doe",
    email: "john@example.com",
    password: "securepassword123",
  }),
});
```

**Example Login:**

```typescript
// POST /auth/login
const response = await fetch("/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "john@example.com",
    password: "securepassword123",
  }),
});

// Returns: { success: true, token: "...", user: {...} }
```

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
// GET /tasks (uses httpOnly cookie for auth)
const response = await fetch("/api/tasks");

// POST /tasks
const response = await fetch("/api/tasks", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
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
  headers: { "Content-Type": "application/json" },
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

All protected endpoints require authentication via JWT tokens stored in httpOnly cookies:

```typescript
import { getCurrentUser } from "@workspace/auth/server";

export async function GET(req: NextRequest) {
  const user = await getCurrentUser(req);

  if (!user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  // Authenticated logic here - user.id is available
}
```

### Authentication Flow

1. **Login/Register** - User submits credentials
2. **JWT Creation** - Server creates signed JWT token
3. **Cookie Storage** - Token stored in httpOnly cookie
4. **Automatic Verification** - Middleware verifies token on protected routes
5. **User Context** - `getCurrentUser()` extracts user info from token

## Database Operations

Uses Drizzle ORM with type-safe queries:

```typescript
import { db, tasks, userPreferences } from "@workspace/database";
import { eq } from "drizzle-orm";

// Get user's tasks
const userTasks = await db.select().from(tasks).where(eq(tasks.userId, userId));

// Update user preferences
await db
  .update(userPreferences)
  .set({ plan: "pro" })
  .where(eq(userPreferences.userId, userId));
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
DATABASE_URL=postgresql://...
AUTH_JWT_SECRET=your-super-secret-key-min-32-chars
NEXT_PUBLIC_APP_URL=http://localhost:3001
NEXT_PUBLIC_API_URL=http://localhost:3002
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_AXIOM_TOKEN=xaat-...
NEXT_PUBLIC_AXIOM_DATASET=orion-kit
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

# Register user
curl -X POST http://localhost:3002/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Login (sets httpOnly cookie)
curl -X POST http://localhost:3002/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  -c cookies.txt

# Get tasks (uses cookie for auth)
curl -b cookies.txt http://localhost:3002/tasks
```

### **Database Studio**

```bash
# Open Drizzle Studio
pnpm db:studio
```

### **Environment Variables**

Set production environment variables in Vercel dashboard:

- `AUTH_JWT_SECRET` - JWT signing secret (32+ characters)
- `DATABASE_URL` - Production database URL
- `NEXT_PUBLIC_APP_URL` - Production app URL
- `NEXT_PUBLIC_API_URL` - Production API URL
- `STRIPE_SECRET_KEY` - Stripe live key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook secret
- `NEXT_PUBLIC_AXIOM_TOKEN` - Axiom logging token
- `NEXT_PUBLIC_AXIOM_DATASET` - Axiom dataset name

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
