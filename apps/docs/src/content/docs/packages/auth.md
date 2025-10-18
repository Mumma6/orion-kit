---
title: Authentication System
description: Custom JWT-based authentication without vendor lock-in
---

Orion Kit provides a **custom JWT-based authentication system** out of the box, designed to be simple, secure, and vendor-neutral. This gives you a solid foundation that works for most SaaS apps, with the flexibility to upgrade to auth providers when needed.

## Why Custom JWT?

Orion Kit uses **custom JWT authentication** instead of third-party services like Clerk or Kinde. This gives you:

### 🎯 **Full Control & Flexibility**

- **No vendor lock-in** - you own all the code
- **Customizable** - modify authentication logic exactly how you need it
- **Transparent** - see exactly what's happening under the hood
- **No external dependencies** - just JWT + bcrypt

### 💰 **Cost-Effective**

- **Free forever** - no monthly fees or user limits
- **Predictable costs** - only pay for your infrastructure
- **No API rate limits** - from authentication providers
- **Scales with your business** - not your user count

### 🚀 **Performance & Reliability**

- **Faster** - no external API calls for authentication
- **Lower latency** - everything runs on your servers
- **Better caching** - you control the cache strategy
- **No network dependencies** - works even when third-party services are down

### 🔒 **Data Privacy & Security**

- **All data stays with you** - no third-party data sharing
- **GDPR compliant** - you control all user data
- **No data leakage** - to external services
- **Complete audit trail** - you see everything

### 🛠️ **Developer Experience**

- **Easy debugging** - all code is available
- **No "magic" functions** - you understand everything
- **Flexible data model** - customize user schema as needed
- **No limitations** - implement any feature you need
- **Cross-origin ready** - works with separate API and frontend domains

## How It Works

### 1. **JWT Tokens (Stateless & Fast)**

```typescript
// Token contains user ID and expires in 7 days
const token = await new SignJWT({ email: user.email })
  .setSubject(user.id) // 👈 User ID stored in token
  .setIssuer(process.env.NEXT_PUBLIC_APP_URL)
  .setAudience(process.env.NEXT_PUBLIC_API_URL)
  .setExpirationTime("7d")
  .sign(secret);
```

### 2. **localStorage + Authorization Headers (Cross-Origin)**

```typescript
// Token stored in localStorage for cross-origin compatibility
localStorage.setItem("auth_token", token);

// Sent via Authorization header in API requests
const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
};
```

### 3. **Automatic Verification**

```typescript
// Every API call automatically verifies the token from Authorization header
export async function getCurrentUser(req: NextRequest) {
  // Try Authorization header first, then fallback to cookie
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");

  const userId = await verifyToken(token);
  if (!userId) return null;

  // Get user from database
  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  return user[0] || null;
}
```

## Database Schema

We use a **minimal, clean schema** - only what we actually need:

### ✅ **Used Tables:**

```sql
-- Users table (simple and clean)
CREATE TABLE users (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255),  -- bcrypt hashed
  image VARCHAR(255),
  email_verified TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- User preferences (settings + Stripe data)
CREATE TABLE user_preferences (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) UNIQUE NOT NULL,
  theme VARCHAR(50) DEFAULT 'system',
  language VARCHAR(10) DEFAULT 'en',
  plan VARCHAR(50) DEFAULT 'free',
  stripe_customer_id VARCHAR(255),
  stripe_subscription_id VARCHAR(255),
  stripe_subscription_status VARCHAR(50),
  stripe_price_id VARCHAR(255),
  stripe_current_period_end TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tasks (your app data)
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status task_status DEFAULT 'todo',
  due_date TIMESTAMP,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## API Routes

### **Authentication Endpoints:**

```typescript
// apps/api/app/auth/
POST /auth/register  - Create new user account
POST /auth/login     - Sign in with email/password
GET  /auth/me        - Get current user info
POST /auth/logout    - Sign out (clear token)
```

### **Protected Endpoints:**

```typescript
// All require valid JWT token:
GET    /tasks           - List user's tasks
POST   /tasks           - Create new task
PUT    /tasks/:id       - Update task
DELETE /tasks/:id       - Delete task
GET    /preferences     - Get user settings
PUT    /preferences     - Update settings
POST   /checkout        - Create Stripe checkout session
POST   /billing-portal  - Access Stripe billing portal
GET    /subscription    - Get subscription details
DELETE /subscription    - Cancel subscription
```

## Client-Side Usage

### **React Hooks (TanStack Query):**

```typescript
import { useAuth, useLogin, useRegister, useLogout } from "@/hooks/use-auth";

export function LoginForm() {
  const loginMutation = useLogin();
  const { user, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  if (user) return <div>Welcome, {user.name}!</div>;

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      loginMutation.mutate({
        email: "user@example.com",
        password: "password"
      });
    }}>
      {/* Form fields */}
    </form>
  );
}
```

### **Server Components:**

```typescript
import { getCurrentUser } from "@/lib/auth-server";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return <div>Welcome, {user.name}!</div>;
}
```

## Security Features

### 🔒 **JWT Security:**

- **Signed tokens** - Cannot be tampered with
- **7-day expiration** - Automatic logout for security
- **User ID in payload** - No database lookup needed for auth
- **Secret key** - Only your server can verify tokens
- **Issuer/Audience validation** - Prevents token reuse across domains

### 🔐 **localStorage Security:**

- **Cross-origin ready** - Works with separate API and frontend domains
- **Authorization headers** - Sent with every API request
- **Automatic cleanup** - Cleared on logout
- **No httpOnly** - Accessible to JavaScript (trade-off for cross-origin)
- **HTTPS only** - Secure in production

### 🛡️ **Middleware Protection:**

```typescript
// apps/api/middleware.ts
const protectedRoutes = [
  "/tasks",
  "/preferences",
  "/subscription",
  "/checkout",
  "/billing-portal",
];
const isProtectedRoute = protectedRoutes.some((route) =>
  req.nextUrl.pathname.startsWith(route)
);

if (isProtectedRoute) {
  const userId = await getUserId(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
```

## When to Upgrade to Auth Providers

Custom JWT works great for most SaaS apps, but consider upgrading when you need:

### ✅ **Upgrade When You Need:**

- **Enterprise SSO** - SAML, OIDC, Active Directory
- **Social Login** - Google, GitHub, Apple, Microsoft
- **Advanced Security** - MFA, device management, audit logs
- **Compliance** - SOC2, GDPR, HIPAA requirements
- **Team Management** - Organizations, roles, permissions

### ❌ **Keep Custom JWT When:**

- **Simple SaaS** - email/password is enough
- **Cost is a concern** - auth providers cost $25+/mo
- **Full control** - over user data and flows
- **MVP stage** - don't over-engineer from day one

## Available Auth Providers

| Provider                                       | Best For                 | Free Tier | Pricing | Difficulty |
| ---------------------------------------------- | ------------------------ | --------- | ------- | ---------- |
| **[Clerk](https://clerk.com)**                 | Modern apps, great DX    | 10k MAU   | $25/mo  | ⭐⭐⭐     |
| **[Auth0](https://auth0.com)**                 | Enterprise, compliance   | 7k MAU    | $23/mo  | ⭐⭐⭐⭐   |
| **[Better Auth](https://better-auth.com)**     | Open source, self-hosted | Unlimited | Free    | ⭐⭐⭐     |
| **[Supabase Auth](https://supabase.com/auth)** | Database-first apps      | 50k MAU   | $25/mo  | ⭐⭐       |
| **[NextAuth.js](https://next-auth.js.org)**    | Custom, flexible         | Unlimited | Free    | ⭐⭐⭐⭐   |

## Migration Guide

When ready to upgrade, see our **[Auth Providers integration guide](/reference/integrations/auth)** for:

- **Step-by-step migration** from custom JWT
- **Provider-specific setup** instructions
- **Database schema changes** needed
- **Cost comparison** and recommendations
- **Migration checklist** to avoid issues

### **Quick Migration Example:**

```bash
# 1. Install provider
pnpm add @clerk/nextjs

# 2. Add environment variables
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# 3. Replace auth function
import { auth } from "@clerk/nextjs/server";
const { userId } = auth();

# 4. Database stays mostly the same!
```

## Alternative: Replace Backend Framework

You can also replace the Next.js API with other TypeScript frameworks:

- **Express** - Most popular Node.js framework
- **Fastify** - High-performance alternative to Express
- **Hono** - Lightweight, edge-first framework
- **tRPC** - End-to-end typesafe APIs
- **NestJS** - Enterprise-grade framework with decorators

All maintain the same TypeScript types and monorepo structure!

## Setup

```bash
# Environment Variables
AUTH_JWT_SECRET=your-super-secret-key-min-32-chars
NEXT_PUBLIC_APP_URL=http://localhost:3001
NEXT_PUBLIC_API_URL=http://localhost:3002
DATABASE_URL=postgresql://...

# Start development
pnpm dev
# ✅ Auth is ready to use!
```

## Common Patterns

### **Login Flow:**

```typescript
// 1. User submits form
const { email, password } = formData;

// 2. Verify credentials
const user = await db
  .select()
  .from(users)
  .where(eq(users.email, email))
  .limit(1);
const valid = await bcrypt.compare(password, user.password);

// 3. Create JWT token
const token = await new SignJWT({ email })
  .setSubject(user.id)
  .setExpirationTime("7d")
  .sign(secret);

// 4. Return token to client (stored in localStorage)
return NextResponse.json({ success: true, token });
```

### **API Authentication:**

```typescript
// Every protected route
export async function GET(req: NextRequest) {
  const user = await getCurrentUser(req);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Use user.id to filter data
  const tasks = await db.select().from(tasks).where(eq(tasks.userId, user.id));

  return NextResponse.json({ success: true, data: tasks });
}
```

### **Form Validation:**

```typescript
// Same Zod schema on client and server
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Client-side validation
const form = useForm({
  resolver: zodResolver(loginSchema),
});

// Server-side validation
const validation = loginSchema.safeParse(body);
if (!validation.success) {
  return NextResponse.json({ error: "Invalid input" }, { status: 400 });
}
```

## Performance

- **JWT**: ~0.1ms per request (no database lookup)
- **Serverless friendly**: Instant verification, no database connections
- **Stateless**: Perfect for serverless architecture

## Best Practices

- ✅ Use strong JWT secrets (32+ characters)
- ✅ Set appropriate token expiration (7 days)
- ✅ Store tokens in localStorage for cross-origin compatibility
- ✅ Hash passwords with bcrypt (salt rounds: 12)
- ✅ Use HTTPS in production for secure token transmission

## Troubleshooting

- **"Invalid token"**: Check JWT secret matches between apps
- **"Token expired"**: User needs to login again
- **"CORS errors"**: Check `NEXT_PUBLIC_APP_URL` in API middleware
- **"Unauthorized"**: Verify token is stored in localStorage and sent in Authorization header
- **Cross-origin issues**: Ensure API and frontend domains are configured correctly

## Next Steps

Ready for advanced features? Check out our integration guides:

- **[Auth Providers](/reference/integrations/auth)** - Upgrade to Clerk, Auth0, or Better Auth
- **[Rate Limiting](/reference/integrations/rate-limiting)** - Add API protection with Upstash Redis
- **[Email](/reference/integrations/email)** - Already included with Resend!
