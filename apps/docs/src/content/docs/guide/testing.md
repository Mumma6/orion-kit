---
title: Testing
description: Unit and E2E testing with Vitest and Playwright
---

## Unit Testing (Vitest)

Orion Kit uses [Vitest](https://vitest.dev) for fast unit testing of schemas, utilities, and business logic.

### Running Tests

```bash
# Run all unit tests
pnpm test

# Run tests in watch mode
pnpm test --watch

# Run tests for specific package
pnpm --filter @workspace/database test

# Run tests with coverage
pnpm test --coverage

# Run specific test file
pnpm test packages/database/__tests__/schema.test.ts
```

### Test Structure

**Location:** `packages/<package>/__tests__/*.test.ts`

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

### What to Test

- ✅ **Zod schemas validation** - Ensure schemas reject invalid data
- ✅ **Pure utility functions** - Test input/output behavior
- ✅ **Business logic** - Validate calculations and transformations
- ✅ **Error handling** - Verify errors are thrown correctly
- ✅ **Edge cases** - Test boundary conditions

### What NOT to Test

- ❌ **Third-party libraries** - Already tested by maintainers
- ❌ **TypeScript types** - Compile-time checked
- ❌ **UI components** - Use Playwright for E2E testing
- ❌ **Database queries** - Test at integration level

### Test Patterns

**Schema validation:**

```typescript
import { describe, it, expect } from "vitest";
import { createTaskInputSchema } from "../src/schema";

describe("Task Schema", () => {
  it("should validate correct input", () => {
    const result = createTaskInputSchema.safeParse({
      title: "Test Task",
      status: "todo",
    });
    expect(result.success).toBe(true);
  });

  it("should reject invalid status", () => {
    const result = createTaskInputSchema.safeParse({
      title: "Test",
      status: "invalid",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.path).toContain("status");
    }
  });
});
```

**Utility functions:**

```typescript
import { describe, it, expect } from "vitest";
import { formatDate } from "../src/utils";

describe("formatDate", () => {
  it("should format date correctly", () => {
    const date = new Date("2025-01-15");
    expect(formatDate(date)).toBe("Jan 15, 2025");
  });

  it("should handle invalid dates", () => {
    expect(() => formatDate(null)).toThrow();
  });
});
```

**Error handling:**

```typescript
import { describe, it, expect } from "vitest";
import { validateUser } from "../src/validation";

describe("validateUser", () => {
  it("should throw on invalid email", () => {
    expect(() => validateUser({ email: "invalid" })).toThrow("Invalid email");
  });
});
```

### Configuration

Tests are configured in `vitest.config.ts` at the root:

```typescript
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
  },
});
```

### Best Practices

1. **Keep tests simple** - One assertion per test when possible
2. **Use descriptive names** - Test name should explain what's being tested
3. **Arrange-Act-Assert** - Structure tests clearly
4. **Test edge cases** - Empty strings, null, undefined, boundary values
5. **Don't test implementation** - Test behavior, not internal details

### Running in CI

Tests run automatically on every push via GitHub Actions. All tests must pass before merging.

---

## E2E Testing (Playwright)

For end-to-end testing of the full application flow, see [E2E Testing](/guide/e2e-testing).

---
