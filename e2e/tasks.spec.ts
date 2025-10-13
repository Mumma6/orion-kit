import { test, expect } from "@playwright/test";

test.describe("Tasks", () => {
  test("should redirect to sign-in when not authenticated", async ({
    page,
  }) => {
    await page.goto("/dashboard/tasks");

    await expect(page).toHaveURL(/sign-in/, { timeout: 10000 });
  });
});
