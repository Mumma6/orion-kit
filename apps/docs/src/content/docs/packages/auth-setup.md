---
title: Auth Setup Summary
---

# Auth Setup Summary

✅ Authentication package has been successfully set up for Orion!

## What Was Created

### 📦 Auth Package (`packages/auth/`)

A reusable authentication package powered by Clerk, similar to next-forge's approach:

```
packages/auth/
├── src/
│   ├── index.ts          # Main entry point
│   ├── client.tsx        # Client-side components & hooks
│   ├── server.ts         # Server-side utilities
│   └── middleware.ts     # Middleware helper
├── package.json
├── tsconfig.json
├── README.md            # Package documentation
└── INTEGRATION.md       # Integration examples
```

### 🎯 Integration Points

#### 1. App Package (Dashboard) - Port 3001

**Files Modified/Created:**

- ✅ `apps/app/package.json` - Added `@workspace/auth` dependency
- ✅ `apps/app/middleware.ts` - Added Clerk middleware with protected routes
- ✅ `apps/app/app/layout.tsx` - Wrapped app with `ClerkProvider`
- ✅ `apps/app/app/page.tsx` - Landing page with sign in/up buttons
- ✅ `apps/app/components/nav-user.tsx` - Updated to use real Clerk user data
- ✅ `apps/app/components/app-sidebar.tsx` - Updated to use auth-aware NavUser
- ✅ `apps/app/.env.example` - Environment variable template

**Features:**

- 🔐 Protected `/dashboard` route
- 👤 Real user data in sidebar
- 🚪 Sign in/out functionality
- 🎨 Sign up modal on landing page

#### 2. API Package - Port 3002

**Files Modified/Created:**

- ✅ `apps/api/package.json` - Added `@workspace/auth` dependency
- ✅ `apps/api/middleware.ts` - Added Clerk middleware
- ✅ `apps/api/app/user/route.ts` - Get current user endpoint
- ✅ `apps/api/app/tasks/route.ts` - Tasks endpoint
- ✅ `apps/api/app/protected/route.ts` - Protected API example
- ✅ `apps/api/app/echo/route.ts` - Echo endpoint with auth status
- ✅ `apps/api/.env.example` - Environment variable template

**API Endpoints:**

- `GET /user` - Returns current authenticated user
- `GET /tasks` - Returns user's tasks
- `GET /protected` - Example of protected route
- `GET /echo?message=hello` - Echo with auth status
- `POST /api/echo` - Echo POST with auth status

### 📚 Documentation

- ✅ `SETUP.md` - Complete setup guide for the project
- ✅ `packages/auth/README.md` - Auth package documentation
- ✅ `packages/auth/INTEGRATION.md` - Detailed integration examples

---

## Quick Start

### 1. Install Dependencies

```bash
pnpm install  # ✅ Already done!
```

### 2. Set Up Clerk

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Create a new application
3. Copy your API keys

### 3. Configure Environment Variables

**For App (Dashboard):**

```bash
cd apps/app
cp .env.example .env.local
```

Edit `apps/app/.env.local`:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
CLERK_SECRET_KEY=sk_test_YOUR_SECRET_HERE
```

**For API:**

```bash
cd apps/api
cp .env.example .env.local
```

Edit `apps/api/.env.local`:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
CLERK_SECRET_KEY=sk_test_YOUR_SECRET_HERE
```

### 4. Start Development

```bash
pnpm dev
```

Then visit:

- 📱 App: http://localhost:3001
- 🔌 API: http://localhost:3002/user

---

## Usage Examples

### Client Component (React)

```tsx
"use client";

import { useUser, SignOutButton } from "@workspace/auth/client";

export function MyComponent() {
  const { user, isLoaded, isSignedIn } = useUser();

  if (!isLoaded) return <div>Loading...</div>;
  if (!isSignedIn) return <div>Please sign in</div>;

  return (
    <div>
      <p>Hello, {user.firstName}!</p>
      <SignOutButton />
    </div>
  );
}
```

### Server Component

```tsx
import { auth, currentUser } from "@workspace/auth/server";

export default async function Page() {
  const { userId } = await auth();
  const user = await currentUser();

  return <div>Welcome, {user?.firstName}!</div>;
}
```

### API Route

```tsx
import { auth, currentUser } from "@workspace/auth/server";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await currentUser();
  return NextResponse.json({ user });
}
```

---

## Available Exports

### From `@workspace/auth/client` (Client Components)

- `ClerkProvider` - Wrap your app
- `SignInButton`, `SignUpButton`, `SignOutButton` - Auth buttons
- `UserButton` - User profile dropdown
- `SignedIn`, `SignedOut` - Conditional rendering
- `useUser()` - Get current user
- `useAuth()` - Auth methods
- `useClerk()` - Clerk instance

### From `@workspace/auth/server` (Server Components & API)

- `auth()` - Get auth data (lightweight)
- `currentUser()` - Get full user object
- `clerkClient` - Direct Clerk API access
- `clerkMiddleware()` - Middleware function

### From `@workspace/auth/middleware`

- `createAuthMiddleware()` - Create configured middleware
- `default` - Default middleware export
- `config` - Default middleware config

---

## Testing the Implementation

### Test the App

1. Start dev server: `pnpm dev`
2. Visit http://localhost:3001
3. Click "Sign Up" and create an account
4. You should be redirected to the landing page
5. Click "Go to Dashboard"
6. You should see the dashboard with your user info in the sidebar

### Test the API

**Get Current User:**

```bash
# You must be signed in to the app first, then:
curl http://localhost:3002/user
```

**Test Protected Route:**

```bash
curl http://localhost:3002/protected
```

**Test Tasks:**

```bash
curl http://localhost:3002/tasks
```

**Test Echo:**

```bash
curl "http://localhost:3002/echo?message=hello"
```

---

## What's Different from Basic Clerk Setup?

✅ **Shared Package** - Auth logic is in a reusable package  
✅ **Consistent API** - Same auth methods across all apps  
✅ **Type Safety** - Full TypeScript support  
✅ **Easy Integration** - Just add `@workspace/auth` as dependency  
✅ **Best Practices** - Follows next-forge patterns  
✅ **Comprehensive Docs** - Multiple documentation files  
✅ **Example Code** - Real-world usage examples

---

## Next Steps

1. **Add your Clerk keys** to `.env.local` files
2. **Start the dev servers** with `pnpm dev`
3. **Test the authentication** flow
4. **Customize the UI** in `apps/app/app/page.tsx`
5. **Add more protected routes** as needed
6. **Explore the docs** in `packages/auth/INTEGRATION.md`

---

## Troubleshooting

### "Invalid publishable key"

- Make sure `.env.local` exists in both `apps/app` and `apps/api`
- Verify your keys are correct from Clerk dashboard
- Restart the dev servers

### User not showing in sidebar

- Make sure you're signed in
- Check browser console for errors
- Verify ClerkProvider is wrapping your app

### API returns 401

- Ensure you're signed in to the app first
- Clerk uses cookies for authentication
- API and app must be on same domain in production

---

## Resources

- [Clerk Documentation](https://clerk.com/docs)
- [Next.js + Clerk Guide](https://clerk.com/docs/quickstarts/nextjs)
- [next-forge Repository](https://github.com/vercel/next-forge)

---

🎉 **Your authentication system is ready to use!**
