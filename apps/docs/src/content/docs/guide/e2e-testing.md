---
title: E2E Testing
---

# E2E Testing

Fast smoke tests with Playwright. Auto-starts servers, runs tests, shows trace on failure.

## Commands

```bash
pnpm test:e2e         # Run all tests
pnpm test:e2e:ui      # Interactive UI mode
pnpm test:e2e:headed  # Visible browser
pnpm test:e2e:debug   # Pause execution
```

## What's Tested

**Smoke tests (no auth required):**

- Landing page loads
- Sign-in/up pages load
- Protected routes redirect
- API health responds

**Skipped tests (require auth):**

- Task CRUD
- Settings access
- Billing flow

_Enable by setting up Clerk test mode in `e2e/fixtures.ts`_

## Test Structure

```
e2e/
├── auth.spec.ts      # Auth pages
├── dashboard.spec.ts # Dashboard + API
├── tasks.spec.ts     # Tasks (skipped)
├── billing.spec.ts   # Billing (skipped)
└── settings.spec.ts  # Settings (skipped)
```

Auto-configured to start app (3001) and API (3002) before tests.

## Example Test

```typescript
import { test, expect } from "./fixtures";

test("landing page loads", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toBeVisible();
});
```

**Trace viewer on failure:** `pnpm dlx playwright show-report`

See [Playwright docs](https://playwright.dev) for more.
