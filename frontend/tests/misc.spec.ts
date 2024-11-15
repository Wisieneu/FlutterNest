import { test, expect } from "@playwright/test";

test("homepage has title", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("FlutterNest");
});

test("Repo redirect functionality", async ({ context }) => {
  const page = await context.newPage();
  await page.goto("/");
  const repoPageEvent = context.waitForEvent("page");
  await page.locator(".repo-link").click();
  const repoPage = await repoPageEvent;
  expect(await repoPage.title()).toContain("Issues");
});
