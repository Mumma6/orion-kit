---
title: Testing
---

# Testing

Orion Kit includes two testing approaches:

1. **Unit Tests** - Vitest for fast unit and integration tests
2. **E2E Tests** - Playwright for end-to-end smoke tests

## Quick Start

```bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e
```

---

## Unit Testing with Vitest

Orion Kit uses [Vitest](https://vitest.dev/) for unit testing and integration testing.

## Why Vitest?

- ✅ **Lightning fast** - Powered by Vite
- ✅ **Compatible with Jest** - Same API, easy migration
- ✅ **TypeScript first** - Native TypeScript support
- ✅ **ESM support** - Modern JavaScript
- ✅ **Built-in coverage** - With V8 provider
- ✅ **UI mode** - Interactive test runner

## Setup

Vitest is already configured at the root level to run tests across all packages and apps.

### Configuration

```typescript
// vitest.config.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: [
      "packages/**/__tests__/**/*.{test,spec}.{js,ts,tsx}",
      "apps/**/__tests__/**/*.{test,spec}.{js,ts,tsx}",
    ],
  },
});
```

This configuration:

- Searches for tests in both `packages/` and `apps/`
- Uses Node.js environment (for backend/package tests)
- Provides global test functions (no need to import `describe`, `it`, etc.)

## Running Tests

```bash
# Run all tests
pnpm test

# Watch mode (runs on file changes)
pnpm test

# UI mode (interactive browser UI)
pnpm test:ui

# Coverage report
pnpm test:coverage
```

## Writing Tests

### Example: Testing Zod Schemas

```typescript
// packages/database/__tests__/schema.test.ts
import { describe, it, expect } from "vitest";
import { createTaskInputSchema } from "../src/schema";

describe("createTaskInputSchema", () => {
  it("should validate valid task input", () => {
    const validInput = {
      title: "Test Task",
      description: "Test Description",
      status: "todo" as const,
    };

    const result = createTaskInputSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it("should reject empty title", () => {
    const invalidInput = {
      title: "",
      status: "todo" as const,
    };

    const result = createTaskInputSchema.safeParse(invalidInput);
    expect(result.success).toBe(false);
  });
});
```

### Example: Testing Utility Functions

```typescript
// packages/payment/__tests__/config.test.ts
import { describe, it, expect } from "vitest";
import { canUpgrade, getPlanById } from "../src/config";

describe("Payment Config Utilities", () => {
  describe("canUpgrade", () => {
    it("should allow upgrade from free to pro", () => {
      expect(canUpgrade("free", "pro")).toBe(true);
    });

    it("should not allow downgrade from pro to free", () => {
      expect(canUpgrade("pro", "free")).toBe(false);
    });

    it("should not allow same plan upgrade", () => {
      expect(canUpgrade("pro", "pro")).toBe(false);
    });
  });

  describe("getPlanById", () => {
    it("should return correct plan for valid id", () => {
      const plan = getPlanById("pro");
      expect(plan).toBeDefined();
      expect(plan?.name).toBe("Pro");
    });

    it("should return undefined for invalid id", () => {
      const plan = getPlanById("invalid");
      expect(plan).toBeUndefined();
    });
  });
});
```

## Test Structure

### Packages Tests

Place tests in `packages/<package>/__tests__/`:

```
packages/
├── database/
│   ├── __tests__/
│   │   └── schema.test.ts        # Example: Zod schema validation
│   └── src/
├── payment/
│   ├── __tests__/
│   │   └── config.test.ts        # Example: Pure utility functions
│   └── src/
└── ...
```

Only add tests where it makes sense to test pure functions or critical business logic.

## Best Practices

### 1. Test Business Logic, Not Implementation

```typescript
// ✅ Good - tests behavior
it("should reject title longer than 255 characters", () => {
  const input = { title: "a".repeat(256), status: "todo" };
  const result = createTaskInputSchema.safeParse(input);
  expect(result.success).toBe(false);
});

// ❌ Bad - tests implementation
it("should call zod parse method", () => {
  const spy = vi.spyOn(createTaskInputSchema, "parse");
  // ...
});
```

### 2. Use Descriptive Test Names

```typescript
// ✅ Good
it("should reject empty title", () => { ... });
it("should accept valid status values", () => { ... });

// ❌ Bad
it("test 1", () => { ... });
it("works", () => { ... });
```

### 3. Group Related Tests

```typescript
describe("createTaskInputSchema", () => {
  describe("title validation", () => {
    it("should reject empty title", () => { ... });
    it("should reject title longer than 255 chars", () => { ... });
    it("should accept valid title", () => { ... });
  });

  describe("status validation", () => {
    it("should accept all valid statuses", () => { ... });
    it("should reject invalid status", () => { ... });
  });
});
```

### 4. Test Edge Cases

```typescript
describe("taskIdSchema", () => {
  it("should accept valid numeric string", () => {
    const result = taskIdSchema.safeParse({ id: "123" });
    expect(result.success).toBe(true);
    expect(result.data?.id).toBe(123);
  });

  it("should reject non-numeric string", () => {
    const result = taskIdSchema.safeParse({ id: "abc" });
    expect(result.success).toBe(false);
  });

  it("should reject negative numbers", () => {
    const result = taskIdSchema.safeParse({ id: "-1" });
    expect(result.success).toBe(false);
  });
});
```

## Coverage

Generate coverage reports to ensure your code is well-tested:

```bash
pnpm test:coverage
```

This creates a coverage report in `coverage/`:

- `coverage/index.html` - Visual HTML report
- `coverage/coverage-final.json` - JSON data

### Coverage Goals

Aim for:

- ✅ **80%+ coverage** for packages (reusable code)
- ✅ **60%+ coverage** for apps (application code)
- ✅ **100% coverage** for critical business logic

## Mocking

### Mock Functions

```typescript
import { vi } from "vitest";

const mockFn = vi.fn();
mockFn.mockReturnValue(42);

expect(mockFn()).toBe(42);
expect(mockFn).toHaveBeenCalled();
```

### Mock Modules

```typescript
vi.mock("@workspace/database", () => ({
  db: {
    select: vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue([{ id: 1, title: "Test" }]),
      }),
    }),
  },
}));
```

### Mock Environment Variables

```typescript
import { beforeEach, afterEach } from "vitest";

beforeEach(() => {
  process.env.DATABASE_URL = "postgresql://test";
});

afterEach(() => {
  delete process.env.DATABASE_URL;
});
```

## CI/CD Integration

Tests run automatically on CI via GitHub Actions:

```yaml
# .github/workflows/test.yml
- name: Run unit tests
  run: pnpm test
```

On CI, tests run in non-interactive mode and fail the build if any test fails.

## What to Test

### ✅ Do Test

- **Zod schemas** - Validation rules (see `packages/database/__tests__/schema.test.ts`)
- **Pure utility functions** - Business logic helpers (see `packages/payment/__tests__/config.test.ts`)
- **Type guards** - Runtime type checking
- **Complex calculations** - Business logic that can fail

### ❌ Don't Test

- **Third-party libraries** - Already tested
- **TypeScript types** - Compile-time checked
- **UI components** - Use Playwright for E2E instead
- **Trivial code** - Simple wrappers without logic
- **API route handlers** - Use E2E tests instead

## Learn More

- [Vitest Documentation](https://vitest.dev/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Jest to Vitest Migration](https://vitest.dev/guide/migration.html)

---

## E2E Testing with Playwright

For end-to-end testing, see the [E2E Testing Guide](/guide/e2e-testing).

Quick overview:

```bash
# Run E2E smoke tests
pnpm test:e2e

# Run in UI mode
pnpm test:e2e:ui

# Debug tests
pnpm test:e2e:debug
```

**What's tested:**

- Landing page loads
- Authentication pages load
- Protected routes redirect correctly
- API health endpoint responds

See [E2E Testing Guide](/guide/e2e-testing) for complete documentation.

---

## Summary

**Unit Tests (Vitest):**
✅ Fast unit and integration tests  
✅ Package-level testing  
✅ Business logic validation  
✅ Zod schema testing

**E2E Tests (Playwright):**
✅ Smoke tests for critical paths  
✅ Multi-browser support  
✅ Visual debugging with trace viewer  
✅ Automatic server management

Happy testing! 🧪
