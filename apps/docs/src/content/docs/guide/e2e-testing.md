---
title: E2E Testing
---

Simple example tests with Playwright to show you how E2E testing works. Auto-starts servers, runs tests, shows trace on failure.

## Commands

```bash
pnpm test:e2e         # Run all tests
pnpm test:e2e:ui      # Interactive UI mode
pnpm test:e2e:headed  # Visible browser
pnpm test:e2e:debug   # Pause execution
```

## What's Included

**Example tests (basic functionality):**

- Landing page loads and displays content
- Basic page navigation

These are minimal examples to get you started. You can expand them or create your own comprehensive test suite.

## Test Structure

```
e2e/
├── billing.spec.ts   # Basic billing page test
└── dashboard.spec.ts # Landing page test
```

Auto-configured to start app (3001) and API (3002) before tests.

## Example Test

```typescript
import { test, expect } from "@playwright/test";

test.describe("Dashboard", () => {
  test("should load landing page", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator("h1").first()).toBeVisible();

    await expect(
      page.locator("text=/Orion Kit|Dashboard|Features/i").first()
    ).toBeVisible();
  });
});
```

## Expanding Your Tests

Consider adding tests for:

- **Authentication Flow** - Login, registration, logout
- **Task Management** - CRUD operations
- **Settings** - Profile updates, preferences
- **Billing** - Subscription flows
- **Error Handling** - Edge cases and error states

**Trace viewer on failure:** `pnpm dlx playwright show-report`

See [Playwright docs](https://playwright.dev) for more.
