---
title: E2E Testing with Playwright
description: End-to-end testing setup and guide
---

# E2E Testing with Playwright

Orion Kit includes Playwright for end-to-end smoke tests.

## Why Playwright?

- ✅ **Fast** - Parallel execution by default
- ✅ **Modern** - TypeScript first-class support
- ✅ **Multi-browser** - Chromium, Firefox, WebKit
- ✅ **Great DX** - Trace viewer, codegen, UI mode
- ✅ **Free** - No paid cloud required
- ✅ **Built for Next.js** - Perfect for modern frameworks

## Running Tests

```bash
# Run all E2E tests
pnpm test:e2e

# Run in UI mode (interactive)
pnpm test:e2e:ui

# Run with visible browser
pnpm test:e2e:headed

# Debug specific test
pnpm test:e2e:debug

# Run specific test file
pnpm test:e2e auth.spec.ts
```

## Test Structure

```
e2e/
├── fixtures.ts          # Test helpers and utilities
├── auth.spec.ts         # Authentication flow
├── dashboard.spec.ts    # Dashboard pages and API health
├── tasks.spec.ts        # Task functionality
├── billing.spec.ts      # Billing and pricing
└── settings.spec.ts     # Settings page
```

## What's Tested

### Basic Smoke Tests ✅

These run without authentication:

- **Landing page** - Verifies home page loads
- **Sign-up page** - Clerk sign-up form appears
- **Sign-in page** - Clerk sign-in form appears
- **Protected routes** - Redirect to sign-in when not authenticated
- **API health** - Backend is responding

### Authenticated Tests (Skipped)

These tests are marked with `test.skip()` because they require authentication:

- Tasks CRUD operations
- Settings page access
- Billing page functionality

**Why skipped?**

- Clerk authentication requires real accounts
- Automated sign-up creates real users
- Better to test manually or with Clerk test mode

## Configuration

### playwright.config.ts

```typescript
export default defineConfig({
  testDir: "./e2e",
  baseURL: "http://localhost:3001",

  // Auto-start servers before tests
  webServer: [
    {
      command: "pnpm --filter app dev",
      url: "http://localhost:3001",
      reuseExistingServer: !process.env.CI,
    },
    {
      command: "pnpm --filter api dev",
      url: "http://localhost:3002/health",
      reuseExistingServer: !process.env.CI,
    },
  ],
});
```

Playwright automatically:

- ✅ Starts app and API servers
- ✅ Waits for them to be ready
- ✅ Runs tests
- ✅ Shuts down servers (unless reusing)

## Writing Tests

### Basic Test Example

```typescript
import { test, expect } from "./fixtures";

test.describe("My Feature", () => {
  test("should display correctly", async ({ page }) => {
    await page.goto("/my-feature");

    await expect(page.locator("h1")).toContainText("My Feature");
    await expect(page.locator("button")).toBeEnabled();
  });
});
```

### Using Test Helpers

```typescript
import { test, expect, signIn, createTask } from "./fixtures";

test("should create task", async ({ page }) => {
  await signIn(page, "user@example.com", "password");
  await createTask(page, "My Task", "Description");

  await expect(page.locator("text=My Task")).toBeVisible();
});
```

## Best Practices

### 1. Use Stable Selectors

```typescript
// ✅ Good - semantic selectors
await page.getByRole("button", { name: "Create Task" });
await page.getByLabel("Task Title");
await page.getByTestId("task-item");

// ❌ Bad - fragile selectors
await page.click(".css-1234567");
await page.locator("div > div > button:nth-child(3)");
```

### 2. Add Explicit Waits

```typescript
// ✅ Good - wait for element
await page.waitForSelector("text=Task created");

// ✅ Good - wait for navigation
await page.waitForURL("/dashboard");

// ❌ Bad - arbitrary timeout
await page.waitForTimeout(5000);
```

### 3. Keep Tests Independent

```typescript
// ✅ Good - each test is independent
test("can create task", async ({ page }) => {
  await signIn(page);
  await createTask(page, "Task 1");
});

test("can delete task", async ({ page }) => {
  await signIn(page);
  await createTask(page, "Task 2");
  await deleteTask(page, "Task 2");
});

// ❌ Bad - tests depend on each other
```

### 4. Test User Journeys, Not UI

```typescript
// ✅ Good - tests complete flow
test("user can upgrade to Pro plan", async ({ page }) => {
  await signIn(page);
  await page.goto("/dashboard/billing");
  await page.click("text=Upgrade to Pro");
  // Verify Stripe checkout opens
});

// ❌ Bad - tests button clicks
test("billing button is clickable", async ({ page }) => {
  await page.goto("/dashboard/billing");
  await expect(page.locator("button")).toBeEnabled();
});
```

## Debugging Failed Tests

### View HTML Report

```bash
pnpm dlx playwright show-report
```

### View Trace

```bash
# After test failure
pnpm dlx playwright show-trace test-results/auth-should-load/trace.zip
```

The trace viewer shows:

- Screenshots at each step
- Network requests
- Console logs
- DOM snapshots

### Run in Headed Mode

```bash
# See browser while tests run
pnpm test:e2e:headed
```

### Debug Mode

```bash
# Pause test execution
pnpm test:e2e:debug
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: E2E Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: "pnpm"

      - run: pnpm install
      - run: pnpm dlx playwright install --with-deps chromium
      - run: pnpm test:e2e

      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

## Skipped Tests

Some tests are skipped by default because they require authentication:

```typescript
test.skip("should create task", async ({ page }) => {
  // Skipped - requires Clerk authentication
});
```

### To Enable Authenticated Tests:

**Option 1: Manual Testing**

- Sign in manually before running tests
- Tests will use existing session

**Option 2: Clerk Test Mode**

- Use Clerk test mode with fixed credentials
- Update `fixtures.ts` with test user
- Remove `.skip()` from tests

**Option 3: API-based Auth**

- Get session token via Clerk API
- Set cookies programmatically
- Advanced setup

## Performance

Smoke tests are **fast**:

- Landing page test: ~1 second
- Auth page tests: ~2 seconds
- API health test: <1 second
- **Total runtime: ~5-10 seconds**

## Troubleshooting

### "Timeout waiting for server"

**Solution:** Ensure `.env.local` files exist:

- `apps/app/.env.local`
- `apps/api/.env.local`

### "Cannot find module"

**Solution:** Install browsers:

```bash
pnpm dlx playwright install
```

### "Test failed on CI"

**Check:**

- Environment variables are set in CI
- Database is accessible
- Servers start successfully

## Learn More

- [Playwright Documentation](https://playwright.dev/)
- [Writing Tests](https://playwright.dev/docs/writing-tests)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Trace Viewer](https://playwright.dev/docs/trace-viewer)
