import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  test("should allow user to sign up, sign in, and sign out", async ({
    page,
  }) => {
    await page.goto("/sign-up");

    await expect(page).toHaveURL(/sign-up/);

    await expect(page.locator('input[name="emailAddress"]')).toBeVisible({
      timeout: 10000,
    });

    await page.goto("/sign-in");
    await expect(page).toHaveURL(/sign-in/);
    await expect(page.locator('input[name="identifier"]')).toBeVisible({
      timeout: 10000,
    });

    await page.goto("/dashboard");
    await expect(page).toHaveURL(/sign-in/);
  });
});
