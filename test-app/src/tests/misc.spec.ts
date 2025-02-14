import { expect } from "@playwright/test";

import { test } from "@/engine/fixtures";
import playwrightObject from "@/engine/playwright.object";

test("homepage has title", async ({ unauthenticatedPage }) => {
  await unauthenticatedPage.goto("/");
  await expect(unauthenticatedPage).toHaveTitle("FlutterNest");
});

test("Repo redirect functionality", async ({ unauthenticatedPage }) => {
  await unauthenticatedPage.goto("/");
  const repoPageEvent = playwrightObject.context.waitForEvent("page");
  await unauthenticatedPage.locator(".repo-link").click();
  const repoPage = await repoPageEvent;
  await repoPage.waitForLoadState("networkidle");
  expect(await repoPage.title()).toContain("Issues");
});
