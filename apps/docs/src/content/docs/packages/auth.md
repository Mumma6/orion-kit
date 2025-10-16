---
title: Authentication System
description: Custom JWT-based authentication without vendor lock-in
---

Orion Kit provides a **custom JWT-based authentication system** out of the box, designed to be simple, secure, and vendor-neutral. The boilerplate intentionally avoids vendor lock-in from the start, making it easy to integrate any authentication provider you prefer.

## Why Start Vendor-Neutral?

### 🎯 **Boilerplate Philosophy:**

- **No vendor lock-in** - Start with full control and migrate to any provider later
- **Easy integration** - Simple to add Clerk, Auth0, Supabase Auth, or any provider
- **Learning-friendly** - Understand authentication fundamentals without abstraction layers
- **Cost-effective** - No monthly fees while building and testing
- **Privacy-first** - All user data stays in your database by default

### 🔄 **Migration Path:**

Orion Kit's architecture makes it trivial to switch authentication providers:

```typescript
// Current: Custom JWT (included)
const user = await getCurrentUser(req);

// Easy migration to any provider:
// const user = await clerk.auth().getUser(req);
// const user = await auth0.getUser(req);
// const user = await supabase.auth.getUser(req);
```

The database schema, API routes, and frontend components remain unchanged regardless of your auth provider choice.

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

### 2. **httpOnly Cookies (Secure)**

```typescript
// Token stored in httpOnly cookie (not localStorage)
res.cookies.set("auth", token, {
  httpOnly: true, // 👈 JavaScript can't access (XSS protection)
  secure: true, // 👈 HTTPS only in production
  sameSite: "lax", // 👈 CSRF protection
  path: "/",
  maxAge: 60 * 60 * 24 * 7, // 7 days
});
```

### 3. **Automatic Verification**

```typescript
// Every API call automatically verifies the token
export async function getCurrentUser(req: NextRequest) {
  const userId = await verifyToken(req); // Extract user ID from token

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

### ❌ **Removed OAuth Tables:**

```sql
-- These were NOT used (OAuth leftovers):
-- accounts (OAuth providers like Google, GitHub)
-- sessions (session management)
-- verification_tokens (email verification)
```

## API Routes

### **Authentication Endpoints:**

```typescript
// apps/api/app/auth/
POST /auth/register  - Create new user account
POST /auth/login     - Sign in with email/password
GET  /auth/me        - Get current user info
POST /auth/logout    - Sign out (clear cookie)
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

### 🍪 **Cookie Security:**

- **httpOnly** - No JavaScript access (XSS protection)
- **Secure** - HTTPS only in production
- **SameSite** - CSRF protection
- **Automatic expiration** - Matches JWT expiration
- **Path restriction** - Limited to your domain

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

## Integration Options

### **Option 1: Keep Custom JWT (Recommended for MVP)**

- **Cost**: $0/month - Perfect for bootstrapping
- **Control**: Complete ownership of auth logic
- **Features**: Login, register, JWT tokens, httpOnly cookies
- **Best for**: MVPs, prototypes, and learning

### **Option 2: Add Cloud Provider Later**

When you're ready for advanced features:

- **Clerk**: $25/month - Great UI components and user management
- **Auth0**: $23/month - Enterprise features and compliance
- **Supabase Auth**: $25/month - Open source with Row Level Security
- **Firebase Auth**: Pay per user - Google ecosystem integration

### **Migration Benefits:**

- **Database stays the same** - No schema changes needed
- **API routes unchanged** - Same authentication patterns
- **Gradual migration** - Switch one feature at a time
- **Zero downtime** - Maintain existing user sessions

## Adding Authentication Providers

### **Adding Clerk (Example):**

```bash
# 1. Install Clerk
pnpm add @clerk/nextjs

# 2. Update environment variables
# Add to .env.local:
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# 3. Replace auth function
# In API routes:
import { auth } from "@clerk/nextjs";
const { userId } = await auth();
```

### **Adding Auth0 (Example):**

```bash
# 1. Install Auth0
pnpm add @auth0/nextjs-auth0

# 2. Update environment variables
# Add to .env.local:
AUTH0_SECRET=your-secret
AUTH0_BASE_URL=http://localhost:3000
AUTH0_ISSUER_BASE_URL=https://your-domain.auth0.com
AUTH0_CLIENT_ID=your-client-id
AUTH0_CLIENT_SECRET=your-client-secret

# 3. Replace auth function
# In API routes:
import { getSession } from "@auth0/nextjs-auth0";
const session = await getSession(req);
const user = session?.user;
```

### **Migration Steps:**

```bash
# 1. Install your preferred provider
pnpm add @clerk/nextjs  # or @auth0/nextjs-auth0, etc.

# 2. Update environment variables
# Add provider-specific keys to .env.local

# 3. Update auth imports
# Replace: import { getCurrentUser } from "@workspace/auth/server"
# With:    import { auth } from "@clerk/nextjs"

# 4. Database stays the same!
# No schema changes needed - users table works with any provider
```

## Setup Guide

### **Option 1: Use Built-in JWT Auth (Default)**

```bash
# 1. Environment Variables
# .env.local
AUTH_JWT_SECRET=your-super-secret-key-min-32-chars
NEXT_PUBLIC_APP_URL=http://localhost:3001
NEXT_PUBLIC_API_URL=http://localhost:3002
DATABASE_URL=postgresql://...

# 2. Start development
pnpm dev
# ✅ Auth is ready to use!
```

### **Option 2: Add Your Preferred Provider**

```bash
# 1. Install provider
pnpm add @clerk/nextjs  # or your preferred auth provider

# 2. Add environment variables
# See provider-specific setup above

# 3. Update auth imports in API routes
# Replace getCurrentUser() with provider's auth function

# 4. Database stays the same!
# No migration needed - users table works with any provider
```

### **Dependencies:**

```bash
# JWT auth (included):
jose bcryptjs

# Or add your preferred provider:
# pnpm add @clerk/nextjs
# pnpm add @auth0/nextjs-auth0
# pnpm add @supabase/auth-helpers-nextjs
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

// 4. Set httpOnly cookie
response.cookies.set("auth", token, { httpOnly: true });
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

## Performance Benefits

### **JWT vs Sessions:**

```typescript
// JWT: ~0.1ms per request (no database lookup)
const userId = await verifyToken(req);

// Sessions: ~10-50ms per request (database query)
const session = await db
  .select()
  .from(sessions)
  .where(eq(sessions.token, token));
```

### **Serverless Friendly:**

- **Cold starts**: JWT verification is instant
- **No database connections**: Reduces lambda execution time
- **Stateless**: Perfect for serverless architecture

## Best Practices

### **For Custom JWT Auth:**

- ✅ Use strong JWT secrets (32+ characters)
- ✅ Set appropriate token expiration (7 days)
- ✅ Validate tokens on every protected route
- ✅ Use httpOnly cookies for token storage
- ✅ Hash passwords with bcrypt (salt rounds: 12)

### **When Migrating to Cloud Providers:**

- ✅ **Gradual migration** - Switch one feature at a time
- ✅ **Keep existing users** - Database schema stays the same
- ✅ **Test thoroughly** - Verify auth flows work correctly
- ✅ **Update environment variables** - Add provider keys
- ✅ **Monitor costs** - Understand pricing before scaling

### **General Guidelines:**

- ❌ Store tokens in localStorage (XSS risk)
- ❌ Use weak secrets or API keys
- ❌ Skip authentication validation
- ❌ Store sensitive data in JWT payloads
- ❌ Rush migration - take time to test properly

## Troubleshooting

### **Common Issues:**

```typescript
// Issue: "Invalid token"
// Solution: Check JWT secret matches between apps
const secret = process.env.AUTH_JWT_SECRET;

// Issue: "Token expired"
// Solution: User needs to login again
// Or implement refresh token flow

// Issue: "CORS errors"
// Solution: Check NEXT_PUBLIC_APP_URL in API middleware
const origin = process.env.NEXT_PUBLIC_APP_URL;
```

## Further Reading

- [JWT Best Practices](https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/)
- [httpOnly Cookies Security](https://owasp.org/www-community/HttpOnly)
- [bcrypt Password Hashing](https://auth0.com/blog/hashing-in-action-understanding-bcrypt/)
- [Next.js Authentication Patterns](https://nextjs.org/docs/authentication)
