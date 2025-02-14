import { expect } from "playwright/test";

import { test } from "@/engine/fixtures";

test.describe("E2E user settings page", () => {
  /**
   * Opening the page
   */
  test("Page doesn't load when not logged in", async ({
    unauthenticatedPage,
  }) => {
    await unauthenticatedPage.goto("/settings");
    await unauthenticatedPage.waitForLoadState("networkidle");
    expect(unauthenticatedPage.url()).not.toContain("/settings");
  });

  test("Page loads when logged in", async ({ userSettingsPage }) => {
    await userSettingsPage.openPage();
  });

  /**
   * Forms
   */
  test("User metadata form is expanded when clicked", async ({
    userSettingsPage,
  }) => {
    await userSettingsPage.openPage();
    await userSettingsPage.openMetadataChangeForm();
  });

  test("User metadata form can be submitted, metadata is updated", async ({
    userSettingsPage,
  }) => {
    await userSettingsPage.openPage();
    await userSettingsPage.openMetadataChangeForm();
  });

  test("Profile picture form is expanded when clicked", async ({
    userSettingsPage,
  }) => {
    await userSettingsPage.openPage();
    await userSettingsPage.openProfilePictureForm();
  });

  test("Password change form is expanded when clicked", async ({
    userSettingsPage,
  }) => {
    await userSettingsPage.openPage();
    await userSettingsPage.openPasswordChangeForm();
  });
});
