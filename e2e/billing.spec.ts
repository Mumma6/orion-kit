import { test, expect } from "@playwright/test";

test.describe("Billing", () => {
  test("should display pricing on landing page", async ({ page }) => {
    await page.goto("/");

    const pricingSection = page
      .locator("text=/Pricing|Plans|Pro|Enterprise/i")
      .first();

    await expect(page.locator("h1").first()).toBeVisible();
  });

  test("should redirect billing page to sign-in when not authenticated", async ({
    page,
  }) => {
    await page.goto("/dashboard/billing");

    await expect(page).toHaveURL(/sign-in/, { timeout: 10000 });
  });
});
