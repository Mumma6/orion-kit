---
title: Adding Rate Limiting
description: Upstash Redis for rate limiting and caching
---

Rate limiting and caching with **Upstash Redis** to protect your API from abuse.

## Why Rate Limiting?

- **Prevent brute force attacks** on login/register endpoints
- **Protect API endpoints** from spam and abuse
- **Control costs** by limiting expensive operations
- **Improve performance** with caching

## Upstash Setup

```bash
# 1. Create account at upstash.com
# 2. Create Redis database
# 3. Get connection details

# apps/api/.env.local
UPSTASH_REDIS_REST_URL=https://your-db.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token-here
```

## Install Dependencies

```bash
pnpm add @upstash/redis
```

## Rate Limiting Package

Create `packages/rate-limiting/src/index.ts`:

```typescript
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export interface RateLimitOptions {
  window: number; // seconds
  limit: number; // requests per window
  key: string; // unique identifier
}

export async function rateLimit(options: RateLimitOptions): Promise<{
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}> {
  const { window, limit, key } = options;

  const current = await redis.incr(key);

  if (current === 1) {
    await redis.expire(key, window);
  }

  const ttl = await redis.ttl(key);

  return {
    success: current <= limit,
    limit,
    remaining: Math.max(0, limit - current),
    reset: Date.now() + ttl * 1000,
  };
}

// Predefined rate limits
export const RATE_LIMITS = {
  LOGIN: { window: 900, limit: 5 }, // 5 attempts per 15 minutes
  REGISTER: { window: 3600, limit: 3 }, // 3 registrations per hour
  API: { window: 60, limit: 100 }, // 100 requests per minute
  PASSWORD_RESET: { window: 3600, limit: 3 }, // 3 resets per hour
} as const;
```

## API Middleware

Update `apps/api/middleware.ts`:

```typescript
import { rateLimit, RATE_LIMITS } from "@workspace/rate-limiting";

export async function middleware(req: NextRequest, event: NextFetchEvent) {
  // ... existing CORS code ...

  // Rate limiting for auth endpoints
  if (req.nextUrl.pathname.startsWith("/auth/login")) {
    const ip = req.ip ?? req.headers.get("x-forwarded-for") ?? "unknown";
    const result = await rateLimit({
      ...RATE_LIMITS.LOGIN,
      key: `login:${ip}`,
    });

    if (!result.success) {
      return new NextResponse(
        JSON.stringify({
          error: "Too many login attempts. Try again later.",
          retryAfter: Math.ceil((result.reset - Date.now()) / 1000),
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": Math.ceil(
              (result.reset - Date.now()) / 1000
            ).toString(),
            "X-RateLimit-Limit": result.limit.toString(),
            "X-RateLimit-Remaining": result.remaining.toString(),
            "X-RateLimit-Reset": result.reset.toString(),
            ...corsHeaders,
          },
        }
      );
    }
  }

  // ... rest of middleware ...
}
```

## Login Route Protection

Update `apps/api/app/auth/login/route.ts`:

```typescript
import { rateLimit, RATE_LIMITS } from "@workspace/rate-limiting";

export const POST = withAxiom(async (req: NextRequest) => {
  const { email, password } = await req.json();

  // Rate limit by email (not just IP)
  const result = await rateLimit({
    ...RATE_LIMITS.LOGIN,
    key: `login:${email}`,
  });

  if (!result.success) {
    return NextResponse.json(
      {
        error: "Too many login attempts for this email. Try again later.",
        retryAfter: Math.ceil((result.reset - Date.now()) / 1000),
      },
      { status: 429 }
    );
  }

  // ... existing login logic ...
});
```

## Caching with Upstash

Add caching to expensive operations:

```typescript
// Cache user data for 5 minutes
export async function getCachedUser(userId: string) {
  const cacheKey = `user:${userId}`;

  // Try cache first
  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached as string);
  }

  // Fetch from database
  const user = await db.select().from(users).where(eq(users.id, userId));

  // Cache for 5 minutes
  await redis.setex(cacheKey, 300, JSON.stringify(user));

  return user;
}

// Invalidate cache on user update
export async function updateUser(userId: string, data: Partial<User>) {
  await db.update(users).set(data).where(eq(users.id, userId));

  // Invalidate cache
  await redis.del(`user:${userId}`);
}
```

## Frontend Rate Limit Handling

Handle rate limit responses in your hooks:

```typescript
// apps/app/hooks/use-auth.ts
export const useLogin = () => {
  return useMutation({
    mutationFn: login,
    onError: (error: Error & { retryAfter?: number }) => {
      if (error.message.includes("Too many attempts")) {
        showErrorToast(
          `Too many login attempts. Try again in ${error.retryAfter}s`
        );
      } else {
        showErrorToast(error, "Login failed");
      }
    },
  });
};
```

## Rate Limit Headers

Your API now returns helpful headers:

```
X-RateLimit-Limit: 5
X-RateLimit-Remaining: 3
X-RateLimit-Reset: 1640995200000
Retry-After: 300
```

## Pricing

**Upstash Redis:**

- **Free tier:** 10,000 requests/day
- **Pay-as-you-go:** $0.2/100k requests
- **Pro:** $25/month for 1M requests

## Alternative: In-Memory Rate Limiting

For simple cases, use in-memory rate limiting:

```typescript
const attempts = new Map<string, { count: number; reset: number }>();

export function simpleRateLimit(key: string, limit: number, window: number) {
  const now = Date.now();
  const record = attempts.get(key);

  if (!record || now > record.reset) {
    attempts.set(key, { count: 1, reset: now + window * 1000 });
    return true;
  }

  if (record.count >= limit) {
    return false;
  }

  record.count++;
  return true;
}
```

## Best Practices

1. **Different limits for different endpoints**
2. **Rate limit by IP + email for auth**
3. **Use Redis for production, in-memory for dev**
4. **Return helpful error messages with retry times**
5. **Cache expensive database queries**

[Upstash docs](https://docs.upstash.com/redis) · [Rate limiting patterns](https://redis.io/docs/manual/patterns/distributed-locks/)
