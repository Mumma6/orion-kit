import { test, expect } from "@playwright/test";

test.describe("Dashboard", () => {
  test("should load landing page", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator("h1").first()).toBeVisible();

    await expect(
      page.locator("text=/Orion Kit|Dashboard|Features/i").first()
    ).toBeVisible();
  });

  test("should redirect to sign-in when accessing protected routes", async ({
    page,
  }) => {
    await page.goto("/dashboard");

    await expect(page).toHaveURL(/sign-in/);
  });

  test("should load API health endpoint", async ({ request }) => {
    const response = await request.get("http://localhost:3002/health");

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const text = await response.text();
    expect(text).toBe("OK");
  });
});
