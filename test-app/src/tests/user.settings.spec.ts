import { expect } from "playwright/test";

import { test } from "@/engine/test.runner";
import playwrightObject from "@/engine/playwright.object";

test.describe("E2E user settings page", () => {
  test("Page loads when logged in", async ({ userSettingsPage }) => {
    await userSettingsPage.open();
  });

  test("Page doesn't load when not logged in", async ({
    unauthenticatedPage,
  }) => {
    unauthenticatedPage.goto("/settings");
    unauthenticatedPage.waitForLoadState("networkidle");
    expect(unauthenticatedPage.url()).not.toContain("/settings");
  });

  test("User metadata form is expanded when clicked", async ({
    userSettingsPage,
  }) => {
    await userSettingsPage.open();
    await userSettingsPage.openMetadataChangeForm();
  });

  test("Profile picture form is expanded when clicked", async ({
    userSettingsPage,
  }) => {
    await userSettingsPage.open();
    await userSettingsPage.openProfilePictureForm();
  });

  test("Password change form is expanded when clicked", async ({
    userSettingsPage,
  }) => {
    await userSettingsPage.open();
    await userSettingsPage.openPasswordChangeForm();
  });
});
