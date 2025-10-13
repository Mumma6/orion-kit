---
title: Testing
---

# Testing

Two testing approaches: **Vitest** (unit) and **Playwright** (E2E).

## Quick Start

```bash
pnpm test          # Unit tests (Vitest)
pnpm test:ui       # Interactive test UI
pnpm test:coverage # Coverage report
pnpm test:e2e      # E2E smoke tests (Playwright)
```

## Unit Testing (Vitest)

**Test structure:** `packages/<package>/__tests__/*.test.ts`

**Example:**

```typescript
import { describe, it, expect } from "vitest";
import { createTaskInputSchema } from "../src/schema";

describe("createTaskInputSchema", () => {
  it("should reject empty title", () => {
    const result = createTaskInputSchema.safeParse({ title: "" });
    expect(result.success).toBe(false);
  });

  it("should accept valid input", () => {
    const result = createTaskInputSchema.safeParse({
      title: "Valid Task",
      status: "todo",
    });
    expect(result.success).toBe(true);
  });
});
```

**What to test:**

- ✅ Zod schemas validation
- ✅ Pure utility functions
- ✅ Business logic

**What NOT to test:**

- ❌ Third-party libraries
- ❌ TypeScript types (compile-time checked)
- ❌ UI components (use Playwright)

See [Vitest docs](https://vitest.dev) for more.

---

## E2E Testing (Playwright)

Fast smoke tests for critical paths. See [E2E Guide](/guide/e2e-testing) for details.

```bash
pnpm test:e2e      # Run all E2E tests
pnpm test:e2e:ui   # Interactive mode
```

**What's tested:** Landing page, auth pages, protected routes, API health
