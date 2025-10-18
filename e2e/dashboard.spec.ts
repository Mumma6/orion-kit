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
