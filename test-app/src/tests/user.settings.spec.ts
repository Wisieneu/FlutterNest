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

  test.only("User metadata form can be submitted, metadata is updated", async ({
    userSettingsPage,
  }) => {
    const testMetadata = {
      displayName: "test DN change1",
      location: "test location change1",
      website: "test website change1",
      bio: "test bio change1",
    };

    await userSettingsPage.openPage();
    await userSettingsPage.openMetadataChangeForm();
    await userSettingsPage.fillDisplayNameInput(testMetadata.displayName);
    await userSettingsPage.fillLocationInput(testMetadata.location);
    await userSettingsPage.fillWebsiteInput(testMetadata.website);
    await userSettingsPage.fillBioInput(testMetadata.bio);
    await userSettingsPage.submitMetadataChangeForm();
    await userSettingsPage.shouldBeOpened();
    await userSettingsPage.validateUrl();
    await userSettingsPage.toastElement.text.validateText(
      "User updated successfully."
    );
    await userSettingsPage.reloadPage();
    await userSettingsPage.openMetadataChangeForm();
    await userSettingsPage.metadataChangeForm.displayNameInput.verifyInputValue(
      testMetadata.displayName
    );
    await userSettingsPage.metadataChangeForm.locationInput.verifyInputValue(
      testMetadata.location
    );
    await userSettingsPage.metadataChangeForm.websiteInput.verifyInputValue(
      testMetadata.website
    );
    await userSettingsPage.metadataChangeForm.bioInput.verifyInputValue(
      testMetadata.bio
    );
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
