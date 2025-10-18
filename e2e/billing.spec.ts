import { test, expect } from "@playwright/test";

test.describe("Billing", () => {
  test("should display pricing on landing page", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator("h1").first()).toBeVisible();
  });
});
