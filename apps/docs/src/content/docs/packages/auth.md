---
title: Auth Package
description: Authentication package using Clerk
---

This package wraps Clerk's authentication system, providing user management, session handling, and protected routes.

**Clerk** handles:

- **User authentication**: Sign-up, sign-in, sign-out
- **Session management**: Secure sessions across all apps
- **User profiles**: Pre-built UI for user settings
- **Protected routes**: Middleware to guard `/dashboard/*` routes

**Where it's used:**

- All three Next.js apps (`web`, `app`, `api`)
- Sign-in/sign-up pages in `apps/app/app/(auth)`
- Middleware in each app to protect authenticated routes
- API routes to get current user ID

## Setup

1. Create a Clerk account at [clerk.com](https://clerk.com)
2. Add API keys to `.env.local` (see [Cloud Accounts Setup](/guide/accounts-setup))
3. Clerk is automatically configured via `ClerkProvider` in root layouts

## Usage in Orion Kit

### Middleware (Route Protection)

All apps use Clerk middleware to protect authenticated routes:

**`apps/app/middleware.ts`:**

```typescript
export { default, config } from "@workspace/auth/middleware";
```

This protects all `/dashboard/*` routes. Unauthenticated users are redirected to `/sign-in`.

### Client Components

**Sign-in/Sign-out buttons:**

```typescript
import { SignInButton, UserButton, SignedIn, SignedOut } from '@workspace/auth/client';

export const Header = () => {
  return (
    <header>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton /> {/* Shows user avatar + dropdown */}
      </SignedIn>
    </header>
  );
};
```

**Used in:**

- `apps/app/components/header.tsx`
- `apps/web/components/navbar.tsx`

### Server Components (Get Current User)

Access user data in Server Components and API routes:

```typescript
import { auth, currentUser } from "@workspace/auth/server";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/sign-in");
  }

  // Fetch user's tasks from database using userId
  const tasks = await db.query.tasks.findMany({
    where: eq(tasks.userId, userId),
  });

  return <div>Welcome! You have {tasks.length} tasks.</div>;
}
```

**Get full user object:**

```typescript
const user = await currentUser();
console.log(user?.emailAddresses[0]?.emailAddress);
```

**Used in:**

- `apps/api/app/tasks/route.ts` - to filter tasks by userId
- `apps/api/app/preferences/route.ts` - to get user subscription
- `apps/app/app/dashboard/page.tsx` - to show user-specific data

### Client Hooks

Use Clerk hooks in Client Components:

```typescript
"use client";
import { useUser, useAuth } from "@workspace/auth/client";

export const ProfileButton = () => {
  const { user, isSignedIn, isLoaded } = useUser();
  const { signOut } = useAuth();

  if (!isLoaded) return <div>Loading...</div>;

  if (!isSignedIn) return <SignInButton />;

  return (
    <div>
      <p>Hello, {user.firstName}</p>
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  );
};
```

## API Reference

### Client (`@workspace/auth/client`)

**Components:**

- `ClerkProvider` - Wrap your app (already done in root layouts)
- `SignIn`, `SignUp` - Full sign-in/sign-up pages
- `UserButton` - User avatar with dropdown menu
- `SignInButton`, `SignUpButton` - Trigger auth modals
- `SignedIn`, `SignedOut` - Conditional rendering based on auth state

**Hooks:**

- `useUser()` - Get current user object and loading state
- `useAuth()` - Get auth methods (`signOut`, `signIn`, etc.) and session data
- `useClerk()` - Access Clerk instance directly

### Server (`@workspace/auth/server`)

**Functions:**

- `auth()` - Get `userId`, `sessionId` in Server Components or API routes
- `currentUser()` - Get full user object (email, name, avatar, etc.)
- `clerkClient` - Clerk API client for advanced operations (update user, etc.)

## Common Patterns

### Protect an API route

```typescript
// apps/api/app/tasks/route.ts
import { auth } from "@workspace/auth/server";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tasks = await db.query.tasks.findMany({
    where: eq(tasks.userId, userId),
  });

  return NextResponse.json({ success: true, data: tasks });
}
```

### Redirect unauthenticated users

```typescript
// apps/app/app/dashboard/page.tsx
import { auth } from "@workspace/auth/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) redirect("/sign-in");

  return <div>Protected content</div>;
}
```

## Further Reading

- [Clerk Documentation](https://clerk.com/docs)
- [Clerk Next.js Quickstart](https://clerk.com/docs/quickstarts/nextjs)
- [Clerk API Reference](https://clerk.com/docs/reference/clerkjs)
