---
title: Auth Package
description: Authentication with Clerk
---

# @workspace/auth

Authentication package powered by [Clerk](https://clerk.com/) providing complete user management and authentication.

## Installation

This package is already included in the workspace. To use it in your app:

```json
{
  "dependencies": {
    "@workspace/auth": "workspace:*"
  }
}
```

## Environment Variables

Add these to your `.env.local` file:

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key_here
CLERK_SECRET_KEY=your_secret_key_here
```

Get your keys from [Clerk Dashboard → API Keys](https://dashboard.clerk.com/last-active?path=api-keys).

## Usage

### 1. Set up middleware

Create `middleware.ts` in your app:

```typescript
import { createAuthMiddleware, config } from "@workspace/auth/middleware";

// Option 1: Use default middleware
export { default, config } from "@workspace/auth/middleware";

// Option 2: Custom protected routes
export const config = {
  matcher: [
    "/((?!_next|[^?]*\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};

export default createAuthMiddleware({
  protectedRoutes: ["/dashboard(.*)"],
  publicRoutes: ["/"],
});
```

### 2. Wrap your app with ClerkProvider

In `app/layout.tsx`:

```typescript
import { ClerkProvider } from '@workspace/auth/client';

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
```

### 3. Use auth components

```typescript
import {
  SignInButton,
  SignUpButton,
  UserButton,
  SignedIn,
  SignedOut,
} from '@workspace/auth/client';

export default function Header() {
  return (
    <header>
      <SignedOut>
        <SignInButton />
        <SignUpButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </header>
  );
}
```

### 4. Access user on the server

In Server Components, Route Handlers, or Server Actions:

```typescript
import { auth, currentUser } from "@workspace/auth/server";

// Get auth data
export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Use userId...
}

// Get full user object
export async function getUser() {
  const user = await currentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  return {
    id: user.id,
    email: user.emailAddresses[0]?.emailAddress,
    name: user.firstName + " " + user.lastName,
  };
}
```

### 5. Use hooks on the client

```typescript
'use client';

import { useUser, useAuth } from '@workspace/auth/client';

export function Profile() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut } = useAuth();

  if (!isLoaded) return <div>Loading...</div>;
  if (!isSignedIn) return <div>Not signed in</div>;

  return (
    <div>
      <p>Welcome, {user.firstName}!</p>
      <button onClick={() => signOut()}>Sign out</button>
    </div>
  );
}
```

## API Reference

### Client Components (`@workspace/auth/client`)

**Components:**

- `ClerkProvider` - Wrap your app with this
- `SignIn`, `SignUp` - Full-page auth components
- `SignInButton`, `SignUpButton`, `SignOutButton` - Pre-built auth buttons
- `UserButton` - User profile dropdown
- `SignedIn`, `SignedOut` - Conditional rendering components
- `UserProfile`, `OrganizationProfile` - Profile management
- `OrganizationSwitcher`, `OrganizationList` - Organization features

**Hooks:**

- `useUser()` - Hook to access user data
- `useAuth()` - Hook to access auth methods
- `useClerk()` - Hook to access Clerk instance
- `useSignIn()`, `useSignUp()` - Auth flow hooks

**Types:**

- `UserResource` - User object type
- `OrganizationResource` - Organization type
- `SessionResource` - Session type

### Server Utilities (`@workspace/auth/server`)

- `auth()` - Get auth data (userId, sessionId, etc.)
- `currentUser()` - Get full user object
- `clerkClient` - Direct access to Clerk API
- `clerkMiddleware()` - Middleware function

## Learn More

- [Clerk Documentation](https://clerk.com/docs)
- [Next.js + Clerk Quickstart](https://clerk.com/docs/quickstarts/nextjs)
