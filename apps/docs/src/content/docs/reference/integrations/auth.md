---
title: Auth Providers
description: Replace custom JWT with Clerk, Auth0, or Better Auth
---

Replace Orion Kit's custom JWT authentication with popular auth providers for enterprise features, social login, and SSO.

## Why Replace Custom Auth?

Orion Kit's custom JWT system is perfect for most SaaS apps, but you might need auth providers for:

- **Enterprise SSO** - SAML, OIDC, Active Directory
- **Social Login** - Google, GitHub, Apple, Microsoft
- **Advanced Security** - MFA, device management, audit logs
- **Compliance** - SOC2, GDPR, HIPAA requirements
- **Team Management** - Organizations, roles, permissions

## Auth Provider Options

| Provider                                       | Best For                 | Free Tier | Pricing | Difficulty |
| ---------------------------------------------- | ------------------------ | --------- | ------- | ---------- |
| **[Clerk](https://clerk.com)**                 | Modern apps, great DX    | 10k MAU   | $25/mo  | ⭐⭐⭐     |
| **[Auth0](https://auth0.com)**                 | Enterprise, compliance   | 7k MAU    | $23/mo  | ⭐⭐⭐⭐   |
| **[Better Auth](https://better-auth.com)**     | Open source, self-hosted | Unlimited | Free    | ⭐⭐⭐     |
| **[Supabase Auth](https://supabase.com/auth)** | Database-first apps      | 50k MAU   | $25/mo  | ⭐⭐       |
| **[NextAuth.js](https://next-auth.js.org)**    | Custom, flexible         | Unlimited | Free    | ⭐⭐⭐⭐   |

## Clerk Integration

**Best for:** Modern SaaS apps with great developer experience.

### Setup

```bash
pnpm add @clerk/nextjs
```

**Environment:**

```bash
# apps/app/.env.local
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# apps/api/.env.local
CLERK_SECRET_KEY=sk_test_...
```

### App Configuration

`apps/app/app/layout.tsx`:

```typescript
import { ClerkProvider } from "@clerk/nextjs";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
```

### Middleware

`apps/app/middleware.ts`:

```typescript
import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: ["/", "/sign-in", "/sign-up"],
  ignoredRoutes: ["/api/webhooks/stripe"],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
```

### API Routes

`apps/api/app/auth/me/route.ts`:

```typescript
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get user from Clerk
  const user = await clerkClient.users.getUser(userId);

  return NextResponse.json({
    success: true,
    data: {
      id: user.id,
      email: user.emailAddresses[0]?.emailAddress,
      name: user.fullName,
      image: user.imageUrl,
    },
  });
}
```

### Frontend Hooks

`apps/app/hooks/use-auth.ts`:

```typescript
import { useUser, useAuth } from "@clerk/nextjs";

export function useAuth() {
  const { user, isLoaded } = useUser();
  const { signOut } = useAuth();

  return {
    user: user
      ? {
          id: user.id,
          email: user.emailAddresses[0]?.emailAddress,
          name: user.fullName,
          image: user.imageUrl,
        }
      : null,
    isLoading: !isLoaded,
    signOut,
  };
}
```

## Better Auth Integration

**Best for:** Open source, self-hosted, full control.

### Setup

```bash
pnpm add better-auth
```

### Configuration

`packages/auth/src/better-auth.ts`:

```typescript
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@workspace/database";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
  },
});
```

### API Routes

`apps/api/app/auth/[...all]/route.ts`:

```typescript
import { auth } from "@workspace/auth/better-auth";

export const { GET, POST } = auth.handler;
```

### Client

`packages/auth/src/better-auth-client.ts`:

```typescript
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const { signIn, signUp, signOut, useSession } = authClient;
```

## Migration Strategy

### 1. **Keep Both Systems**

Run both auth systems in parallel during migration:

```typescript
// Support both auth methods
export async function getCurrentUser(req: Request) {
  // Try Clerk first
  const clerkUser = await getClerkUser(req);
  if (clerkUser) return clerkUser;

  // Fallback to custom JWT
  const jwtUser = await getJWTUser(req);
  return jwtUser;
}
```

### 2. **Migrate Users**

Create migration script to move existing users:

```typescript
// packages/auth/src/migrate-users.ts
export async function migrateUsersToClerk() {
  const users = await db.select().from(users);

  for (const user of users) {
    await clerkClient.users.createUser({
      emailAddress: [user.email],
      firstName: user.name?.split(" ")[0],
      lastName: user.name?.split(" ")[1],
    });
  }
}
```

### 3. **Update Frontend**

Replace auth hooks gradually:

```typescript
// Before: Custom JWT
const { data: user } = useAuth();

// After: Clerk
const { user } = useUser();
```

## Database Schema Changes

Most auth providers handle user storage, so you can simplify your schema:

```typescript
// Before: Custom user table
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }),
  // ... other fields
});

// After: Minimal user table (if needed)
export const userProfiles = pgTable("user_profiles", {
  id: uuid("id").primaryKey(), // Matches auth provider ID
  subscriptionId: varchar("subscription_id"),
  preferences: jsonb("preferences"),
  // ... app-specific fields only
});
```

## When to Switch

### ✅ **Switch to Auth Provider When:**

- **Enterprise customers** need SSO
- **Social login** is a must-have feature
- **Compliance requirements** (SOC2, GDPR)
- **Team/organization** features needed
- **Advanced security** (MFA, device management)
- **Audit logs** required

### ❌ **Keep Custom JWT When:**

- **Simple SaaS** with email/password only
- **Cost is a concern** (auth providers cost $25+/mo)
- **Full control** over user data needed
- **Custom flows** required
- **MVP stage** - don't over-engineer

## Cost Comparison

| Solution        | Free Tier | Paid Plans | Monthly Cost |
| --------------- | --------- | ---------- | ------------ |
| **Custom JWT**  | Unlimited | $0         | $0           |
| **Clerk**       | 10k MAU   | $25/mo     | $0-25        |
| **Auth0**       | 7k MAU    | $23/mo     | $0-23        |
| **Better Auth** | Unlimited | Free       | $0           |
| **Supabase**    | 50k MAU   | $25/mo     | $0-25        |

## Best Practices

1. **Start with custom JWT** - It's free and works for most cases
2. **Switch when needed** - Don't over-engineer from day one
3. **Plan migration** - Keep both systems during transition
4. **Test thoroughly** - Auth changes affect everything
5. **Update documentation** - Help your team understand the new flow

## Migration Checklist

- [ ] Choose auth provider based on requirements
- [ ] Set up development environment
- [ ] Create migration plan for existing users
- [ ] Update API routes to use new auth
- [ ] Update frontend components
- [ ] Test all authentication flows
- [ ] Update environment variables
- [ ] Deploy to staging first
- [ ] Monitor for issues
- [ ] Remove old auth code

[Clerk docs](https://clerk.com/docs) · [Auth0 docs](https://auth0.com/docs) · [Better Auth docs](https://better-auth.com/docs)
